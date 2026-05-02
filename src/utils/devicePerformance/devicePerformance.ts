/**
 * @module src/utils/devicePerformance/devicePerformance.ts
 * @description Production-ready система определения производительности устройства.
 * Future-proof до 2028 года: покрывает RTX 5/6xx, RX 8/9xxx, Adreno X/9xx,
 * MediaTek Immortalis, Mali-G9xx, Intel Arc Battlemage, AMD Radeon 890M.
 * @author Kort
 * @version 4.0.0
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
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  const navMem = (navigator as any).deviceMemory;
  const cpuCores = navigator.hardwareConcurrency || 4;
  let ram = "4 GB";

  if (navMem) {
    ram = `${navMem} GB`;
  } else {
    if (isMobile) {
      ram = cpuCores >= 8 ? "6 GB" : cpuCores >= 6 ? "4 GB" : "3 GB";
    } else {
      ram = cpuCores >= 12 ? "16 GB" : cpuCores >= 8 ? "8 GB" : "4 GB";
    }
  }

  let gpu = "Unknown";
  let webglVersion = "Not Supported";

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (gl) {
      webglVersion =
        gl instanceof WebGL2RenderingContext ? "WebGL 2.0" : "WebGL 1.0";
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    }
  } catch (e) {
    /* silent */
  }

  const cpuFrequency = isMobile
    ? cpuCores >= 8
      ? "2.8 GHz"
      : "2.0 GHz"
    : cpuCores >= 8
      ? "3.5 GHz"
      : "2.8 GHz";

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
  specs: DeviceSpecs,
): { score: number; tier: PerformanceTier } => {
  if (cachedPerformance) return cachedPerformance;

  let score = 0;
  const ua = navigator.userAgent.toLowerCase();
  const isMobile =
    /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);

  // 1. RAM (max 25 баллов)
  let ramValue = parseFloat(specs.ram) || 4;

  // Коррекция RAM для мобильных: deviceMemory API округляет вниз
  // Флагманский GPU + 8 ядер → скорее всего 6GB+
  if (isMobile && ramValue <= 4 && specs.cpuCores >= 8) {
    const gpuLower = specs.gpu.toLowerCase();
    const isFlagshipGpu =
      /adreno\s*6[3-9]\d/.test(gpuLower) || // Adreno 630-699
      /adreno\s*[789]\d\d/.test(gpuLower) || // Adreno 700-999
      /adreno\s*x/i.test(gpuLower) || // Adreno X (Snapdragon X Elite)
      gpuLower.includes("immortalis") || // MediaTek Immortalis
      gpuLower.includes("mali-g7") ||
      gpuLower.includes("mali g7") ||
      gpuLower.includes("mali-g8") ||
      gpuLower.includes("mali g8") ||
      gpuLower.includes("apple");
    if (isFlagshipGpu) ramValue = 6;
  }

  // Десктоп: API cap 8GB → если 12+ ядер, скорее всего 16GB
  if (!isMobile && ramValue === 8 && specs.cpuCores >= 12) {
    ramValue = 12;
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
  if (specs.webglVersion.startsWith("WebGL 2")) gpuScore += 10;
  else if (specs.webglVersion.startsWith("WebGL 1")) gpuScore += 5;

  // --- DESKTOP GPU ---

  // NVIDIA RTX — точный regex по серии, future-proof до RTX 6xxx+
  if (gpuString.includes("rtx")) {
    if (/rtx\s*[56]\d{3}/.test(gpuString))
      gpuScore += 45; // RTX 5xxx/6xxx (2025-2028)
    else if (/rtx\s*4\d{3}/.test(gpuString))
      gpuScore += 40; // RTX 4xxx
    else if (/rtx\s*3\d{3}/.test(gpuString))
      gpuScore += 38; // RTX 3xxx
    else if (/rtx\s*2\d{3}/.test(gpuString))
      gpuScore += 35; // RTX 2xxx
    else gpuScore += 34; // Любой неизвестный RTX (будущие серии) → HIGH
  }
  // NVIDIA GTX
  else if (gpuString.includes("gtx")) {
    if (gpuString.includes("16")) gpuScore += 30;
    else if (gpuString.includes("10")) gpuScore += 28;
    else if (gpuString.includes("9")) gpuScore += 25;
    else gpuScore += 20;
  } else if (gpuString.includes("geforce")) gpuScore += 18;
  // AMD Radeon RX — точный regex, future-proof до RX 9xxx+
  else if (gpuString.includes("radeon") && gpuString.includes("rx")) {
    if (/rx\s*[89]\d{3}/.test(gpuString))
      gpuScore += 42; // RX 8xxx/9xxx (2025-2028)
    else if (/rx\s*7\d{3}/.test(gpuString))
      gpuScore += 38; // RX 7xxx
    else if (/rx\s*6\d{3}/.test(gpuString))
      gpuScore += 35; // RX 6xxx
    else if (/rx\s*5\d{3}/.test(gpuString))
      gpuScore += 28; // RX 5xxx
    else gpuScore += 25; // Любой неизвестный RX → HIGH
  }
  // AMD встроенная графика — мощные APU (Radeon 780M, 890M, 880M и будущие)
  else if (gpuString.includes("radeon") && /\d{3}m/.test(gpuString)) {
    const amdApu = gpuString.match(/(\d{3})m/);
    const apuNum = amdApu && amdApu[1] ? parseInt(amdApu[1]) : 0;
    if (apuNum >= 800)
      gpuScore += 28; // Radeon 890M, 880M (2024-2025)
    else if (apuNum >= 700)
      gpuScore += 25; // Radeon 780M (2023)
    else gpuScore += 18;
  } else if (gpuString.includes("radeon")) gpuScore += 18;
  // --- MOBILE GPU ---
  // MediaTek Immortalis — флагманские чипы Dimensity 9300/9400+ (2024-2028)
  else if (gpuString.includes("immortalis")) {
    gpuScore += 40;
  }

  // Snapdragon / Adreno — future-proof: Adreno X (ARM ноутбуки) и 9xx (2026-2028)
  else if (gpuString.includes("adreno")) {
    const match = gpuString.match(/adreno[^\d]*(\d+)/i);
    const num = match && match[1] ? parseInt(match[1]) : 0;
    if (/adreno\s*x/i.test(gpuString))
      gpuScore += 42; // Adreno X1/X2 (Snapdragon X Elite)
    else if (num >= 900)
      gpuScore += 42; // Adreno 9xx (2026-2028)
    else if (num >= 800)
      gpuScore += 38; // Adreno 830+ (Snapdragon 8 Elite)
    else if (num >= 740)
      gpuScore += 35; // Adreno 740/750 (SD 8 Gen 2/3)
    else if (num >= 730)
      gpuScore += 33; // Adreno 730 (SD 8 Gen 1)
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

  // Mali — future-proof: G900+ (2026-2028)
  else if (gpuString.includes("mali")) {
    const maliMatch = gpuString.match(/mali[^\dg]*g?(\d+)/i);
    const maliNum = maliMatch && maliMatch[1] ? parseInt(maliMatch[1]) : 0;
    if (maliNum >= 900)
      gpuScore += 35; // Mali-G9xx (future)
    else if (maliNum >= 78)
      gpuScore += 28; // Mali-G78, G77
    else if (maliNum >= 72)
      gpuScore += 24; // Mali-G76, G72
    else if (maliNum >= 68)
      gpuScore += 20; // Mali-G71, G68
    else if (maliNum >= 57)
      gpuScore += 12; // Mali-G57
    else if (maliNum >= 52)
      gpuScore += 12; // Mali-G52
    else if (maliNum >= 51)
      gpuScore += 7; // Mali-G51
    else if (maliNum >= 31)
      gpuScore += 6; // Mali-G31
    else if (gpuString.includes("g")) gpuScore += 8;
    else gpuScore += 5;
  }

  // Apple GPU — iOS не раскрывает номер чипа, определяем по UA + ядра + maxTextureSize
  else if (gpuString.includes("apple")) {
    const uaLower = navigator.userAgent.toLowerCase();
    const isMacUA =
      uaLower.includes("macintosh") || uaLower.includes("mac os x");
    const cores = specs.cpuCores;

    if (isMacUA) {
      // Apple Silicon Mac: M3/M4 = 10-12c, M2 = 8-10c, M1 = 8c
      if (cores >= 10)
        gpuScore += 40; // M3/M4+ (2023-2025+)
      else if (cores >= 8)
        gpuScore += 37; // M1/M2
      else gpuScore += 30;
    } else {
      // iPhone/iPad: все современные Apple = WebGL2 + maxTexSize 16384
      let maxTexSize = 0;
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
        if (gl) maxTexSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
      } catch (_) {
        /* silent */
      }

      const hasWebGL2 = specs.webglVersion.startsWith("WebGL 2");
      if (hasWebGL2 && maxTexSize >= 16384 && cores >= 6)
        gpuScore += 33; // A14+ (iPhone 12+)
      else if (hasWebGL2 && cores >= 6)
        gpuScore += 28; // A12/A13
      else if (hasWebGL2) gpuScore += 22;
      else gpuScore += 18; // A11 и старше
    }
  }

  // Intel — Arc future-proof (Battlemage+), фикс Intel Core Ultra Graphics
  else if (gpuString.includes("intel")) {
    if (gpuString.includes("arc"))
      gpuScore += 22; // Arc дискретные + будущие
    else if (gpuString.includes("iris") && gpuString.includes("xe"))
      gpuScore += 15; // Iris Xe
    else if (gpuString.includes("iris"))
      gpuScore += 10; // Iris Plus
    else if (gpuString.includes("uhd"))
      gpuScore += 5; // UHD (слабая встройка)
    else if (gpuString.includes("hd"))
      gpuScore += 3; // HD (очень старая)
    else gpuScore += 8; // Intel Core Ultra Graphics и другие неизвестные Intel → не штрафуем
  } else {
    gpuScore += 5; // Unknown GPU
  }

  score += Math.min(50, gpuScore);

  // Штраф для WebGL 1.0
  if (specs.webglVersion.startsWith("WebGL 1")) {
    score *= 0.85;
  }

  // 4. ШТРАФЫ для мобильных
  if (isMobile) {
    const isGamingMobile = gpuScore >= 33; // Adreno 630+ (36), Mali-G77+ (38), Apple A12+ (38), Immortalis (50)
    const isBudgetMobile = gpuScore < 20; // Mali-G52, PowerVR, Adreno <600

    if (!isGamingMobile) {
      if (isBudgetMobile) score *= 0.5;
      else score *= 0.7;
    }
  }

  // 5. КРИТИЧЕСКИЙ ШТРАФ для слабых интегрированных GPU
  // Фикс: Intel Core Ultra "Intel Graphics" (10+ ядер) и AMD Radeon APU НЕ штрафуются
  const isWeakIntegrated =
    gpuString.includes("intel hd") ||
    gpuString.includes("intel uhd") ||
    // Старый Intel Graphics: <= 8 ядер. Новые Core Ultra: 10+ ядер — не штрафуем
    (gpuString.includes("intel") &&
      gpuString.includes("graphics") &&
      !gpuString.includes("arc") &&
      !gpuString.includes("xe") &&
      specs.cpuCores <= 8) ||
    // Radeon без RX и без мощных APU серий
    (gpuString.includes("radeon") &&
      !gpuString.includes("rx") &&
      !/\d{3}m/.test(gpuString));

  if (isWeakIntegrated) {
    score *= 0.3;
  }

  score = Math.round(score);

  // 6. Определение TIER
  let tier: PerformanceTier;

  if (isMobile) {
    if (score >= 55) tier = "high";
    else if (score >= 35) tier = "medium";
    else tier = "low";
  } else {
    if (score >= 65) tier = "high";
    else if (score >= 35) tier = "medium";
    else tier = "low";
  }

  // Слабые интегрированные GPU = ВСЕГДА LOW
  if (isWeakIntegrated) {
    tier = "low";
    score = Math.min(score, 18);
  }

  cachedPerformance = { score, tier };

  if (process.env.NODE_ENV === "development") {
    console.log(
      `%c⚡ PERFORMANCE TIER: ${tier.toUpperCase()} | Score: ${score}`,
      "color: #00d9ff; font-weight: bold; font-size: 12px; padding: 4px 8px; background: #1a1a1a; border-radius: 4px;",
    );
    console.log("%c📊 Device Specs:", "color: #888; font-weight: bold;", {
      GPU: specs.gpu,
      RAM: specs.ram,
      CPU: `${specs.cpuCores} cores`,
      WebGL: specs.webglVersion,
      Mobile: isMobile,
    });
  }

  return cachedPerformance;
};
