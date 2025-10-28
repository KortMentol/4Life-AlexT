/**
 * @module src/utils/devicePerformance/devicePerformance.ts
 * @description Production-ready система определения производительности устройства (2025).
 * Строгая система скоринга с охватом 100% устройств от 2010 до 2026 года.
 * @author Kort
 * @version 3.0.0
 */

export type PerformanceTier = "low" | "medium" | "high";

export interface DeviceSpecs {
  ram: string;
  cpuCores: number;
  cpuFrequency: string;
  gpu: string;
  webglVersion: string;
  screenResolution: string;
  pixelRatio: number;
  touchSupport: boolean;
  connectionType: string;
}

let cachedSpecs: DeviceSpecs | null = null;
let cachedPerformance: { score: number; tier: PerformanceTier } | null = null;

export const detectDeviceSpecs = (): DeviceSpecs => {
  if (cachedSpecs) return cachedSpecs;

  const ua = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  
  // RAM определение с умной эвристикой
  const navMem = (navigator as any).deviceMemory;
  const cpuCores = navigator.hardwareConcurrency || 4;
  let ram = "4 GB";
  
  if (navMem) {
    ram = `${navMem} GB`;
  } else {
    // Fallback по ядрам
    if (isMobile) {
      ram = cpuCores >= 8 ? "6 GB" : cpuCores >= 6 ? "4 GB" : "3 GB";
    } else {
      ram = cpuCores >= 12 ? "16 GB" : cpuCores >= 8 ? "8 GB" : "4 GB";
    }
  }

  // GPU определение
  let gpu = "Unknown";
  let webglVersion = "Not Supported";
  
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (gl) {
      webglVersion = gl instanceof WebGL2RenderingContext ? "WebGL 2.0" : "WebGL 1.0";
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    }
  } catch (e) {
    /* silent */
  }

  const cpuFrequency = isMobile 
    ? (cpuCores >= 8 ? "2.8 GHz" : "2.0 GHz")
    : (cpuCores >= 8 ? "3.5 GHz" : "2.8 GHz");

  cachedSpecs = {
    ram,
    cpuCores,
    cpuFrequency,
    gpu: gpu.length > 50 ? gpu.substring(0, 47) + "..." : gpu,
    webglVersion,
    screenResolution: `${screen.width}×${screen.height}`,
    pixelRatio: window.devicePixelRatio,
    touchSupport: "ontouchstart" in window,
    connectionType: isMobile ? "4G" : "WiFi",
  };

  return cachedSpecs;
};

