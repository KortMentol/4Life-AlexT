/**
 * @module components/ui/StaticFeature
 * @description Компонент для отображения отдельного преимущества или характеристики с иконкой, заголовком и описанием.
 *
 * ОПТИМИЗАЦИЯ ДИНАМИКИ (Awwwards Pro):
 * 1. [Preemptive Viewport Trigger]: Настройка порога появления изменена на положительный маргин (+200px).
 *    Анимация появления карточки преимуществ теперь рассчитывается и отрабатывает в фоне, задолго до того,
 *    как элемент заедет на экран. Это гарантирует 100% бесшовный скролл без просадок кадров.
 *
 * @author Geminis AI & Kort
 * @version 1.1.0
 */

import { useIsMobile } from "@/hooks/useIsMobile";
import { motion, useAnimation, useInView } from "framer-motion";
import React, { memo, useEffect, useRef } from "react";

interface StaticFeatureProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  colorTheme?: "blue" | "green";
  className?: string;
}

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

  // Упреждающий вьюпорт +200px для бесшовного рендеринга на высокой скорости скролла
  const isInView = useInView(ref, { once: false, margin: "200px 0px" });

  const themes: Record<
    "green" | "blue",
    {
      icon: string;
      border: string;
      hoverText: string;
      hoverBar: string;
    }
  > = {
    green: {
      icon: "from-green-500 to-green-600",
      border: "border-green-900/50",
      hoverText: "group-hover:text-green-400",
      hoverBar: "from-green-400 to-green-600",
    },
    blue: {
      icon: "from-blue-500 to-blue-600",
      border: "border-blue-900/50",
      hoverText: "group-hover:text-blue-400",
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
      },
    },
  };

  if (isMobile) {
    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className={`bg-gray-800/80 p-8 rounded-xl border ${theme.border} shadow-lg ${className || ""}`}
        style={{ contain: "content" }}
      >
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.icon} flex items-center justify-center mb-6 shadow-md`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>

        <div className="mt-6">
          <div className={`h-1 bg-gradient-to-r ${theme.hoverBar}`} />
        </div>
      </motion.div>
    );
  }

  return (
    <div
      className={`bg-gray-800/80 p-8 rounded-xl border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-500 group hover:-translate-y-2 ${className || ""}`}
      style={{ contain: "content" }}
    >
      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.icon} flex items-center justify-center mb-6 shadow-md transform group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>

      <h3 className={`text-xl font-bold mb-4 text-white ${theme.hoverText} transition-colors duration-300`}>{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>

      <div
        className={`w-0 h-1 bg-gradient-to-r ${theme.hoverBar} mt-6 group-hover:w-full transition-all duration-500`}
      ></div>
    </div>
  );
};

export default memo(StaticFeature);
