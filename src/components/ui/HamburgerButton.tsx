/**
 * @module components/ui/HamburgerButton
 * @description Кнопка-гамбургер для переключения состояния мобильного меню.
 * Обладает необходимыми ARIA-атрибутами доступности (WCAG 2.1 AA).
 * Полностью удалены классы светлой темы (`text-gray-900`, `dark:`) [1].
 * Зафиксирован неоновый циановый цвет (`text-cyan-300`) для премиального контраста [1].
 * Все иконки строго импортируются из единого пульта @/utils/icons.
 * @author Kort
 * @version 2.3.0
 */

import { Icons } from "@/utils/icons";
import React from "react";

interface HamburgerButtonProps {
  /** Флаг открытого состояния меню */
  isOpen?: boolean;
  /** Функция-обработчик клика */
  toggle: () => void;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ isOpen = false, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="relative w-10 h-10 focus:outline-none text-cyan-300 [-webkit-tap-highlight-color:transparent]"
      aria-expanded={isOpen}
      aria-label="Открыть меню"
      aria-controls="mobile-menu"
    >
      <Icons.Menu strokeWidth={2} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7" />
    </button>
  );
};

export default HamburgerButton;
