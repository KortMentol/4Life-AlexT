import React from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const progress = useMotionValue(isDark ? 0 : 1);

  React.useEffect(() => {
    const animation = animate(progress, isDark ? 0 : 1, {
      type: 'tween',
      duration: 0.7,
      ease: [0.8, 0, 0.2, 1], // Custom cubic-bezier for a 'heavy' feel
    });
    return () => animation.stop();
  }, [isDark, progress]);

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <motion.div
      onClick={handleToggle}
      className={`relative w-20 h-10 flex items-center rounded-full cursor-pointer select-none [-webkit-tap-highlight-color:transparent] transition-colors duration-500 ${isDark ? 'bg-gray-800' : 'bg-sky-300'}`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`absolute w-10 h-10 flex items-center justify-center`}
        style={{ x: useTransform(progress, [0, 1], [2, 42]) }} // 40 = w-20 (80px) - w-10 (40px) + padding
        transition={{ type: 'tween', duration: 0.7, ease: [0.8, 0, 0.2, 1] }}
      >
        <motion.div
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-gray-600' : 'bg-yellow-400'}`}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <AnimatePresence initial={false} mode='wait'>
            <motion.div
              key={isDark ? 'moon' : 'sun'}
              initial={{ opacity: 0, scale: 0.7, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotate: 90 }}
              transition={{ duration: 0.3, ease: 'easeIn' }}
              className="absolute"
            >
              {isDark ? <Moon size={22} className="text-white" /> : <Sun size={22} className="text-white" />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ThemeSwitcher;