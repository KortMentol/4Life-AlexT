import { useIsMobile } from "@/hooks/useIsMobile";
import { scrollTo as lenisScrollTo } from "@/lib/lenis";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

const ScrollToTopButton: React.FC = () => {
  const isMobile = useIsMobile();
  
  // 🚫 ВРЕМЕННО ОТКЛЮЧЕНО НА МОБИЛЬНЫХ ДЛЯ ТЕСТА ПРОИЗВОДИТЕЛЬНОСТИ
  if (isMobile) {
    return null;
  }
  
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prevScrollPos = useRef(0);

  // Состояния для десктопной версии
  const [isActivated, setIsActivated] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const particlesRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Оптимизированный эффект для отслеживания скролла
  useEffect(() => {
    let rafId: number;
    let lastCheck = 0;
    
    const handleScroll = () => {
      const now = performance.now();
      // Оптимизация для десктопа
      if (now - lastCheck < 100) return;
      lastCheck = now;
      
      const currentScrollPos = window.scrollY;
      const isScrollingUp = prevScrollPos.current > currentScrollPos;
      prevScrollPos.current = currentScrollPos;

      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const scrollPercentage = maxScroll > 0 ? currentScrollPos / maxScroll : 0;

      setIsVisible(scrollPercentage > 0.3 && isScrollingUp);
    };
    
    let ticking = false;
    const optimizedScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", optimizedScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", optimizedScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Очистка интервала
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Мобильная версия отключена

  // Продвинутый клик для десктопа с частицами
  const createParticles = () => {
    if (!particlesRef.current) return;
    const container = particlesRef.current;
    
    // Очищаем активные частицы
    container.querySelectorAll('.particle').forEach(p => p.remove());
    
    const particleCount = 12; // Меньше частиц для лучшей производительности
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = 'particle';
      const size = 2 + Math.random() * 3;
      const xPos = (Math.random() - 0.5) * 30;
      const yPos = 8 + Math.random() * 12;
      const duration = 0.5 + Math.random() * 0.4;
      const delay = Math.random() * 0.1;
      
      // GPU ускорение
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        opacity: 0;
        will-change: transform, opacity;
        transform: translateZ(0);
        backface-visibility: hidden;
      `;
      
      if (isDark) {
        particle.style.background = `rgb(${120 + Math.random() * 80}, ${70 + Math.random() * 100}, 255)`;
        particle.style.boxShadow = `0 0 ${size * 2}px rgba(139, 92, 246, 0.6)`;
      } else {
        particle.style.background = `rgb(${0 + Math.random() * 50}, ${120 + Math.random() * 80}, ${220 + Math.random() * 35})`;
        particle.style.boxShadow = `0 0 ${size * 2}px rgba(59, 130, 246, 0.6)`;
      }
      
      // Оптимизированная анимация
      particle.animate(
        [
          { transform: `translate3d(${xPos}px, 0px, 0px)`, opacity: 0.9 },
          { transform: `translate3d(${xPos * 1.3}px, -${yPos}px, 0px)`, opacity: 0 },
        ],
        {
          duration: duration * 1000,
          delay: delay * 1000,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          fill: "forwards",
        },
      );
      
      container.appendChild(particle);
      
      // Автоочистка
      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove();
        }
      }, 1200);
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

  // Варианты анимации для десктопа
  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 15 
      },
    },
    tap: { scale: 0.92, transition: { type: "spring", stiffness: 600 } },
    hover: {
      scale: 1.08,
      transition: { type: "spring", stiffness: 400, damping: 8 },
    },
  };

  // Оптимизированная пульсация для десктопа
  const pulseVariants = {
    initial: { scale: 0.95, opacity: 0.6 },
    animate: isVisible ? {
      scale: [0.95, 1.05, 0.95],
      opacity: [0.6, 0.8, 0.6],
      transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
    } : { scale: 0.95, opacity: 0.6 },
  };

  // МОБИЛЬНАЯ ВЕРСИЯ ОТКЛЮЧЕНА ДЛЯ ТЕСТА

  // ДЕСКТОПНАЯ ВЕРСИЯ - красивая и оптимизированная
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={handleDesktopClick}
          className={`group fixed z-50 bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center transform-gpu ${
            isDark 
              ? "bg-gradient-to-br from-violet-700 via-indigo-800 to-blue-900" 
              : "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600"
          }`}
          initial="hidden"
          animate="visible"
          exit="hidden"
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          aria-label="Прокрутить вверх"
          style={{ willChange: 'transform' }}
        >
          {/* Пульсирующий blur эффект */}
          <motion.div
            className={`absolute inset-0 rounded-full ${
              isDark ? "bg-indigo-600" : "bg-blue-500"
            } blur-md transform-gpu`}
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            style={{ opacity: 0.15, willChange: 'transform, opacity' }}
          />
          
          {/* Дополнительное свечение при hover */}
          <motion.div
            className={`absolute inset-0 rounded-full ${
              isDark ? "bg-violet-400" : "bg-blue-300"
            } blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform-gpu`}
            style={{ willChange: 'opacity' }}
          />
          
          <div className="absolute inset-0.5 rounded-full overflow-hidden backdrop-blur-sm">
            {/* Радиальный градиент */}
            <div
              className={`absolute inset-0 opacity-30 ${
                isDark 
                  ? "bg-[radial-gradient(ellipse_at_center,_rgba(138,120,255,0.8)_0%,_rgba(50,50,180,0.2)_60%,_transparent_100%)]" 
                  : "bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.9)_0%,_rgba(100,150,255,0.3)_60%,_transparent_100%)]"
              }`}
            />
            
            {/* Движущаяся полоска */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className={`absolute h-1 w-full ${
                  isDark ? "bg-indigo-400/30" : "bg-blue-300/40"
                } blur-sm`}
                animate={isVisible ? { top: ["0%", "100%", "0%"] } : { top: "0%" }}
                transition={{ duration: 3, repeat: isVisible ? Infinity : 0, ease: "linear" }}
              />
            </div>
            
            {/* Граница */}
            <div className="absolute inset-0 rounded-full border border-white/20" />
            
            {/* Прогресс-бар при активации */}
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
                    filter: `drop-shadow(0 0 3px ${
                      isDark ? "rgba(139, 92, 246, 0.7)" : "rgba(59, 130, 246, 0.7)"
                    })`,
                  }}
                />
              </svg>
            )}
            
            {/* Контейнер для частиц */}
            <div
              ref={particlesRef}
              className="absolute inset-0 overflow-hidden rounded-full"
            />
          </div>
          
          {/* Стрелка */}
          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              animate={isActivated ? { y: [-3, -8, -3] } : { y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <ArrowUp
                size={22}
                strokeWidth={2.5}
                className={`text-white drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300 ${
                  isActivated ? 'animate-pulse' : ''
                }`}
                style={{
                  filter: `drop-shadow(0 0 4px ${
                    isDark ? 'rgba(139, 92, 246, 0.8)' : 'rgba(59, 130, 246, 0.8)'
                  })`
                }}
              />
            </motion.div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;