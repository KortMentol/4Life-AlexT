import React from "react";
import { motion } from "framer-motion";
import usePreloadedAnimation from "../../hooks/usePreloadedAnimation";

interface AnimatedFeatureProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

// Компонент для элементов с функциями/преимуществами с предзагруженной анимацией
const AnimatedFeature: React.FC<AnimatedFeatureProps> = ({
  children,
  className = "",
  index = 0,
}) => {
  const { preloadedVariants, preloadClass } = usePreloadedAnimation();

  return (
    <motion.div
      className={`${className} ${preloadClass}`}
      variants={preloadedVariants}
      initial="visible"
      whileHover={{ y: -5 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedFeature;
