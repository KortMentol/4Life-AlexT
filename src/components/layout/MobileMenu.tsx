/**
 * @module src/components/layout/MobileMenu.tsx
 * @description Полноэкранное мобильное меню с эффектом "glassmorphism". Появляется с плавной анимацией, блокируя прокрутку основного контента. Содержит навигационные ссылки, логотип, переключатель темы и кнопку закрытия. Анимации реализованы с помощью `framer-motion`, включая поддержку закрытия меню свайпом и нативным скроллом.
 * @author Kort
 * @version 2.0.0
 * @param {boolean} isOpen - Флаг, определяющий, открыто ли меню.
 * @param {() => void} onClose - Функция обратного вызова для закрытия меню.
 * @see Header - Компонент, который управляет состоянием и отображением MobileMenu.
 * @usage
 * 1. `src/components/layout/Header.tsx`: Рендерится внутри Header, который передает ему пропсы `isOpen` и `onClose` для управления видимостью.
 * @example
 * const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 * <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
 */
import { useTheme } from "../../hooks/useTheme";
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
import { mobileMenuVariants, overlayVariants } from "../../animations/headerAnimations";
import { isMobileDevice } from "../../utils/deviceUtils";
import { lockScroll } from "../../utils/domUtils";
import { useGlassmorphism } from "../../hooks/useGlassmorphism";
import { scrollToTop } from "../../utils/navigationUtils";

import React, { useEffect, useRef } from "react";

import DynamicLogo from "../ui/DynamicLogo";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../../styles/mobile-menu.css";

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


