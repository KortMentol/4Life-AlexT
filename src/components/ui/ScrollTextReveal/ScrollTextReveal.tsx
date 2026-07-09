/**
 * @module src/components/ui/ScrollTextReveal/ScrollTextReveal.tsx
 * @description Высокопроизводительный текстовый парсер на базе GSAP ScrollTrigger.
 *
 * ОПТИМИЗАЦИЯ CHROME (LAYER EXPLOSION & LAYOUT SHIFT FIX):
 * 1. Удалено `force3D: true` с пословной анимации. Выделение 50 отдельных GPU-текстур
 *    в Chrome приводит к просадке FPS, так как переполняет видеопамять.
 * 2. Убрано свойство `contentVisibility: "auto"`. Использование этого свойства на элементах-триггерах
 *    ScrollTrigger ломает расчет высот страницы, вызывая прыжки макета и некорректный запуск анимации.
 *
 * @author Kort
 * @version 5.4.0
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

  const isBlurRequested = useFeatureFlag("scrollTextBlur", tier === "high");
  const isOpacityRequested = useFeatureFlag("scrollTextOpacity", tier === "medium");
  const isBlockOpacityRequested = useFeatureFlag("scrollTextBlockOpacity", tier !== "low");

  type AnimType = "static" | "block_opacity" | "word_by_word_blur" | "word_by_word_opacity";
  let animMode: AnimType = "static";

  if (isTouchDevice) {
    animMode = isBlockOpacityRequested ? "block_opacity" : "static";
  } else {
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

    if (animMode === "static") {
      window.gsap.set(container, {
        opacity: 1,
        y: 0,
        filter: "none",
        skewX: 0,
        clearProps: "transform, opacity, filter",
      });

      const words = container.querySelectorAll('[class*="word-"]');
      if (words.length > 0) {
        window.gsap.set(words, {
          opacity: 1,
          filter: "none",
          skewX: 0,
          clearProps: "transform, opacity, filter",
        });
      }
      return;
    }

    if (animMode === "block_opacity") {
      gsapContextRef.current = window.gsap.context(() => {
        scrollTriggerRef.current = window.gsap.fromTo(
          container,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            force3D: true, // Для единичного блока это безопасно и эффективно
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top bottom-=10%",
              end: "bottom center",
              scrub: true,
            },
          },
        );
      });
    } else {
      try {
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
          gsapContextRef.current = window.gsap.context(() => {
            scrollTriggerRef.current = window.gsap.fromTo(
              words,
              {
                opacity: 0,
                filter: animMode === "word_by_word_blur" ? "blur(6px)" : "none",
                skewX: animMode === "word_by_word_blur" ? -20 : 0,
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
    <p ref={containerRef} className={`editorial-body relative ${className}`}>
      {validatedText}
    </p>
  );
};

export default ScrollTextReveal;
