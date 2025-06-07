import React from 'react';
import { motion } from 'framer-motion';

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  titleGradient?: boolean;
  withLine?: boolean;
  lineColor?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  descriptionClassName?: string;
  animated?: boolean;
  centered?: boolean; // Добавляем свойство centered для обратной совместимости
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  description,
  align = 'left',
  size = 'md',
  titleGradient = false,
  withLine = true,
  lineColor = 'blue',
  className = '',
  titleClassName = '',
  subtitleClassName = '',
  descriptionClassName = '',
  animated = true,
  centered = false,
}) => {
  // Классы для выравнивания
  const alignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };
  
  // Если передан параметр centered, переопределяем align на 'center'
  if (centered) {
    align = 'center';
  }
  
  // Классы для размеров заголовка
  const titleSizeClasses = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl',
    xl: 'text-5xl md:text-6xl',
  };
  
  // Классы для размеров подзаголовка
  const subtitleSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };
  
  // Классы для размеров описания
  const descriptionSizeClasses = {
    sm: 'text-base max-w-xl',
    md: 'text-lg max-w-2xl',
    lg: 'text-xl max-w-3xl',
    xl: 'text-2xl max-w-4xl',
  };
  
  // Цвета для линии
  const lineColors = {
    blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
    green: 'bg-gradient-to-r from-green-400 to-green-600',
    purple: 'bg-gradient-to-r from-purple-400 to-purple-600',
    amber: 'bg-gradient-to-r from-amber-400 to-amber-600',
    pink: 'bg-gradient-to-r from-pink-400 to-pink-600',
  };
  
  // Анимации для элементов
  const containerAnimation = animated ? {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  } : {};
  
  const titleAnimation = animated ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay: 0.1 }
  } : {};
  
  const subtitleAnimation = animated ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay: 0 }
  } : {};
  
  const lineAnimation = animated ? {
    initial: { width: 0 },
    whileInView: { width: '100%' },
    viewport: { once: true },
    transition: { duration: 0.7, delay: 0.3 }
  } : {};
  
  const descriptionAnimation = animated ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay: 0.4 }
  } : {};
  
  return (
    <motion.div 
      className={`${alignClasses[align]} ${className}`}
      {...containerAnimation}
    >
      {subtitle && (
        <motion.p 
          className={`font-medium text-primary-blue dark:text-blue-400 mb-2 ${subtitleSizeClasses[size]} ${subtitleClassName}`}
          {...subtitleAnimation}
        >
          {subtitle}
        </motion.p>
      )}
      
      <motion.h2 
        className={`font-bold leading-tight ${titleGradient ? 'gradient-heading' : ''} ${titleSizeClasses[size]} ${titleClassName}`}
        {...titleAnimation}
      >
        {title}
      </motion.h2>
      
      {withLine && (
        <div className="relative h-1 mt-4 mb-6 w-24">
          <motion.div 
            className={`absolute h-full ${lineColors[lineColor as keyof typeof lineColors] || lineColors.blue}`}
            {...lineAnimation}
          ></motion.div>
        </div>
      )}
      
      {description && (
        <motion.p 
          className={`mt-4 text-gray-600 dark:text-gray-300 ${descriptionSizeClasses[size]} ${descriptionClassName}`}
          {...descriptionAnimation}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionHeading;