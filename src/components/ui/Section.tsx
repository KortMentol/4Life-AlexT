import React from "react";
import { motion } from "framer-motion";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "light" | "dark" | "gradient" | "transparent" | "glass";
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  withDecoration?: boolean;
  decorationPosition?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  decorationColor?: string;
  containerWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  id,
  background = "light",
  spacing = "lg",
  withDecoration = false,
  decorationPosition = "top-right",
  decorationColor = "blue",
  containerWidth = "xl",
}) => {
  // Базовые классы
  const baseClasses = "relative overflow-hidden";

  // Классы для фона
  const backgroundClasses = {
    light:
      "bg-gradient-to-b from-white to-neutral-100 dark:from-gray-900 dark:to-gray-800",
    dark: "bg-gradient-to-b from-gray-900 to-gray-800 text-white",
    gradient:
      "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950",
    transparent: "bg-transparent",
    glass: "glass-effect",
  };

  // Классы для отступов
  const spacingClasses = {
    none: "",
    sm: "py-8",
    md: "py-16",
    lg: "py-24",
    xl: "py-32",
  };

  // Классы для ширины контейнера
  const containerClasses = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-screen-2xl",
    full: "w-full",
  };

  // Классы для декоративных элементов
  const decorationClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
  };

  // Цвета для декоративных элементов
  const decorationColors = {
    blue: "from-blue-400 to-blue-600",
    green: "from-green-400 to-green-600",
    purple: "from-purple-400 to-purple-600",
    amber: "from-amber-400 to-amber-600",
    pink: "from-pink-400 to-pink-600",
  };

  // Объединяем все классы
  const allClasses = `${baseClasses} ${backgroundClasses[background]} ${spacingClasses[spacing]} ${className}`;

  return (
    <section className={allClasses} id={id}>
      {/* Декоративный элемент */}
      {withDecoration && (
        <div
          className={`absolute ${decorationClasses[decorationPosition]} w-96 h-96 opacity-20 z-0 pointer-events-none`}
        >
          <div
            className={`w-full h-full rounded-full bg-gradient-to-br ${decorationColors[decorationColor as keyof typeof decorationColors] || decorationColors.blue} filter blur-3xl`}
          ></div>
        </div>
      )}

      {/* Контейнер для содержимого */}
      <div
        className={`container ${containerClasses[containerWidth]} mx-auto px-6 relative z-10`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default Section;
