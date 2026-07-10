/**
 * @module src/utils/devicePerformance/devicePerformance.ts
 * @description Production-ready система определения производительности устройства.
 * ИСПРАВЛЕНИЕ: Убрана дискриминация 6-ядерных процессоров Apple на iPhone для честного High Tier.
 * @author Kort
 * @version 4.2.0
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

  let gpu = typeof window !== "undefined" ? sessionStorage.getItem("4life_gpu") : null;
  let webglVersion = "Not Supported";

  if (!gpu) {
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
  } else {
    webglVersion = "WebGL 2.0 (WebGPU fallback)";
  }

  if (!gpu) gpu = "Unknown";

  const cpuFrequency = isMobile ? (cpuCores >= 8 ? "2.8 GHz" : "2.0 GHz") : cpuCores >= 8 ? "3.5 GHz" : "2.8 GHz";

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

export const calculatePerformanceScore = (specs: DeviceSpecs): { score: number; tier: PerformanceTier } => {
  if (cachedPerformance) return cachedPerformance;

  let score = 0;
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);

  // 1. RAM (max 25 баллов)
  let ramValue = parseFloat(specs.ram) || 4;

  if (isMobile && ramValue <= 4 && specs.cpuCores >= 8) {
    const gpuLower = specs.gpu.toLowerCase();
    const isFlagshipGpu =
      /adreno\s*6[3-9]\d/.test(gpuLower) ||
      /adreno\s*[789]\d\d/.test(gpuLower) ||
      /adreno\s*x/i.test(gpuLower) ||
      gpuLower.includes("immortalis") ||
      gpuLower.includes("mali-g7") ||
      gpuLower.includes("mali g7") ||
      gpuLower.includes("mali-g8") ||
      gpuLower.includes("mali g8") ||
      gpuLower.includes("apple");
    if (isFlagshipGpu) ramValue = 6;
  }

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

  if (specs.webglVersion.startsWith("WebGL 2") || specs.webglVersion === "WebGPU") {
    gpuScore += 10;
  } else if (specs.webglVersion.startsWith("WebGL 1")) {
    gpuScore += 5;
  }

  // --- DESKTOP GPU ---

  if (gpuString.includes("rtx")) {
    if (/rtx\s*[56]\d{3}/.test(gpuString)) gpuScore += 45;
    else if (/rtx\s*4\d{3}/.test(gpuString)) gpuScore += 40;
    else if (/rtx\s*3\d{3}/.test(gpuString)) gpuScore += 38;
    else if (/rtx\s*2\d{3}/.test(gpuString)) gpuScore += 35;
    else gpuScore += 34;
  } else if (gpuString.includes("gtx")) {
    if (gpuString.includes("1660") || gpuString.includes("1655") || gpuString.includes("1650 ti")) gpuScore += 22;
    else if (gpuString.includes("16")) gpuScore += 20;
    else if (gpuString.includes("1080") || gpuString.includes("1070")) gpuScore += 20;
    else if (gpuString.includes("1060") || gpuString.includes("1050 ti")) gpuScore += 18;
    else if (gpuString.includes("10")) gpuScore += 15;
    else if (gpuString.includes("9")) gpuScore += 12;
    else gpuScore += 8;
  } else if (gpuString.includes("geforce")) gpuScore += 12;
  else if (gpuString.includes("radeon") && gpuString.includes("rx")) {
    if (/rx\s*[89]\d{3}/.test(gpuString)) gpuScore += 42;
    else if (/rx\s*7\d{3}/.test(gpuString)) gpuScore += 38;
    else if (/rx\s*6\d{3}/.test(gpuString)) gpuScore += 35;
    else if (/rx\s*5\d{3}/.test(gpuString)) gpuScore += 25;
    else gpuScore += 22;
  } else if (gpuString.includes("radeon") && /\d{3}m/.test(gpuString)) {
    const amdApu = gpuString.match(/(\d{3})m/);
    const apuNum = amdApu && amdApu[1] ? parseInt(amdApu[1]) : 0;
    if (apuNum >= 800) gpuScore += 28;
    else if (apuNum >= 700) gpuScore += 25;
    else gpuScore += 18;
  } else if (gpuString.includes("radeon")) gpuScore += 15;
  // --- MOBILE GPU ---
  else if (gpuString.includes("immortalis")) {
    gpuScore += 40;
  } else if (gpuString.includes("adreno")) {
    const match = gpuString.match(/adreno[^\d]*(\d+)/i);
    const num = match && match[1] ? parseInt(match[1]) : 0;
    if (/adreno\s*x/i.test(gpuString)) gpuScore += 42;
    else if (num >= 900) gpuScore += 42;
    else if (num >= 800) gpuScore += 38;
    else if (num >= 740) gpuScore += 35;
    else if (num >= 730) gpuScore += 33;
    else if (num >= 650) gpuScore += 28;
    else if (num >= 640) gpuScore += 24;
    else if (num >= 630) gpuScore += 22;
    else if (num >= 620) gpuScore += 20;
    else if (num >= 610) gpuScore += 18;
    else if (num >= 600) gpuScore += 16;
    else if (num >= 530) gpuScore += 12;
    else if (num >= 500) gpuScore += 10;
    else gpuScore += 6;
  } else if (gpuString.includes("mali")) {
    const maliMatch = gpuString.match(/mali[^\dg]*g?(\d+)/i);
    const maliNum = maliMatch && maliMatch[1] ? parseInt(maliMatch[1]) : 0;
    if (maliNum >= 900) gpuScore += 35;
    else if (maliNum >= 78) gpuScore += 28;
    else if (maliNum >= 72) gpuScore += 22;
    else if (maliNum >= 68) gpuScore += 18;
    else if (maliNum >= 57) gpuScore += 12;
    else if (maliNum >= 52) gpuScore += 10;
    else if (maliNum >= 51) gpuScore += 6;
    else if (maliNum >= 31) gpuScore += 5;
    else if (gpuString.includes("g")) gpuScore += 7;
    else gpuScore += 4;
  }
  // Apple GPU
  else if (gpuString.includes("apple")) {
    if (gpuString.includes("m4") || gpuString.includes("ultra")) {
      gpuScore += 45;
    } else if (gpuString.includes("m3") || gpuString.includes("max")) {
      gpuScore += 41;
    } else if (gpuString.includes("m2") || gpuString.includes("pro")) {
      gpuScore += 38;
    } else if (gpuString.includes("m1")) {
      gpuScore += 35;
    } else {
      // ИСПРАВЛЕНИЕ: На мобильных устройствах Apple (iPhone) видеокарта всегда мощная
      // и легко справляется с WebGL. Убираем дискриминацию по 6 ядрам процессора.
      if (isMobile) {
        gpuScore += 35; // Любой современный iPhone (A14+) имеет мощный GPU
      } else {
        const cores = specs.cpuCores;
        if (cores >= 10) gpuScore += 38;
        else if (cores >= 8) gpuScore += 33;
        else gpuScore += 22;
      }
    }
  } else if (gpuString.includes("snapdragon") || gpuString.includes("x elite") || gpuString.includes("x plus")) {
    gpuScore += 38;
  } else if (gpuString.includes("intel")) {
    if (gpuString.includes("arc")) gpuScore += 22;
    else if (gpuString.includes("iris") && gpuString.includes("xe")) gpuScore += 14;
    else if (gpuString.includes("iris")) gpuScore += 10;
    else if (gpuString.includes("uhd")) gpuScore += 4;
    else if (gpuString.includes("hd")) gpuScore += 2;
    else gpuScore += 6;
  } else {
    gpuScore += 5;
  }

  score += Math.min(50, gpuScore);

  if (specs.webglVersion.startsWith("WebGL 1")) {
    score *= 0.85;
  }

  if (isMobile) {
    const isGamingMobile = gpuScore >= 33;
    const isBudgetMobile = gpuScore < 20;

    if (!isGamingMobile) {
      if (isBudgetMobile) score *= 0.5;
      else score *= 0.7;
    }
  }

  const isWeakIntegrated =
    gpuString.includes("intel hd") ||
    gpuString.includes("intel uhd") ||
    (gpuString.includes("intel") &&
      gpuString.includes("graphics") &&
      !gpuString.includes("arc") &&
      !gpuString.includes("xe") &&
      specs.cpuCores <= 8) ||
    (gpuString.includes("radeon") && !gpuString.includes("rx") && !/\d{3}m/.test(gpuString));

  if (isWeakIntegrated) {
    score *= 0.3;
  }

  score = Math.round(score);

  let tier: PerformanceTier;

  if (isMobile) {
    if (score >= 55) tier = "high";
    else if (score >= 35) tier = "medium";
    else tier = "low";
  } else {
    if (score >= 78 && gpuScore >= 30) tier = "high";
    else if (score >= 40) tier = "medium";
    else tier = "low";
  }

  if (isWeakIntegrated) {
    tier = "low";
    score = Math.min(score, 18);
  }

  cachedPerformance = { score, tier };

  if (import.meta.env.DEV) {
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
