import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Info,
  User,
  Users,
  Phone,
} from "lucide-react";
import { useTheme } from "@/context/useTheme";
import { lenis } from "@/lib/lenis";

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
  hidden: { x: "100%", opacity: 0, scale: 0.96, filter: "blur(8px)" },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 24, duration: 0.36 },
  },
  exit: {
    x: "100%",
    opacity: 0,
    scale: 0.95,
    filter: "blur(8px)",
    transition: { duration: 0.22 },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation(); // Получаем текущий маршрут
  const [pendingRoute, setPendingRoute] = React.useState<string | null>(null);
  const [locked, setLocked] = React.useState(false);
  // scrollOnClose и useEffect для scroll больше не нужны — скролл происходит мгновенно при клике

  // Эффект: после закрытия меню выполняем навигацию (для перехода на другие страницы)
  React.useEffect(() => {
    if (!isOpen && pendingRoute) {
      navigate(pendingRoute);
      setPendingRoute(null);
      setLocked(false);
    }
  }, [isOpen, pendingRoute, navigate]);

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

  // Цвета и стили для overlay и меню в зависимости от темы
  const overlayBg = theme === "dark" ? "bg-black/70" : "bg-black/50";
  const menuBg = theme === "dark" ? "bg-gray-900/90" : "bg-white/90";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className={`fixed inset-0 z-40 ${overlayBg} backdrop-blur-md transition-opacity duration-200`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={onClose}
            aria-label="Закрыть меню"
            style={{ willChange: "opacity" }}
          />

          {/* Меню */}
          <motion.nav
            className={`fixed top-0 right-0 z-50 h-full w-[90vw] max-w-sm p-6 flex flex-col ${menuBg} shadow-2xl rounded-l-3xl border-l ${borderColor} glassmorphism`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            role="dialog"
            aria-modal="true"
            aria-label="Мобильное меню"
            style={{ willChange: "transform, opacity, filter" }}
          >
            {/* Кнопка закрытия */}
            <button
              className="absolute top-5 right-6 text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors"
              onClick={onClose}
              aria-label="Закрыть меню"
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
            </button>
            {/* Навигация */}
            <ul className="flex flex-col gap-3 mt-16">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-5 py-3 rounded-xl text-lg font-semibold transition-all duration-200 shadow-sm backdrop-blur-md select-none ${
                        isActive
                          ? "bg-blue-100/80 dark:bg-blue-800/60 text-blue-800 dark:text-blue-200"
                          : "text-gray-900 dark:text-gray-100 hover:bg-blue-100/70 dark:hover:bg-blue-800/50"
                      }`
                    }
                    onClick={async (e) => {
                      e.preventDefault();
                      if (locked) return; // Защита от двойного клика
                      if (location.pathname === link.href) {
                        // Если уже на этой странице — плавно скроллим вверх с помощью Lenis и закрываем меню
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
                        onClose(); // Сначала закрываем меню, переход произойдёт после анимации
                      }
                    }}
                  >
                    <span className="inline-flex items-center justify-center">
                      {link.icon}
                    </span>
                    <span>{link.title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="flex-1" />
            {/* Нижний блок: можно добавить соцсети, копирайт и т.д. */}
            <div className="mt-8 text-xs text-center text-gray-500 dark:text-gray-400 select-none">
              © {new Date().getFullYear()} 4Life. Все права защищены.
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
