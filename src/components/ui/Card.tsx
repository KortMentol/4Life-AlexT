import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'solid' | 'outline';
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'none';
  isInteractive?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  to,
  href,
  onClick,
  variant = 'default',
  hoverEffect = 'lift',
  isInteractive = true,
}) => {
  // Базовые классы
  const baseClasses = 'card-modern overflow-hidden relative';
  
  // Классы для вариантов
  const variantClasses = {
    default: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/20 dark:border-white/5',
    glass: 'glass-effect',
    solid: 'bg-white dark:bg-gray-800 shadow-lg',
    outline: 'bg-transparent border-2 border-white/20 dark:border-white/10',
  };
  
  // Классы для эффектов при наведении
  const hoverClasses = isInteractive ? {
    lift: 'hover:-translate-y-2 hover:shadow-xl transition-all duration-300',
    glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300',
    scale: 'hover:scale-[1.02] transition-all duration-300',
    none: '',
  } : {};
  
  // Объединяем все классы
  const allClasses = `${baseClasses} ${variantClasses[variant]} ${hoverEffect !== 'none' && isInteractive ? hoverClasses[hoverEffect] : ''} ${className}`;
  
  // Анимация для карточки
  const cardAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };
  
  // Рендер в зависимости от типа карточки
  if (to) {
    return (
      <motion.div {...cardAnimation}>
        <Link to={to} className={`${allClasses} block`} onClick={onClick}>
          {children}
        </Link>
      </motion.div>
    );
  }
  
  if (href) {
    return (
      <motion.div {...cardAnimation}>
        <a 
          href={href} 
          className={`${allClasses} block`} 
          onClick={onClick}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className={`${allClasses} ${onClick && isInteractive ? 'cursor-pointer' : ''}`}
      onClick={isInteractive ? onClick : undefined}
      {...cardAnimation}
    >
      {children}
    </motion.div>
  );
};

export default Card;