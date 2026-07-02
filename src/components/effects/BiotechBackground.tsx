/**
 * @module components/effects/BiotechBackground
 * @description Премиальный адаптивный фон "Жидкий Металл" (Liquid Metal).
 * Полностью спроектирован под сверхдлинную секцию (500-600vh).
 *
 * ИСПРАВЛЕНИЕ КРИТИЧЕСКИХ ПРОСАДОК FPS НА ТАЧ-УСТРОЙСТВАХ:
 * 1. Анимация `background-position` (anim-pos) отключена на тачах. Эта CSS-свойство
 *    не ускоряется видеокартой на мобильных и вызывает перерисовку (Repaint) 600vh слоя 60 раз в секунду.
 * 2. Тяжелый `filter: blur(50px)` на вращающихся конических градиентах (High Tier)
 *    заменен на нативно-мягкие радиальные градиенты для мобильных. (Blur вращающегося объекта убивает Fill-Rate мобильных GPU).
 * 3. Субпиксельный SVG-шум (`feTurbulence`) отключен на мобильных (вызывает перегрузку композитора на больших высотах).
 *
 * @author Geminis AI & Kort
 * @version 6.4.0
 */

import { useEffectsDebug } from "@/hooks/useEffectsDebug";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import React, { useMemo } from "react";

const BiotechBackground: React.FC = () => {
  const tier = usePerformanceTier();
  const efxFlags = useEffectsDebug();

  const showBackground = import.meta.env.DEV ? efxFlags.morphingBackground : true;
  const showGlow = import.meta.env.DEV ? efxFlags.bgGlowLights : true;

  // КРИТИЧЕСКИЙ ФИКС: Детект тач-устройств для жесткой защиты GPU
  const isTouchDevice = useMemo(() => {
    return typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;
  }, []);

  const renderedContent = useMemo(() => {
    if (!showBackground) return null;

    const isLow = tier === "low";
    const isHigh = tier === "high";

    // На тач-устройствах мы принудительно фиксируем градиент в красивой точке,
    // отключая тяжелую программную анимацию background-position.
    const disableHeavyAnim = isLow || isTouchDevice;

    return (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
        style={{ backgroundColor: "#03050a" }}
      >
        {/* Базовый градиент жидкого металла */}
        <div
          className={`absolute inset-0 ${disableHeavyAnim ? "" : "anim-pos"}`}
          style={{
            background: "linear-gradient(120deg, #04070d 0%, #062430 30%, #041b2b 50%, #052033 68%, #04070d 100%)",
            backgroundSize: "300% 300%",
            backgroundPosition: disableHeavyAnim ? "35% 45%" : undefined,
            willChange: disableHeavyAnim ? "auto" : "background-position",
          }}
        />

        {/* Локальные ноды свечения, распределенные по всей высоте 600vh (Всегда видны и аппаратно безопасны) */}
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

        {/* 3. HIGH TIER ONLY: Вращающиеся блики отражения света */}
        {isHigh && showGlow && (
          <div className="absolute inset-0">
            {/* Блик 01 */}
            <div
              className="absolute left-[20%] top-[26%] h-[90vw] w-[90vw] -translate-x-1/2 -translate-y-1/2 anim-spin-rev opacity-40"
              style={
                isTouchDevice
                  ? {
                      // ТАЧ-ВЕРСИЯ: Без filter:blur. Чистый радиальный градиент (0ms нагрузки)
                      background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 60%)",
                      willChange: "transform",
                    }
                  : {
                      // ПК-ВЕРСИЯ: Конический градиент с тяжелым блюром
                      background:
                        "conic-gradient(from 90deg, transparent, rgba(34,211,238,0.12) 20%, transparent 40%, rgba(14, 165, 233, 0.10) 60%, transparent 100%)",
                      filter: "blur(50px)",
                      borderRadius: "50%",
                      willChange: "transform",
                    }
              }
            />
            {/* Блик 03 */}
            <div
              className="absolute left-[50%] top-[75%] h-[90vw] w-[90vw] -translate-x-1/2 -translate-y-1/2 anim-spin-rev opacity-40"
              style={
                isTouchDevice
                  ? {
                      // ТАЧ-ВЕРСИЯ: Без filter:blur
                      background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 60%)",
                      willChange: "transform",
                      animationDelay: "-30s",
                    }
                  : {
                      // ПК-ВЕРСИЯ: Конический градиент с тяжелым блюром
                      background:
                        "conic-gradient(from 270deg, transparent, rgba(34,211,238,0.12) 20%, transparent 40%, rgba(59, 130, 246, 0.10) 60%, transparent 100%)",
                      filter: "blur(50px)",
                      borderRadius: "50%",
                      willChange: "transform",
                      animationDelay: "-30s",
                    }
              }
            />
          </div>
        )}

        {/* Субпиксельный шум (Отключаем на тачах, так как feTurbulence убивает мобильный композитор на 600vh) */}
        {isHigh && !isTouchDevice && <div className="absolute inset-0 bg-noise-overlay" style={{ opacity: 0.02 }} />}

        {/* Виньетка глубины */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(130% 100% at 50% 20%, transparent 45%, rgba(0, 0, 0, 0.6) 100%)",
          }}
        />
      </div>
    );
  }, [tier, showBackground, showGlow, isTouchDevice]);

  return renderedContent;
};

export default React.memo(BiotechBackground);
