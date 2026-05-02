/**
 * @module PartnershipSection/ui/ChapterNav.tsx
 * Вертикальная навигация по главам — правый край экрана.
 * Только на /partnership странице, только desktop, только medium/high tier.
 *
 * Все главы видны всегда — активная ярко, остальные приглушённо.
 * Все кликабельны — плавный скролл к нужной главе через Lenis.
 * Hover — подсветка.
 */

import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import { scrollTo } from "@/lib/lenis";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { memo } from "react";
import type { Palette } from "../constants";
import { CHAPTERS, IS_TOUCH } from "../constants";

interface ChapterNavProps {
  active: number;
  tier: PerformanceTier;
  palette: Palette;
  visible: boolean;
  chapterRefs?: React.RefObject<HTMLElement | HTMLDivElement | null>[];
}

const ChapterNav = memo(
  ({ active, tier, palette, visible, chapterRefs }: ChapterNavProps) => {
    if (IS_TOUCH || tier === "low") return null;

    const handleClick = (index: number) => {
      const ref = chapterRefs?.[index];
      if (ref?.current) {
        scrollTo(ref.current, {
          offset: 0,
          duration: 1.8,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
      }
    };

    return (
      <AnimatePresence>
        {visible && (
          <motion.nav
            aria-label="Навигация по разделам"
            className="fixed right-7 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-4"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <LayoutGroup id="chapter-nav">
              {CHAPTERS.map((label, i) => {
                const isActive = i === active;
                return (
                  <motion.button
                    key={label}
                    onClick={() => handleClick(i)}
                    className="flex items-center gap-2.5 bg-transparent border-none p-0 cursor-pointer group"
                    aria-label={`Перейти к разделу ${label}`}
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                  >
                    {/* Label — всегда виден, активный ярче */}
                    <motion.span
                      variants={{
                        rest: { opacity: isActive ? 0.55 : 0.2 },
                        hover: { opacity: isActive ? 0.75 : 0.45 },
                      }}
                      transition={{ duration: 0.25 }}
                      className="text-[9px] uppercase tracking-[0.35em] font-medium select-none"
                      style={{ color: isActive ? palette.gold : palette.cream }}
                    >
                      {label}
                    </motion.span>

                    {/* Индикатор — жидкая полоска через layoutId */}
                    <div
                      className="relative flex items-center justify-center"
                      style={{ width: 1, height: 28 }}
                    >
                      {/* Фоновая линия */}
                      <motion.div
                        variants={{
                          rest: {
                            height: isActive ? 28 : 5,
                            backgroundColor: isActive
                              ? palette.gold
                              : palette.overlay20,
                          },
                          hover: {
                            height: isActive ? 28 : 10,
                            backgroundColor: isActive
                              ? palette.gold
                              : palette.overlay40,
                          },
                        }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute rounded-full"
                        style={{ width: 1 }}
                      />
                      {/* Активная полоска — перетекает через layoutId */}
                      {isActive && (
                        <motion.div
                          layoutId="chapter-active"
                          className="absolute rounded-full"
                          style={{
                            width: 1,
                            height: 28,
                            backgroundColor: palette.gold,
                          }}
                          transition={{
                            layout: {
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                              mass: 0.8,
                            },
                          }}
                        />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </LayoutGroup>
          </motion.nav>
        )}
      </AnimatePresence>
    );
  },
);

ChapterNav.displayName = "ChapterNav";

export default ChapterNav;
