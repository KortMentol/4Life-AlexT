// src/components/effects/FluidEffect.tsx

import { FluidInstance } from "@/context/FluidContext.types";
import { useFluid } from "@/hooks/useFluid";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useTheme } from "@/hooks/useTheme";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

const TRANSITION_START = "menu-transition-start";
const TRANSITION_COMPLETE = "menu-transition-complete";

const runIdle = (cb: () => void) => {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(cb);
  } else {
    setTimeout(cb, 0);
  }
};

// --- РУБИЛЬНИК ЭФФЕКТА (для быстрой отладки) ---
const DISABLE_FLUID_EFFECT = false;

// --- Конфигурации эффекта ---
const getFluidConfig = (tier: string, isMobile: boolean) => ({
  dyeResolution: isMobile ? 512 : 1024,
  simResolution: isMobile ? 150 : 256,
  densityDissipation: 1,
  velocityDissipation: isMobile ? 0.9 : 0.3,
  pressure: 0.01,
  pressureIterations: tier === "high" ? 50 : tier === "medium" ? 25 : 10,
  curl: isMobile ? 25 : 35,
  splatRadius: isMobile ? 0.18 : 0.22,
  splatForce: isMobile ? 6000 : 7000,
  shading: tier === "high" ? true : false,
  sunrays: tier === "high" ? true : false,
});

const getCommonConfig = (theme: string, isMobile: boolean, isTouchDevice: boolean) => {
  const isLightTheme = theme === "light";
  return {
    transparent: true,
    brightness: isMobile ? 1.1 : isLightTheme ? 0.9 : 0.7,
    colorPalette: isLightTheme
      ? ["#172554", "#1e3a8a", "#312e81", "#0b1945", "#283593"]
      : ["#2563eb", "#4f46e5", "#7c3aed", "#8b5cf6", "#6366f1"],
    colorful: true,
    colorUpdateSpeed: 10,
    hover: !isTouchDevice,
    backgroundColor: "#000000",
    inverted: false,
    bloom: isMobile && isLightTheme,
    bloomIterations: 6,
    bloomResolution: isMobile ? 128 : 196,
    bloomIntensity: isMobile ? 0.3 : 0.6,
    bloomThreshold: isMobile ? 0.4 : 0.7,
    bloomSoftKnee: isMobile ? 0.3 : 0.5,
    sunraysResolution: 196,
    sunraysWeight: 1.0,
    ...(isMobile && {
      paused: false,
      embedded: true,
      multipleSplats: 0,
    }),
  };
};

const FluidEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);
  const stopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef<boolean>(false);

  // ▼▼▼ ГЛАВНОЕ ИЗМЕНЕНИЕ: Получаем resetKey для принудительного обновления ▼▼▼
  const { setFluidInstance, resetKey } = useFluid();
  const { theme } = useTheme();
  const tier = usePerformanceTier();

  const isTouchDevice = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
    []
  );
  const isMobile = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    []
  );

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
    }, 5000);
  }, []);

  // Этот useEffect отвечает за создание и уничтожение всего эффекта.
  // Теперь он будет перезапускаться при изменении resetKey.
  useEffect(() => {
    if (!containerRef.current || DISABLE_FLUID_EFFECT) return;

    const currentContainer = containerRef.current;

    const initFluid = () => {
      if (!currentContainer) return;
      try {
        simulationRef.current = new WebGLFluidEnhanced(currentContainer);
        const fluidConfig = getFluidConfig(tier, isMobile);
        const commonConfig = getCommonConfig(theme, isMobile, isTouchDevice);
        simulationRef.current.setConfig({ ...fluidConfig, ...commonConfig });
        setFluidInstance(simulationRef.current as unknown as FluidInstance);
      } catch (error) {
        console.error("[FluidEffect] Initialization Error:", error);
      }
    };

    initFluid();

    return () => {
      try {
        if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
        if (simulationRef.current) {
          simulationRef.current.stop();
          simulationRef.current = null;
        }
        if (currentContainer) {
          currentContainer.innerHTML = "";
        }
        setFluidInstance(null);
        isRunningRef.current = false;
      } catch (error) {
        console.error("[FluidEffect] Cleanup Error:", error);
      }
    };
    // ▼▼▼ ГЛАВНОЕ ИЗМЕНЕНИЕ: Добавление resetKey в массив зависимостей ▼▼▼
  }, [setFluidInstance, theme, tier, isTouchDevice, isMobile, resetKey]);

  // Этот useEffect отвечает за взаимодействие с курсором/пальцем.
  useEffect(() => {
    if (DISABLE_FLUID_EFFECT) return;
    const mainElement = document.querySelector("main");
    if (!mainElement) return;

    let lastTouchEvent: TouchEvent | null = null;
    let touchInterval: NodeJS.Timeout | null = null;
    let animationFrameId: number | null = null;
    let lastMouseEvent: MouseEvent | null = null;

    const updateAnimation = () => {
      if (!lastMouseEvent) {
        animationFrameId = null;
        return;
      }
      handleEvent(lastMouseEvent);
      animationFrameId = null;
    };
    const throttledMouseMoveHandler = (event: MouseEvent) => {
      lastMouseEvent = event;
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(updateAnimation);
      }
    };
    function handleEvent(event: Event) {
      const target = event.target as HTMLElement;
      if (target?.closest?.('[data-parallax-section="true"]')) return;
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
            if (lastTouchEvent?.touches[0]) {
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
    const directEventTypes = ["mousedown", "mouseup", "touchstart", "touchmove", "touchend"];
    directEventTypes.forEach((type) => {
      mainElement.addEventListener(type, handleEvent, { passive: true });
    });
    mainElement.addEventListener("mousemove", throttledMouseMoveHandler as EventListener, { passive: true });

    return () => {
      if (touchInterval) clearInterval(touchInterval);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      directEventTypes.forEach((type) => mainElement.removeEventListener(type, handleEvent));
      mainElement.removeEventListener("mousemove", throttledMouseMoveHandler as EventListener);
    };
  }, [startAnimation, scheduleStopAnimation]);

  // Этот useEffect отвечает за паузу во время анимации меню.
  useEffect(() => {
    if (DISABLE_FLUID_EFFECT) return;
    const onStart = () => {
      if (simulationRef.current && isRunningRef.current) {
        simulationRef.current.stop();
        isRunningRef.current = false;
      }
    };
    const onComplete = () => {
      runIdle(() => startAnimation());
    };
    window.addEventListener(TRANSITION_START, onStart as EventListener);
    window.addEventListener(TRANSITION_COMPLETE, onComplete as EventListener);
    return () => {
      window.removeEventListener(TRANSITION_START, onStart as EventListener);
      window.removeEventListener(TRANSITION_COMPLETE, onComplete as EventListener);
    };
  }, [startAnimation]);

  if (DISABLE_FLUID_EFFECT) {
    return null;
  }

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
