import React, { useEffect } from 'react';
import { motion, MotionProps } from 'framer-motion';

// Компонент, который предотвращает моргание при первой загрузке
interface PreloadedMotionProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
}

const PreloadedMotion: React.FC<PreloadedMotionProps> = ({ 
  children, 
  className = "", 
  ...props 
}) => {
  // Эффект для предотвращения моргания при первой загрузке
  useEffect(() => {
    // Компонент загружен
  }, []);

  // Предзагруженные варианты без анимации
  const preloadedVariants = {
    visible: {
      opacity: 1,
      y: 0
    }
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