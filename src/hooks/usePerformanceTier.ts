/**
 * @module hooks/usePerformanceTier
 * @description Хук для получения текущего тира производительности.
 * Теперь полностью реактивен: подписывается на изменения в effectsDebugStore [1],
 * благодаря чему любое переключение режимов (включая "Restore Last Preset") мгновенно
 * обновляет все зависимые слои (включая фоновые зеленые фонари и CustomScrollbar).
 *
 * @author Kort
 * @version 5.2.0
 */

import {
  PerformanceTier,
  calculatePerformanceScore,
  detectDeviceSpecs,
} from "@/utils/devicePerformance/devicePerformance";
import { effectsDebugStore } from "@/utils/effectsDebug/effectsDebugStore";
import { useEffect, useState } from "react";

let globalTier: PerformanceTier | null = null;

if (typeof window !== "undefined") {
  try {
    const specs = detectDeviceSpecs();
    const result = calculatePerformanceScore(specs);
    globalTier = result.tier;
  } catch (error) {
    console.error("Failed to detect performance specs on init:", error);
    globalTier = "medium";
  }
}

export const usePerformanceTier = (): PerformanceTier => {
  const [tier, setTier] = useState<PerformanceTier>(globalTier || "medium");

  // Локальный стейт для синхронизации в DEV режиме
  const [devTier, setDevTier] = useState<PerformanceTier>(() => {
    if (import.meta.env.DEV && typeof window !== "undefined") {
      return effectsDebugStore.activeTier;
    }
    return globalTier || "medium";
  });

  useEffect(() => {
    if (globalTier && tier !== globalTier) {
      setTier(globalTier);
    }
  }, []);

  // КРИТИЧЕСКИЙ ФИКС: Подписываемся на обновления стора в DEV режиме.
  // Это гарантирует реактивность тира во всех компонентах, которые его используют.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const unsub = effectsDebugStore.subscribe(() => {
      setDevTier(effectsDebugStore.activeTier);
    });
    return unsub;
  }, []);

  if (import.meta.env.DEV && typeof window !== "undefined") {
    return devTier;
  }

  return tier;
};

export type { PerformanceTier };
