import React from "react";
import { motion } from "framer-motion";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  index?: number;
  /**
   * Отключает анимацию появления, оставляя только hover-эффект
   */
  noAnimation?: boolean;
}

// Компонент карточки с анимацией появления и hover-эффектом
const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = "",
  delay = 0,
  index = 0,
  noAnimation = false,
}) => {
  return (
    <motion.div
      className={`${className} card-preload`}
      initial={noAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      animate={noAnimation ? undefined : { opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
      transition={{
        duration: 0.3,
        delay: delay + index * 0.1,
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
