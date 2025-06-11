import { useTheme } from "@/context/useTheme";
import { lenis } from "@/lib/lenis";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  Info,
  Phone,
  ShoppingBag,
  ShoppingCart,
  User,
  Users,
} from "lucide-react";
import React, { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

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

// Изысканные варианты анимации для меню в стиле Awwwards
const menuVariants = {
  hidden: { 
    x: "100%",
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1], // Плавная кривая Безье
    }
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1], // Плавная кривая Безье
    }
  },
  exit: { 
    x: "100%",
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1], // Плавная кривая Безье
    }
  },
};

// Анимация для элементов навигации
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.1 + i * 0.05,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.2,
      ease: "easeOut" 
    }
  }
};

// Анимация для overlay
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingRoute, setPendingRoute] = React.useState<string | null>(null);
  const [locked, setLocked] = React.useState(false);

  // Эффект: после закрытия меню выполняем навигацию
  React.useEffect(() => {
    if (!isOpen && pendingRoute) {
      navigate(pendingRoute);
      setPendingRoute(null);
      setLocked(false);
    }
  }, [isOpen, pendingRoute, navigate]);

  // Управление прокруткой
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Цвета и стили для меню в зависимости от темы
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const bgColor = theme === "dark" ? "#111827" : "#ffffff";
  const overlayColor = theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.7)";

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Плавно анимированный overlay */}
          <motion.div
            className="fixed inset-0 z-40"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={onClose}
            aria-label="Закрыть меню"
            style={{
              backgroundColor: overlayColor,
            }}
          />

          {/* Премиальное меню с изысканной анимацией */}
          <motion.nav
            className={`fixed top-0 right-0 z-50 h-full w-[90vw] max-w-sm p-6 flex flex-col shadow-2xl rounded-l-3xl border-l ${borderColor}`}
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
            }}
          >
            {/* Кнопка закрытия */}
            <motion.button
              className="absolute top-5 right-6 text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors"
              onClick={onClose}
              aria-label="Закрыть меню"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: { delay: 0.2, duration: 0.4 }
              }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>
            
            {/* Навигация с каскадной анимацией */}
            <motion.ul 
              className="flex flex-col gap-3 mt-16"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {navLinks.map((link, i) => (
                <motion.li 
                  key={link.href}
                  custom={i}
                  variants={itemVariants}
                >
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-5 py-3 rounded-xl text-lg font-semibold transition-all duration-200 shadow-sm select-none ${
                        isActive
                          ? "bg-blue-100/80 dark:bg-blue-800/60 text-blue-800 dark:text-blue-200"
                          : "text-gray-900 dark:text-gray-100 hover:bg-blue-100/70 dark:hover:bg-blue-800/50"
                      }`
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      if (locked) return;
                      if (location.pathname === link.href) {
                        lenis.scrollTo(0, {
                          duration: 1.2,
                          easing: (t) =>
                            Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                        });
                        onClose();
                        setLocked(false);
                      } else {
                        setLocked(true);
                        setPendingRoute(link.href);
                        onClose();
                      }
                    }}
                  >
                    <span className="inline-flex items-center justify-center">
                      {link.icon}
                    </span>
                    <span>{link.title}</span>
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>
            
            <div className="flex-1" />
            
            {/* Нижний блок с анимацией */}
            <motion.div 
              className="mt-8 text-xs text-center text-gray-500 dark:text-gray-400 select-none"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 0.5, duration: 0.5 }
              }}
              exit={{ opacity: 0 }}
            >
              © {new Date().getFullYear()} 4Life. Все права защищены.
            </motion.div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;