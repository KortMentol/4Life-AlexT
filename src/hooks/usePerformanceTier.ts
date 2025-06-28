import { useEffect, useState } from "react";
import { PerformanceTier, detectDeviceSpecs, calculatePerformanceScore } from "@/utils/devicePerformance";

/**
 * Хук для определения уровня производительности устройства
 * Использует единую систему скоринга из devicePerformance.ts
 * 
 * @returns {PerformanceTier} Уровень производительности: "high", "medium" или "low"
 */
export const usePerformanceTier = (): PerformanceTier => {
  const [tier, setTier] = useState<PerformanceTier>("medium");

  useEffect(() => {
    if (typeof window === "undefined") {
      setTier("medium");
      return;
    }

    try {
      // Определяем характеристики устройства
      const specs = detectDeviceSpecs();
      
      // Рассчитываем производительность по единой системе
      const { score, tier: detectedTier } = calculatePerformanceScore(specs);
      
      setTier(detectedTier);
      
      console.log('🚀 Performance tier detected:', {
        tier: detectedTier,
        score,
        specs
      });
    } catch (error) {
      console.error('❌ Error detecting performance tier:', error);
      setTier("medium"); // Fallback на средний уровень
    }
  }, []);

  return tier;
};

// Реэкспорт типа для обратной совместимости
export type { PerformanceTier };