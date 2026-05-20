import { useIsMobile } from "@/hooks/useIsMobile";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useTheme } from "@/hooks/useTheme";
import { scrollToTop } from "@/utils/navigationUtils";
import {
  motion,
  useAnimationControls,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ArrowUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopButton: React.FC = () => {
  const isMobile = useIsMobile();
  const tier = usePerformanceTier();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const controls = useAnimationControls();
  const isVisibleRef = useRef(false);
  // Lock during route transitions to prevent phantom show from scroll restoration jumps
  const isRoutingLockRef = useRef(false);

  const { scrollY, scrollYProgress } = useScroll();

  // Hide button and lock on every route change for 800ms
  useEffect(() => {
    isRoutingLockRef.current = true;
    isVisibleRef.current = false;
    controls.start({ opacity: 0, y: 10, pointerEvents: "none" });

    const timer = setTimeout(() => {
      isRoutingLockRef.current = false;
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname, controls]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Ignore while menu is open (position:fixed makes scrollY = 0)
    if (document.documentElement.style.position === "fixed") return;
    // Ignore during route transitions (scroll restoration jumps)
    if (isRoutingLockRef.current) return;

    const previous = scrollY.getPrevious() || 0;
    const isScrollingUp = latest < previous;
    const progress = scrollYProgress.get();

    const shouldShow = progress > 0.2 && isScrollingUp;

    // Пропускаем вызов если состояние уже совпадает — экономим на RAF/анимации
    if (shouldShow === isVisibleRef.current) return;

    isVisibleRef.current = shouldShow;

    if (shouldShow) {
      controls.start({ opacity: 1, y: 0, pointerEvents: "auto" });
    } else {
      controls.start({ opacity: 0, y: 10, pointerEvents: "none" });
    }
  });

  const handleClick = () => {
    scrollToTop();
  };

  // МОБИЛЬНАЯ ВЕРСИЯ - минималистичная и сверхбыстрая
  if (isMobile) {
    return (
      <motion.button
        onClick={handleClick}
        initial={{ opacity: 0, y: 10, pointerEvents: "none" }}
        animate={controls}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`fixed z-50 bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center ${
          isDark
            ? "bg-gray-900/95 border-2 border-cyan-400/60"
            : "bg-white/95 border-2 border-blue-500/60"
        } active:scale-90`}
        style={{
          contain: "layout style paint",
          boxShadow: isDark
            ? "0 4px 12px rgba(6, 182, 212, 0.2)"
            : "0 4px 12px rgba(59, 130, 246, 0.2)",
        }}
        aria-label="Прокрутить вверх"
      >
        <div
          className={`absolute inset-0.5 rounded-full opacity-30 ${
            isDark
              ? "bg-gradient-to-br from-cyan-400/40 to-blue-500/40"
              : "bg-gradient-to-br from-blue-400/40 to-indigo-500/40"
          }`}
        />
        <ArrowUp
          size={16}
          strokeWidth={2.5}
          className={`relative z-10 ${isDark ? "text-cyan-300" : "text-blue-600"}`}
        />
      </motion.button>
    );
  }

  // ДЕСКТОПНАЯ ВЕРСИЯ - оптимизированная красота со всеми эффектами
  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10, pointerEvents: "none" }}
      animate={controls}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`fixed z-50 bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center ${
        isDark
          ? "bg-gradient-to-br from-violet-700 via-indigo-800 to-blue-900"
          : "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600"
      }`}
      style={{
        boxShadow: isDark
          ? "0 8px 24px rgba(139, 92, 246, 0.3)"
          : "0 8px 24px rgba(59, 130, 246, 0.3)",
      }}
      aria-label="Прокрутить вверх"
    >
      {/* Hover glow - только CSS */}
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
          isDark ? "bg-violet-400" : "bg-blue-300"
        }`}
        style={{
          opacity: isHovered ? 0.2 : 0,
          filter: "blur(12px)",
        }}
      />

      {/* Внутренний контейнер */}
      <div className="absolute inset-0.5 rounded-full overflow-hidden">
        {/* Радиальный градиент */}
        <div
          className={`absolute inset-0 opacity-30 ${
            isDark
              ? "bg-[radial-gradient(ellipse_at_center,_rgba(138,120,255,0.8)_0%,_rgba(50,50,180,0.2)_60%,_transparent_100%)]"
              : "bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.9)_0%,_rgba(100,150,255,0.3)_60%,_transparent_100%)]"
          }`}
        />

        {/* Бордер */}
        <div className="absolute inset-0 rounded-full border border-white/20" />

        {/* Частицы только для HIGH tier */}
        {tier === "high" && (
          <div className="absolute inset-0 overflow-hidden rounded-full" />
        )}
      </div>

      {/* Иконка */}
      <div className="relative z-10 flex items-center justify-center">
        <ArrowUp
          size={22}
          strokeWidth={2.5}
          className="text-white transition-transform duration-200"
          style={{
            filter: `drop-shadow(0 2px 4px ${isDark ? "rgba(139, 92, 246, 0.5)" : "rgba(59, 130, 246, 0.5)"})`,
            transform: isHovered ? "translateY(-2px)" : "translateY(0)",
          }}
        />
      </div>
    </motion.button>
  );
};

export default ScrollToTopButton;
