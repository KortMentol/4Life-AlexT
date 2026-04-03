import { motion, useMotionValue, useSpring } from "framer-motion";
import React, { useRef } from "react";
import { IS_TOUCH, type FeatureCardData, type PerformanceTier } from "./types";

interface FeatureCardProps {
  card: FeatureCardData;
  index: number;
  tier: PerformanceTier;
  isActive: boolean;
  isDark: boolean;
}

// Spring конфиг для магнетизма — нежный, как у Apple/Immersive Garden
// Низкий stiffness + высокий damping = плавный "тянущийся" эффект
// restDelta/restSpeed — карточка полностью останавливается, не дрожит
const MAGNETIC_SPRING = {
  stiffness: 120,
  damping: 20,
  mass: 0.6,
  restDelta: 0.001,
  restSpeed: 0.001,
};

const FeatureCard: React.FC<FeatureCardProps> = ({ card, index, tier, isActive, isDark }) => {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = card.icon;

  // useMotionValue — нет ре-рендеров React, всё в RAF Framer Motion
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // useSpring поверх motionValue — плавный инерционный отклик
  const x = useSpring(rawX, MAGNETIC_SPRING);
  const y = useSpring(rawY, MAGNETIC_SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tier !== "high" || IS_TOUCH || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Сила магнетизма: 0.10 — нежно, не агрессивно
    rawX.set((e.clientX - centerX) * 0.1);
    rawY.set((e.clientY - centerY) * 0.1);
  };

  const handleMouseLeave = () => {
    // Spring сам плавно вернёт к 0 — не нужно мгновенно сбрасывать
    rawX.set(0);
    rawY.set(0);
  };

  const cardBg = isDark
    ? tier === "high" && !IS_TOUCH
      ? "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20"
      : "bg-white/[0.03] border-white/10"
    : tier === "high" && !IS_TOUCH
      ? "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] hover:border-black/20"
      : "bg-black/[0.03] border-black/10";

  const titleColor = isDark ? "text-white" : "text-slate-900";
  const descColor = isDark ? "text-white/45" : "text-slate-600/80";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      animate={isActive ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{
        // Магнетизм на medium + high desktop, на low и touch — статично
        x: tier !== "low" && !IS_TOUCH ? x : 0,
        y: tier !== "low" && !IS_TOUCH ? y : 0,
        // Изолируем stacking context — карточка не наползает на соседей
        isolation: "isolate",
      }}
      className="group relative"
    >
      <div
        className={`relative overflow-hidden rounded-3xl border transition-colors duration-500 ${cardBg}`}
        style={{
          contain: "layout paint",
          // backdrop-blur убран — paint operation при скролле через секцию
        }}
      >
        {/* Image */}
        <div className="relative h-48 sm:h-52 overflow-hidden">
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div
            className={`absolute bottom-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${card.accent} shadow-lg`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7">
          <h3 className={`text-xl sm:text-2xl font-medium mb-3 tracking-tight ${titleColor}`}>{card.title}</h3>
          <p className={`leading-relaxed text-sm sm:text-base font-light ${descColor}`}>{card.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(FeatureCard);