const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  
  // Используем хук для создания эффекта гласморфизма в sci-fi стиле
  useGlassmorphism({
    blur: 16,
    saturation: 200,
    brightness: isDark ? 0.95 : 1.05,
    intensity: 'strong'
  });
  
  // Для нативного скролла
  const menuRef = useRef<HTMLDivElement>(null);

  
  // Убираем обработку свайпа вниз, оставляем только горизонтальный свайп

  const dragConstraints = React.useMemo(
    () => ({ left: -window.innerWidth, right: 0 }),
    [],
  );
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

  // Используем ref для хранения функции разблокировки скролла
  const unlockScrollRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isOpen) {
      lenis.stop();
      unlockScrollRef.current = lockScroll();
      document.body.classList.add('menu-open');
    } else {
      lenis.start();
      if (unlockScrollRef.current) {
        unlockScrollRef.current();
        unlockScrollRef.current = null;
      }
      document.body.classList.remove('menu-open');
    }
    
    return () => {
      lenis.start();
      if (unlockScrollRef.current) {
        unlockScrollRef.current();
        unlockScrollRef.current = null;
      }
      document.body.classList.remove('menu-open');
    };
  }, [isOpen]);

  const handleMobileMenuLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (locked) return;
    
    if (location.pathname === href) {
      // Если мы уже на этой странице, закрываем меню и скроллим к верху
      onClose();
      setTimeout(() => {
        scrollToTop({ immediate: isMobileDevice() });
      }, 10);
    } else {
      // Если мы переходим на другую страницу, сначала закрываем меню, а потом переходим
      setLocked(true);
      setPendingRoute(href);
      onClose();
    }
  };

  const borderColor = isDark ? "border-gray-700" : "border-white/30";
  
  // Используем хук для создания эффекта гласморфизма для оверлея
  const { style: overlayStyle } = useGlassmorphism({
    blur: 28,
    saturation: isDark ? 160 : 180,
    brightness: isDark ? 0.8 : 1.05,
    opacity: isDark ? 0.9 : 0.8,
    intensity: 'strong'
  });

  // Функция для безопасного вызова onClose при свайпе - улучшенная версия
  const handleDragEnd = (_: any, info: any) => {
    if (info && 
        typeof info.offset === 'object' && 
        typeof info.velocity === 'object' && 
        typeof info.offset?.x === 'number' && 
        typeof info.velocity?.x === 'number') {
      // Закрываем меню даже при небольшом свайпе влево
      if (info.offset.x < -50 || info.velocity.x < -200) {
        onClose();
      }
    }
  };
  
  // Обработка свайпа в процессе движения
  const handleDrag = (_: any, info: any) => {
    if (info && 
        typeof info.offset === 'object' && 
        typeof info.offset?.x === 'number' && 
        info.offset.x < -150) {
      onClose();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && [
        <motion.div
          key="overlay"
          className="fixed inset-0 z-40"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ ...overlayStyle, willChange: "opacity, backdrop-filter" }}
          onClick={onClose}
        />,
        <motion.nav
          key="menu"
          ref={menuRef}
          className="mobile-menu__nav fixed top-0 left-0 h-full w-screen max-w-none z-50 p-6 pt-safe flex flex-col justify-between overflow-y-auto glassmorphism"
          style={{
            willChange: "transform, opacity",
            opacity: 1,
            boxShadow: isDark ? "0 4px 30px rgba(0, 255, 255, 0.2)" : "0 4px 30px rgba(59, 130, 246, 0.2)"
          }}
          role="navigation"
          aria-label="Мобильное меню"
          variants={mobileMenuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          drag="x"
          dragConstraints={dragConstraints}
          dragElastic={0.1}
          dragTransition={{
            power: 0.2,
            timeConstant: 200,
            modifyTarget: (v) => Math.min(0, v),
            bounceStiffness: 300,
            bounceDamping: 40,
          }}
          onUpdate={(latest: any) => {
            if (latest && typeof latest.x !== "undefined" && Number(latest.x) > 0) {
              latest.x = 0;
            }
          }}
          onClick={(e) => e.stopPropagation()}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        >
          <div
            className={`relative flex flex-col items-center pt-3 pb-3 border-b ${borderColor}`}
          >
            <motion.button
              onClick={onClose}
              className="absolute -left-2 -top-2 p-3 rounded-2xl backdrop-blur-md shadow-glow border overflow-hidden group"
              style={{
                background: `var(--gradient)`,
                borderColor: `var(--border)`,
                color: `var(--primary)`,
                boxShadow: `var(--glow)`
              }}
              aria-label="Закрыть меню"
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }}
              whileTap={{
                scale: 0.95,
                transition: { type: "spring", stiffness: 600, damping: 30 },
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                },
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M7 7L21 21"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 1 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.path
                  d="M7 21L21 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 1 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </svg>
            </motion.button>

            <div className="flex flex-col items-center">
              <DynamicLogo alt="4Life Logo" size="md" />
            </div>
          </div>
          <ul className="flex flex-col gap-3 mt-4 flex-grow">
            {navLinks.map((link, index) => (
              <motion.li 
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { 
                    delay: 0.05 * index + 0.1,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }}
              >
                <NavLink
                  to={link.href}
                  onClick={(e) => handleMobileMenuLinkClick(e, link.href)}
                >
                  {({ isActive }) => (
                    <div
                      className={`sci-fi-link group relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-lg font-semibold transition-all duration-300 select-none [-webkit-tap-highlight-color:transparent] overflow-hidden backdrop-blur-md ${
                        isActive
                          ? "text-white bg-white/20 dark:bg-white/15 border border-white/30 dark:border-white/20 shadow-lg"
                          : "text-gray-800 dark:text-white/80 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-transparent"
                      }`}
                    >
                      <span className={`relative z-10 transition-colors duration-300 ${isActive ? "text-white" : "text-gray-700 dark:text-white/80"}`}>
                        {link.icon}
                      </span>
                      <span className={`relative z-10 transition-colors duration-300 ${isActive ? "text-white" : "text-gray-800 dark:text-white"}`}>
                        {link.title}
                      </span>
                    </div>
                  )}
                </NavLink>
              </motion.li>
            ))}
          </ul>

          <div className="mt-6 mb-4 flex flex-col items-center gap-4">
            <div
              className="relative w-16 h-8 mb-2 group"
              onClick={() => toggleTheme()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleTheme();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Переключить тему"
            >
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 backdrop-blur-md"
                style={{
                  background: `var(--gradient)`,
                  borderColor: `var(--border)`
                }}
                initial={false}
                animate={{
                  boxShadow: `var(--glow), inset 0 1px 0 ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)'}`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  mass: 0.8,
                }}
              />

              <div className="absolute inset-0 flex items-center justify-between px-1.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  {/* Иконка Луны */}
                  <Moon size={16} className="text-white/80" />
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  {/* Иконка Солнца */}
                  <Sun size={16} className="text-yellow-400" />
                </div>
              </div>

              <motion.div
                className="absolute top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 border backdrop-blur-sm"
                style={{
                  background: isDark
                    ? `var(--gradient)`
                    : `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)`,
                  borderColor: isDark
                    ? `var(--border)`
                    : `rgba(255,255,255,0.6)`,
                }}
                initial={false}
                animate={{
                  right: isDark ? "auto" : "0.25rem",
                  left: isDark ? "0.25rem" : "auto",
                  boxShadow: `var(--glow), 0 4px 12px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(59,130,246,0.3)'}`,
                  rotate: isDark ? 180 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 22,
                  mass: 1.2,
                }}
              >
                {isDark ? (
                  <Moon size={16} className="text-primary" />
                ) : (
                  <Sun size={16} className="text-secondary" />
                )}
              </motion.div>
            </div>
            <div className="text-xs text-center text-gray-500 dark:text-gray-400 select-none">
              {new Date().getFullYear()} 4Life. Все права защищены.
            </div>
          </div>
        </motion.nav>
      ]}
    </AnimatePresence>
  );
};

export default MobileMenu;