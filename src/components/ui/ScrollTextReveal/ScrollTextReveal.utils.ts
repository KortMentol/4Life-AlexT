/**
 * @module src/components/ui/ScrollTextReveal/ScrollTextReveal.utils.ts
 * @description Text splitting utilities for ScrollTextReveal component
 * @author Kort
 * @version 1.0.0
 */

import React from "react";
import { TextSplitterResult } from "./ScrollTextReveal.types";

/**
 * TextSplitter class for robust text processing and word-by-word splitting
 */
export class TextSplitter {
  /**
   * Splits text into words while preserving formatting information
   * @param text - Input text to split
   * @returns Structured data for animation targeting
   */
  static splitText(text: string): TextSplitterResult {
    if (!text || typeof text !== "string") {
      return {
        words: [],
        preservedSpacing: [],
        lineBreaks: [],
      };
    }

    // Handle empty or whitespace-only strings
    if (text.trim().length === 0) {
      return {
        words: [text],
        preservedSpacing: [false],
        lineBreaks: [],
      };
    }

    const words: string[] = [];
    const preservedSpacing: boolean[] = [];
    const lineBreaks: number[] = [];

    // Split on whitespace while preserving spacing information
    const segments = text.split(/(\s+)/);

    let wordIndex = 0;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      // Skip empty or undefined segments
      if (!segment || segment.length === 0) continue;

      // Check if this segment is whitespace
      if (/^\s+$/.test(segment)) {
        // If we have words, mark the last word as having preserved spacing
        if (words.length > 0) {
          preservedSpacing[preservedSpacing.length - 1] = true;
        }

        // Check for line breaks in the whitespace
        const lineBreakMatches = segment.match(/\n/g);
        if (lineBreakMatches) {
          // Add line break positions
          for (let j = 0; j < lineBreakMatches.length; j++) {
            lineBreaks.push(wordIndex);
          }
        }
      } else {
        // This is a word segment
        const trimmedWord = segment.trim();
        if (trimmedWord.length > 0) {
          words.push(trimmedWord);
          preservedSpacing.push(false); // Will be updated if followed by whitespace
          wordIndex++;
        }
      }
    }

    return {
      words,
      preservedSpacing,
      lineBreaks,
    };
  }

  /**
   * Wraps words in motion.span elements while preserving formatting
   * @param words - Array of words to wrap
   * @param spacing - Array indicating preserved spacing
   * @param lineBreaks - Array of line break positions
   * @param renderWord - Function to render each word
   * @returns Array of React nodes with preserved formatting
   */
  static preserveFormatting(
    words: string[],
    spacing: boolean[],
    lineBreaks: number[],
    renderWord: (word: string, index: number) => React.ReactNode | string,
  ): (React.ReactNode | string)[] {
    const result: (React.ReactNode | string)[] = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      // Skip if word is undefined
      if (!word) continue;

      // Add line break before this word if needed
      if (lineBreaks.includes(i)) {
        result.push(React.createElement("br", { key: `br-${i}` }));
      }

      // Render the word
      result.push(renderWord(word, i));

      // Add space after word if preserved spacing indicates it
      if (spacing[i]) {
        result.push(" ");
      }
    }

    return result;
  }

  /**
   * Calculates animation timing for word staggering
   * @param index - Word index
   * @param totalWords - Total number of words
   * @param staggerDelay - Delay between word animations
   * @returns Start and end progress values for the word
   */
  static calculateWordTiming(index: number, totalWords: number, staggerDelay: number): [number, number] {
    if (totalWords <= 1) {
      return [0, 1];
    }

    // Calculate the base progress for this word
    const baseProgress = index / (totalWords - 1);

    // Apply stagger delay
    const staggerRange = Math.min(staggerDelay * totalWords, 0.8); // Cap at 80% of animation
    const wordDuration = Math.max(0.2, 1 - staggerRange); // Minimum 20% duration per word

    const startProgress = baseProgress * staggerRange;
    const endProgress = Math.min(1, startProgress + wordDuration);

    return [startProgress, endProgress];
  }

  /**
   * Validates and sanitizes text input
   * @param text - Input text to validate
   * @returns Sanitized text or empty string if invalid
   */
  static validateText(text: unknown): string {
    if (typeof text !== "string") {
      if (import.meta.env.DEV) {
        console.warn("[ScrollTextReveal] Invalid text input:", typeof text);
      }
      return "";
    }

    // Handle extremely long text (performance consideration)
    if (text.length > 10000) {
      if (import.meta.env.DEV) {
        console.warn("[ScrollTextReveal] Text exceeds recommended length (10000 chars)");
      }
      return text.substring(0, 10000) + "...";
    }

    return text;
  }

  /**
   * Handles edge cases in text processing
   * @param text - Input text
   * @returns Processed text with edge cases handled
   */
  static handleEdgeCases(text: string): string {
    // Handle multiple consecutive spaces - normalize to single space
    const normalizedSpaces = text.replace(/[ \t]+/g, " ");

    // Handle mixed line endings - normalize to \n
    const normalizedLineEndings = normalizedSpaces.replace(/\r\n|\r/g, "\n");

    // Handle excessive line breaks - limit to double line breaks
    const normalizedLineBreaks = normalizedLineEndings.replace(/\n{3,}/g, "\n\n");

    return normalizedLineBreaks;
  }
}

/**
 * Default configuration for ScrollTextReveal
 */
export const DEFAULT_CONFIG = {
  animation: {
    staggerDelay: 0.04,
    easingFunction: "sine",
    blurRange: [8, 0] as [number, number],
    skewRange: [-20, 0] as [number, number],
    opacityRange: [0, 1] as [number, number],
  },
  scrollTrigger: {
    startOffset: "start 0.85",
    endOffset: "end 0.65",
    scrubEnabled: true,
  },
  performance: {
    inViewMargin: "200px",
    gpuAcceleration: true,
    willChangeOptimization: true,
  },
} as const;

/**
 * Performance tier configurations with smart degradation
 */
export const PERFORMANCE_CONFIGS = {
  low: {
    tier: "low" as const,
    enableWordSplitting: false,
    enableBlurEffect: false,
    enableSkewEffect: false,
    enableGPUAcceleration: false,
  },
  medium: {
    tier: "medium" as const,
    enableWordSplitting: true, // Word-by-word animation enabled
    enableBlurEffect: false, // ОТКЛЮЧИЛИ blur на medium — для мобилок!
    enableSkewEffect: false, // No skew for performance
    enableGPUAcceleration: true,
  },
  high: {
    tier: "high" as const,
    enableWordSplitting: true,
    enableBlurEffect: true,
    enableSkewEffect: true, // Full effect with skew
    enableGPUAcceleration: true,
  },
} as const;
