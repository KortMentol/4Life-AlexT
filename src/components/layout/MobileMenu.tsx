import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { mainNav } from "../../config/site";

/**
 * Свойства компонента MobileMenu
 */
interface MobileMenuProps {
  /** Флаг открытия меню */
  isOpen: boolean;
  /** Функция закрытия меню */
  onClose: () => void;
  /** Флаг прокрутки страницы (для совместимости с Header) */
  scrolled: boolean;
  /** Функция для обработки клика по навигации */
  handleNavClick: () => void;
}

/**
 * Компонент мобильного меню с анимацией
 */
const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  handleNavClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Блокировка прокрутки при открытом меню
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

  // Обработчик клика по ссылке с использованием AnimatePresence
  const handleLinkClick = (href: string) => {
    // Сохраняем целевой маршрут для использования после анимации
    const targetHref = href;
    // Закрываем меню
    onClose();

    // Используем setTimeout с минимальной задержкой для корректной работы анимации
    // Это безопаснее, чем полагаться на onExitComplete, который может не сработать
    // если компонент размонтируется раньше
    setTimeout(() => {
      navigate(targetHref);
      handleNavClick();
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-white/90 dark:bg-gray-900/95 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Кнопка закрытия */}
          <div className="flex justify-end p-6">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Закрыть меню"
            >
              <X size={24} />
            </button>
          </div>

          {/* Навигационные ссылки */}
          <motion.nav
            className="flex flex-col items-center justify-center flex-1 space-y-6 p-8"
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.2 },
              },
              closed: {
                opacity: 0,
                transition: { staggerChildren: 0.05, staggerDirection: -1 },
              },
            }}
          >
            {mainNav.map((item) => (
              <motion.div
                key={item.href}
                variants={{
                  open: { y: 0, opacity: 1 },
                  closed: { y: 20, opacity: 0 },
                }}
                transition={{ duration: 0.4 }}
              >
                <button
                  onClick={() => handleLinkClick(item.href)}
                  className={`px-6 py-3 text-xl font-medium rounded-lg transition-all duration-300 relative overflow-hidden ${
                    location.pathname === item.href
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {item.title}
                  {location.pathname === item.href && (
                    <motion.span
                      className="absolute bottom-0 left-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              </motion.div>
            ))}
          </motion.nav>

          {/* Декоративный элемент */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-20 w-60 h-60 rounded-full bg-blue-400/20 blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
