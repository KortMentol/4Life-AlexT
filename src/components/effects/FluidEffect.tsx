import React, { useEffect, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

const FluidEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Инициализация симуляции
    simulationRef.current = new WebGLFluidEnhanced(containerRef.current);

    // Настройка параметров
    simulationRef.current.setConfig({
      colorPalette: ["#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#ec4899"],
      transparent: true,
      brightness: 0.7,
      densityDissipation: 0.98,
      velocityDissipation: 0.99,
      pressure: 0.8,
      pressureIterations: 20,
      curl: 30,
      splatRadius: 0.25,
      splatForce: 6000,
      shading: true,
      colorful: true,
      colorUpdateSpeed: 10,
      hover: true,
      bloom: true,
      bloomIterations: 8,
      bloomResolution: 256,
      bloomIntensity: 0.4,
      bloomThreshold: 0.8,
      bloomSoftKnee: 0.7,
      sunrays: true,
      sunraysResolution: 196,
      sunraysWeight: 0.6,
    });

    // Запуск симуляции
    simulationRef.current.start();

    // Создаем начальные всплески
    simulationRef.current.multipleSplats(5);

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
    };
  }, []);

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
            const touch = event.touches[0];
            if (touch) {
              const rect = canvas.getBoundingClientRect();
              const mouseEvent = new MouseEvent(
                event.type === "touchstart" ? "mousedown" : event.type === "touchend" ? "mouseup" : "mousemove",
                {
                  clientX: touch.clientX - rect.left,
                  clientY: touch.clientY + window.scrollY - rect.top,
                  bubbles: true,
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
        zIndex: 1, // Позади контента
      }}
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default FluidEffect;
