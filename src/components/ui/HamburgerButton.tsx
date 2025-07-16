import React from "react";
import { motion } from "framer-motion";


interface HamburgerButtonProps {
  isOpen: boolean;
  toggle: () => void;
}

/**
 * @module components/ui/HamburgerButton
 * @description Премиальная анимированная кнопка-гамбургер для переключения состояния мобильного меню.
 * Плавно трансформируется из трех линий в крестик (и обратно) с помощью `framer-motion`.
 * Также меняет свой стиль в зависимости от того, проскроллена ли страница. Имеет необходимые ARIA-атрибуты для доступности.
 *
 * @author Kort
 * @version 2.0.0
 *
 * @param {boolean} isOpen - Текущее состояние меню (открыто/закрыто), управляет анимацией.
 * @param {() => void} toggle - Callback-функция для изменения состояния меню.
 * @param {boolean} scrolled - Флаг, указывающий, прокручена ли страница, для адаптации стилей.
 *
 * @see motion - Компонент из `framer-motion` для анимации SVG-линий.
 *
 * @usage
 * Используется в шапке сайта для управления видимостью мобильного меню.
 * 
 * 1. **В шапке сайта (`src/components/layout/Header.tsx`):**
 *    - Отображается на мобильных устройствах и служит триггером для открытия/закрытия `MobileMenu`.
 *
 * @example
 * const [isOpen, setIsOpen] = useState(false);
 * const [scrolled, setScrolled] = useState(false);
 * // ... логика для отслеживания скролла ...
 * 
 * <HamburgerButton 
 *   isOpen={isOpen} 
 *   toggle={() => setIsOpen(!isOpen)} 
 *   scrolled={scrolled} 
 * />
 */
const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  isOpen,
  toggle,
}) => {


  return (
    <motion.button
      onClick={toggle}
      className="relative w-10 h-10 focus:outline-none text-gray-900 dark:text-cyan-300 [-webkit-tap-highlight-color:transparent]"
      animate={isOpen ? "open" : "closed"}
      aria-expanded={isOpen}
      aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
      aria-controls="mobile-menu"
    >
      <motion.svg width="28" height="28" viewBox="0 0 24 24" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.line
          x1="4" y1="6" x2="20" y2="6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          variants={{
            closed: { rotate: 0, y: 0 },
            open: { rotate: 45, y: 6 },
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.line
          x1="4" y1="12" x2="20" y2="12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.1 }}
        />
        <motion.line
          x1="4" y1="18" x2="20" y2="18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          variants={{
            closed: { rotate: 0, y: 0 },
            open: { rotate: -45, y: -6 },
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </motion.svg>
    </motion.button>
  );
};

export default HamburgerButton;