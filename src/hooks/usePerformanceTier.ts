import { useEffect, useState } from "react";

export type PerformanceTier = "low" | "medium" | "high";

/**
 * Хук для определения производительности устройства
 * @returns Уровень производительности на основе характеристик устройства
 */
export const usePerformanceTier = (): PerformanceTier => {
  const [tier, setTier] = useState<PerformanceTier>("high");

  useEffect(() => {
    if (typeof window === "undefined") {
      setTier("medium");
      return;
    }

    const detectPerformance = () => {
      let score = 0;
      const ua = navigator.userAgent;
      const isMobile =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const isTablet = /iPad|Android.*Tablet/i.test(ua);
      const isIOS = /iPhone|iPad|iPod/i.test(ua);

      // Базовые очки за тип устройства (статистика 2025)
      if (!isMobile && !isTablet) {
        score += 50; // Десктоп
      } else if (isTablet) {
        score += 35; // Планшеты
      } else if (isIOS) {
        score += 30; // iPhone
      } else {
        score += 20; // Android
      }

      // Память устройства (критично для WebGL)
      if ("deviceMemory" in navigator) {
        const memory = (navigator as Navigator & { deviceMemory?: number })
          .deviceMemory;
        if (memory && memory >= 8)
          score += 25; // 8+ ГБ
        else if (memory && memory >= 6)
          score += 20; // 6 ГБ
        else if (memory && memory >= 4)
          score += 15; // 4 ГБ
        else if (memory && memory >= 3)
          score += 10; // 3 ГБ
        else if (memory)
          score += 5; // 2 ГБ и меньше
        else score += isIOS ? 20 : isMobile ? 12 : 22; // fallback если memory undefined
      } else {
        score += isIOS ? 20 : isMobile ? 12 : 22;
      }

      // Количество ядер процессора
      if ("hardwareConcurrency" in navigator) {
        const cores = navigator.hardwareConcurrency;
        if (cores >= 8)
          score += 20; // 8+ ядер
        else if (cores >= 6)
          score += 15; // 6 ядер
        else if (cores >= 4)
          score += 12; // 4 ядра
        else if (cores >= 2)
          score += 8; // 2 ядра
        else score += 3; // 1 ядро
      } else {
        score += 12;
      }

      // WebGL поддержка и GPU
      const canvas = document.createElement("canvas");
      const gl2 = canvas.getContext("webgl2");
      if (gl2) {
        score += 15; // WebGL 2.0 поддержка

        const debugInfo = gl2.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const renderer = gl2
            .getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            .toLowerCase();

          // Дискретные видеокарты
          if (renderer.includes("rtx 40") || renderer.includes("rtx 30")) {
            score += 25; // Новые RTX
          } else if (
            renderer.includes("rtx") ||
            renderer.includes("gtx 16") ||
            renderer.includes("gtx 10")
          ) {
            score += 20; // Средние RTX/GTX
          } else if (
            renderer.includes("gtx") ||
            renderer.includes("rx 6") ||
            renderer.includes("rx 7")
          ) {
            score += 15; // Старые GTX или новые AMD
          } else if (renderer.includes("rx")) {
            score += 12; // Старые AMD
          }
          // Интегрированная графика
          else if (
            renderer.includes("iris xe") ||
            renderer.includes("iris plus")
          ) {
            score += 12; // Новая Intel
          } else if (renderer.includes("intel") && renderer.includes("uhd")) {
            score += 8; // Средняя Intel
          } else if (renderer.includes("intel")) {
            score += 5; // Старая Intel
          } else if (
            renderer.includes("adreno 7") ||
            renderer.includes("adreno 6")
          ) {
            score += 15; // Новые Adreno (флагманы)
          } else if (
            renderer.includes("adreno 5") ||
            renderer.includes("adreno 4")
          ) {
            score += 10; // Средние Adreno
          } else if (renderer.includes("adreno")) {
            score += 7; // Старые Adreno
          } else if (
            renderer.includes("mali-g") &&
            (renderer.includes("78") ||
              renderer.includes("77") ||
              renderer.includes("76"))
          ) {
            score += 12; // Новые Mali
          } else if (renderer.includes("mali")) {
            score += 8; // Старые Mali
          } else if (renderer.includes("apple") || renderer.includes("a1")) {
            score += 18; // Apple GPU
          }
        }
      } else {
        const gl = canvas.getContext("webgl");
        if (gl)
          score += 8; // Только WebGL 1.0
        else score += 0; // Нет WebGL - очень слабое устройство
      }

      // Определение уровня score
      if (score >= 70) return "high"; // Планка для high
      if (score >= 40) return "medium"; // Планка для medium
      return "low";
    };

    setTier(detectPerformance());
  }, []);

  return tier;
};
