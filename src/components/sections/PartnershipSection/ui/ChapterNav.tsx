/**
 * @module PartnershipSection/ui/ChapterNav.tsx
 * @description Liquid-inertia right-edge editorial chapter rail for /partnership.
 * Uses a single continuous molten-gold spring indicator (useSpring + useVelocity)
 * that glides smoothly up and down with physical velocity-driven elongation,
 * eliminating abrupt bar snapping in both directions.
 */

import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import { scrollTo } from "@/lib/lenis";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import React, { memo, useEffect } from "react";
import type { Palette } from "../constants";
import { IS_TOUCH } from "../constants";

export interface NavChapterItem {
  id: string;
  label: string;
}

interface ChapterNavProps {
  active: number;
  tier: PerformanceTier;
  palette: Palette;
  visible: boolean;
  chapters: readonly NavChapterItem[];
  chapterRefs: React.RefObject<HTMLElement | HTMLDivElement | null>[];
  onSelectChapter?: (index: number) => void;
}

const ROW_HEIGHT = 36;
const ROW_GAP = 10;
const ROW_STEP = ROW_HEIGHT + ROW_GAP;
const INDICATOR_HEIGHT = 26;
const INDICATOR_OFFSET = (ROW_HEIGHT - INDICATOR_HEIGHT) / 2;

const ChapterNav = memo(
  ({ active, tier, palette, visible, chapters, chapterRefs, onSelectChapter }: ChapterNavProps) => {
    const isHigh = tier === "high";
    const targetY = useMotionValue(active * ROW_STEP + INDICATOR_OFFSET);

    const smoothY = useSpring(targetY, {
      stiffness: isHigh ? 190 : 240,
      damping: isHigh ? 23 : 28,
      mass: isHigh ? 0.78 : 0.6,
    });

    const velocityY = useVelocity(smoothY);
    const liquidScaleY = useTransform(
      velocityY,
      [-1400, -450, 0, 450, 1400],
      isHigh ? [2.05, 1.38, 1, 1.38, 2.05] : [1, 1, 1, 1, 1],
    );
    const liquidGlowOpacity = useTransform(
      velocityY,
      [-900, 0, 900],
      isHigh ? [0.95, 0.55, 0.95] : [0.55, 0.55, 0.55],
    );

    useEffect(() => {
      const clamped = Math.max(0, Math.min(active, Math.max(0, chapters.length - 1)));
      targetY.set(clamped * ROW_STEP + INDICATOR_OFFSET);
    }, [active, chapters.length, targetY]);

    if (IS_TOUCH || tier === "low") return null;

    const handleClick = (index: number) => {
      onSelectChapter?.(index);
      const ref = chapterRefs[index];
      if (ref?.current) {
        scrollTo(ref.current, {
          offset: -24,
          duration: 1.15,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
      }
    };

    const totalRailHeight = chapters.length * ROW_HEIGHT + Math.max(0, chapters.length - 1) * ROW_GAP;

    return (
      <AnimatePresence>
        {visible && (
          <motion.nav
            aria-label="Навигация по разделам партнёрства"
            data-chapter-nav
            className="fixed right-5 xl:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex items-stretch"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative flex flex-col items-end" style={{ gap: `${ROW_GAP}px` }}>
              {chapters.map((chapter, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => handleClick(i)}
                    data-chapter-item={chapter.id}
                    data-active={isActive ? "true" : "false"}
                    style={{ height: `${ROW_HEIGHT}px` }}
                    className="flex items-center justify-end gap-4 bg-transparent border-none pr-4 pl-2 cursor-pointer group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A659] rounded-md"
                    aria-label={`Перейти к разделу ${chapter.label}`}
                    aria-current={isActive ? "location" : undefined}
                  >
                    <span
                      className={`typography-mono text-[10px] uppercase tracking-[0.24em] select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive
                          ? "opacity-100 -translate-x-1 font-semibold"
                          : "opacity-35 translate-x-0 group-hover:opacity-85 group-hover:-translate-x-0.5 font-medium"
                      }`}
                      style={{ color: isActive ? palette.gold : palette.cream }}
                    >
                      {chapter.label}
                    </span>
                  </button>
                );
              })}

              {/* Continuous Right Rail + Flowing Liquid Gold Droplet */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 w-2 flex justify-center"
                style={{ height: `${totalRailHeight}px` }}
              >
                {/* Hairline spine */}
                <span className="w-px h-full bg-white/[0.11] rounded-full" />

                {/* Subtle chapter tick notches */}
                {chapters.map((chapter, i) => (
                  <span
                    key={`tick-${chapter.id}`}
                    className="absolute w-[3px] h-[3px] rounded-full bg-white/25"
                    style={{
                      top: `${i * ROW_STEP + ROW_HEIGHT / 2 - 1.5}px`,
                    }}
                  />
                ))}

                {/* Single continuous fluid spring indicator */}
                <motion.span
                  data-testid="liquid-chapter-indicator"
                  className="absolute top-0 w-[3px] rounded-full origin-center"
                  style={{
                    height: `${INDICATOR_HEIGHT}px`,
                    y: smoothY,
                    scaleY: liquidScaleY,
                    background: `linear-gradient(180deg, #F0EDE8 0%, ${palette.gold} 55%, #8F6D28 100%)`,
                  }}
                >
                  <motion.span
                    className="absolute -inset-x-[3px] -inset-y-[2px] rounded-full"
                    style={{
                      opacity: liquidGlowOpacity,
                      background: `radial-gradient(circle, rgba(201,166,89,0.75) 0%, transparent 72%)`,
                    }}
                  />
                </motion.span>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    );
  },
);

ChapterNav.displayName = "ChapterNav";

export default ChapterNav;