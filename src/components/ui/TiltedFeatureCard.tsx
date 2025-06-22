import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Tilt } from 'react-tilt';
import { useTheme } from '@/context/useTheme';

interface TiltedFeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
}

const tiltOptions = {
  max: 15,
  perspective: 1000,
  scale: 1.05,
  speed: 1000,
  transition: true,
  reset: true,
};

const TiltedFeatureCard: React.FC<TiltedFeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  className = '',
}) => {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 1024); // Отключаем Tilt на планшетах и мобильных
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const CardContent = (
    <motion.div
      className={`relative p-8 h-full rounded-2xl overflow-hidden group ${className}`}
      style={{
        background: theme === 'dark' ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      {/* Интерактивное свечение */}
      <motion.div
        className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${
            theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'
          } 0%, transparent 70%)`,
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          className="mb-6 p-4 rounded-full"
          style={{
            background: theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Icon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
        </motion.div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );

  return isMobile ? CardContent : <Tilt options={tiltOptions}>{CardContent}</Tilt>;
};

export default TiltedFeatureCard;