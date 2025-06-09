import React, { useEffect, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";
import { useFluid } from "./FluidContext";

const FluidEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);
  const { setFluidInstance } = useFluid();

  useEffect(() => {
    if (!containerRef.current) return;

    // Инициализация симуляции
    simulationRef.current = new WebGLFluidEnhanced(containerRef.current);

    // Определяем, является ли устройство мобильным
    const isMobile = window.innerWidth < 768 || 
                  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Настройка параметров с оптимизацией для мобильных устройств
    simulationRef.current.setConfig({
      colorPalette: ["#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#ec4899"],
      transparent: true,
      brightness: 0.7,
      densityDissipation: 0.98,
      velocityDissipation: 0.99,
      pressure: 0.8,
      pressureIterations: isMobile ? 16 : 20, // Меньше итераций на мобильных
      curl: 30,
      splatRadius: 0.25,
      splatForce: 6000,
      shading: true,
      colorful: true,
      colorUpdateSpeed: 10,
      hover: true,
      bloom: true,
      bloomIterations: isMobile ? 6 : 8, // Меньше итераций для мобильных
      bloomResolution: isMobile ? 196 : 256, // Меньше разрешение для мобильных
      bloomIntensity: 0.4,
      bloomThreshold: 0.8,
      bloomSoftKnee: 0.7,
      sunrays: true,
      sunraysResolution: isMobile ? 128 : 196, // Меньше разрешение для мобильных
      sunraysWeight: 0.6,
      dyeResolution: isMobile ? 768 : 1024, // Меньше разрешение для мобильных
      simResolution: isMobile ? 96 : 128, // Меньше разрешение для мобильных
    });

    // Запуск симуляции
    simulationRef.current.start();
    
    // Создаем начальные всплески только на десктопе
    if (!isMobile) {
      simulationRef.current.multipleSplats(3);
    }
    
    // Сохраняем экземпляр в контексте
    setFluidInstance(simulationRef.current);

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
        setFluidInstance(null);
      }
    };
  }, [setFluidInstance]);

  // Обработка событий мыши на main элементе
  useEffect(() => {
    const mainElement = document.querySelector("main");
    if (!mainElement) return;

    function handleEvent(event: Event) {
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
                  view: window
                }
              );
              canvas.dispatchEvent(mouseEvent);
              
              // Убираем рандомные всплески, оставляем только точное следование за пальцем
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

    return () => {
      eventTypes.forEach((eventType) => {
        mainElement.removeEventListener(eventType, handleEvent);
      });
    };
  }, []);

  return (
    <div
      className="fixed left-0 top-0 w-full h-full pointer-events-none"
      style={{
        zIndex: -1, // Позади всего контента
      }}
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default FluidEffect;
