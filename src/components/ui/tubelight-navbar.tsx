import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTransition } from "@/context/TransitionProvider";
import { useTheme } from "@/hooks/useTheme";
import { mainNav } from "@/site-config/site";
import { scrollToTop } from "@/utils/navigationUtils";

export const TubelightNavbar: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { transitionTo } = useTransition();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // --- ИЗМЕНЕНИЕ 1: Новое состояние для "залипания" подсветки при клике ---
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  // --- ИЗМЕНЕНИЕ 2: Сбрасываем "залипание" после завершения перехода на новую страницу ---
  useEffect(() => {
    setClickedIndex(null);
  }, [location.pathname]);

  return (
    <motion.nav
      role="navigation"
      className="hidden md:flex items-center justify-center h-full"
      style={{ marginLeft: "4rem" }}
      onMouseLeave={() => setHoveredIndex(null)}
      onMouseMove={(e) => {
        // Оптимизация: throttling для мобильных (хотя навбар скрыт на мобильных)
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          const OVERLAP = 14;
          let bestMatch = {
            index: -1,
            edgeDistance: Infinity,
            centerDistance: Infinity,
          };

          itemRefs.current.forEach((el, idx) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const center = rect.left + rect.width / 2;
            const edgeDistance = Math.max(0, e.clientX - (rect.right + OVERLAP), rect.left - OVERLAP - e.clientX);
            const centerDistance = Math.abs(center - e.clientX);

            if (
              edgeDistance < bestMatch.edgeDistance ||
              (edgeDistance === bestMatch.edgeDistance && centerDistance < bestMatch.centerDistance)
            ) {
              bestMatch = { index: idx, edgeDistance, centerDistance };
            }
          });

          if (bestMatch.index !== -1 && bestMatch.index !== hoveredIndex) {
            setHoveredIndex(bestMatch.index);
          }
        });
      }}
    >
      <div className="relative flex items-center gap-2">
        {mainNav.map((item, index) => (
          <motion.div
            key={item.href}
            ref={(el) => (itemRefs.current[index] = el)}
            className="relative flex items-center h-full"
          >
            <NavLink
              to={item.href}
              onClick={(e) => {
                e.preventDefault();
                // Если мы уже на этой странице, просто скроллим вверх
                if (location.pathname === item.href) {
                  scrollToTop({ immediate: false });
                  return;
                }
                // --- ИЗМЕНЕНИЕ 3: При клике "запоминаем" индекс, чтобы подсветка осталась ---
                setClickedIndex(index);
                transitionTo(item.href);
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              className={({ isActive }) =>
                `flex items-center px-3 py-1.5 rounded-xl text-[14px] font-medium relative whitespace-nowrap tracking-tight transition-colors duration-300 ${
                  isActive ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"
                }`
              }
            >
              {({ isActive }) => {
                // --- ИЗМЕНЕНИЕ 4: Новая логика для отображения подсветки ---
                const showLamp =
                  clickedIndex === index || // 1. Показываем, если этот элемент был кликнут
                  (clickedIndex === null && hoveredIndex === index) || // 2. Или если на него наведен курсор (и ничего не кликнуто)
                  (clickedIndex === null && hoveredIndex === null && isActive); // 3. Или если это активная страница (и ничего не кликнуто/не наведено)

                return (
                  <>
                    <span className="relative z-10">{item.title}</span>
                    {showLamp && (
                      <motion.div
                        layoutId="lamp"
                        className={`absolute inset-0 w-full rounded-xl -z-10 ${
                          isDark ? "bg-slate-700/60" : "bg-blue-100/80"
                        }`}
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                      >
                        <div
                          className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full"
                          style={{
                            background: isDark ? "linear-gradient(90deg, #00ffff, #00aaff)" : "linear-gradient(90deg, #374151, #1f2937)",
                          }}
                        >
                          <div
                            className="absolute w-12 h-6 rounded-full blur-md -top-2 -left-2"
                            style={{
                              background: isDark ? "rgba(0, 255, 255, 0.2)" : "rgba(55, 65, 81, 0.25)",
                            }}
                          />
                          <div
                            className="absolute w-8 h-6 rounded-full blur-md -top-1"
                            style={{
                              background: isDark ? "rgba(0, 255, 255, 0.2)" : "rgba(55, 65, 81, 0.2)",
                            }}
                          />
                          <div
                            className="absolute w-4 h-4 rounded-full blur-sm top-0 left-2"
                            style={{
                              background: isDark ? "rgba(0, 255, 255, 0.2)" : "rgba(55, 65, 81, 0.15)",
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </>
                );
              }}
            </NavLink>
          </motion.div>
        ))}
      </div>
    </motion.nav>
  );
};
