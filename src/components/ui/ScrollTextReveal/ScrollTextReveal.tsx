import { useFeatureFlag } from "@/hooks/useEffectsDebug";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useMemo, useRef } from "react";
import { ScrollTextRevealProps } from "./ScrollTextReveal.types";
import { TextSplitter } from "./ScrollTextReveal.utils";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    gsap?: typeof gsap;
    ScrollTrigger?: typeof ScrollTrigger;
    SplitType?: new (el: HTMLElement, opts: { types: string }) => { words: HTMLElement[]; revert: () => void };
  }
}

const ScrollTextReveal: React.FC<ScrollTextRevealProps> = ({ children, className = "" }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const tier = usePerformanceTier();

  const splitInstanceRef = useRef<{ words: HTMLElement[]; revert: () => void } | null>(null);
  const scrollTriggerRef = useRef<gsap.core.Tween | null>(null);
  const gsapContextRef = useRef<gsap.Context | null>(null);

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
    if (!containerRef.current) return;

    const container = containerRef.current;

    if (animMode === "static") {
      gsap.set(container, {
        opacity: 1,
        y: 0,
        filter: "none",
        skewX: 0,
        clearProps: "transform, opacity, filter",
      });

      const words = container.querySelectorAll('[class*="word-"]');
      if (words.length > 0) {
        gsap.set(words, {
          opacity: 1,
          filter: "none",
          skewX: 0,
          clearProps: "transform, opacity, filter",
        });
      }
      return;
    }

    if (animMode === "block_opacity") {
      gsapContextRef.current = gsap.context(() => {
        scrollTriggerRef.current = gsap.fromTo(
          container,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            force3D: true,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top bottom-=10%",
              end: "bottom center",
              scrub: true,
            },
          },
        );
      }, containerRef);
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
          gsapContextRef.current = gsap.context(() => {
            scrollTriggerRef.current = gsap.fromTo(
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
          }, containerRef);
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
  }, [animMode, validatedText]);

  return (
    <p ref={containerRef} className={`editorial-body relative ${className}`} aria-label={validatedText}>
      {validatedText}
    </p>
  );
};

export default ScrollTextReveal;
