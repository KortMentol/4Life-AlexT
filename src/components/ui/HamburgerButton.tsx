import React from 'react';
import { motion } from 'framer-motion';

interface HamburgerButtonProps {
  isOpen: boolean;
  toggle: () => void;
  scrolled: boolean;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ isOpen, toggle, scrolled }) => {
  // Варианты анимации для линий гамбургера
  const topLineVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 6 }
  };
  
  const middleLineVariants = {
    closed: { opacity: 1 },
    open: { opacity: 0 }
  };
  
  const bottomLineVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: -45, y: -6 }
  };

  return (
    <button
      className={`flex flex-col justify-center items-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        scrolled 
          ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/70' 
          : 'text-gray-300 hover:bg-gray-800/30'
      } transition-colors duration-300`}
      onClick={toggle}
      aria-expanded={isOpen}
      aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
      aria-controls="mobile-menu"
    >
      <div className="w-6 h-5 flex flex-col justify-between">
        <motion.span
          className={`w-full h-0.5 rounded-full transform origin-left ${
            scrolled ? 'bg-gray-700 dark:bg-gray-300' : 'bg-gray-300'
          }`}
          variants={topLineVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className={`w-full h-0.5 rounded-full ${
            scrolled ? 'bg-gray-700 dark:bg-gray-300' : 'bg-gray-300'
          }`}
          variants={middleLineVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className={`w-full h-0.5 rounded-full transform origin-left ${
            scrolled ? 'bg-gray-700 dark:bg-gray-300' : 'bg-gray-300'
          }`}
          variants={bottomLineVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3 }}
        />
      </div>
    </button>
  );
};

export default HamburgerButton;