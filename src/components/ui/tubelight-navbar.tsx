/**
 * @module components/ui/tubelight-navbar
 * @description Премиальная неоновая навигационная панель с эффектом светящейся лампы.
 * Полностью зафиксирована под глубокий стиль Clinical Obsidian (белый активный текст, неоновые циановые ареолы).
 * Полностью очищена от фликов, ресайз-троттлинга и вызовов светлой темы.
 * @version 2.1.0
 */

import { useTransition } from "@/context/TransitionProvider";
import { mainNav } from "@/site-config/site";
import { scrollToTop } from "@/utils/navigationUtils";
import { motion, useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

export const TubelightNavbar: React.FC = () => {
  const location = useLocation();
  const { transitionTo } = useTransition();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navRef = useRef<HTMLElement>(null);
  const inView = useInView(navRef, { once: false, margin: "100px" });

  // КЭШ КООРДИНАТ: спасает Main Thread от Layout Thrashing
  const rectsCache = useRef<{ left: number; right: number; width: number }[]>([]);

  useEffect(() => {
    setClickedIndex(null);
  }, [location.pathname]);

  // Считаем геометрию кнопок 1 раз при загрузке и ресайзе для 100% плавности
  useEffect(() => {
    const updateRects = () => {
      rectsCache.current = itemRefs.current.map((el) => {
        if (!el) return { left: 0, right: 0, width: 0 };
        const rect = el.getBoundingClientRect();
        return { left: rect.left, right: rect.right, width: rect.width };
      });
    };

    const timer = setTimeout(updateRects, 300);
    window.addEventListener("resize", updateRects);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateRects);
    };
  }, []);

  return (
    <motion.nav
      ref={navRef}
      role="navigation"
      className="hidden md:flex items-center justify-center h-full"
      style={{ marginLeft: "4rem" }}
      onMouseLeave={() => setHoveredIndex(null)}
      onMouseMove={(e) => {
        if (!inView || rectsCache.current.length === 0) return;

        const OVERLAP = 14;
        let bestMatch = { index: -1, edgeDistance: Infinity, centerDistance: Infinity };

        rectsCache.current.forEach((rect, idx) => {
          if (rect.width === 0) return;
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
                if (location.pathname === item.href) {
                  scrollToTop({ immediate: false });
                  return;
                }
                setClickedIndex(index);
                transitionTo(item.href);
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              className={({ isActive }) =>
                `flex items-center px-3 py-1.5 rounded-xl text-[14px] font-medium relative whitespace-nowrap tracking-tight transition-colors duration-300 ${
                  isActive ? "text-white" : "text-gray-300"
                }`
              }
            >
              {({ isActive }) => {
                const showLamp =
                  clickedIndex === index ||
                  (clickedIndex === null && hoveredIndex === index) ||
                  (clickedIndex === null && hoveredIndex === null && isActive);
                return (
                  <>
                    <span className="relative z-10">{item.title}</span>
                    {showLamp && (
                      <motion.div
                        layoutId="lamp"
                        className="absolute inset-0 w-full rounded-xl -z-10 bg-slate-700/60"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      >
                        <div
                          className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full"
                          style={{ background: "linear-gradient(90deg, #00ffff, #00aaff)" }}
                        >
                          <div
                            className="absolute w-12 h-6 rounded-full blur-md -top-2 -left-2"
                            style={{ background: "rgba(0, 255, 255, 0.2)" }}
                          />
                          <div
                            className="absolute w-8 h-6 rounded-full blur-md -top-1"
                            style={{ background: "rgba(0, 255, 255, 0.2)" }}
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
