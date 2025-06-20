import { useTheme } from "@/context/useTheme";
import React, { useEffect, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";
import { FluidInstance } from "./FluidContext.types";
import { useFluid } from "./useFluid";

/**
 * Компонент FluidEffect - создает эффект жидкости на фоне сайта
 *
 * Это основной пульт управления эффектом жидкости на сайте.
 * Здесь собраны все настройки с подробными комментариями.
 */
const FluidEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);
  // Определяем характеристики устройства
  const isTouchDevice = React.useMemo(
    () => window.matchMedia('(pointer: coarse)').matches,
    []
  );
  // Для размеров и производительности всё ещё ориентируемся на ширину экрана
  const isNarrowViewport = React.useMemo(() => window.innerWidth < 768, []);
  // "Мобильное" в смысле лимитов производительности
  const isMobile = isTouchDevice || isNarrowViewport;
  const { setFluidInstance } = useFluid();
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Инициализация симуляции
    simulationRef.current = new WebGLFluidEnhanced(containerRef.current);

    // isMobile уже определён выше

    // Определяем, используется ли светлая тема
    const isLightTheme = theme === "light";

    /**
     * НАСТРОЙКИ ЭФФЕКТА ЖИДКОСТИ
     *
     * Полный список параметров с описанием и значениями для десктопа и мобильных устройств
     */
    simulationRef.current.setConfig({
      // ЦВЕТА И ПРОЗРАЧНОСТЬ

      /** Палитра цветов для жидкости (HEX формат) */
      colorPalette: isLightTheme
        ? ["#60a5fa", "#93c5fd", "#3b82f6", "#2563eb", "#1d4ed8"] // Нежные голубые оттенки для светлой темы
        : ["#2563eb", "#4f46e5", "#7c3aed", "#8b5cf6", "#6366f1"], // Глубокие синие и фиолетовые оттенки для темной темы

      /** Прозрачный фон (true) или цветной (false) */
      transparent: true, // Десктоп: true, Мобильные: true

      /** Яркость цветов (0.0-1.0) - меньше значение, меньше белых вспышек */
      brightness: isLightTheme ? (isMobile ? 0.7 : 0.6) : isMobile ? 0.7 : 0.55,

      // ФИЗИКА ЖИДКОСТИ

      /** Скорость рассеивания плотности жидкости (0.0-1.0) - чем ближе к 1, тем дольше сохраняется цвет */
      densityDissipation: isLightTheme ? 0.97 : 0.98, // Десктоп: 0.98, Мобильные: 0.97-0.98

      /** Скорость рассеивания скорости жидкости (0.0-1.0) - чем ближе к 1, тем дольше движется жидкость */
      velocityDissipation: isMobile ? 0.98 : 0.2, // Десктоп: 0.2, Мобильные: 0.98

      /** Давление жидкости (0.0-1.0) - влияет на скорость распространения */
      pressure: 0.8, // Десктоп: 0.8, Мобильные: 0.8

      /** Количество итераций расчета давления - больше значение, точнее физика, но ниже производительность */
      pressureIterations: isMobile ? 16 : 20, // Десктоп: 20, Мобильные: 16

      /** Завихрение жидкости (0-100) - чем больше, тем более закрученные формы */
      curl: isLightTheme ? 15 : 18, // Десктоп: 30, Мобильные: 30-35

      // ВСПЛЕСКИ (SPLATS)

      /** Радиус всплесков (0.0-1.0) - размер пятен при клике/касании */
      splatRadius: isLightTheme ? 0.2 : 0.25, // Десктоп: 0.25, Мобильные: 0.2-0.25

      /** Сила всплесков (0-10000) - скорость распространения при клике/касании */
      splatForce: isLightTheme ? 5000 : 5000, // Десктоп: 6000, Мобильные: 5000

      // ВИЗУАЛЬНЫЕ ЭФФЕКТЫ

      /** Включить затенение (true/false) - создает объемный эффект */
      shading: true, // Десктоп: true, Мобильные: true

      /** Включить автоматическую смену цветов (true/false) */
      colorful: true, // Десктоп: true, Мобильные: true

      /** Скорость смены цветов (1-30) - чем больше, тем быстрее меняются цвета */
      colorUpdateSpeed: isLightTheme ? 8 : 7, // Десктоп: 10, Мобильные: 12

      /** Включить взаимодействие при наведении курсора (true/false) */
      hover: !isTouchDevice, // Для устройств с мышью оставляем hover даже при узком экране

      // ЭФФЕКТ СВЕЧЕНИЯ (BLOOM)

      /** Включить эффект свечения (true/false) */
      bloom: false, // Десктоп: true, Мобильные: true

      /** Количество итераций эффекта свечения - больше значение, сильнее размытие, но ниже производительность */
      bloomIterations: isMobile ? 6 : 8, // Десктоп: 8, Мобильные: 6

      /** Разрешение эффекта свечения - больше значение, качественнее эффект, но ниже производительность */
      bloomResolution: isMobile ? 196 : 256, // Десктоп: 256, Мобильные: 196

      /** Интенсивность эффекта свечения (0.0-1.0) - сила свечения */
      bloomIntensity: isLightTheme ? 0.3 : 0.4, // Десктоп: 0.4, Мобильные: 0.3

      /** Порог эффекта свечения (0.0-1.0) - с какой яркости начинается свечение */
      bloomThreshold: isLightTheme ? 0.9 : 0.8, // Десктоп: 0.8, Мобильные: 0.9

      /** Плавность перехода эффекта свечения (0.0-1.0) */
      bloomSoftKnee: 0.7, // Десктоп: 0.7, Мобильные: 0.7

      // ЭФФЕКТ ЛУЧЕЙ (SUNRAYS)

      /** Включить эффект лучей (true/false) */
      sunrays: true, // Десктоп: true, Мобильные: true

      /** Разрешение эффекта лучей - больше значение, качественнее эффект, но ниже производительность */
      sunraysResolution: isMobile ? 128 : 196, // Десктоп: 196, Мобильные: 128

      /** Интенсивность эффекта лучей (0.0-1.0) */
      sunraysWeight: isLightTheme ? 0.5 : 0.45, // Десктоп: 0.6, Мобильные: 0.5

      // РАЗРЕШЕНИЕ СИМУЛЯЦИИ

      /** Разрешение сетки красителя - больше значение, качественнее эффект, но ниже производительность */
      dyeResolution: isMobile ? 768 : 1024, // Десктоп: 1024, Мобильные: 768

      /** Разрешение сетки симуляции - больше значение, точнее физика, но ниже производительность */
      simResolution: isMobile ? 96 : 128, // Десктоп: 128, Мобильные: 96
    });

    // Запуск симуляции
    simulationRef.current.start();

    // Сохраняем экземпляр в контексте для доступа из других компонентов
    setFluidInstance(simulationRef.current as unknown as FluidInstance);

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
        setFluidInstance(null);
      }
    };
  }, [setFluidInstance, theme]);

  // Обработка событий мыши и касаний на main элементе
  useEffect(() => {
    const isScrollingRef = { current: false } as { current: boolean };

    const mainElement = document.querySelector("main");
    if (!mainElement) return;

    function handleEvent(event: Event) {
      if (isScrollingRef.current) return; // Не создаём всплески пока идёт прокрутка

      if (containerRef.current) {
        const canvas = containerRef.current.querySelector("canvas");
        if (canvas) {
          if (event instanceof MouseEvent) {
            canvas.dispatchEvent(new MouseEvent(event.type, event));
          } else if (event instanceof TouchEvent) {
            // НЕ предотвращаем прокрутку, чтобы скроллинг работал нормально

            const touch = event.touches[0];
            if (touch) {
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
            }
          }
        }
      }
    }

    const eventTypes = ["mousemove", "mousedown", "mouseup", "touchstart", "touchmove", "touchend"];

    eventTypes.forEach((eventType) => {
      // Все события делаем passive: true, чтобы не блокировать скроллинг
      mainElement.addEventListener(eventType, handleEvent, { passive: true });
    });

    const cleanup = () => {
      eventTypes.forEach((eventType) => {
        mainElement.removeEventListener(eventType, handleEvent);
      });
    };

    return cleanup;
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
