/**
 * @module components/effects/BiotechBackground
 * @description Премиальный адаптивный фон "Жидкий Металл" (Liquid Metal).
 * Полностью спроектирован под сверхдлинную секцию (500-600vh).
 *
 * ИСПРАВЛЕНИЕ:
 * - Устранена проблема темноты на Low-Tier. Теперь на всех тирах (включая Low-Tier)
 *   и на тач-устройствах базовый фон имеет одинаковую сочность и яркость [1].
 * - Для Low-Tier задано фиксированное центрирование градиента `backgroundPosition: "35% 45%"` [1],
 *   которое выводит самую яркую бирюзово-синюю металлическую область прямо во вьюпорт [1],
 *   но не запускает тяжелую анимацию смещения, сохраняя производительность [1, 2].
 *
 * @author Geminis AI & Kort
 * @version 6.3.0
 */

import { useEffectsDebug } from "@/hooks/useEffectsDebug";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import React, { useMemo } from "react";

const BiotechBackground: React.FC = () => {
  const tier = usePerformanceTier();
  const efxFlags = useEffectsDebug();

  const showBackground = import.meta.env.DEV ? efxFlags.morphingBackground : true;
  // Свечение теперь всегда разрешено на Low-Tier по умолчанию для исключения темноты [1]
  const showGlow = import.meta.env.DEV ? efxFlags.bgGlowLights : true;

  const renderedContent = useMemo(() => {
    if (!showBackground) return null;

    const isLow = tier === "low";
    const isHigh = tier === "high";

    return (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
        style={{ backgroundColor: "#03050a" }}
      >
        {/* Базовый градиент жидкого металла — Одинаков по цвету на всех тирах! */}
        {/* На Low-Tier он зафиксирован в яркой точке "35% 45%", на Medium/High плавно перетекает (anim-pos) */}
        <div
          className={`absolute inset-0 ${isLow ? "" : "anim-pos"}`}
          style={{
            background: "linear-gradient(120deg, #04070d 0%, #062430 30%, #041b2b 50%, #052033 68%, #04070d 100%)",
            backgroundSize: "300% 300%",
            backgroundPosition: isLow ? "35% 45%" : undefined, // Идеально центрируем неоновую бирюзовую полосу на Low-Tier [1]
            willChange: isLow ? "auto" : "background-position",
          }}
        />

        {/* Локальные ноды свечения, распределенные по всей высоте 600vh (Всегда видны и одинаково ярки!) [1] */}
        {showGlow && (
          <div className="absolute inset-0">
            {/* Нода 1 — Заголовок */}
            <div
              className="absolute left-[30%] top-[6%] w-[60vw] h-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)" }}
            />
            {/* Нода 2 — Блок 01 */}
            <div
              className="absolute left-[20%] top-[26%] w-[65vw] h-[65vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(6,182,212,0.20) 0%, transparent 70%)" }}
            />
            {/* Нода 3 — Блок 02 */}
            <div
              className="absolute right-[-10%] top-[50%] w-[65vw] h-[65vw] -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)" }}
            />
            {/* Нода 4 — Блок 03 */}
            <div
              className="absolute left-[50%] top-[75%] w-[70vw] h-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(6,182,212,0.19) 0%, transparent 70%)" }}
            />
            {/* Нода 5 — CTA */}
            <div
              className="absolute left-[50%] top-[92%] w-[50vw] h-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)" }}
            />
          </div>
        )}

        {/* 3. HIGH TIER ONLY: Вращающиеся блики отражения света (Conic Gradient) */}
        {isHigh && showGlow && (
          <div className="absolute inset-0">
            {/* Вращающийся блик на Блоке 01 */}
            <div
              className="absolute left-[20%] top-[26%] h-[90vw] w-[90vw] -translate-x-1/2 -translate-y-1/2 anim-spin-rev opacity-40"
              style={{
                background:
                  "conic-gradient(from 90deg, transparent, rgba(34,211,238,0.12) 20%, transparent 40%, rgba(14, 165, 233, 0.10) 60%, transparent 100%)",
                filter: "blur(50px)",
                borderRadius: "50%",
                willChange: "transform",
              }}
            />
            {/* Вращающийся блик на Блоке 03 */}
            <div
              className="absolute left-[50%] top-[75%] h-[90vw] w-[90vw] -translate-x-1/2 -translate-y-1/2 anim-spin-rev opacity-40"
              style={{
                background:
                  "conic-gradient(from 270deg, transparent, rgba(34,211,238,0.12) 20%, transparent 40%, rgba(59, 130, 246, 0.10) 60%, transparent 100%)",
                filter: "blur(50px)",
                borderRadius: "50%",
                willChange: "transform",
                animationDelay: "-30s",
              }}
            />
          </div>
        )}

        {/* Субпиксельный шум (High Tier) */}
        {isHigh && <div className="absolute inset-0 bg-noise-overlay" style={{ opacity: 0.02 }} />}

        {/* Виньетка глубины */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(130% 100% at 50% 20%, transparent 45%, rgba(0, 0, 0, 0.6) 100%)",
          }}
        />
      </div>
    );
  }, [tier, showBackground, showGlow]);

  return renderedContent;
};

export default React.memo(BiotechBackground);
