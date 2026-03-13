import { useIsMobile } from "@/hooks/useIsMobile";
import { scrollTo as lenisScrollTo } from "@/lib/lenis";
import { motion } from "framer-motion";
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

  // Оптимизированный scroll handler без лишних setState
  useEffect(() => {
    let ticking = false;
    let lastCheck = 0;
    const throttleTime = 200;
    
    const handleScroll = () => {
      const now = performance.now();
      if (now - lastCheck < throttleTime) return;
      lastCheck = now;
      
      const currentScrollPos = window.scrollY;
      const isScrollingUp = prevScrollPos.current > currentScrollPos;
      prevScrollPos.current = currentScrollPos;

      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const scrollPercentage = maxScroll > 0 ? currentScrollPos / maxScroll : 0;

      const shouldShow = scrollPercentage > 0.2 && isScrollingUp;
      setIsVisible(prev => prev !== shouldShow ? shouldShow : prev);
    };
    
    const optimizedScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", optimizedScroll, { passive: true });
    return () => window.removeEventListener("scroll", optimizedScroll);
  }, []);

  const handleClick = () => {
    lenisScrollTo(0, { duration: isMobile ? 1.2 : 1.5 });
  };

  // МОБИЛЬНАЯ ВЕРСИЯ - минималистичная
  if (isMobile) {
    return (
      <button
        onClick={handleClick}
        className={`fixed z-50 bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        } ${
          isDark 
            ? "bg-gray-900/95 border-2 border-cyan-400/60" 
            : "bg-white/95 border-2 border-blue-500/60"
        } active:scale-90`}
        style={{ 
          contain: 'layout style paint',
          boxShadow: isDark 
            ? '0 4px 12px rgba(6, 182, 212, 0.2)' 
            : '0 4px 12px rgba(59, 130, 246, 0.2)'
        }}
        aria-label="Прокрутить вверх"
      >
        <div className={`absolute inset-0.5 rounded-full opacity-30 ${
          isDark ? "bg-gradient-to-br from-cyan-400/40 to-blue-500/40" : "bg-gradient-to-br from-blue-400/40 to-indigo-500/40"
        }`} />
        <ArrowUp
          size={16}
          strokeWidth={2.5}
          className={`relative z-10 ${isDark ? "text-cyan-300" : "text-blue-600"}`}
        />
      </button>
    );
  }

  // ДЕСКТОПНАЯ ВЕРСИЯ - оптимизированная красота
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {isVisible && (
        <motion.button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`fixed z-50 bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center ${
            isDark 
              ? "bg-gradient-to-br from-violet-700 via-indigo-800 to-blue-900" 
              : "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600"
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ 
            boxShadow: isDark
              ? '0 8px 24px rgba(139, 92, 246, 0.3)'
              : '0 8px 24px rgba(59, 130, 246, 0.3)'
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
              filter: 'blur(12px)'
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
            
            {/* Частицы только для HIGH tier и только при клике */}
            {tier === 'high' && (
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
                filter: `drop-shadow(0 2px 4px ${
                  isDark ? 'rgba(139, 92, 246, 0.5)' : 'rgba(59, 130, 246, 0.5)'
                })`,
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
              }}
            />
          </div>
        </motion.button>
      )}
    </>
  );
};

export default ScrollToTopButton;
