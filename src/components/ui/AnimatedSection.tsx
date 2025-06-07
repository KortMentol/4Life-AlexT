import React from 'react';
import { motion } from 'framer-motion';
import usePreloadedAnimation from '../../hooks/usePreloadedAnimation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

// Компонент для секций с предзагруженной анимацией
const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  className = "", 
  delay = 0
}) => {
  const { preloadedVariants, preloadClass } = usePreloadedAnimation();
  
  return (
    <motion.section
      className={`${className} ${preloadClass} container-preload`}
      variants={preloadedVariants}
      initial="visible"
      transition={{ 
        duration: 0.5,
        delay
      }}
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;