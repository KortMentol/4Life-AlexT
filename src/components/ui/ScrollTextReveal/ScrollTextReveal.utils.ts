import React from "react";
import { TextSplitterResult } from "./ScrollTextReveal.types";

export class TextSplitter {
  static splitText(text: string): TextSplitterResult {
    if (!text || typeof text !== "string") {
      return {
        words: [],
        preservedSpacing: [],
        lineBreaks: [],
      };
    }

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

    const segments = text.split(/(\s+)/);
    let wordIndex = 0;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (!segment || segment.length === 0) continue;

      if (/^\s+$/.test(segment)) {
        if (words.length > 0) {
          preservedSpacing[preservedSpacing.length - 1] = true;
        }
        const lineBreakMatches = segment.match(/\n/g);
        if (lineBreakMatches) {
          for (let j = 0; j < lineBreakMatches.length; j++) {
            lineBreaks.push(wordIndex);
          }
        }
      } else {
        const trimmedWord = segment.trim();
        if (trimmedWord.length > 0) {
          words.push(trimmedWord);
          preservedSpacing.push(false);
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

  static preserveFormatting(
    words: string[],
    spacing: boolean[],
    lineBreaks: number[],
    renderWord: (word: string, index: number) => React.ReactNode | string,
  ): (React.ReactNode | string)[] {
    const result: (React.ReactNode | string)[] = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (!word) continue;

      if (lineBreaks.includes(i)) {
        result.push(React.createElement("br", { key: `br-${i}` }));
      }

      result.push(renderWord(word, i));

      if (spacing[i]) {
        result.push(" ");
      }
    }

    return result;
  }

  static calculateWordTiming(index: number, totalWords: number, staggerDelay: number): [number, number] {
    if (totalWords <= 1) {
      return [0, 1];
    }

    const baseProgress = index / (totalWords - 1);
    const staggerRange = Math.min(staggerDelay * totalWords, 0.8);
    const wordDuration = Math.max(0.2, 1 - staggerRange);

    const startProgress = baseProgress * staggerRange;
    const endProgress = Math.min(1, startProgress + wordDuration);

    return [startProgress, endProgress];
  }

  static validateText(text: unknown): string {
    if (typeof text !== "string") {
      if (import.meta.env.DEV) {
        console.warn("[ScrollTextReveal] Invalid text input:", typeof text);
      }
      return "";
    }

    if (text.length > 10000) {
      if (import.meta.env.DEV) {
        console.warn("[ScrollTextReveal] Text exceeds recommended length (10000 chars)");
      }
      return text.substring(0, 10000) + "...";
    }

    return text;
  }

  static handleEdgeCases(text: string): string {
    const normalizedSpaces = text.replace(/[ \t]+/g, " ");
    const normalizedLineEndings = normalizedSpaces.replace(/\r\n|\r/g, "\n");
    const normalizedLineBreaks = normalizedLineEndings.replace(/\n{3,}/g, "\n\n");
    return normalizedLineBreaks;
  }
}

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
    enableWordSplitting: true,
    enableBlurEffect: false,
    enableSkewEffect: false,
    enableGPUAcceleration: true,
  },
  high: {
    tier: "high" as const,
    enableWordSplitting: true,
    enableBlurEffect: true,
    enableSkewEffect: true,
    enableGPUAcceleration: true,
  },
} as const;
