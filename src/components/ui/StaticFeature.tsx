import { useIsMobile } from "@/hooks/useIsMobile";
import { motion, useAnimation, useInView } from "framer-motion";
import React, { memo, useEffect, useRef } from "react";

interface StaticFeatureProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  colorTheme?: "blue" | "green";
  className?: string;
}

/**
 * @module components/ui/StaticFeature
 * @description Компонент для отображения отдельного преимущества или характеристики с иконкой, заголовком и описанием.
 * Обладает интеллектуальной анимацией: на десктопных устройствах анимация запускается при наведении курсора, а на мобильных — при попадании компонента в область видимости во время прокрутки. Это обеспечивает как интерактивность, так и хорошую производительность.
 *
 * @author Kort
 * @version 1.0.0
 *
 * @param {React.ElementType} icon - Компонент иконки для отображения (например, из `lucide-react`).
 * @param {string} title - Заголовок преимущества.
 * @param {string} description - Описание преимущества.
 * @param {'blue' | 'green'} [colorTheme='green'] - Цветовая схема компонента.
 * @param {string} [className] - Дополнительные CSS-классы для корневого элемента.
 *
 * @see useIsMobile - Хук для определения типа устройства.
 * @see useAnimation - Хук `framer-motion` для управления анимациями.
 * @see useInView - Хук `framer-motion` для отслеживания видимости элемента.
 *
 * @usage
 * Идеально подходит для использования в грид-сетках на главной странице или страницах продуктов для перечисления ключевых особенностей.
 *
 * @example
 * import { ShieldCheck } from 'lucide-react';
 *
 * <StaticFeature
 *   icon={ShieldCheck}
 *   title="Надежная Защита"
 *   description="Наши продукты проходят строгий контроль качества."
 *   colorTheme="blue"
 * />
 */
const StaticFeature: React.FC<StaticFeatureProps> = ({
  icon: Icon,
  title,
  description,
  colorTheme = "green",
  className = "",
}) => {
  const isMobile = useIsMobile();
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px 0px" });

  const themes: Record<
    "green" | "blue",
    {
      icon: string;
      border: string;
      hoverText: string;
      hoverBar: string;
    }
  > = {
    green: {
      icon: "from-green-500 to-green-600",
      border: "border-green-100 dark:border-green-900/50",
      hoverText: "group-hover:text-green-600 dark:group-hover:text-green-400",
      hoverBar: "from-green-400 to-green-600",
    },
    blue: {
      icon: "from-blue-500 to-blue-600",
      border: "border-blue-100 dark:border-blue-900/50",
      hoverText: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
      hoverBar: "from-blue-400 to-blue-600",
    },
  };

  const theme = themes[colorTheme];

  useEffect(() => {
    if (isMobile) {
      if (isInView) {
        controls.start("visible");
      } else {
        controls.start("hidden");
      }
    }
  }, [isInView, controls, isMobile]);

  const containerVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  if (isMobile) {
    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className={`bg-white/80 dark:bg-gray-800/80 p-8 rounded-xl border ${theme.border} shadow-lg ${className || ""}`}
      >
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.icon} flex items-center justify-center mb-6 shadow-md`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>

        <h3 className={`text-xl font-bold mb-4 text-gray-800 dark:text-white`}>
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>

        <div className="mt-6">
          <div className={`h-1 bg-gradient-to-r ${theme.hoverBar}`} />
        </div>
      </motion.div>
    );
  }

  return (
    <div
      className={`bg-white/80 dark:bg-gray-800/80 p-8 rounded-xl border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-500 group hover:-translate-y-2 ${className || ""}`}
    >
      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.icon} flex items-center justify-center mb-6 shadow-md transform group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>

      <h3
        className={`text-xl font-bold mb-4 text-gray-800 dark:text-white ${theme.hoverText} transition-colors duration-300`}
      >
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>

      <div
        className={`w-0 h-1 bg-gradient-to-r ${theme.hoverBar} mt-6 group-hover:w-full transition-all duration-500`}
      ></div>
    </div>
  );
};

export default memo(StaticFeature);
