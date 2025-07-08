import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isExternal?: boolean;
  disabled?: boolean;
}

/**
 * @module components/ui/Button
 * @description Универсальный компонент кнопки с современным дизайном и анимациями.
 * Поддерживает несколько стилей (variant), размеров (size), и может функционировать как внутренняя ссылка (`<Link>`), внешняя ссылка (`<a>`) или стандартная кнопка (`<button>`).
 * Интегрирован с `MagneticEffect` для эффекта примагничивания и `framer-motion` для анимации масштабирования при наведении и клике.
 *
 * @author Kort
 * @version 1.0.0
 *
 * @param {React.ReactNode} children - Содержимое кнопки (обычно текст).
 * @param {string} [to] - Путь для внутренней навигации (использует React Router `Link`).
 * @param {string} [href] - URL для внешней ссылки.
 * @param {() => void} [onClick] - Функция, вызываемая при клике.
 * @param {'primary' | 'secondary' | 'outline' | 'ghost'} [variant='primary'] - Визуальный стиль кнопки.
 * @param {'sm' | 'md' | 'lg'} [size='md'] - Размер кнопки.
 * @param {string} [className] - Дополнительные CSS-классы.
 * @param {React.ReactNode} [icon] - Иконка для отображения внутри кнопки.
 * @param {'left' | 'right'} [iconPosition='right'] - Позиция иконки относительно текста.
 * @param {boolean} [isExternal=false] - Если `true`, ссылка `href` откроется в новой вкладке.
 * @param {boolean} [disabled=false] - Блокирует взаимодействие с кнопкой.
 *
 * @see Link - Компонент из `react-router-dom` для навигации.
 * @see MagneticEffect - Кастомный хук для создания эффекта "примагничивания" курсора.
 * @see motion - Компонент из `framer-motion` для анимаций.
 *
 * @usage
 * Является основным интерактивным элементом на всем сайте.
 * 
 * 1. **В шапке (`src/components/layout/Header.tsx`):**
 *    - Используется для навигационных ссылок и кнопки связи.
 * 2. **В блоках призыва к действию (`src/components/ui/CallToAction.tsx`):**
 *    - Как основная кнопка для целевых действий.
 * 3. **На страницах (`src/pages/*.tsx`):**
 *    - Для фильтрации, отправки форм и других пользовательских взаимодействий.
 *
 * @example
 * // Стандартная кнопка с действием
 * <Button variant="primary" onClick={() => alert('Clicked!')}>Нажми меня</Button>
 * 
 * // Кнопка-ссылка для внутренней навигации с иконкой
 * <Button to="/products" variant="secondary" icon={<ArrowRight />}>Продукты</Button>
 */
const Button: React.FC<ButtonProps> = ({
  children,
  to,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  iconPosition = "right",
  isExternal = false,
  disabled = false,
}) => {
  // Базовые классы
  const baseClasses =
    "btn-modern inline-flex items-center justify-center gap-2 font-medium transition-all rounded-lg";

  // Классы для вариантов
  const variantClasses = {
    primary: "btn-primary-modern",
    secondary: "btn-secondary-modern",
    outline: "border-2 border-current hover:bg-opacity-10 hover:bg-white",
    ghost: "hover:bg-opacity-10 hover:bg-white",
  };

  // Классы для размеров
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };

  // Классы для состояния disabled
  const disabledClasses = disabled ? "opacity-50" : "";

  // Объединяем все классы
  const allClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  // Содержимое кнопки
  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </>
  );

  // Рендер в зависимости от типа кнопки
  if (to) {
    return (
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        <Link
          to={to}
          className={allClasses}
          onClick={disabled ? undefined : onClick}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        <a
          href={href}
          className={allClasses}
          onClick={disabled ? undefined : onClick}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {content}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.button
      className={allClasses}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {content}
    </motion.button>
  );
};

export default Button;
