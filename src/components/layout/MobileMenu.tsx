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

import React, { useEffect } from "react";

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

// Плавные анимации как туман
const overlayVariants = {
  hidden: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    WebkitBackdropFilter: "blur(0px)",
  },
  visible: {
    opacity: 1,
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      opacity: { duration: 0.6 },
      backdropFilter: { duration: 1.2, ease: "easeOut" },
      WebkitBackdropFilter: { duration: 1.2, ease: "easeOut" },
    },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    WebkitBackdropFilter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.7, 0, 0.84, 0],
      opacity: { duration: 0.4, delay: 0.1 },
      backdropFilter: { duration: 0.8, ease: "easeIn" },
      WebkitBackdropFilter: { duration: 0.8, ease: "easeIn" },
    },
  },
};

// Анимации для самого меню
const menuVariants = {
  hidden: {
    x: "-100%",
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 120,
      mass: 0.8,
      duration: 0.8,
      opacity: { duration: 0.4, delay: 0.2 },
    },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 150,
      mass: 0.6,
      duration: 0.6,
      opacity: { duration: 0.3 },
    },
  },
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const dragConstraints = React.useMemo(
    () => ({ left: -window.innerWidth, right: 0 }),
    [],
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingRoute, setPendingRoute] = React.useState<string | null>(null);
  const [locked, setLocked] = React.useState(false);
  const scrollPositionRef = React.useRef(0);

  React.useEffect(() => {
    if (!isOpen && pendingRoute) {
      navigate(pendingRoute);
      setPendingRoute(null);
      setLocked(false);
    }
  }, [isOpen, pendingRoute, navigate]);

  useEffect(() => {
    if (isOpen) {
      // Сохраняем текущую позицию скролла
      scrollPositionRef.current =
        window.pageYOffset || document.documentElement.scrollTop;
      document.body.classList.add("menu-open");
      // Устанавливаем top для body чтобы сохранить визуальную позицию
      document.body.style.top = `-${scrollPositionRef.current}px`;
      lenis.stop();
    } else {
      document.body.classList.remove("menu-open");
      document.body.style.top = "";
      // Восстанавливаем позицию скролла
      window.scrollTo(0, scrollPositionRef.current);
      lenis.start();
    }
    return () => {
      document.body.classList.remove("menu-open");
      document.body.style.top = "";
      lenis.start();
    };
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (locked) return;
    if (location.pathname === href) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        onClose();
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "auto",
          });
        }, 10);
      } else {
        lenis.scrollTo(0, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        onClose();
      }
    } else {
      setLocked(true);
      setPendingRoute(href);
      onClose();
    }
  };

  const borderColor = theme === "dark" ? "border-gray-700" : "border-white/30";
  const overlayStyle =
    theme === "dark"
      ? {
          background: `
      radial-gradient(circle at 20% 30%, rgba(0,255,255,0.12) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255,0,255,0.12) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(0,100,255,0.08) 0%, transparent 50%),
      linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.75) 100%)
    `,
          backdropFilter: "blur(24px) saturate(200%) brightness(1.1)",
          WebkitBackdropFilter: "blur(24px) saturate(200%) brightness(1.1)",
          borderImage:
            "linear-gradient(135deg, rgba(0,255,255,0.3), rgba(255,0,255,0.3)) 1",
        }
      : {
          background: `
      radial-gradient(circle at 25% 25%, rgba(59,130,246,0.15) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(168,85,247,0.12) 0%, transparent 50%),
      radial-gradient(circle at 50% 90%, rgba(34,197,94,0.08) 0%, transparent 50%),
      linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(248,250,252,0.6) 100%)
    `,
          backdropFilter: "blur(28px) saturate(180%) brightness(1.05)",
          WebkitBackdropFilter: "blur(28px) saturate(180%) brightness(1.05)",
          border: "1px solid rgba(255,255,255,0.4)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
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
          style={overlayStyle}
          onClick={onClose}
        />,
        <motion.nav
          key="menu"
          className="mobile-menu__nav fixed top-0 left-0 h-full w-screen max-w-none z-50 p-6 flex flex-col justify-between"
          style={{
            background:
              theme === "dark"
                ? `
                radial-gradient(circle at 10% 20%, rgba(0,255,255,0.08) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(255,0,255,0.08) 0%, transparent 40%),
                linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.9) 50%, rgba(51,65,85,0.85) 100%)
              `
                : `
                radial-gradient(circle at 20% 30%, rgba(59,130,246,0.25) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(168,85,247,0.2) 0%, transparent 50%),
                radial-gradient(circle at 50% 90%, rgba(34,197,94,0.15) 0%, transparent 50%),
                linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 50%, rgba(241,245,249,0.85) 100%)
              `,
            backdropFilter: "blur(32px) saturate(200%)",
            WebkitBackdropFilter: "blur(32px) saturate(200%)",
            border:
              theme === "dark"
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(59,130,246,0.2)",
            boxShadow:
              theme === "dark"
                ? "0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
                : "0 25px 50px rgba(59,130,246,0.15), 0 0 100px rgba(168,85,247,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
          role="navigation"
          aria-label="Мобильное меню"
          variants={menuVariants}
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
          onUpdate={(latest) => {
            if (typeof latest.x !== "undefined" && Number(latest.x) > 0) {
              latest.x = 0;
            }
          }}
          onClick={(e) => e.stopPropagation()}
          onDragEnd={(_, info) => {
            if (info.offset.x < -100 || info.velocity.x < -300) {
              onClose();
            }
          }}
        >
          <div
            className={`relative flex flex-col items-center pt-3 pb-3 border-b ${borderColor}`}
          >
            <motion.button
              onClick={onClose}
              className="absolute -left-2 -top-2 p-3 rounded-2xl backdrop-blur-md shadow-lg border overflow-hidden group"
              style={{
                background:
                  theme === "dark"
                    ? "linear-gradient(135deg, rgba(0,255,255,0.15) 0%, rgba(255,0,255,0.15) 100%)"
                    : "linear-gradient(135deg, rgba(59,130,246,0.4) 0%, rgba(168,85,247,0.4) 100%)",
                borderColor:
                  theme === "dark"
                    ? "rgba(0,255,255,0.3)"
                    : "rgba(59,130,246,0.6)",
                color: theme === "dark" ? "#00ffff" : "#ffffff",
                boxShadow:
                  theme === "dark"
                    ? "0 0 20px rgba(0,255,255,0.3)"
                    : "0 0 20px rgba(59,130,246,0.4), 0 4px 15px rgba(168,85,247,0.2)",
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
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `sci-fi-link group relative flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-500 select-none [-webkit-tap-highlight-color:transparent] overflow-hidden ${
                      isActive
                        ? theme === "dark"
                          ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                          : "bg-gradient-to-r from-blue-500/15 to-purple-500/15 text-blue-600 border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                        : theme === "dark"
                          ? "bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border border-white/10 hover:border-white/20"
                          : "bg-gradient-to-r from-white/70 to-white/50 hover:from-white/90 hover:to-white/70 text-gray-900 border border-blue-200/60 hover:border-blue-300/80 shadow-md hover:shadow-lg"
                    } hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm`
                  }
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  <span className="relative z-10 inline-flex items-center justify-center">
                    {link.icon}
                  </span>
                  <span className="relative z-10 font-medium">
                    {link.title}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-6 mb-4 flex flex-col items-center gap-4">
            <div
              className="relative w-16 h-8 mb-2 group"
              onClick={toggleTheme}
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
                  background:
                    theme === "light"
                      ? "linear-gradient(135deg, rgba(59,130,246,0.4) 0%, rgba(168,85,247,0.4) 100%)"
                      : "linear-gradient(135deg, rgba(0,255,255,0.15) 0%, rgba(255,0,255,0.15) 100%)",
                  borderColor:
                    theme === "light"
                      ? "rgba(59,130,246,0.6)"
                      : "rgba(0,255,255,0.3)",
                }}
                initial={false}
                animate={{
                  boxShadow:
                    theme === "light"
                      ? "0 0 25px rgba(59,130,246,0.5), 0 0 40px rgba(168,85,247,0.3), inset 0 1px 0 rgba(255,255,255,0.7)"
                      : "0 0 25px rgba(0,255,255,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
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
                  <Moon size={16} className="text-white" />
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  <Sun size={16} className="text-white" />
                </div>
              </div>

              <motion.div
                className="absolute top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 border backdrop-blur-sm"
                style={{
                  background:
                    theme === "light"
                      ? "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)"
                      : "linear-gradient(135deg, rgba(0,255,255,0.2) 0%, rgba(255,0,255,0.2) 100%)",
                  borderColor:
                    theme === "light"
                      ? "rgba(255,255,255,0.6)"
                      : "rgba(0,255,255,0.4)",
                }}
                initial={false}
                animate={{
                  right: theme === "light" ? "0.25rem" : "auto",
                  left: theme === "light" ? "auto" : "0.25rem",
                  boxShadow:
                    theme === "light"
                      ? "0 0 15px rgba(255,255,255,0.8), 0 4px 12px rgba(59,130,246,0.3)"
                      : "0 0 20px rgba(0,255,255,0.5), 0 4px 12px rgba(0,0,0,0.3)",
                  rotate: theme === "light" ? 0 : 180,
                }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 22,
                  mass: 1.2,
                }}
              >
                {theme === "light" ? (
                  <Sun size={16} className="text-amber-500" />
                ) : (
                  <Moon size={16} className="text-cyan-300" />
                )}
              </motion.div>
            </div>
            <div className="text-xs text-center text-gray-500 dark:text-gray-400 select-none">
              {new Date().getFullYear()} 4Life. Все права защищены.
            </div>
          </div>
        </motion.nav>,
      ]}
    </AnimatePresence>
  );
};

export default MobileMenu;
