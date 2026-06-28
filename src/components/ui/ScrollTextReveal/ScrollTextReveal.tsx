/**
 * @module src/components/ui/ScrollTextReveal/ScrollTextReveal.tsx
 * @description Высокопроизводительный текстовый парсер на базе GSAP ScrollTrigger.
 * Реализует жесткую стейт-машину для трех независимых режимов анимации
 * (Word-by-word Blur, Word-by-word Opacity, Block Opacity) с полной защитой от невидимости.
 *
 * @author Kort
 * @version 4.1.0
 */

import { useTheme } from "@/hooks";
import { useFeatureFlag } from "@/hooks/useEffectsDebug";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import React, { useEffect, useMemo, useRef } from "react";
import { ScrollTextRevealProps } from "./ScrollTextReveal.types";
import { TextSplitter } from "./ScrollTextReveal.utils";

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    SplitType: any;
  }
}

const ScrollTextReveal: React.FC<ScrollTextRevealProps> = ({ children, className = "" }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const tier = usePerformanceTier();
  const { theme } = useTheme();

  const splitInstanceRef = useRef<any>(null);
  const scrollTriggerRef = useRef<any>(null);
  const gsapContextRef = useRef<any>(null);

  const isTouchDevice =
    typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;

  // Читаем индивидуальные флаги из дебаг-стора
  const isBlurRequested = useFeatureFlag("scrollTextBlur", tier === "high");
  const isOpacityRequested = useFeatureFlag("scrollTextOpacity", tier === "medium");
  const isBlockOpacityRequested = useFeatureFlag("scrollTextBlockOpacity", tier !== "low");

  // ОПРЕДЕЛЕНИЕ РЕЖИМА АНИМАЦИИ (Жесткая стейт-машина)
  type AnimType = "static" | "block_opacity" | "word_by_word_blur" | "word_by_word_opacity";
  let animMode: AnimType = "static";

  if (isTouchDevice) {
    // На тач-устройствах (телефонах) никогда не дробим по словам, это слишком дорого для GPU.
    // Используем плавный бледный фейд всего блока целиком, либо оставляем статичным.
    animMode = isBlockOpacityRequested ? "block_opacity" : "static";
  } else {
    // На десктопе даем полную свободу ручным ползункам дебаггера
    if (isBlurRequested) {
      animMode = "word_by_word_blur";
    } else if (isOpacityRequested) {
      animMode = "word_by_word_opacity";
    } else {
      animMode = "static";
    }
  }

  const validatedText = useMemo(() => {
    return TextSplitter.handleEdgeCases(TextSplitter.validateText(children));
  }, [children]);

  useEffect(() => {
    if (!window.gsap || !window.ScrollTrigger || !containerRef.current) return;

    const container = containerRef.current;

    // THE FIX: Если режим "static" (например, Low Tier без оверрайдов), мы обязаны
    // сбросить все инлайн-стили в исходное видимое состояние. Это предотвращает баг,
    // когда выключение ползунка скрывало текст полностью из-за зависшего начального состояния.
    if (animMode === "static") {
      window.gsap.set(container, { opacity: 1, y: 0, filter: "none", skewX: 0, clearProps: "all" });
      const words = container.querySelectorAll('[class*="word-"]');
      if (words.length > 0) {
        window.gsap.set(words, { opacity: 1, filter: "none", skewX: 0, clearProps: "all" });
      }
      return; // Выходим из эффекта, текст останется 100% видимым
    }

    if (animMode === "block_opacity") {
      // Изолируем анимацию блока
      gsapContextRef.current = window.gsap.context(() => {
        scrollTriggerRef.current = window.gsap.fromTo(
          container,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: { trigger: container, start: "top bottom-=10%", end: "bottom center", scrub: true },
          },
        );
      });
    }
    // ─── 2. РЕЖИМЫ: ПОСЛОВНОЕ ПОЯВЛЕНИЕ (Desktop Medium/High) ───
    else {
      try {
        // Нарезка текста на слова с помощью библиотеки SplitType или кастомного фоллбэка
        if (window.SplitType) {
          splitInstanceRef.current = new window.SplitType(container, { types: "words" });
        } else {
          const textData = TextSplitter.splitText(validatedText);
          if (textData.words.length > 0) {
            const wordsHTML = TextSplitter.preserveFormatting(
              textData.words,
              textData.preservedSpacing,
              textData.lineBreaks,
              (word, index) => `<span class="word-${index}" style="display: inline-block;">${word}</span>`,
            );
            container.innerHTML = wordsHTML.join("");
          }
        }

        const words = splitInstanceRef.current?.words || container.querySelectorAll('[class*="word-"]');
        if (words && words.length > 0) {
          const themeColor = theme === "dark" ? "#cbd5e1" : "#1e293b";
          words.forEach((word: HTMLElement) => {
            word.style.color = themeColor;
          });

          const isBlurMode = animMode === "word_by_word_blur";

          gsapContextRef.current = window.gsap.context(() => {
            scrollTriggerRef.current = window.gsap.fromTo(
              words,
              {
                opacity: 0,
                filter: isBlurMode ? "blur(6px)" : "none",
                skewX: isBlurMode ? -20 : 0,
                willChange: "opacity, transform",
              },
              {
                opacity: 1,
                filter: "blur(0px)",
                skewX: 0,
                ease: "sine",
                stagger: 0.04,
                scrollTrigger: {
                  trigger: container,
                  start: "top bottom-=15%",
                  end: "bottom center+=15%",
                  scrub: true,
                },
              },
            );
          });
        }
      } catch (error) {
        console.error("[ScrollTextReveal] GSAP initialization failed:", error);
      }
    }

    return () => {
      if (gsapContextRef.current) gsapContextRef.current.revert();
      if (scrollTriggerRef.current) scrollTriggerRef.current.kill();
      if (splitInstanceRef.current) splitInstanceRef.current.revert();
    };
  }, [animMode, validatedText, theme]);

  return (
    <p
      ref={containerRef}
      className={`typography-body relative ${className}`}
      style={{ color: theme === "dark" ? "#cbd5e1" : "#1e293b" }}
    >
      {validatedText}
    </p>
  );
};

export default ScrollTextReveal;
