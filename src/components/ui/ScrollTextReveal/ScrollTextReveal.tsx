/**
 * @module src/components/ui/ScrollTextReveal/ScrollTextReveal.tsx
 * @description Modern blur/skew text reveal component implementing Codrops demo 4 effect
 * @author Kort
 * @version 2.0.0 - GSAP Performance Optimized
 * @usage
 * Drop-in replacement for ScrollText component with enhanced visual effects
 * @example
 * <ScrollTextReveal className="text-lg leading-relaxed">
 *   Your text content here...
 * </ScrollTextReveal>
 */

import { useTheme } from "@/hooks";
import { useEffectsDebug } from "@/hooks/useEffectsDebug";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useInView } from "framer-motion";
import React, { useEffect, useMemo, useRef } from "react";
import { ScrollTextRevealProps } from "./ScrollTextReveal.types";
import { DEFAULT_CONFIG, PERFORMANCE_CONFIGS, TextSplitter } from "./ScrollTextReveal.utils";

// Global GSAP types
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    SplitType: any;
  }
}

/**
 * ScrollTextReveal Component
 *
 * Implements the 4th text reveal effect from Codrops ScrollBlurTypography demo
 * with performance optimization and theme integration using pure GSAP.
 */
const ScrollTextReveal: React.FC<ScrollTextRevealProps> = ({
  children,
  className = "",
  staggerDelay = DEFAULT_CONFIG.animation.staggerDelay,
  easingFunction = DEFAULT_CONFIG.animation.easingFunction,
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const tier = usePerformanceTier();
  const efxFlags = useEffectsDebug();
  const { theme } = useTheme();
  const splitInstanceRef = useRef<any>(null);
  const scrollTriggerRef = useRef<any>(null);

  // КРИТИЧНО: На тач-устройствах СТРОГО отключаем blur и skew, даже если телефон мощный
  const isTouchDevice =
    typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;

  // На мобилках СТРОГО medium tier — никаких blur/skew эффектов!
  const effectiveTier = isTouchDevice ? "medium" : tier;

  // Get performance configuration
  const performanceConfig = PERFORMANCE_CONFIGS[effectiveTier];

  // DEV: Check effects debug flags
  const wordByWordEnabled = import.meta.env.DEV ? efxFlags.scrollTextWordByWord : true;

  const resolvedTier = effectiveTier === "high" && !wordByWordEnabled ? "medium" : effectiveTier;

  // Validate and sanitize input text
  const validatedText = useMemo(() => {
    const sanitized = TextSplitter.validateText(children);
    return TextSplitter.handleEdgeCases(sanitized);
  }, [children]);

  // Viewport detection with performance optimization
  const inView = useInView(containerRef, {
    once: false,
    margin: DEFAULT_CONFIG.performance.inViewMargin,
  });

  // Theme-based styling with consistent colors
  const getThemeStyles = () => {
    return {
      // Премиальные цвета — яркие и контрастные
      color: theme === "dark" ? "#67e8f9" : "#1e293b", // cyan-300 dark / slate-800 light (темнее для контраста)
    };
  };

  // GSAP Animation Effect (like original demo 4)
  useEffect(() => {
    if (!window.gsap || !window.ScrollTrigger || !containerRef.current || !inView) return;

    const container = containerRef.current;

    // LOW TIER: No animation
    if (resolvedTier === "low") return;

    // Clean up previous instances
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }
    if (splitInstanceRef.current) {
      splitInstanceRef.current.revert();
      splitInstanceRef.current = null;
    }

    // MEDIUM/HIGH TIER: Word-by-word animation
    if (isTouchDevice) {
      // ДЛЯ МОБИЛОК: Никакого разбиения на слова. Одна легкая анимация на весь блок.
      scrollTriggerRef.current = window.gsap.fromTo(
        container,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top bottom-=10%",
            end: "bottom center",
            scrub: true,
          },
        },
      );
    } else if (performanceConfig.enableWordSplitting && validatedText) {
      try {
        // Use SplitType like in original demo (if available) or fallback to manual splitting
        if (window.SplitType) {
          splitInstanceRef.current = new window.SplitType(container, {
            types: "words",
          });
        } else {
          // Manual word splitting fallback
          const textData = TextSplitter.splitText(validatedText);
          if (textData.words.length > 0) {
            const wordsHTML = TextSplitter.preserveFormatting(
              textData.words,
              textData.preservedSpacing,
              textData.lineBreaks,
              (word, index) =>
                `<span class="word-${index}" style="display: inline-block; margin-right: 0.75rem; margin-top: 0.75rem;">${word}</span>`,
            );
            container.innerHTML = wordsHTML.join("");
          }
        }

        // Get words for animation
        const words = splitInstanceRef.current?.words || container.querySelectorAll('[class*="word-"]');

        if (words && words.length > 0) {
          // Apply theme color to words
          const themeColor = theme === "dark" ? "#67e8f9" : "#1e293b";
          words.forEach((word: HTMLElement) => {
            word.style.color = themeColor;
          });

          // GSAP Animation (exactly like demo 4)
          const animationProps: any = {
            opacity: 0,
            willChange: "opacity, transform", // УБРАЛИ filter — экономим GPU память!
          };

          const toProps: any = {
            ease: easingFunction === "sine" ? "sine" : "none",
            opacity: 1,
            stagger: staggerDelay,
            scrollTrigger: {
              trigger: container,
              start: "top bottom-=15%",
              end: "bottom center+=15%",
              scrub: true,
            },
          };

          // Add blur only for HIGH tier (НЕ на мобилках!)
          if (resolvedTier === "high" && performanceConfig.enableBlurEffect) {
            animationProps.filter = "blur(8px)";
            toProps.filter = "blur(0px)";
          }

          // Add skew only for HIGH tier (like demo 4)
          if (resolvedTier === "high" && performanceConfig.enableSkewEffect) {
            animationProps.skewX = -20;
            toProps.skewX = 0;
          }

          // Create the animation
          scrollTriggerRef.current = window.gsap.fromTo(words, animationProps, toProps);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("[ScrollTextReveal] GSAP animation failed:", error);
        }
      }
    }

    // Cleanup function
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      if (splitInstanceRef.current) {
        splitInstanceRef.current.revert();
        splitInstanceRef.current = null;
      }
    };
  }, [inView, resolvedTier, validatedText, theme, staggerDelay, easingFunction, performanceConfig]);

  // Error boundary wrapper
  const renderWithErrorBoundary = (content: React.ReactNode) => {
    try {
      return content;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("[ScrollTextReveal] Render error:", error);
      }
      // Fallback to static text
      return (
        <p className={`typography-body relative ${className}`} style={getThemeStyles()}>
          {validatedText}
        </p>
      );
    }
  };

  // Render the container
  return renderWithErrorBoundary(
    <p ref={containerRef} className={`typography-body relative ${className}`} style={getThemeStyles()}>
      {validatedText}
    </p>,
  );
};

export default ScrollTextReveal;