export const calculatePerformanceScore = (
  specs: DeviceSpecs
): { score: number; tier: PerformanceTier } => {
  if (cachedPerformance) return cachedPerformance;

  let score = 0;
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);

  // 1. RAM (max 25 баллов) с коррекцией на основе GPU
  let ramValue = parseFloat(specs.ram) || 4;
  
  // Умная коррекция RAM для игровых устройств (API часто занижает)
  if (isMobile && ramValue === 4 && specs.cpuCores >= 8) {
    // Если 8 ядер и API показывает 4GB, скорее всего это 6GB+
    const gpuLower = specs.gpu.toLowerCase();
    if (gpuLower.includes("adreno 6") || gpuLower.includes("adreno 7") || 
        gpuLower.includes("mali-g7") || gpuLower.includes("mali g7")) {
      ramValue = 6; // Игровые GPU обычно идут с 6GB+
    }
  }
  
  if (ramValue >= 16) score += 25;
  else if (ramValue >= 12) score += 22;
  else if (ramValue >= 8) score += 20;
  else if (ramValue >= 6) score += 15;
  else if (ramValue >= 4) score += 10;
  else if (ramValue >= 3) score += 6;
  else score += 3;

  // 2. CPU (max 25 баллов)
  if (specs.cpuCores >= 16) score += 25;
  else if (specs.cpuCores >= 12) score += 22;
  else if (specs.cpuCores >= 8) score += 20;
  else if (specs.cpuCores >= 6) score += 15;
  else if (specs.cpuCores >= 4) score += 10;
  else score += 5;

  // 3. GPU (max 50 баллов)
  const gpuString = specs.gpu.toLowerCase();
  let gpuScore = 0;

  // WebGL версия
  if (specs.webglVersion.startsWith("WebGL 2")) {
    gpuScore += 10;
  } else if (specs.webglVersion.startsWith("WebGL 1")) {
    gpuScore += 5;
  }

  // Desktop GPU - NVIDIA (RTX, GTX)
  if (gpuString.includes("rtx") && gpuString.includes("40")) gpuScore += 40;
  else if (gpuString.includes("rtx") && gpuString.includes("30")) gpuScore += 38;
  else if (gpuString.includes("rtx") && gpuString.includes("20")) gpuScore += 35;
  else if (gpuString.includes("rtx")) gpuScore += 33;
  else if (gpuString.includes("gtx") && gpuString.includes("16")) gpuScore += 30;
  else if (gpuString.includes("gtx") && gpuString.includes("10")) gpuScore += 28;
  else if (gpuString.includes("gtx") && gpuString.includes("9")) gpuScore += 25;
  else if (gpuString.includes("gtx")) gpuScore += 20;
  else if (gpuString.includes("geforce")) gpuScore += 18;
  // Desktop GPU - AMD (Radeon)
  else if (gpuString.includes("radeon") && gpuString.includes("rx") && gpuString.includes("7")) gpuScore += 38;
  else if (gpuString.includes("radeon") && gpuString.includes("rx") && gpuString.includes("6")) gpuScore += 35;
  else if (gpuString.includes("radeon") && gpuString.includes("rx") && gpuString.includes("5")) gpuScore += 28;
  else if (gpuString.includes("radeon") && gpuString.includes("rx")) gpuScore += 22;
  else if (gpuString.includes("radeon")) gpuScore += 18;
  // Mobile GPU - Adreno
  else if (gpuString.includes("adreno")) {
    const match = gpuString.match(/adreno[^\d]*(\d+)/i);
    const num = match && match[1] ? parseInt(match[1]) : 0;
    if (num >= 740) gpuScore += 35;
    else if (num >= 730) gpuScore += 33;
    else if (num >= 650) gpuScore += 30;
    else if (num >= 640) gpuScore += 28;
    else if (num >= 630) gpuScore += 26;
    else if (num >= 620) gpuScore += 24;
    else if (num >= 610) gpuScore += 22;
    else if (num >= 600) gpuScore += 20;
    else if (num >= 530) gpuScore += 15;
    else if (num >= 500) gpuScore += 12;
    else gpuScore += 8;
  }
  // Mobile GPU - Mali (поддержка Mali-G52, Mali G52, Mali™-G52 и т.д.)
  else if (gpuString.includes("mali")) {
    // Извлекаем номер Mali (например, G78, G77, G52)
    const maliMatch = gpuString.match(/mali[^\dg]*g?(\d+)/i);
    const maliNum = maliMatch && maliMatch[1] ? parseInt(maliMatch[1]) : 0;
    
    if (maliNum >= 78) gpuScore += 28;      // Mali-G78, G77
    else if (maliNum >= 72) gpuScore += 24; // Mali-G76, G72
    else if (maliNum >= 68) gpuScore += 20; // Mali-G71, G68
    else if (maliNum >= 57) gpuScore += 12; // Mali-G57
    else if (maliNum >= 52) gpuScore += 8;  // Mali-G52
    else if (maliNum >= 51) gpuScore += 7;  // Mali-G51
    else if (maliNum >= 31) gpuScore += 6;  // Mali-G31
    else if (gpuString.includes("g")) gpuScore += 8; // Другие Mali-G
    else gpuScore += 5; // Старые Mali-T и другие
  }
  // Apple GPU
  else if (gpuString.includes("apple")) gpuScore += 30;
  // Intel Integrated (поддержка Intel® HD, Intel(R) UHD и т.д.)
  else if (gpuString.includes("intel")) {
    if (gpuString.includes("arc")) gpuScore += 18;           // Intel Arc (дискретные)
    else if (gpuString.includes("iris") && gpuString.includes("xe")) gpuScore += 15; // Iris Xe
    else if (gpuString.includes("iris")) gpuScore += 10;     // Iris Plus
    else if (gpuString.includes("uhd")) gpuScore += 5;       // UHD Graphics
    else if (gpuString.includes("hd")) gpuScore += 3;        // HD Graphics
    else gpuScore += 2;                                       // Другие Intel
  }
  else {
    gpuScore += 5; // Unknown GPU (снижено с 8 до 5)
  }

  score += Math.min(50, gpuScore);
  
  // Штраф для старых устройств с WebGL 1.0
  if (specs.webglVersion.startsWith("WebGL 1")) {
    score *= 0.85; // -15% для устройств без WebGL 2.0
  }

  // 4. ШТРАФЫ для мобильных
  if (isMobile) {
    // Определяем класс устройства по GPU
    const isGamingMobile = gpuScore >= 26; // Adreno 630+, Mali G77+
    const isBudgetMobile = gpuScore < 20;   // Mali G52 (18), Adreno < 600
    
    if (isGamingMobile) {
      // НЕТ ШТРАФА для игровых телефонов - они должны быть в HIGH
    } else if (isBudgetMobile) {
      score *= 0.50; // -50% для бюджетных телефонов
    } else {
      score *= 0.70; // -30% для средних телефонов
    }
  }

  // 5. КРИТИЧЕСКИЙ ШТРАФ для Intel Integrated
  const isIntelIntegrated = 
    gpuString.includes("intel hd") ||
    gpuString.includes("intel uhd") ||
    (gpuString.includes("intel") && gpuString.includes("graphics"));
  
  if (isIntelIntegrated) {
    score *= 0.30; // -70% для встроенной графики
  }

  score = Math.round(score);

  // 6. Определение TIER
  let tier: PerformanceTier;
  
  if (isMobile) {
    if (score >= 55) tier = "high";      // Игровые телефоны 
    else if (score >= 35) tier = "medium"; // Средние телефоны 
    else tier = "low";                     // Бюджетные телефоны
  } else {
    if (score >= 605) tier = "high";        // Игровые ПК 
    else if (score >= 305) tier = "medium"; // Средние ПК
    else tier = "low";                     // Слабые ПК/ноутбуки (Intel HD)
  }

  // Intel Integrated = ВСЕГДА LOW
  if (isIntelIntegrated) {
    tier = "low";
    score = Math.min(score, 18);
  }

  cachedPerformance = { score, tier };

  // Production-ready логирование (только в development)
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `%c⚡ PERFORMANCE TIER: ${tier.toUpperCase()} | Score: ${score}`,
      'color: #00d9ff; font-weight: bold; font-size: 12px; padding: 4px 8px; background: #1a1a1a; border-radius: 4px;'
    );
    console.log('%c📊 Device Specs:', 'color: #888; font-weight: bold;', {
      GPU: specs.gpu,
      RAM: specs.ram,
      CPU: `${specs.cpuCores} cores`,
      WebGL: specs.webglVersion,
      Mobile: isMobile
    });
  }

  return cachedPerformance;
};
