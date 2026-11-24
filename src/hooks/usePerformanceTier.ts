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
  }, [tier]);

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
