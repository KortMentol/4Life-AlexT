import { useTheme } from "@/context/useTheme";
import { lenis } from "@/lib/lenis";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  Info,
  Moon,
  Phone,
  ShoppingBag,
  ShoppingCart,
  Sun,
  User,
  Users,
} from "lucide-react";
import React, { useEffect } from "react";

import DynamicLogo from "@/shared/ui/DynamicLogo";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./styles.css";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { title: "Главная", href: "/", icon: <Home size={22} /> },
  { title: "Продукты", href: "/products", icon: <ShoppingBag size={22} /> },
  {
    title: "Как приобрести?",
    href: "/how-to-buy",
    icon: <ShoppingCart size={22} />,
  },
  { title: "О 4Life", href: "/about", icon: <Info size={22} /> },
  { title: "Обо Мне", href: "/about-me", icon: <User size={22} /> },
  { title: "Партнерство", href: "/partnership", icon: <Users size={22} /> },
  { title: "Контакты", href: "/contact", icon: <Phone size={22} /> },
];

const menuVariants = {
  hidden: {
    x: "-100%",
    opacity: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.32, 0.72, 0, 1], // Оптимизированная кривая для закрытия
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [dragX, setDragX] = React.useState(0);
  
  // Создаем ref для отслеживания начальной позиции свайпа
  const swipeRef = React.useRef<{ startX: number | null }>({ startX: null });
  
  const handleDrag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number } }
  ) => {
    // Используем прямое обновление без вложенного requestAnimationFrame для минимизации задержки
    // Устанавливаем только отрицательные значения для движения влево
    setDragX(Math.min(0, info.offset.x));
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }
  ) => {
    // Закрываем меню, если его смахнули влево достаточно далеко или с большой скоростью
    // Уменьшаем порог скорости для более отзывчивого закрытия
    if (info.offset.x < -window.innerWidth * 0.08 || info.velocity.x < -150) {
      onClose();
    } else {
      // Анимируем возврат в исходное положение
      setDragX(0);
    }
  };

  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingRoute, setPendingRoute] = React.useState<string | null>(null);
  const [locked, setLocked] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen && pendingRoute) {
      navigate(pendingRoute);
      setPendingRoute(null);
      setLocked(false);
    }
  }, [isOpen, pendingRoute, navigate]);

  useEffect(() => {
    if (isOpen) {
      // Блокируем скролл на всей странице
      document.body.classList.add('menu-open');
      
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
      
      // Добавляем обработчик для предотвращения скролла на всем документе
      const preventScroll = (e: TouchEvent) => {
        // Разрешаем только горизонтальные свайпы для закрытия меню
        const touch = e.touches[0];
        if (!touch) return; // Проверка на undefined
        
        const startTouch = swipeRef.current.startX;
        
        // Если это горизонтальный свайп (больше по X, чем по Y), разрешаем его
        if (startTouch && Math.abs(touch.clientX - startTouch) > Math.abs(touch.clientY - window.scrollY)) {
          return;
        }
        
        // Иначе блокируем скролл
        e.preventDefault();
      };
      
      // Добавляем обработчик с пассивным: false для возможности вызова preventDefault
      document.addEventListener('touchmove', preventScroll, { passive: false });
      
      return () => {
        // Восстанавливаем скролл при закрытии меню
        document.body.classList.remove('menu-open');
        
        // Восстанавливаем позицию скролла
        const scrollY = parseInt(document.body.style.top || '0', 10) * -1;
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
        
        document.removeEventListener('touchmove', preventScroll);
      };
    }
    
    // Если меню закрыто, возвращаем пустую функцию очистки
    return () => {};
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (locked) return;
    if (location.pathname === href) {
      // Проверяем, мобильное ли устройство
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // На мобильных используем нативный скролл для мгновенного отклика
        onClose();
        // Небольшая задержка, чтобы меню успело закрыться
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'auto' // Используем 'auto' вместо 'smooth' для мгновенного скролла
          });
        }, 10);
      } else {
        // На десктопе используем Lenis
        lenis.scrollTo(0, { 
          duration: 1.2, 
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
        });
        onClose();
      }
    } else {
      setLocked(true);
      setPendingRoute(href);
      onClose();
    }
  };

  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const bgColor = theme === "dark" ? "#111827" : "#ffffff";
  const overlayColor = theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.7)";

  // Объявление swipeRef перемещено в начало компонента
  
  // Обработчик начала свайпа на всем экране
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      swipeRef.current.startX = touch.clientX;
    }
  };
  
  // Обработчик движения свайпа на всем экране
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeRef.current.startX) return;
    
    const touch = e.touches[0];
    if (!touch) return; // Проверка на undefined
    
    const currentX = touch.clientX;
    const diff = currentX - swipeRef.current.startX;
    
    // Определяем, является ли свайп горизонтальным
    const touchY = touch.clientY;
    const startY = touch.clientY; // Упрощение, так как мы не отслеживаем startY
    const isHorizontalSwipe = Math.abs(diff) > Math.abs(touchY - startY);
    
    // Если движение влево и это горизонтальный свайп, начинаем закрывать меню
    if (diff < 0 && isHorizontalSwipe) {
      setDragX(diff);
      // Предотвращаем скролл страницы
      e.preventDefault();
    }
  };
  
  // Обработчик окончания свайпа на всем экране
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!swipeRef.current.startX) return;
    
    const touch = e.changedTouches[0];
    if (!touch) {
      swipeRef.current.startX = null;
      return;
    }
    
    const currentX = touch.clientX;
    const diff = currentX - swipeRef.current.startX;
    const velocity = Math.abs(diff) / 150; // Примерная скорость свайпа
    
    // Закрываем меню при достаточном свайпе влево
    if (diff < -50 || (diff < 0 && velocity > 0.5)) {
      onClose();
    } else {
      setDragX(0);
    }
    
    swipeRef.current.startX = null;
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 menu-overlay"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={onClose}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            aria-label="Закрыть меню"
            style={{ 
              backgroundColor: overlayColor,
              touchAction: "none", // Блокируем все стандартные жесты
              pointerEvents: "auto" // Гарантируем, что события касания обрабатываются
            }}
          />
          <motion.nav
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: -1000, right: 0 }}
            dragMomentum={false}
            dragElastic={0.05}
            dragTransition={{ 
              power: 0.15, 
              timeConstant: 300,
              modifyTarget: (target) => Math.round(target * 2) / 2 // Сглаживание для предотвращения субпиксельных рендеров
            }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className={`mobile-menu-container fixed top-0 left-0 z-50 h-full w-[90vw] max-w-sm p-6 flex flex-col justify-between shadow-2xl rounded-r-3xl border-r ${borderColor}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            role="dialog"
            aria-modal="true"
            aria-label="Мобильное меню"
            style={{ 
              background: bgColor, 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              transform: dragX ? `translateX(${dragX}px)` : "none",
              willChange: "transform", // Оптимизация для GPU-ускорения
              backfaceVisibility: "hidden", // Предотвращает мерцание
              WebkitBackfaceVisibility: "hidden", // Для Safari
              perspective: "1000px", // Улучшает 3D-рендеринг
              touchAction: "pan-y", // Разрешаем только вертикальный скролл внутри меню
              height: "100vh", // Фиксированная высота на весь экран
              overscrollBehavior: "contain" as const // Предотвращаем скролл родительского элемента
            }}
          >
            <div className={`relative flex flex-col items-center pt-3 pb-3 border-b ${borderColor}`}>
              <motion.button
                onClick={onClose}
                className="absolute left-0 top-0 p-2 rounded-full bg-blue-100/80 dark:bg-blue-800/60 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700/70 transition-all duration-300 shadow-md"
                aria-label="Закрыть меню"
                initial={{ opacity: 1, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path 
                    d="M18 6L6 18" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    initial={{ pathLength: 0, opacity: 1 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.path 
                    d="M6 6L18 18" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 1 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </svg>
              </motion.button>
              
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.5 } }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center"
              >
                <div className="transition-transform duration-300 hover:scale-105">
                  <DynamicLogo alt="4Life Logo" size="md" />
                </div>
              </motion.div>
            </div>
            <motion.ul className="flex flex-col gap-3 mt-4 flex-grow">
              {navLinks.map((link, i) => (
                <motion.li key={link.href} custom={i} variants={itemVariants}>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-5 py-3 rounded-xl text-lg font-semibold transition-all duration-200 shadow-sm select-none [-webkit-tap-highlight-color:transparent] ${isActive ? "bg-blue-100/80 dark:bg-blue-800/60 text-blue-800 dark:text-blue-200" : "text-gray-900 dark:text-gray-100 hover:bg-blue-100/70 dark:hover:bg-blue-800/50"}`
                    }
                    onClick={(e) => handleLinkClick(e, link.href)}
                  >
                    <span className="inline-flex items-center justify-center">{link.icon}</span>
                    <span>{link.title}</span>
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>

            {/* Убираем flex-1 div, так как используем flex-grow для списка и justify-between для контейнера */}

            <motion.div
              className="mt-6 mb-4 flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.4 } }}
              exit={{ opacity: 0 }}
            >
              {/* Переключатель темы */}
              <div className="relative w-16 h-8 mb-2">
                <motion.div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: theme === 'light' 
                      ? 'linear-gradient(to right, #3b82f6, #60a5fa)' 
                      : 'linear-gradient(to right, #1f2937, #374151)'
                  }}
                  initial={false}
                  animate={{
                    boxShadow: theme === 'light'
                      ? '0 0 15px rgba(59, 130, 246, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.5)'
                      : '0 0 15px rgba(17, 24, 39, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.1)'
                  }}
                  transition={{ duration: 0.5 }}
                />
                
                <div className="absolute inset-0 flex items-center justify-between px-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center">
                    <Moon size={16} className="text-white" />
                  </div>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center">
                    <Sun size={16} className="text-white" />
                  </div>
                </div>
                
                <motion.div
                  className="absolute top-1 w-6 h-6 rounded-full flex items-center justify-center z-10"
                  style={{
                    background: theme === 'light'
                      ? 'linear-gradient(to bottom right, #fff, #e0e7ff)'
                      : 'linear-gradient(to bottom right, #374151, #1f2937)'
                  }}
                  initial={false}
                  animate={{
                    right: theme === 'light' ? '0.25rem' : 'auto',
                    left: theme === 'light' ? 'auto' : '0.25rem',
                    boxShadow: theme === 'light'
                      ? '0 0 10px rgba(255, 255, 255, 0.8), 0 0 5px rgba(59, 130, 246, 0.5)'
                      : '0 0 10px rgba(17, 24, 39, 0.8), 0 0 5px rgba(255, 255, 255, 0.2)'
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  onClick={toggleTheme}
                >
                  {theme === 'light' 
                    ? <Sun size={14} className="text-amber-500" /> 
                    : <Moon size={14} className="text-blue-300" />
                  }
                </motion.div>
                
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                  aria-label="Переключить тему"
                />
              </div>
              
              {/* Копирайт */}
              <div className="text-xs text-center text-gray-500 dark:text-gray-400 select-none">
                © {new Date().getFullYear()} 4Life. Все права защищены.
              </div>
            </motion.div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
