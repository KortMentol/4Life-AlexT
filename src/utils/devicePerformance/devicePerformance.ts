/**
 * @module src/utils/devicePerformance.ts
 * @description Предоставляет комплексную систему для определения производительности устройства пользователя.
 * Включает две основные функции: `detectDeviceSpecs` для сбора технических характеристик (RAM, CPU, GPU и т.д.)
 * и `calculatePerformanceScore` для вычисления итогового балла и присвоения уровня производительности ('low', 'medium', 'high').
 * Это позволяет адаптировать функционал приложения, например, отключая ресурсоемкие анимации на слабых устройствах.
 * @author Kort
 * @version 1.0.0
 * @usage
 * 1. `src/hooks/usePerformanceTier.ts`: Используется для определения уровня производительности и предоставления его через хук.
 * @example
 * import { detectDeviceSpecs, calculatePerformanceScore } from '@/utils/devicePerformance';
 *
 * const specs = detectDeviceSpecs();
 * const { tier } = calculatePerformanceScore(specs);
 *
 * if (tier === 'low') {
 *   // Отключить сложные анимации
 * }
 */

/**
 * @type PerformanceTier
 * @description Определяет уровень производительности устройства: 'low', 'medium', 'high'.
 */
export type PerformanceTier = "low" | "medium" | "high";

/**
 * @interface DeviceSpecs
 * @description Определяет структуру объекта с техническими характеристиками устройства, которые собираются функцией `detectDeviceSpecs`.
 */
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
  batteryLevel?: number;
  thermalState?: string;
}

/**
 * @function detectDeviceSpecs
 * @description Собирает подробные технические характеристики устройства, используя доступные Web API.
 * Включает информацию о RAM, CPU, GPU, WebGL, разрешении экрана, сетевом подключении и других параметрах.
 * Применяет эвристики для определения характеристик, которые не могут быть получены напрямую.
 * @returns {DeviceSpecs} Объект с техническими характеристиками устройства.
 */
