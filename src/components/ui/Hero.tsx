import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundImage?: string;
  backgroundOverlay?: boolean;
  backgroundOverlayOpacity?: number;
  height?: 'full' | 'large' | 'medium' | 'small';
  contentPosition?: 'center' | 'left' | 'right';
  contentWidth?: 'narrow' | 'medium' | 'wide' | 'full';
  textColor?: 'light' | 'dark';
  withDecoration?: boolean;
  children?: React.ReactNode;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  backgroundImage,
  backgroundOverlay = true,
  backgroundOverlayOpacity = 0.5,
  height = 'large',
  contentPosition = 'center',
  contentWidth = 'medium',
  textColor = 'light',
  withDecoration = true,
  children,
}) => {
  // Классы для высоты
  const heightClasses = {
    full: 'min-h-screen',
    large: 'min-h-[80vh]',
    medium: 'min-h-[60vh]',
    small: 'min-h-[40vh]',
  };
  
  // Классы для позиции контента
  const contentPositionClasses = {
    center: 'items-center text-center',
    left: 'items-start text-left',
    right: 'items-end text-right',
  };
  
  // Классы для ширины контента
  const contentWidthClasses = {
    narrow: 'max-w-2xl',
    medium: 'max-w-4xl',
    wide: 'max-w-6xl',
    full: 'w-full',
  };
  
  // Классы для цвета текста
  const textColorClasses = {
    light: 'text-white',
    dark: 'text-gray-900 dark:text-white',
  };
  
  // Анимации для элементов
  const containerAnimation = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section 
      className={`relative flex items-center justify-center overflow-hidden ${heightClasses[height]}`}
      style={{ 
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Фоновый оверлей */}
      {backgroundOverlay && (
        <div 
          className="absolute inset-0 bg-black z-10"
          style={{ opacity: backgroundOverlayOpacity }}
        ></div>
      )}
      
      {/* Декоративные элементы */}
      {withDecoration && (
        <>
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/20 to-transparent z-10"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl z-10"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl z-10"></div>
        </>
      )}
      
      {/* Контент */}
      <div className="container mx-auto px-6 relative z-20">
        <motion.div 
          className={`flex flex-col ${contentPositionClasses[contentPosition]} ${contentWidthClasses[contentWidth]} mx-auto`}
          variants={containerAnimation}
          initial="initial"
          animate="animate"
        >
          {subtitle && (
            <motion.div variants={itemAnimation} className="mb-4">
              <span className="inline-block px-4 py-1.5 bg-blue-600/30 backdrop-blur-sm text-blue-100 rounded-full text-sm font-medium border border-blue-400/30">
                {subtitle}
              </span>
            </motion.div>
          )}
          
          <motion.h1 
            variants={itemAnimation}
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${textColorClasses[textColor]}`}
          >
            {title.split(' ').includes('с') ? (
              <>
                {title.split(' с ')[0]}{' '}
                <span className="text-blue-300">с {title.split(' с ')[1]}</span>
              </>
            ) : (
              title
            )}
          </motion.h1>
          
          {description && (
            <motion.p 
              variants={itemAnimation}
              className={`text-xl md:text-2xl mb-10 leading-relaxed ${textColor === 'light' ? 'text-white/90' : 'text-gray-700 dark:text-gray-300'}`}
            >
              {description}
            </motion.p>
          )}
          
          {(primaryButtonText || secondaryButtonText) && (
            <motion.div 
              variants={itemAnimation}
              className="flex flex-col sm:flex-row gap-5 justify-center"
            >
              {primaryButtonText && primaryButtonLink && (
                <Button 
                  to={primaryButtonLink} 
                  variant="primary"
                  size="lg"
                  icon={<span className="i-lucide-arrow-right" />}
                >
                  {primaryButtonText}
                </Button>
              )}
              
              {secondaryButtonText && secondaryButtonLink && (
                <Button 
                  to={secondaryButtonLink} 
                  variant="secondary"
                  size="lg"
                >
                  {secondaryButtonText}
                </Button>
              )}
            </motion.div>
          )}
          
          {children && (
            <motion.div 
              variants={itemAnimation}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;