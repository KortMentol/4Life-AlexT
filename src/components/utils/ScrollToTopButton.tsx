import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { throttle } from "../../utils/throttle";

/**
 * Кнопка для прокрутки страницы вверх, появляющаяся при скролле
 */
const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Оптимизированная функция для отслеживания скролла
  const handleScroll = useCallback(() => {
    // Показываем кнопку, когда пользователь прокрутил страницу на 300px вниз
    setIsVisible(window.scrollY > 300);
  }, []);

  // Создаем throttled-версию обработчика скролла
  const throttledScrollHandler = useCallback(throttle(handleScroll, 200), [handleScroll]);

  // Отслеживаем скролл страницы с throttle
  useEffect(() => {
    window.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });
    return () => window.removeEventListener("scroll", throttledScrollHandler);
  }, [throttledScrollHandler]);

  // Функция для плавной прокрутки вверх
  const scrollToTop = () => {
    // Используем Lenis для плавной прокрутки, если он доступен
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.2 });
    } else {
      // Запасной вариант с нативной прокруткой
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-50 btn-hover-effect"
          onClick={scrollToTop}
          aria-label="Прокрутить вверх"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
