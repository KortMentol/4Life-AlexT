import { FluidInstance } from "@/context/FluidContext.types";
import { useFluid } from "@/hooks/useFluid";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useTheme } from "@/hooks/useTheme";
import React, { useEffect, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

/**
 * КОНФИГУРАЦИИ ЭФФЕКТА ЖИДКОСТИ ДЛЯ РАЗНЫХ УРОВНЕЙ ПРОИЗВОДИТЕЛЬНОСТИ
 *
 * Настройки оптимизированы для трех уровней производительности:
 * - high: Максимальное качество
 * - medium: Сбалансированные настройки
 * - low: Минимальные настройки
 */
const fluidConfigs = {
  high: {
    /** Разрешение сетки красителя - больше значение, качественнее эффект, но ниже производительность */
    dyeResolution: 1224,
    /** Разрешение сетки симуляции - больше значение, точнее физика, но ниже производительность */
    simResolution: 140,
    /** Скорость рассеивания плотности жидкости (0.0-1.0) - чем ближе к 0, тем дольше сохраняется цвет */
    densityDissipation: 0.8,
    /** Скорость рассеивания скорости жидкости (0.0-1.0) - чем ближе к 0, тем дольше движется жидкость */
    velocityDissipation: 0.1,
    /** Давление жидкости (0.0-1.0) - влияет на скорость распространения */
    pressure: 0.7,
    /** Количество итераций расчета давления - больше значение, точнее физика, но ниже производительность */
    pressureIterations: 10,
    /** Завихрение жидкости (0-100) - чем больше, тем более закрученные формы */
    curl: 20,
    /** Радиус всплесков (0.0-1.0) - размер пятен при клике/касании */
    splatRadius: 0.3,
    /** Сила всплесков (0-10000) - скорость распространения при клике/касании */
    splatForce: 5000,
    /** Включить затенение (true/false) - создает объемный эффект */
    shading: true,
    /** Включить эффект свечения (true/false) */
    bloom: false,
    /** Количество итераций эффекта свечения - больше значение, сильнее размытие, но ниже производительность */
    bloomIterations: 8,
    /** Разрешение эффекта свечения - больше значение, качественнее эффект, но ниже производительность */
    bloomResolution: 256,
    /** Интенсивность эффекта свечения (0.0-1.0) - сила свечения */
    bloomIntensity: 0.4,
    /** Порог эффекта свечения (0.0-1.0) - с какой яркости начинается свечение */
    bloomThreshold: 0.8,
    /** Плавность перехода эффекта свечения (0.0-1.0) */
    bloomSoftKnee: 0.7,
    /** Включить эффект лучей (true/false) */
    sunrays: true,
    /** Разрешение эффекта лучей - больше значение, качественнее эффект, но ниже производительность */
    sunraysResolution: 196,
    /** Интенсивность эффекта лучей (0.0-1.0) */
    sunraysWeight: 0.45,
  },
  medium: {
    /** Разрешение сетки красителя - оптимизировано для средней производительности */
    dyeResolution: 768,
    /** Разрешение сетки симуляции - сбалансированное значение */
    simResolution: 96,
    /** Скорость рассеивания плотности - немного быстрее для экономии ресурсов */
    densityDissipation: 0.97,
    /** Скорость рассеивания скорости - высокое значение для мобильных устройств */
    velocityDissipation: 0.98,
    /** Давление жидкости - снижено для экономии производительности */
    pressure: 0.7,
    /** Количество итераций расчета давления - оптимизировано */
    pressureIterations: 16,
    /** Завихрение жидкости - умеренное значение */
    curl: 15,
    /** Радиус всплесков - немного увеличен для лучшей видимости на мобильных */
    splatRadius: 0.3,
    /** Сила всплесков - снижена для экономии ресурсов */
    splatForce: 4500,
    /** Затенение включено для сохранения качества */
    shading: true,
    /** Эффект свечения отключен для экономии производительности */
    bloom: false,
    /** Количество итераций свечения - минимальное */
    bloomIterations: 6,
    /** Разрешение свечения - снижено */
    bloomResolution: 128,
    /** Интенсивность свечения - снижена */
    bloomIntensity: 0.3,
    /** Порог свечения - повышен */
    bloomThreshold: 0.9,
    /** Эффект лучей включен с минимальными настройками */
    sunrays: true,
    /** Разрешение лучей - минимальное */
    sunraysResolution: 128,
    /** Интенсивность лучей - снижена */
    sunraysWeight: 0.3,
  },
  low: {
    /** Разрешение сетки красителя - минимальное для слабых устройств */
    dyeResolution: 512,
    /** Разрешение сетки симуляции - минимальное */
    simResolution: 64,
    /** Скорость рассеивания плотности - быстрое рассеивание */
    densityDissipation: 0.96,
    /** Скорость рассеивания скорости - быстрое затухание */
    velocityDissipation: 0.97,
    /** Давление жидкости - минимальное */
    pressure: 0.6,
    /** Количество итераций расчета давления - минимальное */
    pressureIterations: 12,
    /** Завихрение жидкости - минимальное */
    curl: 10,
    /** Радиус всплесков - увеличен для компенсации низкого качества */
    splatRadius: 0.35,
    /** Сила всплесков - минимальная */
    splatForce: 3500,
    /** Затенение отключено для экономии производительности */
    shading: false,
    /** Эффект свечения отключен */
    bloom: false,
    /** Эффект лучей отключен */
    sunrays: false,
  },
};

const FluidEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);
  const { setFluidInstance } = useFluid();
  const { theme } = useTheme();
  const tier = usePerformanceTier();

  const isTouchDevice = React.useMemo(() => window.matchMedia("(pointer: coarse)").matches, []);
  const isMobile = React.useMemo(() => /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), []);

  useEffect(() => {
    if (!containerRef.current) return;

    simulationRef.current = new WebGLFluidEnhanced(containerRef.current);

    const isLightTheme = theme === "light";
    const config = fluidConfigs[tier];

    simulationRef.current.setConfig({
      ...config,
      transparent: true,
      brightness: isMobile ? 0.5 : (isLightTheme ? 0.7 : 0.6),
      colorPalette: isLightTheme
        ? ["#60a5fa", "#93c5fd", "#3b82f6", "#2563eb", "#1d4ed8"]
        : ["#2563eb", "#4f46e5", "#7c3aed", "#8b5cf6", "#6366f1"],
      colorful: true,
      colorUpdateSpeed: 8,
      hover: !isTouchDevice,
    });

    simulationRef.current.start();
    setFluidInstance(simulationRef.current as unknown as FluidInstance);

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
        setFluidInstance(null);
      }
    };
  }, [setFluidInstance, theme, tier, isTouchDevice, isMobile]);

  useEffect(() => {
    const mainElement = document.querySelector("main");
    if (!mainElement) return;

    let lastTouchEvent: TouchEvent | null = null;
    let touchInterval: NodeJS.Timeout | null = null;

    function handleEvent(event: Event) {
      if (!containerRef.current) return;
      
      const canvas = containerRef.current.querySelector("canvas");
      if (!canvas) return;

      if (event instanceof MouseEvent) {
        canvas.dispatchEvent(new MouseEvent(event.type, event));
      } else if (event instanceof TouchEvent) {
        const touch = event.touches[0] || event.changedTouches[0];
        if (!touch) return;

        // Сохраняем последнее touch-событие
        if (event.type === "touchmove") {
          lastTouchEvent = event;
        }

        // Основное событие для библиотеки
        const mouseEvent = new MouseEvent(
          event.type === "touchstart" ? "mousedown" : event.type === "touchend" ? "mouseup" : "mousemove",
          {
            clientX: touch.clientX,
            clientY: touch.clientY,
            bubbles: true,
            cancelable: true,
            view: window,
          }
        );
        canvas.dispatchEvent(mouseEvent);

        // ПРИНУДИТЕЛЬНОЕ ПОДДЕРЖАНИЕ СОСТОЯНИЯ
        if (event.type === "touchstart") {
          // Начинаем постоянное дублирование событий
          touchInterval = setInterval(() => {
            if (lastTouchEvent && lastTouchEvent.touches[0]) {
              const continuousEvent = new MouseEvent("mousemove", {
                clientX: lastTouchEvent.touches[0].clientX,
                clientY: lastTouchEvent.touches[0].clientY,
                bubbles: true,
                cancelable: true,
                view: window,
              });
              canvas.dispatchEvent(continuousEvent);
            }
          }, 16); // 60 FPS
        } else if (event.type === "touchend") {
          // Останавливаем дублирование
          if (touchInterval) {
            clearInterval(touchInterval);
            touchInterval = null;
          }
          lastTouchEvent = null;
        }
      }
    }

    const eventTypes = ["mousemove", "mousedown", "mouseup", "touchstart", "touchmove", "touchend"];
    eventTypes.forEach((eventType) => {
      // Все события passive: true чтобы НЕ блокировать скролл
      mainElement.addEventListener(eventType, handleEvent, { passive: true });
    });

    return () => {
      if (touchInterval) {
        clearInterval(touchInterval);
      }
      eventTypes.forEach((eventType) => {
        mainElement.removeEventListener(eventType, handleEvent);
      });
    };
  }, []);

  return (
    <div
      className="fixed inset-0 w-full pointer-events-none"
      style={{
        zIndex: -1,
        backgroundColor: "transparent",
        height: "100lvh", // фиксируем самую большую высоту визуального viewport
        maxHeight: "100vh", // фолбэк для старых браузеров
      }}
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default FluidEffect;
