import { useIsMobile } from "@/hooks/useIsMobile";
import { scrollTo as lenisScrollTo } from "@/lib/lenis";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../../hooks/useTheme";

const ScrollToTopButton: React.FC = () => {
  // --- ШАГ 1: ВСЕ ХУКИ ОБЪЯВЛЯЮТСЯ ЗДЕСЬ, НА ВЕРХНЕМ УРОВНЕ ---
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prevScrollPos = useRef(0);
  const isMobile = useIsMobile();

  // Хуки, которые раньше были "спрятаны" в условии, теперь здесь
  const [isActivated, setIsActivated] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const particlesRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Эффект для отслеживания скролла (без изменений)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingUp = prevScrollPos.current > currentScrollPos;
      prevScrollPos.current = currentScrollPos;

      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const scrollPercentage = maxScroll > 0 ? currentScrollPos / maxScroll : 0;

      setIsVisible(scrollPercentage > 0.3 && isScrollingUp);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Эффект для очистки интервала (теперь он тоже на верхнем уровне)
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // --- ШАГ 2: ВСЕ ФУНКЦИИ ОСТАЮТСЯ КАК ЕСТЬ ---

  const handleClick = () => {
    lenisScrollTo(0, { duration: 1.5 });
  };

  const createParticles = () => {
    if (!particlesRef.current) return;
    const container = particlesRef.current;
    container.innerHTML = "";
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      const size = 2 + Math.random() * 4;
      const xPos = (Math.random() - 0.5) * 40;
      const yPos = 10 + Math.random() * 20;
      const duration = 0.6 + Math.random() * 0.8;
      const delay = Math.random() * 0.2;
      particle.style.position = "absolute";
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.borderRadius = "50%";
      particle.style.opacity = "0";
      if (isDark) {
        particle.style.background = `rgb(${120 + Math.random() * 80}, ${70 + Math.random() * 100}, ${255})`;
      } else {
        particle.style.background = `rgb(${0 + Math.random() * 50}, ${120 + Math.random() * 80}, ${220 + Math.random() * 35})`;
      }
      particle.animate(
        [
          { transform: `translate(${xPos}px, 0px)`, opacity: 0.8 },
          { transform: `translate(${xPos * 1.5}px, -${yPos}px)`, opacity: 0 },
        ],
        {
          duration: duration * 1000,
          delay: delay * 1000,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          fill: "forwards",
        },
      );
      container.appendChild(particle);
    }
  };

  const handleDesktopClick = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsActivated(true);
    setScrollProgress(0);
    createParticles();
    const scrollDuration = 1500;
    const startTime = performance.now();
    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / scrollDuration, 1);
      setScrollProgress(progress);
      if (progress >= 1) {
        clearInterval(progressIntervalRef.current!);
        progressIntervalRef.current = null;
        setScrollProgress(0);
        setIsActivated(false);
      }
    }, 16);
    lenisScrollTo(0, { duration: scrollDuration / 1000 });
  };

  // Варианты анимации (без изменений)
  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 15 },
    },
    tap: { scale: 0.92, transition: { type: "spring", stiffness: 600 } },
    hover: {
      scale: 1.08,
      transition: { type: "spring", stiffness: 400, damping: 8 },
    },
  };

  const pulseVariants = {
    initial: { scale: 0.95, opacity: 0.6 },
    animate: {
      scale: [0.95, 1.05, 0.95],
      opacity: [0.6, 0.8, 0.6],
      transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
    },
  };

  // --- ШАГ 3: УСЛОВНЫЙ РЕНДЕРИНГ JSX ---
  // Теперь условие `if` обертывает только возвращаемую разметку, а не хуки.
  if (isMobile) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.button
            onClick={handleClick}
            className={`fixed z-50 bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            whileTap="tap"
            variants={buttonVariants}
            aria-label="Прокрутить вверх"
          >
            <ArrowUp size={24} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    );
  }

  // Рендер для десктопа (без изменений, т.к. хуки уже наверху)
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={handleDesktopClick}
          className={`fixed z-50 bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center ${isDark ? "bg-gradient-to-br from-violet-700 via-indigo-800 to-blue-900" : "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600"}`}
          initial="hidden"
          animate="visible"
          exit="hidden"
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          aria-label="Прокрутить вверх"
        >
          <motion.div
            className={`absolute inset-0 rounded-full ${isDark ? "bg-indigo-600" : "bg-blue-500"} blur-md`}
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            style={{ opacity: 0.15 }}
          />
          <div className="absolute inset-0.5 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className={`absolute inset-0 opacity-30 ${isDark ? "bg-[radial-gradient(ellipse_at_center,_rgba(138,120,255,0.8)_0%,_rgba(50,50,180,0.2)_60%,_transparent_100%)]" : "bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.9)_0%,_rgba(100,150,255,0.3)_60%,_transparent_100%)]"}`}
            />
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className={`absolute h-1 w-full ${isDark ? "bg-indigo-400/30" : "bg-blue-300/40"} blur-sm`}
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="absolute inset-0 rounded-full border border-white/20" />
            {isActivated && (
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  strokeWidth="2"
                  stroke={
                    isDark
                      ? "rgba(139, 92, 246, 0.8)"
                      : "rgba(59, 130, 246, 0.8)"
                  }
                  strokeLinecap="round"
                  strokeDasharray={`${scrollProgress * 302} 302`}
                  className="transform -rotate-90 origin-center"
                  style={{
                    filter: `drop-shadow(0 0 3px ${isDark ? "rgba(139, 92, 246, 0.7)" : "rgba(59, 130, 246, 0.7)"})`,
                  }}
                />
              </svg>
            )}
            <div
              ref={particlesRef}
              className="absolute inset-0 overflow-hidden rounded-full"
            />
          </div>
          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              animate={isActivated ? { y: [-3, -8, -3] } : { y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <ArrowUp
                size={22}
                strokeWidth={2.5}
                className={`text-white drop-shadow-lg ${isActivated ? "scale-110" : ""}`}
                style={{
                  filter: `drop-shadow(0 0 3px ${isDark ? "rgba(139, 92, 246, 0.7)" : "rgba(59, 130, 246, 0.7)"})`,
                }}
              />
            </motion.div>
          </div>
          <AnimatePresence>
            {isActivated && (
              <>
                {" "}
                <motion.div
                  className={`absolute inset-0 rounded-full border-2 ${isDark ? "border-indigo-400/50" : "border-blue-400/50"}`}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.3, 0],
                    boxShadow: [
                      `inset 0 0 5px ${isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(59, 130, 246, 0.3)"}`,
                      `inset 0 0 15px ${isDark ? "rgba(139, 92, 246, 0.6)" : "rgba(59, 130, 246, 0.6)"}`,
                      `inset 0 0 5px ${isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(59, 130, 246, 0.3)"}`,
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: 1, ease: "easeInOut" }}
                />{" "}
              </>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
