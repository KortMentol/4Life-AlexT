import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import InteractiveCard from "../interactive/InteractiveCard";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "glass" | "solid" | "outline";
  hoverEffect?: "lift" | "glow" | "scale" | "none";
  isInteractive?: boolean;
}

/**
 * @module components/ui/Card
 * @description Базовый компонент карточки, служащий основой для различных UI-элементов.
 * Поддерживает несколько визуальных стилей (variants), эффектов при наведении (hover effects) и может быть кликабельным (ссылка или кнопка).
 * Обернут в `InteractiveCard` для добавления 3D-эффекта наклона и использует `framer-motion` для анимации появления.
 *
 * @author Kort
 * @version 1.0.0
 *
 * @param {React.ReactNode} children - Содержимое, отображаемое внутри карточки.
 * @param {string} [className] - Дополнительные CSS-классы для кастомизации.
 * @param {string} [to] - Путь для внутренней навигации (использует React Router `Link`).
 * @param {string} [href] - URL для внешней ссылки.
 * @param {() => void} [onClick] - Функция, вызываемая при клике.
 * @param {'default' | 'glass' | 'solid' | 'outline'} [variant='default'] - Визуальный стиль карточки.
 * @param {'lift' | 'glow' | 'scale' | 'none'} [hoverEffect='lift'] - Эффект при наведении курсора.
 * @param {boolean} [isInteractive=true] - Включает/отключает интерактивные эффекты (наведение, наклон).
 *
 * @see Link - Компонент из `react-router-dom` для навигации.
 * @see motion - Компонент из `framer-motion` для анимаций.
 * @see InteractiveCard - Компонент-обертка для создания 3D-эффекта наклона.
 *
 * @usage
 * Является строительным блоком для более специализированных карточек.
 *
 * 1. **Как основа для `ProductCard` (`src/components/ui/ProductCard.tsx`):**
 *    - Используется для отображения карточек товаров в каталоге.
 * 2. **Как основа для `StaticCard` (ранее):**
 *    - Использовался для статичных информационных блоков.
 *
 * @example
 * <Card variant="glass" hoverEffect="glow" to="/details">
 *   <h3>Заголовок</h3>
 *   <p>Описание контента внутри карточки.</p>
 * </Card>
 */
const Card: React.FC<CardProps> = ({
  children,
  className = "",
  to,
  href,
  onClick,
  variant = "default",
  hoverEffect = "lift",
  isInteractive = true,
}) => {
  // Базовые классы
  const baseClasses = "card-modern overflow-hidden relative";

  // Классы для вариантов
  const variantClasses = {
    default: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/20 dark:border-white/5",
    glass: "glass-effect",
    solid: "bg-white dark:bg-gray-800 shadow-lg",
    outline: "bg-transparent border-2 border-white/20 dark:border-white/10",
  };

  // Классы для эффектов при наведении
  const hoverClasses = isInteractive
    ? {
        lift: "hover:-translate-y-2 hover:shadow-xl transition-all duration-300",
        glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300",
        scale: "hover:scale-[1.02] transition-all duration-300",
        none: "",
      }
    : {};

  // Объединяем все классы
  const allClasses = `${baseClasses} ${variantClasses[variant]} ${hoverEffect !== "none" && isInteractive ? hoverClasses[hoverEffect] : ""} ${className}`;

  // Анимация для карточки
  const cardAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  // Рендер в зависимости от типа карточки
  if (to) {
    return (
      <InteractiveCard className={allClasses}>
        <motion.div {...cardAnimation}>
          <Link to={to} className="block" onClick={onClick}>
            {children}
          </Link>
        </motion.div>
      </InteractiveCard>
    );
  }

  if (href) {
    return (
      <InteractiveCard className={allClasses}>
        <motion.div {...cardAnimation}>
          <a href={href} className="block" onClick={onClick} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        </motion.div>
      </InteractiveCard>
    );
  }

  return (
    <InteractiveCard className={allClasses}>
      <motion.div onClick={isInteractive ? onClick : undefined} {...cardAnimation}>
        {children}
      </motion.div>
    </InteractiveCard>
  );
};

export default Card;
