import { useEffect, useState } from "react";
import { PerformanceTier, detectDeviceSpecs, calculatePerformanceScore } from "@/utils/devicePerformance";

/**
 * @module src/hooks/usePerformanceTier.ts
 * @description Хук для определения уровня производительности устройства клиента. Он анализирует характеристики устройства (CPU, GPU, RAM) и на основе скоринговой системы присваивает один из трех уровней: `high`, `medium` или `low`. Это позволяет адаптировать функциональность приложения (например, качество графики) под возможности пользователя.
 * @author Kort
 * @version 1.0.0
 * @returns {PerformanceTier} Строка, представляющая уровень производительности: `"high"`, `"medium"` или `"low"`.
 * @see calculatePerformanceScore - Функция, лежащая в основе логики определения производительности.
 * @usage
 * 1. `src/components/effects/FluidEffect.tsx`: Используется для выбора подходящей конфигурации WebGL-эффекта в зависимости от мощности устройства.
 * @example
 * const tier = usePerformanceTier();
 * 
 * useEffect(() => {
 *   if (tier === 'low') {
 *     // Отключить сложные анимации
 *   }
 * }, [tier]);
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