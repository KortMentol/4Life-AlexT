import React from "react";
import { motion, MotionProps } from "framer-motion";

/**
 * Свойства компонента PreloadedMotion
 */
interface PreloadedMotionProps extends MotionProps {
  /** Дочерние элементы */
  children: React.ReactNode;
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Компонент, который предотвращает моргание при первой загрузке
 * Использует предзагруженные варианты анимации для плавного отображения
 */
const PreloadedMotion: React.FC<PreloadedMotionProps> = ({
  children,
  className = "",
  ...props
}) => {
  // Предзагруженные варианты без анимации
  const preloadedVariants = {
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      className={className}
      variants={preloadedVariants}
      initial="visible"
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default PreloadedMotion;
