import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  index?: number;
}

// Компонент карточки с предзагруженной анимацией для предотвращения моргания
const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  index = 0
}) => {
  return (
    <motion.div
      className={`${className} card-preload`}
      initial={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
      transition={{ 
        duration: 0.3,
        delay: delay + (index * 0.1)
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;