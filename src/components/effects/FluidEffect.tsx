import { FluidInstance } from "@/context/FluidContext.types";
import { useFluid } from "@/hooks/useFluid";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useTheme } from "@/hooks/useTheme";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

// --- РУБИЛЬНИК ЭФФЕКТА ---
// Если true = эффект выключен, если false = эффект включен.
const DISABLE_FLUID_EFFECT = true;

/**
 * КОНФИГУРАЦИЯ ЭФФЕКТА ЖИДКОСТИ
 * Адаптируется под уровень производительности устройства: high, medium, low
 * Уровень определяется автоматически с помощью usePerformanceTier на основе характеристик устройства
 * @param {PerformanceTier} tier - Уровень производительности (high: 80+ очков, medium: 50-79 очков, low: 0-49 очков)
 * @param {boolean} isMobile - Флаг мобильного устройства
 */

const getFluidConfig = (tier: string, isMobile: boolean) => ({
  /** Разрешение текстуры красителя (пиксели) - чем больше, тем детальнее цвета, но больше нагрузка на GPU */
  dyeResolution: tier === "high" ? 1024 : tier === "medium" ? 512 : 256,
  /** Разрешение сетки физической симуляции (пиксели) - чем больше, тем точнее физика, но больше вычислений */
  simResolution: isMobile ? 128 : 256,
  /** Скорость затухания плотности (0.0-1.0) - чем ближе к 1.0, тем быстрее исчезают цвета */
  densityDissipation: 1,
  /** Скорость затухания скорости (0.0-1.0) - чем ближе к 1.0, тем быстрее останавливается движение */
  velocityDissipation: isMobile ? 0.4 : 0.01,
  /** Сила давления жидкости (0.0-1.0) - чем меньше, тем сильнее распространение волн */
  pressure: 0.01,
  /** Количество итераций расчета давления (1-50) - чем больше, тем точнее физика, но медленнее */
  pressureIterations: tier === "high" ? 50 : tier === "medium" ? 25 : 10,
  /** Сила завихрений (0-100) - чем больше, тем более закрученные формы */
  curl: isMobile ? 15 : 35,
  /** Радиус всплесков (0.0-1.0) - размер пятен при взаимодействии */
  splatRadius: isMobile ? 0.18 : 0.22,
  /** Сила всплесков (0-10000) - скорость распространения при взаимодействии */
  splatForce: isMobile ? 6000 : 7000,
  /** Объемное затенение - создает 3D эффект, но требует больше GPU */
  shading: tier === "high" ? true : false,
  /** Эффект солнечных лучей */
  sunrays: tier === "high" ? true : false,
});

/**
 * КОНФИГУРАЦИЯ ЭФФЕКТА ЖИДКОСТИ (Общие настройки)
 * Адаптивные настройки для разных устройств и тем
 */
const getCommonConfig = (theme: string, isMobile: boolean, isTouchDevice: boolean) => {
  const isLightTheme = theme === "light";
  return {
    /** Прозрачность фона - позволяет видеть контент под эффектом */
    transparent: true,
    /** Яркость эффекта - на мобильных выше для лучшей видимости */
    brightness: isMobile ? 1.1 : isLightTheme ? 0.9 : 0.7,
    /** Палитра цветов - адаптируется под светлую/темную тему */
    colorPalette: isLightTheme
      ? ["#172554", "#1e3a8a", "#312e81", "#0b1945", "#283593"]
      : ["#2563eb", "#4f46e5", "#7c3aed", "#8b5cf6", "#6366f1"],
    /** Многоцветность - включает смешивание цветов */
    colorful: true,
    /** Скорость смены цветов (1-10) - меньше на мобильных для экономии ресурсов */
    colorUpdateSpeed: isMobile ? 5 : 10,
    /** Реакция на наведение мыши - отключена на тач-устройствах */
    hover: !isTouchDevice,
    /** Цвет фона canvas */
    backgroundColor: "#000000",
    /** Инверсия цветов */
    inverted: false,
    /** Эффект свечения */
    bloom: isMobile && isLightTheme,
    /** Количество итераций bloom эффекта - меньше на мобильных */
    bloomIterations: 6,
    /** Разрешение bloom эффекта (пиксели) */
    bloomResolution: isMobile ? 128 : 196,
    /** Интенсивность свечения (0.0-1.0) */
    bloomIntensity: isMobile ? 0.3 : 0.6,
    /** Порог срабатывания bloom (0.0-1.0) */
    bloomThreshold: isMobile ? 0.4 : 0.7,
    /** Мягкость перехода bloom (0.0-1.0) */
    bloomSoftKnee: isMobile ? 0.3 : 0.5,
    /** Разрешение солнечных лучей (пиксели) */
    sunraysResolution: 196,
    /** Интенсивность солнечных лучей (0.0-1.0) */
    sunraysWeight: 1.0,
    /** Дополнительные оптимизации для мобильных устройств */
    ...(isMobile && {
      /** Состояние паузы - false для активного режима */
      paused: false,
      /** Встроенный режим - оптимизация для интеграции */
      embedded: true,
      /** Автоматические всплески - отключены для экономии ресурсов */
      multipleSplats: 0,
    }),
  };
};

