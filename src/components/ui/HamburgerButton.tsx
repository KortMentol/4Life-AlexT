import React from "react";

interface HamburgerButtonProps {
  isOpen?: boolean;
  toggle: () => void;
}

/**
 * @module components/ui/HamburgerButton
 * @description Кнопка-гамбургер для переключения состояния мобильного меню.
 * Имеет необходимые ARIA-атрибуты для доступности.
 *
 * @author Kort
 * @version 2.1.0
 *
 * @param {boolean} isOpen - Текущее состояние меню (открыто/закрыто).
 * @param {() => void} toggle - Callback-функция для изменения состояния меню.
 *
 * @usage
 * Используется в шапке сайта для управления видимостью мобильного меню.
 *
 * 1. **В шапке сайта (`src/components/layout/Header.tsx`):**
 *    - Отображается на мобильных устройствах и служит триггером для открытия/закрытия мобильного меню.
 *
 * @example
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <HamburgerButton
 *   isOpen={isOpen}
 *   toggle={() => setIsOpen(!isOpen)}
 * />
 */
const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  isOpen = false,
  toggle,
}) => {
  return (
    <button
      onClick={toggle}
      className="relative w-10 h-10 focus:outline-none text-gray-900 dark:text-cyan-300 [-webkit-tap-highlight-color:transparent]"
      aria-expanded={isOpen}
      aria-label="Открыть меню"
      aria-controls="mobile-menu"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <line
          x1="4"
          y1="6"
          x2="20"
          y2="6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="4"
          y1="12"
          x2="20"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="4"
          y1="18"
          x2="20"
          y2="18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
};

export default HamburgerButton;
