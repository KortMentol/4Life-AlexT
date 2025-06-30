import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";

interface StaticFeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
  colorTheme?: "blue" | "green";
  className?: string;
}

/**
 * Компонент для отображения преимуществ с интеллектуальной анимацией:
 * - На десктопе: анимация при наведении курсора.
 * - На мобильных: анимация при появлении в поле зрения во время скролла.
 */
const StaticFeature: React.FC<StaticFeatureProps> = ({
  icon: Icon,
  title,
  description,
  colorTheme = "green",
  className = "",
}) => {
  const isMobile = useIsMobile();
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px 0px" });

  const themes = {
    green: {
      icon: "from-green-500 to-green-600",
      border: "border-green-100 dark:border-green-900/50",
      hoverText: "group-hover:text-green-600 dark:group-hover:text-green-400",
      hoverBar: "from-green-400 to-green-600",
    },
    blue: {
      icon: "from-blue-500 to-blue-600",
      border: "border-blue-100 dark:border-blue-900/50",
      hoverText: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
      hoverBar: "from-blue-400 to-blue-600",
    },
  };

  const theme = themes[colorTheme];

  useEffect(() => {
    if (isMobile) {
      if (isInView) {
        controls.start("visible");
      } else {
        controls.start("hidden");
      }
    }
  }, [isInView, controls, isMobile]);

  const containerVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.15,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1.1, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const barVariants = {
    hidden: { width: "0%" },
    visible: { width: "100%", transition: { duration: 0.7, ease: "easeInOut" } },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (isMobile) {
    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl border ${theme.border} shadow-lg ${className}`}
      >
        <motion.div
          variants={iconVariants}
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.icon} flex items-center justify-center mb-6 shadow-md`}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>

        <motion.h3
          variants={itemVariants}
          className={`text-xl font-bold mb-4 text-gray-800 dark:text-white`}
        >
          {title}
        </motion.h3>
        <motion.p
          variants={itemVariants}
          className="text-gray-600 dark:text-gray-300 leading-relaxed"
        >
          {description}
        </motion.p>

        <div className="mt-6">
          <motion.div
            variants={barVariants}
            className={`h-1 bg-gradient-to-r ${theme.hoverBar}`}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <div
      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-500 group hover:-translate-y-2 ${className}`}
    >
      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.icon} flex items-center justify-center mb-6 shadow-md transform group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>

      <h3
        className={`text-xl font-bold mb-4 text-gray-800 dark:text-white ${theme.hoverText} transition-colors duration-300`}
      >
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>

      <div
        className={`w-0 h-1 bg-gradient-to-r ${theme.hoverBar} mt-6 group-hover:w-full transition-all duration-500`}
      ></div>
    </div>
  );
};

export default StaticFeature;
