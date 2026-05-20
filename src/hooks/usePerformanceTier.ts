import {
  PerformanceTier,
  calculatePerformanceScore,
  detectDeviceSpecs,
} from "@/utils/devicePerformance/devicePerformance";
import { getTierOverride } from "@/utils/effectsDebug/effectsDebugStore";
import { useEffect, useState } from "react";

// Кэш на уровне модуля — вычисляется ровно 1 раз для всего сайта
let globalTier: PerformanceTier | null = null;
let isCalculating = false;

/**
 * @module src/hooks/usePerformanceTier.ts
 * @description Singleton-хук для определения производительности устройства.
 * Rules of Hooks соблюдены: useState и useEffect всегда вызываются безусловно.
 * DEV override проверяется ПОСЛЕ хуков и возвращается в конце.
 */
export const usePerformanceTier = (): PerformanceTier => {
  // Синхронно вычисляем тир при первом вызове
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

  // ─── ХУКИ ВСЕГДА ВЫЗЫВАЮТСЯ БЕЗУСЛОВНО (Rules of Hooks) ───
  const [tier, setTier] = useState<PerformanceTier>(globalTier || "medium");

  useEffect(() => {
    if (globalTier && tier !== globalTier) {
      setTier(globalTier);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // только при монтировании — globalTier не меняется после инициализации

  // ─── DEV override: проверяем ПОСЛЕ хуков ───
  if (import.meta.env.DEV && typeof window !== "undefined") {
    const override = getTierOverride();
    if (override !== "auto") {
      return override as PerformanceTier;
    }
  }

  return tier;
};

export type { PerformanceTier };
