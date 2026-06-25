/**
 * @module components/effects/BiotechBackground
 * @description SOTD Awwwards 2026 - Performance-engineered background container.
 * @author Geminis AI & Kort
 */

import React, { useMemo } from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useEffectsDebug } from "@/hooks/useEffectsDebug";

const BiotechBackground: React.FC = () => {
  const tier = usePerformanceTier();
  const efxFlags = useEffectsDebug();

  const showBackground = import.meta.env.DEV ? efxFlags.morphingBackground : true;

  const renderedContent = useMemo(() => {
    if (!showBackground) return null;

    // 1. LOW TIER (PC & Touch): Элегантный швейцарский минимализм.
    // Только сетка 40px с низкой контрастностью. 0ms на рендеринг.
    if (tier === "low") {
      return (
        <div className="absolute inset-0 bg-[#03050a] pointer-events-none select-none z-0">
          <div className="bg-biotech-grid absolute inset-0" />
        </div>
      );
    }

    const isHigh = tier === "high";
    const blurClass = isHigh ? " bg-glow-blurred" : "";
    const animationClassCyan = isHigh ? " animate-glow-cyan" : "";
    const animationClassBlue = isHigh ? " animate-glow-blue" : "";

    return (
      <div className="absolute inset-0 -z-30 overflow-hidden bg-[#03050a] pointer-events-none select-none">
        {/* Инженерная микро-сетка */}
        <div className="bg-biotech-grid" />

        {/* Объемные свечения (на Medium они статичны и не грузят процессор) */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`bg-glow-cyan absolute left-[-10%] top-[10%] ${blurClass}${animationClassCyan}`}
            style={{ willChange: isHigh ? "transform" : "auto" }}
          />
          <div
            className={`bg-glow-blue absolute right-[-10%] bottom-[5%] ${blurClass}${animationClassBlue}`}
            style={{ willChange: isHigh ? "transform" : "auto" }}
          />
        </div>

        {/* Аппаратный субпиксельный шум */}
        <div className="bg-noise-overlay" style={{ opacity: "var(--bg-noise-opacity)" }} />
      </div>
    );
  }, [tier, showBackground]);

  return renderedContent;
};

export default React.memo(BiotechBackground);