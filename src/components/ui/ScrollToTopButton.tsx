import { useIsMobile } from "@/hooks/useIsMobile";
import { scrollTo as lenisScrollTo } from "@/lib/lenis";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const ScrollToTopButton: React.FC = () => {
  const isMobile = useIsMobile();
  const tier = usePerformanceTier();
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prevScrollPos = useRef(0);

  // === МОБИЛЬНАЯ ВЕРСИЯ: УЛЬТРА-ОПТИМИЗИРОВАННАЯ ===
  if (isMobile) {
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
      let rafId: number;
      let lastCheck = 0;
      
      const handleScroll = () => {
        const now = performance.now();
        if (now - lastCheck < 250) return; // Агрессивный throttle для мобильных
        lastCheck = now;
        
        const currentScrollPos = window.scrollY;
        const isScrollingUp = prevScrollPos.current > currentScrollPos;
        prevScrollPos.current = currentScrollPos;

        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        const scrollPercentage = maxScroll > 0 ? currentScrollPos / maxScroll : 0;

        // Показывать после 20% прокрутки при скролле вверх
        const shouldShow = scrollPercentage > 0.2 && isScrollingUp;
        
        if (shouldShow !== isVisible) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          // Дебаунс для стабильности
          timeoutRef.current = window.setTimeout(() => {
            setIsVisible(shouldShow);
          }, 100);
        }
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
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, [isVisible]);

    const handleMobileClick = () => {
      lenisScrollTo(0, { duration: 1.2 });
    };

    return (
      <button
        onClick={handleMobileClick}
        className={`fixed z-50 bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        } ${
          isDark 
            ? "bg-gray-900/95 border-2 border-cyan-400/60 shadow-lg shadow-cyan-400/20" 
            : "bg-white/95 border-2 border-blue-500/60 shadow-lg shadow-blue-500/20"
        } active:scale-90 focus:outline-none`}
        style={{ 
          willChange: 'transform, opacity',
          contain: 'layout style paint'
        }}
        aria-label="Прокрутить вверх"
      >
        {/* Sci-fi внутренний глоу */}
        <div className={`absolute inset-0.5 rounded-full opacity-30 ${
          isDark ? "bg-gradient-to-br from-cyan-400/40 to-blue-500/40" : "bg-gradient-to-br from-blue-400/40 to-indigo-500/40"
        }`} />
        
        {/* Стрелка */}
        <ArrowUp
          size={16}
          strokeWidth={2.5}
          className={`relative z-10 ${
            isDark ? "text-cyan-300" : "text-blue-600"
          }`}
        />
      </button>
    );
  }

  // === ДЕСКТОПНАЯ ВЕРСИЯ: ПРОДВИНУТАЯ С ЭФФЕКТАМИ ===
  const [isActivated, setIsActivated] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const particlesRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    let rafId: number;
    let lastCheck = 0;
    
    const handleScroll = () => {
      const now = performance.now();
      if (now - lastCheck < 100) return; // Оптимизация для десктопа
      lastCheck = now;
      
      const currentScrollPos = window.scrollY;
      const isScrollingUp = prevScrollPos.current > currentScrollPos;
      prevScrollPos.current = currentScrollPos;

      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const scrollPercentage = maxScroll > 0 ? currentScrollPos / maxScroll : 0;

      setIsVisible(scrollPercentage > 0.2 && isScrollingUp); // 20% для десктопа
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

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const createParticles = () => {
    if (!particlesRef.current) return;
    const container = particlesRef.current;
    
    container.querySelectorAll('.particle').forEach(p => p.remove());
    
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = 'particle';
      const size = 2 + Math.random() * 3;
      const xPos = (Math.random() - 0.5) * 30;
      const yPos = 8 + Math.random() * 12;
      const duration = 0.5 + Math.random() * 0.4;
      const delay = Math.random() * 0.1;
      
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
    
    // Частицы только для high tier
    if (tier === 'high') {
      createParticles();
    }
    const scrollDuration = 1500;
    
    // Прогресс-бар только для medium и high
    if (tier !== 'low') {
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
    } else {
      // Для low tier просто сбрасываем состояние через 1.5с
      setTimeout(() => {
        setScrollProgress(0);
        setIsActivated(false);
      }, scrollDuration);
    }
    lenisScrollTo(0, { duration: scrollDuration / 1000 });
  };

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

  const pulseVariants = {
    initial: { scale: 0.95, opacity: 0.6 },
    animate: isVisible ? {
      scale: [0.95, 1.05, 0.95],
      opacity: [0.6, 0.8, 0.6],
      transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
    } : { scale: 0.95, opacity: 0.6 },
  };

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
          <motion.div
            className={`absolute inset-0 rounded-full ${
              isDark ? "bg-indigo-600" : "bg-blue-500"
            } blur-md transform-gpu`}
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            style={{ opacity: 0.15, willChange: 'transform, opacity' }}
          />
          
          <motion.div
            className={`absolute inset-0 rounded-full ${
              isDark ? "bg-violet-400" : "bg-blue-300"
            } blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform-gpu`}
            style={{ willChange: 'opacity' }}
          />
          
          <div className="absolute inset-0.5 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className={`absolute inset-0 opacity-30 ${
                isDark 
                  ? "bg-[radial-gradient(ellipse_at_center,_rgba(138,120,255,0.8)_0%,_rgba(50,50,180,0.2)_60%,_transparent_100%)]" 
                  : "bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.9)_0%,_rgba(100,150,255,0.3)_60%,_transparent_100%)]"
              }`}
            />
            
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className={`absolute h-1 w-full ${
                  isDark ? "bg-indigo-400/30" : "bg-blue-300/40"
                } blur-sm`}
                animate={isVisible ? { top: ["0%", "100%", "0%"] } : { top: "0%" }}
                transition={{ duration: 3, repeat: isVisible ? Infinity : 0, ease: "linear" }}
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
                    filter: `drop-shadow(0 0 3px ${
                      isDark ? "rgba(139, 92, 246, 0.7)" : "rgba(59, 130, 246, 0.7)"
                    })`,
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