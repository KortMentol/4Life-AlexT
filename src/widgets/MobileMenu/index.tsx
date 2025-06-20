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
  hidden: { 
    opacity: 0,
    transition: { type: "tween", ease: [0.32, 0, 0.67, 0], duration: 0.4 }
  },
  visible: { 
    opacity: 1,
    transition: { type: "tween", ease: [0.33, 1, 0.68, 1], duration: 0.5 }
  },
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {

  const { theme, toggleTheme } = useTheme();
  const dragConstraints = React.useMemo(() => ({ left: -window.innerWidth, right: 0 }), []);
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
      document.body.classList.add("menu-open");
      lenis.stop();
    } else {
      document.body.classList.remove("menu-open");
      lenis.start();
    }
    return () => {
      document.body.classList.remove("menu-open");
      lenis.start();
    };
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
  const overlayColor = theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.7)";

  return (
    <AnimatePresence mode="wait">
      {isOpen && [
        <motion.div
          key="overlay"
          className="fixed inset-0 z-40"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{ backgroundColor: overlayColor }}
          onClick={onClose}
        />,
        <motion.nav
          key="menu"
                className="mobile-menu__nav fixed top-0 left-0 h-full w-screen max-w-none z-50 p-6 flex flex-col justify-between shadow-2xl bg-white dark:bg-gray-900"
                role="navigation"
                aria-label="Мобильное меню"
                initial={{ x: "-100%" }}
                animate={{ x: 0, transition: { type: "spring", stiffness: 400, damping: 40 } }}
                exit={{ x: "-100%", transition: { type: "spring", stiffness: 400, damping: 40 } }}
                drag="x"
                dragConstraints={dragConstraints}
                dragElastic={0}
                dragTransition={{ power: 0.1, timeConstant: 180, modifyTarget: v => Math.min(0, v) }}
                onUpdate={latest => {
                  if (typeof latest.x !== 'undefined' && Number(latest.x) > 0) {
                    latest.x = 0;
                  }
                }}
                onClick={e => e.stopPropagation()}
                onDragEnd={(_, info) => {
                  const threshold = -window.innerWidth * 0.2;
                  if (info.offset.x < threshold || info.velocity.x < -500) {
                    onClose();
                  }
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
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
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

            <motion.div
              className="mt-6 mb-4 flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.4 } }}
              exit={{ opacity: 0 }}
            >
              <div className="relative w-16 h-8 mb-2 cursor-pointer" onClick={toggleTheme}>
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
                >
                  {theme === 'light' 
                    ? <Sun size={14} className="text-amber-500" /> 
                    : <Moon size={14} className="text-blue-300" />
                  }
                </motion.div>
                
              </div>
              <div className="text-xs text-center text-gray-500 dark:text-gray-400 select-none">
                {new Date().getFullYear()} 4Life. Все права защищены.
              </div>
            </motion.div>
          </motion.nav>
        ]}
      </AnimatePresence>
    );
  }

  export default MobileMenu;