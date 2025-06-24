import { FluidInstance } from "@/context/FluidContext.types";
import { useFluid } from "@/hooks/useFluid";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useTheme } from "@/hooks/useTheme";
import React, { useEffect, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

const fluidConfigs = {
  high: {
    dyeResolution: 1024,
    simResolution: 128,
    densityDissipation: 0.98,
    velocityDissipation: 0.2,
    pressure: 0.8,
    pressureIterations: 20,
    curl: 18,
    splatRadius: 0.25,
    splatForce: 5000,
    shading: true,
    bloom: false,
    bloomIterations: 8,
    bloomResolution: 256,
    bloomIntensity: 0.4,
    bloomThreshold: 0.8,
    bloomSoftKnee: 0.7,
    sunrays: true,
    sunraysResolution: 196,
    sunraysWeight: 0.45,
  },
  medium: {
    dyeResolution: 768,
    simResolution: 96,
    densityDissipation: 0.97,
    velocityDissipation: 0.98,
    pressure: 0.7,
    pressureIterations: 16,
    curl: 15,
    splatRadius: 0.3,
    splatForce: 4500,
    shading: true,
    bloom: false,
    bloomIterations: 6,
    bloomResolution: 128,
    bloomIntensity: 0.3,
    bloomThreshold: 0.9,
    sunrays: true,
    sunraysResolution: 128,
    sunraysWeight: 0.3,
  },
  low: {
    dyeResolution: 512,
    simResolution: 64,
    densityDissipation: 0.96,
    velocityDissipation: 0.97,
    pressure: 0.6,
    pressureIterations: 12,
    curl: 10,
    splatRadius: 0.35,
    splatForce: 3500,
    shading: false,
    bloom: false,
    sunrays: false,
  },
};

const FluidEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);
  const { setFluidInstance } = useFluid();
  const { theme } = useTheme();
  const tier = usePerformanceTier();

  const isTouchDevice = React.useMemo(
    () => window.matchMedia("(pointer: coarse)").matches,
    [],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    simulationRef.current = new WebGLFluidEnhanced(containerRef.current);

    const isLightTheme = theme === "light";
    const config = fluidConfigs[tier];

    simulationRef.current.setConfig({
      ...config,
      transparent: true,
      brightness: isLightTheme ? 0.7 : 0.55,
      colorPalette: isLightTheme
        ? ["#60a5fa", "#93c5fd", "#3b82f6", "#2563eb", "#1d4ed8"]
        : ["#2563eb", "#4f46e5", "#7c3aed", "#8b5cf6", "#6366f1"],
      colorful: true,
      colorUpdateSpeed: 10,
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
  }, [setFluidInstance, theme, tier, isTouchDevice]);

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
              const mouseEvent = new MouseEvent(
                event.type === "touchstart"
                  ? "mousedown"
                  : event.type === "touchend"
                    ? "mouseup"
                    : "mousemove",
                {
                  clientX: touch.clientX,
                  clientY: touch.clientY,
                  bubbles: true,
                  cancelable: true,
                  view: window,
                },
              );
              canvas.dispatchEvent(mouseEvent);
            }
          }
        }
      }
    }

    const eventTypes = [
      "mousemove",
      "mousedown",
      "mouseup",
      "touchstart",
      "touchmove",
      "touchend",
    ];
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
