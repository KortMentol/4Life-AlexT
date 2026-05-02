import {
  PerformanceTier,
  calculatePerformanceScore,
  detectDeviceSpecs,
} from "@/utils/devicePerformance/devicePerformance";
import { getTierOverride } from "@/utils/effectsDebug/effectsDebugStore";
import { useEffect, useState } from "react";

// Выносим кэш на уровень модуля (вне React-компонентов)
// Это гарантирует, что расчет произойдет ровно 1 раз для всего сайта
let globalTier: PerformanceTier | null = null;
let isCalculating = false;

/**
 * @module src/hooks/usePerformanceTier.ts
 * @description Оптимизированный хук (Singleton) для определения производительности.
 * В DEV режиме поддерживает override через effectsDebugStore (localStorage).
 */
export const usePerformanceTier = (): PerformanceTier => {
  // DEV: проверяем override из effectsDebugStore
  if (import.meta.env.DEV && typeof window !== "undefined") {
    const override = getTierOverride();
    if (override !== "auto") {
      return override as PerformanceTier;
    }
  }

  // Синхронно вычисляем тир при ПЕРВОМ вызове хука любым компонентом.
  // Это избавляет от первоначального "medium" и последующего массового re-render'а.
  if (typeof window !== "undefined" && !globalTier && !isCalculating) {
    isCalculating = true;
    try {
      const specs = detectDeviceSpecs();
      const { score, tier: detectedTier } = calculatePerformanceScore(specs);
      globalTier = detectedTier;

      console.log(
        `🚀 System Performance Initialized: [${globalTier.toUpperCase()}] (Score: ${score})`,
      );
    } catch (error) {
      console.error("❌ Error detecting performance tier:", error);
      globalTier = "medium";
    }
    isCalculating = false;
  }

  // Инициализируем стейт сразу правильным глобальным значением (или medium для SSR)
  const [tier, setTier] = useState<PerformanceTier>(globalTier || "medium");

  // useEffect нужен только на случай, если глобальный тир вычислился чуть позже
  // (например, при асинхронных загрузках)
  useEffect(() => {
    if (globalTier && tier !== globalTier) {
      setTier(globalTier);
    }
  }, [tier]);

  return tier;
};

export type { PerformanceTier };
