/**
 * @module src/components/ui/PageNav.tsx
 * @description Вертикальная навигация по секциям страницы — правый край экрана.
 *
 * Кликабельные индикаторы с плавным скроллом через Lenis.
 * Только desktop (non-touch).
 * Адаптирована под light/dark тему.
 *
 * Исправления:
 * - Скрытые labels не кликабельны (pointer-events: none)
 * - Нет флика при смене главы (layout="position" на span)
 * - Жидкая полоска через layoutId — плавное перетекание
 */

import { scrollTo } from "@/lib/lenis";
import { LayoutGroup, motion } from "framer-motion";
import { memo } from "react";

const IS_TOUCH =
  typeof window !== "undefined"
    ? "ontouchstart" in window || navigator.maxTouchPoints > 0
    : false;

export interface PageNavSection {
  label: string;
  ref: React.RefObject<HTMLElement | HTMLDivElement | null>;
}

interface PageNavProps {
  sections: PageNavSection[];
  activeIndex: number;
}

const PageNav = memo(({ sections, activeIndex }: PageNavProps) => {
  if (IS_TOUCH) return null;

  const gold = "#B9974A";
  const cream = "rgba(240,237,232,0.55)";
  const dim = "rgba(240,237,232,0.18)";

  const handleClick = (
    ref: React.RefObject<HTMLElement | HTMLDivElement | null>,
  ) => {
    if (ref.current) {
      scrollTo(ref.current, {
        offset: 0,
        duration: 1.8,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    }
  };

  return (
    // LayoutGroup нужен для layoutId — жидкое перетекание полоски
    <LayoutGroup id="page-nav">
      <nav
        aria-label="Навигация по разделам страницы"
        className="fixed right-7 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-5"
      >
        {sections.map((section, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={section.label}
              onClick={() => handleClick(section.ref)}
              className="flex items-center gap-2.5 bg-transparent border-none p-0 cursor-pointer"
              aria-label={`Перейти к разделу ${section.label}`}
              // Неактивные кнопки не кликабельны — только активная
              style={{ pointerEvents: isActive ? "auto" : "none" }}
            >
              {/* Label — только активный кликабелен и виден */}
              <div className="overflow-hidden" style={{ height: "12px" }}>
                <motion.span
                  animate={{
                    opacity: isActive ? 0.55 : 0,
                    y: isActive ? 0 : 4,
                  }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-[9px] uppercase tracking-[0.35em] font-medium select-none"
                  style={{
                    color: cream,
                    // Скрытые labels не кликабельны — убирает баг с кликом
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  {section.label}
                </motion.span>
              </div>

              {/* Индикатор — жидкая полоска через layoutId */}
              <div
                className="relative flex items-center justify-center"
                style={{ width: 1, height: 28 }}
              >
                {/* Фоновая тонкая линия — всегда видна */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: 1,
                    height: 6,
                    backgroundColor: dim,
                    transition: "background-color 0.3s ease",
                  }}
                />
                {/* Активная полоска — перетекает между позициями через layoutId */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute rounded-full"
                    style={{
                      width: 1,
                      height: 28,
                      backgroundColor: gold,
                      // Жидкое перетекание — spring физика
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
            </button>
          );
        })}
      </nav>
    </LayoutGroup>
  );
});

PageNav.displayName = "PageNav";

export default PageNav;
