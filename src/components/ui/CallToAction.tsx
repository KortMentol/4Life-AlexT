import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface CallToActionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  primaryButtonIcon?: LucideIcon;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  secondaryButtonIcon?: LucideIcon;
  isExternal?: boolean;
  className?: string;
  buttonText?: string;
  buttonLink?: string;
}

/**
 * @module components/ui/CallToAction
 * @description Компонент для создания секции "Призыв к действию".
 * Включает в себя заголовок, описание и одну или две кнопки для целевых действий пользователя.
 * Поддерживает как внутренние, так и внешние ссылки. Использует `framer-motion` для анимации кнопок.
 *
 * @author Kort
 * @version 1.0.0
 *
 * @param {string} [title] - Основной заголовок секции.
 * @param {string} [description] - Описание или поясняющий текст.
 * @param {string} [primaryButtonText] - Текст для основной (первой) кнопки.
 * @param {string} [primaryButtonLink] - Ссылка для основной кнопки.
 * @param {LucideIcon} [primaryButtonIcon] - Иконка для основной кнопки.
 * @param {string} [secondaryButtonText] - Текст для вторичной (второй) кнопки.
 * @param {string} [secondaryButtonLink] - Ссылка для вторичной кнопки.
 * @param {LucideIcon} [secondaryButtonIcon] - Иконка для вторичной кнопки.
 * @param {boolean} [isExternal=false] - Если `true`, все ссылки будут открываться в новой вкладке.
 * @param {string} [className] - Дополнительные CSS-классы для контейнера.
 * @param {string} [buttonText] - (Для обратной совместимости) Текст основной кнопки.
 * @param {string} [buttonLink] - (Для обратной совместимости) Ссылка основной кнопки.
 *
 * @see Link - Компонент из `react-router-dom` для навигации.
 * @see motion - Компонент из `framer-motion` для анимаций.
 *
 * @usage
 * Используется на различных страницах для направления пользователей к важным действиям.
 *
 * 1. **На странице "Продукты" (`src/pages/ProductsPage.tsx`):**
 *    - Предлагает пользователям связаться для консультации.
 * 2. **На странице "Партнерство" (`src/pages/PartnershipPage.tsx`):**
 *    - Призывает присоединиться к команде.
 *
 * @example
 * <CallToAction
 *   title="Готовы начать?"
 *   description="Присоединяйтесь к нам сегодня и откройте новые возможности."
 *   primaryButtonText="Регистрация"
 *   primaryButtonLink="/register"
 *   secondaryButtonText="Узнать больше"
 *   secondaryButtonLink="/about"
 * />
 */
const CallToAction = ({
  title = "",
  description = "",
  primaryButtonText,
  primaryButtonLink,
  primaryButtonIcon,
  secondaryButtonText,
  secondaryButtonLink,
  secondaryButtonIcon,
  isExternal = false,
  className = "",
  buttonText,
  buttonLink,
}: CallToActionProps) => {
  // Backward compatibility
  const displayButtonText = primaryButtonText || buttonText || "";
  const displayButtonLink = primaryButtonLink || buttonLink || "";

  const renderPrimaryButton = () => {
    if (!displayButtonText || !displayButtonLink) return null;

    const PrimaryIcon = primaryButtonIcon;

    if (isExternal) {
      return (
        <motion.a
          href={displayButtonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 text-lg font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
          aria-label={`Перейти к ${displayButtonText}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {displayButtonText}
          {PrimaryIcon && <PrimaryIcon className="w-5 h-5" />}
        </motion.a>
      );
    }

    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to={displayButtonLink}
          className="inline-block px-8 py-3 text-lg font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
          aria-label={displayButtonText}
        >
          {displayButtonText}
          {PrimaryIcon && <PrimaryIcon className="w-5 h-5" />}
        </Link>
      </motion.div>
    );
  };

  const renderSecondaryButton = () => {
    if (!secondaryButtonText || !secondaryButtonLink) return null;

    const SecondaryIcon = secondaryButtonIcon;

    if (isExternal) {
      return (
        <motion.a
          href={secondaryButtonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 text-lg font-medium text-center text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors duration-300 flex items-center justify-center gap-2"
          aria-label={secondaryButtonText}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {secondaryButtonText}
          {SecondaryIcon && <SecondaryIcon className="w-5 h-5" />}
        </motion.a>
      );
    }

    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to={secondaryButtonLink}
          className="inline-block px-8 py-3 text-lg font-medium text-center text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors duration-300 flex items-center justify-center gap-2"
          aria-label={secondaryButtonText}
        >
          {secondaryButtonText}
          {SecondaryIcon && <SecondaryIcon className="w-5 h-5" />}
        </Link>
      </motion.div>
    );
  };

  return (
    <section className={`py-16 md:py-24 bg-gradient-to-r from-blue-600/0 to-indigo-700/0 text-white ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px 0px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
          {description && <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">{description}</p>}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {renderPrimaryButton()}
            {renderSecondaryButton()}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