export const detectDeviceSpecs = (): DeviceSpecs => {
  const canvas = document.createElement("canvas");
  const gl2 = canvas.getContext("webgl2") as WebGL2RenderingContext | null;
  const gl =
    gl2 ||
    (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
    (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

  let gpu = "Unknown";
  let webglVersion = "Not supported";

  /**
   * Определение WebGL версии и информации о GPU
   */
  if (gl) {
    // Определяем версию WebGL
    webglVersion = gl2 ? "WebGL 2.0" : "WebGL 1.0";

    // Получаем расширенную информацию о GPU
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      // Получаем информацию о рендерере и производителе
      const rendererInfo = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "Unknown";
      // const vendorInfo = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "Unknown";

      // Используем полученную информацию напрямую
      gpu = rendererInfo;
    }
  }

  // Определение RAM
  let ram = "Unknown";

  // Пытаемся получить информацию о RAM через современные API
  try {
    // Проверяем наличие API для определения памяти
    if ((navigator as any).deviceMemory) {
      const memoryGB = (navigator as any).deviceMemory;

      // Для десктопов уточняем информацию
      const isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isDesktop) {
        // На десктопах обычно больше RAM, чем показывает API
        if (memoryGB >= 8) {
          ram = "16 GB"; // Типичное значение для современных ПК
        } else if (memoryGB >= 4) {
          ram = "8 GB"; // Типичное значение для средних ПК
        } else {
          ram = `${memoryGB} GB`;
        }
      } else {
        ram = `${memoryGB} GB`;
      }
    } else {
      // Используем более точный алгоритм определения RAM по характеристикам устройства
      const cores = navigator.hardwareConcurrency || 4;
      const ua = navigator.userAgent.toLowerCase();
      const isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isDesktop) {
        // Определение RAM для десктопов
        if (cores >= 16) {
          ram = "32 GB"; // Высокопроизводительные системы
        } else if (cores >= 12) {
          ram = "16 GB"; // Производительные системы
        } else if (cores >= 8) {
          ram = "16 GB"; // Стандартные системы
        } else if (cores >= 6) {
          ram = "8 GB"; // Базовые системы
        } else {
          ram = "8 GB"; // Минимальные системы
        }
      } else {
        // Определение RAM для мобильных устройств
        if (ua.includes("iphone")) {
          // Определение RAM для iPhone
          if (ua.includes("iphone 15") || ua.includes("iphone 14")) {
            ram = "8 GB";
          } else if (ua.includes("iphone 13") || ua.includes("iphone 12")) {
            ram = "6 GB";
          } else {
            ram = "4 GB";
          }
        } else {
          // Определение RAM для Android и других устройств
          if (cores >= 8) {
            ram = "8 GB";
          } else if (cores >= 6) {
            ram = "6 GB";
          } else if (cores >= 4) {
            ram = "4 GB";
          } else {
            ram = "3 GB";
          }
        }
      }
    }
  } catch (e) {
    // Fallback при ошибке
    const cores = navigator.hardwareConcurrency || 4;
    if (cores >= 8) {
      ram = "8 GB";
    } else if (cores >= 6) {
      ram = "6 GB";
    } else if (cores >= 4) {
      ram = "4 GB";
    } else {
      ram = "2 GB";
    }
  }

  const cpuCores = navigator.hardwareConcurrency || 0;

  /**
   * Определение типа сетевого подключения
   */
  let connectionType = "Unknown";

  try {
    // Проверяем наличие Network Information API
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    if (connection) {
      // Используем стандартный API для определения типа соединения
      if (connection.type === "wifi") {
        connectionType = "WiFi";
      } else if (connection.type === "ethernet") {
        connectionType = "Ethernet";
      } else if (connection.effectiveType === "4g" && connection.type !== "cellular") {
        // Часто WiFi определяется как 4g
        connectionType = "WiFi";
      } else if (connection.effectiveType) {
        // Используем effectiveType для мобильных соединений
        connectionType = connection.effectiveType.toUpperCase();
      } else if (connection.type) {
        // Используем тип соединения, если доступен
        connectionType = connection.type;
      }
    } else {
      // Если API недоступен, определяем по скорости загрузки ресурсов
      const isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if ("performance" in window && "getEntriesByType" in performance) {
        // Анализируем скорость загрузки ресурсов
        const resources = performance.getEntriesByType("resource");
        if (resources.length > 0) {
          let totalSize = 0;
          let totalTime = 0;
          let validEntries = 0;

          // Анализируем несколько последних загруженных ресурсов
          for (let i = 0; i < Math.min(resources.length, 10); i++) {
            const resource = resources[i] as PerformanceResourceTiming;
            if (resource.transferSize && resource.duration) {
              totalSize += resource.transferSize;
              totalTime += resource.duration;
              validEntries++;
            }
          }

          // Рассчитываем скорость загрузки
          if (validEntries > 0 && totalTime > 0) {
            const speedMbps = (totalSize * 8) / (totalTime * 1000); // Скорость в Мбит/с

            // Определяем тип соединения по скорости
            if (speedMbps > 50) {
              connectionType = "Ethernet"; // Высокоскоростное проводное соединение
            } else if (speedMbps > 10) {
              connectionType = "WiFi"; // Быстрый WiFi
            } else if (speedMbps > 2) {
              connectionType = "4G"; // Скорость как у 4G
            } else if (speedMbps > 0.5) {
              connectionType = "3G"; // Скорость как у 3G
            } else {
              connectionType = "2G"; // Медленное соединение
            }
          } else {
            // Если не удалось измерить скорость, используем значение по умолчанию
            connectionType = isDesktop ? "WiFi" : "4G";
          }
        } else {
          // Если нет данных о загруженных ресурсах
          connectionType = isDesktop ? "WiFi" : "4G";
        }
      } else {
        // Если API Performance недоступен
        connectionType = isDesktop ? "WiFi" : "4G";
      }
    }
  } catch (e) {
    // Фоллбэк при ошибке - используем значение по умолчанию
    const isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    connectionType = isDesktop ? "WiFi" : "4G";
  }

  /**
   * Определение частоты процессора (CPU)
   */
  let cpuFrequency = "Variable";
  const ua = navigator.userAgent.toLowerCase();
  const isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  try {
    // Проверяем наличие современных API для форматирования
    if (typeof (window as any).Intl !== "undefined" && typeof (window as any).Intl.NumberFormat !== "undefined") {
      // Создаем форматтер для частоты
      const formatter = new (window as any).Intl.NumberFormat(undefined, {
        style: "unit",
        unit: "hertz",
        unitDisplay: "short",
        maximumFractionDigits: 1,
      });

      // Базовая частота для расчета
      let baseFrequency = 0;

      if (isDesktop) {
        // Пытаемся найти частоту в User Agent для десктопов
        const cpuRegex = /(?:CPU|Processor)(?:[^@]+)?(?:@\s*)?(\d+(?:\.\d+)?\s*[GM]Hz)/i;
        const cpuMatch = ua.match(cpuRegex);

        if (cpuMatch && cpuMatch[1]) {
          // Если нашли частоту в User Agent
          cpuFrequency = cpuMatch[1].replace(/\s+/g, "");
        } else {
          // Иначе определяем по количеству ядер
          if (cpuCores >= 16) {
            baseFrequency = 3.5 * 1e9; // Высокопроизводительные системы
          } else if (cpuCores >= 12) {
            baseFrequency = 3.3 * 1e9; // Производительные системы
          } else if (cpuCores >= 8) {
            baseFrequency = 3.2 * 1e9; // Стандартные системы
          } else if (cpuCores >= 6) {
            baseFrequency = 3.0 * 1e9; // Базовые системы
          } else if (cpuCores >= 4) {
            baseFrequency = 2.8 * 1e9; // Минимальные системы
          } else {
            baseFrequency = 2.4 * 1e9; // Слабые системы
          }
        }
      } else {
        // Определение частоты для мобильных устройств по количеству ядер
        if (cpuCores >= 8) {
          baseFrequency = 2.8 * 1e9; // Высокопроизводительные мобильные устройства
        } else if (cpuCores >= 6) {
          baseFrequency = 2.2 * 1e9; // Производительные мобильные устройства
        } else if (cpuCores >= 4) {
          baseFrequency = 1.8 * 1e9; // Средние мобильные устройства
        } else {
          baseFrequency = 1.4 * 1e9; // Бюджетные мобильные устройства
        }
      }

      // Форматируем частоту в ГГц
      if (cpuFrequency === "Variable" && baseFrequency > 0) {
        cpuFrequency = formatter.format(baseFrequency).replace("Hz", "Hz");
      }
    } else {
      // Фоллбэк на стандартные значения по количеству ядер
      if (isDesktop) {
        // Значения для десктопов
        if (cpuCores >= 12) {
          cpuFrequency = "3.3 GHz";
        } else if (cpuCores >= 8) {
          cpuFrequency = "3.2 GHz";
        } else if (cpuCores >= 6) {
          cpuFrequency = "3.0 GHz";
        } else if (cpuCores >= 4) {
          cpuFrequency = "2.8 GHz";
        } else {
          cpuFrequency = "2.4 GHz";
        }
      } else {
        // Значения для мобильных устройств
        if (cpuCores >= 8) {
          cpuFrequency = "2.8 GHz";
        } else if (cpuCores >= 6) {
          cpuFrequency = "2.2 GHz";
        } else if (cpuCores >= 4) {
          cpuFrequency = "1.8 GHz";
        } else {
          cpuFrequency = "1.4 GHz";
        }
      }
    }
  } catch (e) {
    // Фоллбэк при ошибке - стандартные значения по количеству ядер
    if (isDesktop) {
      if (cpuCores >= 12) {
        cpuFrequency = "3.3 GHz";
      } else if (cpuCores >= 8) {
        cpuFrequency = "3.2 GHz";
      } else if (cpuCores >= 6) {
        cpuFrequency = "3.0 GHz";
      } else if (cpuCores >= 4) {
        cpuFrequency = "2.8 GHz";
      } else {
        cpuFrequency = "2.4 GHz";
      }
    } else {
      if (cpuCores >= 8) {
        cpuFrequency = "2.8 GHz";
      } else if (cpuCores >= 6) {
        cpuFrequency = "2.2 GHz";
      } else if (cpuCores >= 4) {
        cpuFrequency = "1.8 GHz";
      } else {
        cpuFrequency = "1.4 GHz";
      }
    }
  }

  return {
    ram,
    cpuCores,
    cpuFrequency,
    gpu: gpu.length > 50 ? gpu.substring(0, 47) + "..." : gpu,
    webglVersion,
    screenResolution: `${screen.width}×${screen.height}`,
    pixelRatio: window.devicePixelRatio,
    touchSupport: "ontouchstart" in window,
    connectionType,
    thermalState: "Normal",
  };
};

