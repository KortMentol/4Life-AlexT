import React from "react";
import { motion } from "framer-motion";

interface AnimatedFeatureProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const AnimatedFeature: React.FC<AnimatedFeatureProps> = ({
  children,
  className = "",
  index = 0,
}) => {
  return (
    <motion.div
      className={className}
      custom={index}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedFeature;
