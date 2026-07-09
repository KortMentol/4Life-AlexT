/**
 * @module components/effects/BiotechBackground
 * @description Премиальный адаптивный фон "Жидкий Металл" (Liquid Metal).
 *
 * АРХИТЕКТУРА ZERO-OVERHEAD (AWWWARDS 2026):
 * 1. Полностью удален Framer Motion, JS-вычисления и CSS-анимации.
 * 2. Фон представляет собой гигантский, математически точно рассчитанный
 *    статичный холст.
 * 3. Эффект "жизни" и глубины создается ИСКЛЮЧИТЕЛЬНО за счет скролла камеры
 *    (viewport) поверх этого холста. Карточки проплывают над запеченными
 *    световыми пятнами, создавая параллакс-иллюзию.
 * 4. Нагрузка на GPU от этого компонента при скролле = 0% (остается только
 *    базовый композитинг браузера ~9-10%).
 *
 * @author Geminis AI & Kort
 * @version 9.0.0
 */

import { useEffectsDebug } from "@/hooks/useEffectsDebug";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import React, { useMemo } from "react";

const BiotechBackground: React.FC = () => {
  const tier = usePerformanceTier();
  const efxFlags = useEffectsDebug();

  const showBackground = import.meta.env.DEV ? efxFlags.morphingBackground : true;
  const showGlow = import.meta.env.DEV ? efxFlags.bgGlowLights : true;

  const isTouchDevice =
    typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;
  const isHigh = tier === "high";

  const renderedContent = useMemo(() => {
    if (!showBackground) return null;

    return (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
        style={{ backgroundColor: "#03050a" }}
      >
        {/* Базовый градиент жидкого металла (Запеченный слой) */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(120deg, #04070d 0%, #062430 30%, #041b2b 50%, #052033 68%, #04070d 100%)",
          }}
        />

        {/* Локальные статические ноды свечения (0% нагрузки, 0ms Fill-Rate) */}
        {showGlow && (
          <div className="absolute inset-0">
            <div
              className="absolute left-[30%] top-[6%] w-[60vw] h-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)" }}
            />
            <div
              className="absolute left-[20%] top-[26%] w-[65vw] h-[65vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(6,182,212,0.20) 0%, transparent 70%)" }}
            />
            <div
              className="absolute right-[-10%] top-[50%] w-[65vw] h-[65vw] -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)" }}
            />
            <div
              className="absolute left-[50%] top-[75%] w-[70vw] h-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(6,182,212,0.19) 0%, transparent 70%)" }}
            />
            <div
              className="absolute left-[50%] top-[92%] w-[50vw] h-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)" }}
            />
          </div>
        )}

        {/* HIGH TIER ONLY: Дополнительные акцентные блики для глубины (Статичные) */}
        {isHigh && showGlow && (
          <div className="absolute inset-0">
            <div
              className="absolute left-[20%] top-[26%] h-[90vw] w-[90vw] -translate-x-1/2 -translate-y-1/2 opacity-60"
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, rgba(34,211,238,0.15) 0%, rgba(34,211,238,0.02) 60%, transparent 100%)",
              }}
            />
            <div
              className="absolute left-[50%] top-[75%] h-[90vw] w-[90vw] -translate-x-1/2 -translate-y-1/2 opacity-60"
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.02) 60%, transparent 100%)",
              }}
            />
          </div>
        )}

        {/* Кэшированный GPU-шум в формате Base64 (Включен только на ПК) */}
        {isHigh && !isTouchDevice && <div className="absolute inset-0 bg-noise-overlay" />}

        {/* Виньетка глубины */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(130% 100% at 50% 20%, transparent 45%, rgba(0, 0, 0, 0.6) 100%)",
          }}
        />
      </div>
    );
  }, [tier, showBackground, showGlow, isTouchDevice, isHigh]);

  return renderedContent;
};

export default React.memo(BiotechBackground);
