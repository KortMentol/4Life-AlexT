import { FluidInstance } from "@/context/FluidContext.types";
import { useFluid } from "@/hooks/useFluid";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useTheme } from "@/hooks/useTheme";
import React, { useEffect, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

/**
 * КОНФИГУРАЦИЯ ЭФФЕКТА ЖИДКОСТИ
 * Адаптируется под уровень производительности устройства: high, medium, low
 * Уровень определяется автоматически с помощью usePerformanceTier на основе характеристик устройства
 * @param {PerformanceTier} tier - Уровень производительности (high: 80+ очков, medium: 55-79 очков, low: 0-54 очков)
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
  velocityDissipation: 0.01,
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
  /** Эффект свечения */
  bloom: false,
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
    brightness: isMobile ? 1.0 : isLightTheme ? 0.9 : 0.7,
    /** Палитра цветов - адаптируется под светлую/темную тему */
    colorPalette: isLightTheme
      ? ["#0369a1", "#0891b2", "#1e40af", "#1d4ed8", "#0e7490"]
      : ["#2563eb", "#4f46e5", "#7c3aed", "#8b5cf6", "#6366f1"],
    /** Многоцветность - включает смешивание цветов */
    colorful: true,
    /** Скорость смены цветов (1-10) - меньше на мобильных для экономии ресурсов */
    colorUpdateSpeed: 8,
    /** Реакция на наведение мыши - отключена на тач-устройствах */
    hover: !isTouchDevice,
    /** Цвет фона canvas */
    backgroundColor: "#000000",
    /** Инверсия цветов */
    inverted: false,
    /** Количество итераций bloom эффекта - меньше на мобильных */
    bloomIterations: 6,
    /** Разрешение bloom эффекта (пиксели) */
    bloomResolution: 196,
    /** Интенсивность свечения (0.0-1.0) */
    bloomIntensity: 0.6,
    /** Порог срабатывания bloom (0.0-1.0) */
    bloomThreshold: 0.7,
    /** Мягкость перехода bloom (0.0-1.0) */
    bloomSoftKnee: 0.5,
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

const FluidEffect: React.FC = () => { // Fluid FPS Effect
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);
  const { setFluidInstance } = useFluid();
  const { theme } = useTheme();
  const tier = usePerformanceTier();

  const isTouchDevice = React.useMemo(() => window.matchMedia("(pointer: coarse)").matches, []);
  const isMobile = React.useMemo(
    () => /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    []
  );

  useEffect(() => {
    if (!containerRef.current) return;

    // Отложенная инициализация для мобильных устройств
    const initFluid = () => {
      try {
        simulationRef.current = new WebGLFluidEnhanced(containerRef.current!);

        // Получаем конфигурацию на основе уровня производительности и общих настроек
        const fluidConfig = getFluidConfig(tier, isMobile);
        const commonConfig = getCommonConfig(theme, isMobile, isTouchDevice);

        simulationRef.current.setConfig({
          ...fluidConfig,
          ...commonConfig,
        });

        simulationRef.current.start();
        setFluidInstance(simulationRef.current as unknown as FluidInstance);
        
        console.log('🌊 Fluid FPS Effect успешно инициализирован:', {
          tier,  // Уровень производительности из usePerformanceTier
          config: {
            ...fluidConfig,
            ...commonConfig
          },
          isMobile,
          isTouchDevice,
          canvas: containerRef.current?.querySelector('canvas')
        });
        
        // Отслеживаем производительность для аналитики
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'fluid_effect_initialized', {
            'event_category': 'performance',
            'event_label': tier,
            'value': tier === 'high' ? 3 : tier === 'medium' ? 2 : 1
          });
        }
      } catch (error) {
        console.error('❌ Ошибка инициализации FluidEffect:', error);
      }
    };

    // На мобильных устройствах даем время на загрузку DOM
    if (isMobile) {
      const timer = setTimeout(initFluid, 100);
      return () => clearTimeout(timer);
    } else {
      initFluid();
    }

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

      // Проверяем, что событие не происходит в области дебагера
      const debugElement = document.querySelector('[class*="debugContainer"]');
      if (debugElement && event.target && debugElement.contains(event.target as Node)) {
        return; // Игнорируем события из дебагера
      }

      if (event instanceof MouseEvent) {
        const mouseEvent = new MouseEvent(event.type, {
          clientX: event.clientX,
          clientY: event.clientY,
          bubbles: true,
          cancelable: true,
          view: window,
        });
        canvas.dispatchEvent(mouseEvent);
      } else if (event instanceof TouchEvent) {
        const touch = event.touches[0] || event.changedTouches[0];
        if (!touch) return;
        
        // Только для canvas взаимодействий, не блокируем скролл
        const canvasRect = canvas.getBoundingClientRect();
        const isDirectCanvasTouch = touch.clientX >= canvasRect.left && touch.clientX <= canvasRect.right &&
                                   touch.clientY >= canvasRect.top && touch.clientY <= canvasRect.bottom;
        
        // preventDefault только для touchstart на canvas для активации эффекта
        if (event.type === 'touchstart' && isDirectCanvasTouch) {
          event.preventDefault();
        }

        // Сохраняем последнее touch-событие для непрерывности
        if (event.type === "touchmove") {
          lastTouchEvent = event;
        }

        // Преобразуем touch в mouse события для WebGL библиотеки
        const mouseEventType = event.type === "touchstart" ? "mousedown" : 
                              event.type === "touchend" ? "mouseup" : "mousemove";
        
        const mouseEvent = new MouseEvent(mouseEventType, {
          clientX: touch.clientX,
          clientY: touch.clientY,
          bubbles: true,
          cancelable: true,
          view: window,
          // Добавляем дополнительные свойства для лучшей совместимости
          button: 0,
          buttons: event.type === "touchend" ? 0 : 1,
        });
        
        canvas.dispatchEvent(mouseEvent);

        // Система непрерывной передачи событий для плавности
        if (event.type === "touchstart") {
          // Очищаем предыдущий интервал если есть
          if (touchInterval) {
            clearInterval(touchInterval);
          }
          
          // Начинаем непрерывную передачу для поддержания активности
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
          }, 16); // 60 FPS для плавности
        } else if (event.type === "touchend") {
          // Завершаем непрерывную передачу
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
      // Все события passive для разрешения скролла
      mainElement.addEventListener(eventType, handleEvent, { 
        passive: true,
        capture: false 
      });
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