const FluidEffect: React.FC = () => {
  if (DISABLE_FLUID_EFFECT) {
    return null;
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);
  const stopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef<boolean>(false);

  const { setFluidInstance } = useFluid();
  const { theme } = useTheme();
  const tier = usePerformanceTier();

  const isTouchDevice = useMemo(() => window.matchMedia("(pointer: coarse)").matches, []);
  const isMobile = useMemo(
    () => /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    []
  );

  // --- Animation Control --- //

  const startAnimation = useCallback(() => {
    if (simulationRef.current && !isRunningRef.current) {
      simulationRef.current.start();
      isRunningRef.current = true;
    }
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  }, []);

  const scheduleStopAnimation = useCallback(() => {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
    }
    stopTimerRef.current = setTimeout(() => {
      if (simulationRef.current && isRunningRef.current) {
        simulationRef.current.stop();
        isRunningRef.current = false;
      }
    }, 5000); // 5 seconds delay
  }, []);

  // --- Initialization and Cleanup --- //

  useEffect(() => {
    if (!containerRef.current) return;

    // Инициализация эффекта. Происходит немедленно, без задержек.
    const initFluid = () => {
      if (!containerRef.current) return;
      try {
        simulationRef.current = new WebGLFluidEnhanced(containerRef.current!);
        const fluidConfig = getFluidConfig(tier, isMobile);
        const commonConfig = getCommonConfig(theme, isMobile, isTouchDevice);

        simulationRef.current.setConfig({ ...fluidConfig, ...commonConfig });
        setFluidInstance(simulationRef.current as unknown as FluidInstance);

        console.log(`[FluidEffect] Initialized for theme: ${theme}`);
      } catch (error) {
        console.error('[FluidEffect] Initialization Error:', error);
      }
    };

    initFluid();

    // Функция очистки. Гарантированно выполняется перед следующей инициализацией.
    return () => {
      try {
        console.log(`[FluidEffect] Cleaning up for theme: ${theme}`);
        
        if (stopTimerRef.current) clearTimeout(stopTimerRef.current);

        if (simulationRef.current) {
          simulationRef.current.stop();
          simulationRef.current = null;
        }

        if (containerRef.current) {
          // Полная и надежная очистка контейнера.
          containerRef.current.innerHTML = '';
        }

        setFluidInstance(null);
        isRunningRef.current = false;
        console.log('[FluidEffect] Cleanup complete.');
      } catch (error) {
        console.error('[FluidEffect] Cleanup Error:', error);
      }
    };
  }, [setFluidInstance, theme, tier, isTouchDevice, isMobile]);

  // --- Event Handling --- //

  useEffect(() => {
    const mainElement = document.querySelector("main");
    if (!mainElement) return;

    let lastTouchEvent: TouchEvent | null = null;
    let touchInterval: NodeJS.Timeout | null = null;

    function handleEvent(event: Event) {
      if (!containerRef.current) return;
      const canvas = containerRef.current.querySelector("canvas");
      if (!canvas) return;

      startAnimation();
      if (["mouseup", "touchend", "mousemove"].includes(event.type)) {
        scheduleStopAnimation();
      }

      const debugElement = document.querySelector('[class*="debugContainer"]');
      if (debugElement && event.target && debugElement.contains(event.target as Node)) return;

      if (event instanceof MouseEvent) {
        const mouseEvent = new MouseEvent(event.type, {
          clientX: event.clientX,
          clientY: event.clientY,
          bubbles: true,
          cancelable: true,
          view: window,
          button: event.button,
          buttons: event.buttons,
        });
        canvas.dispatchEvent(mouseEvent);
      } else if (event instanceof TouchEvent) {
        const touch = event.touches[0] || event.changedTouches[0];
        if (!touch) return;

        const canvasRect = canvas.getBoundingClientRect();
        const isDirectCanvasTouch =
          touch.clientX >= canvasRect.left &&
          touch.clientX <= canvasRect.right &&
          touch.clientY >= canvasRect.top &&
          touch.clientY <= canvasRect.bottom;

        if (event.type === "touchstart" && isDirectCanvasTouch) event.preventDefault();
        if (event.type === "touchmove") lastTouchEvent = event;

        const mouseEventType =
          event.type === "touchstart" ? "mousedown" : event.type === "touchend" ? "mouseup" : "mousemove";
        const mouseEvent = new MouseEvent(mouseEventType, {
          clientX: touch.clientX,
          clientY: touch.clientY,
          bubbles: true,
          cancelable: true,
          view: window,
          button: 0,
          buttons: event.type === "touchend" ? 0 : 1,
        });
        canvas.dispatchEvent(mouseEvent);

        if (event.type === "touchstart") {
          if (touchInterval) clearInterval(touchInterval);
          touchInterval = setInterval(() => {
            if (lastTouchEvent && lastTouchEvent.touches[0]) {
              const continuousEvent = new MouseEvent("mousemove", {
                clientX: lastTouchEvent.touches[0].clientX,
                clientY: lastTouchEvent.touches[0].clientY,
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0,
                buttons: 1,
              });
              canvas.dispatchEvent(continuousEvent);
            }
          }, 16);
        } else if (event.type === "touchend") {
          if (touchInterval) clearInterval(touchInterval);
          touchInterval = null;
          lastTouchEvent = null;
        }
      }
    }

    const eventTypes = ["mousemove", "mousedown", "mouseup", "touchstart", "touchmove", "touchend"];
    eventTypes.forEach((eventType) => {
      mainElement.addEventListener(eventType, handleEvent, { passive: true, capture: false });
    });

    return () => {
      if (touchInterval) clearInterval(touchInterval);
      eventTypes.forEach((eventType) => mainElement.removeEventListener(eventType, handleEvent));
    };
  }, [startAnimation, scheduleStopAnimation]);

  return (
    <div
      className="fixed inset-0 w-full pointer-events-none"
      style={{
        zIndex: -1,
        backgroundColor: "transparent",
        height: "100lvh",
        maxHeight: "100vh",
      }}
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default FluidEffect;
