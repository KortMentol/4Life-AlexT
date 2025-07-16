/**
 * @module src/components/ui/ScrollToTopButton.tsx
 * @description Футуристическая кнопка прокрутки вверх в sci-fi стиле 2025 года. Появляется только когда пользователь прокрутил определенный процент страницы и начинает скроллить вверх. Имеет продвинутые визуальные эффекты и быструю плавную анимацию скролла.
 * @author Kort
 * @version 2.0.0
 * @see lenis - Библиотека для плавной прокрутки страницы.
 * @usage
 * 1. `src/components/layout/Layout.tsx`: Добавляется в основной макет для доступности на всех страницах.
 * @example
 * <Layout>
 *   <Header />
 *   <main>...</main>
 *   <Footer />
 *   <ScrollToTopButton />
 * </Layout>
 */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { lenis } from "@/lib/lenis";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const prevScrollPos = useRef(0);
  const particlesRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<number | null>(null);
  
  // Определяем мобильное устройство
  const isMobile = typeof window !== "undefined" && 
    window.matchMedia("(pointer: coarse)").matches;

  useEffect(() => {
    const handleScroll = () => {
      // Текущая позиция скролла
      const currentScrollPos = window.scrollY;
      
      // Определяем направление скролла
      const isScrollingUp = prevScrollPos.current > currentScrollPos;
      
      // Сохраняем текущую позицию для следующего сравнения
      prevScrollPos.current = currentScrollPos;
      
      // Высота документа
      const scrollHeight = document.documentElement.scrollHeight;
      // Высота окна
      const clientHeight = document.documentElement.clientHeight;
      // Максимально возможная прокрутка
      const maxScroll = scrollHeight - clientHeight;
      
      // Процент прокрутки (от 0 до 1)
      const scrollPercentage = maxScroll > 0 ? currentScrollPos / maxScroll : 0;
      
      // Показываем кнопку только если:
      // 1. Прокручено более 30% страницы
      // 2. Пользователь скроллит вверх
      setIsVisible(scrollPercentage > 0.3 && isScrollingUp);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Функция для создания частиц при активации
  const createParticles = () => {
    if (!particlesRef.current) return;
    
    const container = particlesRef.current;
    container.innerHTML = '';
    
    const particleCount = isMobile ? 10 : 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // Случайные параметры для разнообразия частиц
      const size = 2 + Math.random() * 4;
      const xPos = (Math.random() - 0.5) * 40;
      const yPos = 10 + Math.random() * 20;
      const duration = 0.6 + Math.random() * 0.8;
      const delay = Math.random() * 0.2;
      
      // Стили частицы
      particle.style.position = 'absolute';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.borderRadius = '50%';
      particle.style.opacity = '0';
      
      // Разные цвета для разных тем
      if (isDark) {
        particle.style.background = `rgb(${120 + Math.random() * 80}, ${70 + Math.random() * 100}, ${255})`;
      } else {
        particle.style.background = `rgb(${0 + Math.random() * 50}, ${120 + Math.random() * 80}, ${220 + Math.random() * 35})`;
      }
      
      // Анимация частицы
      particle.animate([
        { 
          transform: `translate(${xPos}px, 0px)`, 
          opacity: 0.8 
        },
        { 
          transform: `translate(${xPos * 1.5}px, -${yPos}px)`, 
          opacity: 0 
        }
      ], {
        duration: duration * 1000,
        delay: delay * 1000,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        fill: 'forwards'
      });
      
      container.appendChild(particle);
    }
  };

  // Очистка интервала прогресса при размонтировании
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    // Сбрасываем предыдущий интервал, если он существует
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    setIsActivated(true);
    setScrollProgress(0);
    createParticles();
    
    // Длительность анимации скролла
    const scrollDuration = isMobile ? 1500 : 1800; // Увеличиваем длительность для более плавной анимации
    const startTime = performance.now();
    const startScrollY = window.scrollY;
    
    // Запускаем анимацию прогресса заполнения контура
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
    }, 16); // ~60fps
    
    // Быстрая и плавная прокрутка вверх
    if (isMobile) {
      // Более плавная прокрутка для мобильных устройств с использованием requestAnimationFrame
      const scrollAnimation = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / scrollDuration, 1);
        
        // Функция плавности - медленный старт, быстрая середина, плавное завершение
        const easeInOutCubic = (t: number) => 
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        
        const easedProgress = easeInOutCubic(progress);
        window.scrollTo(0, startScrollY * (1 - easedProgress));
        
        if (progress < 1) {
          requestAnimationFrame(scrollAnimation);
        }
      };
      
      requestAnimationFrame(scrollAnimation);
    } else {
      try {
        // Используем lenis для более плавной прокрутки
        lenis.scrollTo(0, {
          duration: scrollDuration / 1000, // Конвертируем в секунды для lenis
          easing: (t) => {
            // Функция плавности - медленный старт, быстрая середина, плавное завершение
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          }
        });
      } catch (e) {
        // Запасной вариант с requestAnimationFrame
        const scrollAnimation = (timestamp: number) => {
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / scrollDuration, 1);
          
          // Функция плавности
          const easeInOutCubic = (t: number) => 
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          
          const easedProgress = easeInOutCubic(progress);
          window.scrollTo(0, startScrollY * (1 - easedProgress));
          
          if (progress < 1) {
            requestAnimationFrame(scrollAnimation);
          }
        };
        
        requestAnimationFrame(scrollAnimation);
      }
    }
  };

  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    },
    tap: {
      scale: 0.92,
      transition: {
        type: "spring",
        stiffness: 600
      }
    },
    hover: {
      scale: 1.08,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 8
      }
    }
  };

  // Эффект пульсации для кнопки
  const pulseVariants = {
    initial: {
      scale: 0.95,
      opacity: 0.6
    },
    animate: {
      scale: [0.95, 1.05, 0.95],
      opacity: [0.6, 0.8, 0.6],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={handleClick}
          className={`fixed z-50 ${isMobile ? 'bottom-4 right-4 w-11 h-11' : 'bottom-6 right-6 w-14 h-14'} rounded-full flex items-center justify-center
                     ${isDark 
                       ? 'bg-gradient-to-br from-violet-700 via-indigo-800 to-blue-900' 
                       : 'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600'}`}
          initial="hidden"
          animate="visible"
          exit="hidden"
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          aria-label="Прокрутить вверх"
        >
          {/* Внешний светящийся ореол */}
          <motion.div 
            className={`absolute inset-0 rounded-full ${isDark ? 'bg-indigo-600' : 'bg-blue-500'} blur-md`}
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            style={{ opacity: 0.15 }}
          />
          
          {/* Внутренний контейнер с эффектами */}
          <div className="absolute inset-0.5 rounded-full overflow-hidden backdrop-blur-sm">
            {/* Голографический эффект */}
            <div className={`absolute inset-0 opacity-30 
              ${isDark 
                ? 'bg-[radial-gradient(ellipse_at_center,_rgba(138,120,255,0.8)_0%,_rgba(50,50,180,0.2)_60%,_transparent_100%)]' 
                : 'bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.9)_0%,_rgba(100,150,255,0.3)_60%,_transparent_100%)]'}`}>
            </div>
            
            {/* Линии сканирования */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                className={`absolute h-1 w-full ${isDark ? 'bg-indigo-400/30' : 'bg-blue-300/40'} blur-sm`}
                animate={{ 
                  top: ["0%", "100%", "0%"],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "linear" 
                }}
              />
            </div>
            
            {/* Тонкая обводка */}
            <div className="absolute inset-0 rounded-full border border-white/20" />
            
            {/* Прогресс-бар по контуру */}
            {isActivated && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  strokeWidth="2"
                  stroke={isDark ? 'rgba(139, 92, 246, 0.8)' : 'rgba(59, 130, 246, 0.8)'}
                  strokeLinecap="round"
                  strokeDasharray={`${scrollProgress * 302} 302`} // 2πr = ~302 для r=48
                  className="transform -rotate-90 origin-center"
                  style={{
                    filter: `drop-shadow(0 0 3px ${isDark ? 'rgba(139, 92, 246, 0.7)' : 'rgba(59, 130, 246, 0.7)'})`
                  }}
                />
              </svg>
            )}
            
            {/* Контейнер для частиц */}
            <div ref={particlesRef} className="absolute inset-0 overflow-hidden rounded-full" />
          </div>
          
          {/* Иконка стрелки с эффектом свечения */}
          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              animate={isActivated ? { y: [-3, -8, -3] } : { y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <ArrowUp 
                size={isMobile ? 18 : 22} 
                strokeWidth={isMobile ? 2 : 2.5} 
                className={`text-white drop-shadow-lg ${isActivated ? 'scale-110' : ''}`} 
                style={{ 
                  filter: `drop-shadow(0 0 3px ${isDark ? 'rgba(139, 92, 246, 0.7)' : 'rgba(59, 130, 246, 0.7)'})`
                }}
              />
            </motion.div>
          </div>
          
          {/* Кольцо пульсации при нажатии */}
          <AnimatePresence>
            {isActivated && (
              <>
                <motion.div 
                  className={`absolute inset-0 rounded-full border-2 ${isDark ? 'border-indigo-400/50' : 'border-blue-400/50'}`}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                
                {/* Дополнительный светящийся эффект при активации */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 0.3, 0],
                    boxShadow: [
                      `inset 0 0 5px ${isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                      `inset 0 0 15px ${isDark ? 'rgba(139, 92, 246, 0.6)' : 'rgba(59, 130, 246, 0.6)'}`,
                      `inset 0 0 5px ${isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                    ]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: 1,
                    ease: "easeInOut"
                  }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;