/**
 * @function calculatePerformanceScore
 * @description Рассчитывает итоговый балл производительности на основе собранных технических характеристик.
 * Присваивает баллы за каждый параметр (тип устройства, RAM, CPU, GPU и т.д.) и на основе суммы определяет
 * уровень производительности ('low', 'medium', 'high').
 * @param {DeviceSpecs} specs - Объект с характеристиками устройства, полученный от `detectDeviceSpecs`.
 * @returns {{score: number, tier: PerformanceTier}} Объект с итоговым баллом и уровнем производительности.
 */
export const calculatePerformanceScore = (specs: DeviceSpecs): { score: number; tier: PerformanceTier } => {
  let score = 0;

  /**
   * Определение типа устройства
   */
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isTablet = /ipad|android.*tablet/i.test(ua);
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isDesktop = !isMobile && !isTablet;

  /**
   * Базовые очки за тип платформы
   * Десктопы получают больше базовых очков, чем мобильные устройства
   */
  if (isDesktop) {
    score += 50; // Десктопы имеют больше вычислительной мощности
  } else if (isTablet) {
    score += 35; // Планшеты обычно мощнее смартфонов
  } else if (isIOS) {
    score += 30; // iOS устройства обычно оптимизированы лучше
  } else {
    score += 25; // Android и другие мобильные платформы
  }

  /**
   * Анализ оперативной памяти (RAM)
   * Больше RAM = выше производительность
   */
  const memory = (navigator as any).deviceMemory;
  if (memory) {
    // Используем API deviceMemory, если доступен
    if (memory >= 16)
      score += 35; // 16+ ГБ
    else if (memory >= 12)
      score += 30; // 12 ГБ
    else if (memory >= 8)
      score += 25; // 8 ГБ
    else if (memory >= 6)
      score += 20; // 6 ГБ
    else if (memory >= 4)
      score += 15; // 4 ГБ
    else if (memory >= 3)
      score += 10; // 3 ГБ
    else score += 5; // 2 ГБ или меньше
  } else {
    // Если API недоступен, оцениваем по количеству ядер процессора
    const cores = specs.cpuCores;
    if (cores >= 12)
      score += 25; // Много ядер = вероятно много RAM
    else if (cores >= 8)
      score += 20; // Современные устройства
    else if (cores >= 6)
      score += 15; // Средние устройства
    else if (cores >= 4)
      score += 12; // Базовые устройства
    else score += 8; // Слабые устройства
  }

  /**
   * Анализ процессора (CPU)
   * Оценка по количеству ядер
   */
  if (specs.cpuCores >= 16)
    score += 30; // Высокопроизводительные CPU
  else if (specs.cpuCores >= 12)
    score += 25; // Производительные CPU
  else if (specs.cpuCores >= 8)
    score += 20; // Стандартные современные CPU
  else if (specs.cpuCores >= 6)
    score += 15; // Средние CPU
  else if (specs.cpuCores >= 4)
    score += 12; // Базовые CPU
  else if (specs.cpuCores >= 2)
    score += 8; // Слабые CPU
  else score += 4; // Очень слабые CPU

  /**
   * Анализ графического процессора (GPU)
   * Оценка по поддержке WebGL и возможностям GPU
   */
  const canvas = document.createElement("canvas");
  const gl =
    (canvas.getContext("webgl2") as WebGL2RenderingContext | null) ||
    (canvas.getContext("webgl") as WebGLRenderingContext | null);

  if (gl) {
    // Базовая оценка по версии WebGL
    let gpuScore = gl instanceof WebGL2RenderingContext ? 15 : 8; // WebGL 2.0 даёт больше очков

    // Получаем дополнительную информацию о GPU
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL).toLowerCase();

      // Определение типа GPU по производителю
      let gpuTypeScore = 0;

      // Дискретные видеокарты NVIDIA
      if (vendor.includes("nvidia") || renderer.includes("nvidia")) {
        if (renderer.includes("rtx")) {
          gpuTypeScore = 25; // Высокопроизводительные RTX
        } else if (renderer.includes("gtx") || renderer.includes("geforce")) {
          gpuTypeScore = 20; // Производительные GTX
        } else if (renderer.includes("quadro")) {
          gpuTypeScore = 25; // Профессиональные Quadro
        } else {
          gpuTypeScore = 15; // Другие NVIDIA
        }
      }
      // Дискретные видеокарты AMD
      else if (
        vendor.includes("amd") ||
        renderer.includes("amd") ||
        renderer.includes("radeon") ||
        renderer.includes("ati")
      ) {
        if (renderer.includes("radeon")) {
          if (renderer.includes("rx")) {
            gpuTypeScore = 25; // Высокопроизводительные RX
          } else {
            gpuTypeScore = 20; // Другие Radeon
          }
        } else {
          gpuTypeScore = 15; // Другие AMD
        }
      }
      // Интегрированные и мобильные GPU
      else if (vendor.includes("intel") || renderer.includes("intel")) {
        if (renderer.includes("iris") || renderer.includes("xe")) {
          gpuTypeScore = 15; // Производительные Intel Iris/Xe
        } else if (renderer.includes("hd") || renderer.includes("uhd")) {
          gpuTypeScore = 10; // Intel HD/UHD
        } else {
          gpuTypeScore = 8; // Другие Intel
        }
      }
      // Мобильные GPU Qualcomm Adreno
      else if (renderer.includes("adreno")) {
        // Определяем модель Adreno по номеру
        const adrenoMatch = renderer.match(/adreno\s*(\d+)/i);
        const adrenoNumber = adrenoMatch ? parseInt(adrenoMatch[1]) : 0;

        if (adrenoNumber >= 600) {
          gpuTypeScore = 25; // Новейшие Adreno (600+)
        } else if (adrenoNumber >= 500) {
          gpuTypeScore = 20; // Современные Adreno (500+)
        } else if (adrenoNumber >= 300) {
          gpuTypeScore = 15; // Старые Adreno (300+)
        } else {
          gpuTypeScore = 10; // Очень старые Adreno
        }
      }
      // Мобильные GPU ARM Mali
      else if (renderer.includes("mali")) {
        // Определяем серию Mali
        if (
          renderer.includes("g7") ||
          renderer.includes("g57") ||
          renderer.includes("g77") ||
          renderer.includes("g78")
        ) {
          gpuTypeScore = 20; // Новые Mali G-серии
        } else if (renderer.includes("g")) {
          gpuTypeScore = 15; // Другие Mali G-серии
        } else if (renderer.includes("t")) {
          gpuTypeScore = 12; // Mali T-серии
        } else {
          gpuTypeScore = 10; // Старые Mali
        }
      }
      // Apple GPU
      else if (vendor.includes("apple") || renderer.includes("apple")) {
        gpuTypeScore = 20; // Apple GPU обычно очень производительны
      }
      // Общие признаки для неопределенных GPU
      else {
        if (renderer.includes("high") || renderer.includes("discrete") || renderer.includes("dedicated")) {
          gpuTypeScore = 20; // Высокопроизводительные GPU
        } else if (renderer.includes("integrated") || renderer.includes("graphics")) {
          gpuTypeScore = 10; // Интегрированные GPU
        } else if (renderer.includes("mobile") || renderer.includes("embedded")) {
          gpuTypeScore = 15; // Мобильные GPU
        } else {
          // Если не удалось определить тип, даем базовые очки
          gpuTypeScore = 10;
        }
      }

      // Добавляем очки за тип GPU
      gpuScore += gpuTypeScore;

      // Дополнительные очки за поддержку современных технологий
      let apiScore = 0;

      // Дополнительная проверка по типу устройства и модели GPU
      if (apiScore === 0) {
        // Для мобильных устройств
        if (!isDesktop) {
          // Современные Adreno поддерживают Vulkan
          if (renderer.includes("adreno")) {
            const adrenoMatch = renderer.match(/adreno\s*(\d+)/i);
            const adrenoNumber = adrenoMatch ? parseInt(adrenoMatch[1]) : 0;
            if (adrenoNumber >= 500) {
              apiScore = 10; // Adreno 500+ поддерживают Vulkan
            } else if (adrenoNumber >= 300) {
              apiScore = 5; // Adreno 300+ поддерживают современные API
            }
          }
          // Современные Mali поддерживают Vulkan
          else if (renderer.includes("mali")) {
            if (renderer.includes("g")) {
              apiScore = 10; // Mali G-серии поддерживают Vulkan
            } else if (renderer.includes("t")) {
              apiScore = 5; // Mali T-серии поддерживают современные API
            }
          }
          // Apple GPU поддерживают Metal
          else if (vendor.includes("apple") || renderer.includes("apple")) {
            apiScore = 10; // Apple GPU поддерживают Metal
          }
        }
        // Для десктопов
        else {
          // Современные NVIDIA поддерживают DirectX 12 и Vulkan
          if (vendor.includes("nvidia") || renderer.includes("nvidia")) {
            if (
              renderer.includes("rtx") ||
              renderer.includes("gtx 16") ||
              renderer.includes("gtx 10") ||
              renderer.includes("gtx 9")
            ) {
              apiScore = 10; // Современные NVIDIA поддерживают DX12/Vulkan
            } else {
              apiScore = 5; // Старые NVIDIA поддерживают современные API
            }
          }
          // Современные AMD поддерживают DirectX 12 и Vulkan
          else if (vendor.includes("amd") || renderer.includes("amd") || renderer.includes("radeon")) {
            if (renderer.includes("rx") || renderer.includes("vega") || renderer.includes("navi")) {
              apiScore = 10; // Современные AMD поддерживают DX12/Vulkan
            } else {
              apiScore = 5; // Старые AMD поддерживают современные API
            }
          }
          // Современные Intel поддерживают DirectX 12
          else if (vendor.includes("intel") || renderer.includes("intel")) {
            if (
              renderer.includes("iris") ||
              renderer.includes("xe") ||
              renderer.includes("uhd") ||
              renderer.includes("hd 6")
            ) {
              apiScore = 8; // Современные Intel поддерживают DX12
            } else {
              apiScore = 3; // Старые Intel поддерживают базовые API
            }
          }
        }
      }

      // Добавляем очки за поддержку API
      gpuScore += apiScore;
    }

    // Добавляем очки за GPU, но не более 35
    score += Math.min(35, gpuScore);
  }

  /**
   * Определение уровня производительности (tier)
   * На основе общего количества очков
   */
  let tier: PerformanceTier;

  // Пороговые значения для определения уровня
  if (score >= 80) {
    tier = "high"; // Высокая производительность
  } else if (score >= 50) {
    tier = "medium"; // Средняя производительность
  } else {
    tier = "low"; // Низкая производительность
  }

  return { score, tier };
};
