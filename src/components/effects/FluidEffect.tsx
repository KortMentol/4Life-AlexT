import { FluidInstance } from "@/context/FluidContext.types";
import { useFluid } from "@/hooks/useFluid";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useTheme } from "@/hooks/useTheme";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";
import { useLocation } from "react-router-dom";

const TRANSITION_START = "menu-transition-start";
const TRANSITION_COMPLETE = "menu-transition-complete";

const runIdle = (cb: () => void) => {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(cb);
  } else {
    setTimeout(cb, 0);
  }
};

const DISABLE_FLUID_EFFECT = false;

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
      ?["#172554", "#1e3a8a", "#312e81", "#0b1945", "#283593"]
      :["#2563eb", "#4f46e5", "#7c3aed", "#8b5cf6", "#6366f1"],
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
    ...(isMobile && { paused: false, embedded: true, multipleSplats: 0 }),
  };
};

const FluidEffect: React.FC = () => {
  const tier = usePerformanceTier();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);
  const stopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef<boolean>(false);

  const { setFluidInstance, resetKey } = useFluid();
  const { theme } = useTheme();

  const isTouchDevice = useMemo(() => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,[]);
  const isMobile = useMemo(() => typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),[]);

  // SMART SLEEP MODE: True if on products page.
  const isSleepMode = location.pathname.startsWith('/products');

  const startAnimation = useCallback(() => {
    if (isSleepMode) return; // Never start if sleeping
    if (simulationRef.current && !isRunningRef.current) {
      simulationRef.current.start();
      isRunningRef.current = true;
    }
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  }, [isSleepMode]);

  const scheduleStopAnimation = useCallback(() => {
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    stopTimerRef.current = setTimeout(() => {
      if (simulationRef.current && isRunningRef.current) {
        simulationRef.current.stop();
        isRunningRef.current = false;
      }
    }, 5000);
  },[]);

  // INITIALIZATION - Runs ONCE. Context is preserved.
  useEffect(() => {
    if (!containerRef.current || DISABLE_FLUID_EFFECT) return;

    const initFluid = () => {
      if (!containerRef.current) return;
      try {
        simulationRef.current = new WebGLFluidEnhanced(containerRef.current);
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
        if (containerRef.current) containerRef.current.innerHTML = "";
        setFluidInstance(null);
        isRunningRef.current = false;
      } catch (error) {
        console.error("[FluidEffect] Cleanup Error:", error);
      }
    };
  },[setFluidInstance, theme, tier, isTouchDevice, isMobile, resetKey]);

  // HANDLE SLEEP MODE (Pause engine instantly when routing to /products)
  useEffect(() => {
    if (isSleepMode && simulationRef.current && isRunningRef.current) {
      simulationRef.current.stop();
      isRunningRef.current = false;
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    }
  },[isSleepMode]);

  // SYNTHETIC EVENTS LISTENER
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
      // CRITICAL CPU OPTIMIZATION: Early return if sleeping. Saves 120 function calls per second!
      if (isSleepMode) return;

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
          clientX: event.clientX, clientY: event.clientY,
          bubbles: true, cancelable: true, view: window,
          button: event.button, buttons: event.buttons,
        });
        canvas.dispatchEvent(mouseEvent);
      } else if (event instanceof TouchEvent) {
        const touch = event.touches[0] || event.changedTouches[0];
        if (!touch) return;
        const canvasRect = canvas.getBoundingClientRect();
        const isDirectCanvasTouch = touch.clientX >= canvasRect.left && touch.clientX <= canvasRect.right && touch.clientY >= canvasRect.top && touch.clientY <= canvasRect.bottom;
        if (event.type === "touchstart" && isDirectCanvasTouch) event.preventDefault();
        if (event.type === "touchmove") lastTouchEvent = event;
        
        const mouseEventType = event.type === "touchstart" ? "mousedown" : event.type === "touchend" ? "mouseup" : "mousemove";
        const mouseEvent = new MouseEvent(mouseEventType, {
          clientX: touch.clientX, clientY: touch.clientY,
          bubbles: true, cancelable: true, view: window,
          button: 0, buttons: event.type === "touchend" ? 0 : 1,
        });
        canvas.dispatchEvent(mouseEvent);
        
        if (event.type === "touchstart") {
          if (touchInterval) clearInterval(touchInterval);
          touchInterval = setInterval(() => {
            if (lastTouchEvent?.touches[0]) {
              const continuousEvent = new MouseEvent("mousemove", {
                clientX: lastTouchEvent.touches[0].clientX, clientY: lastTouchEvent.touches[0].clientY,
                bubbles: true, cancelable: true, view: window,
                button: 0, buttons: 1,
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

    const directEventTypes =["mousedown", "mouseup", "touchstart", "touchmove", "touchend"];
    directEventTypes.forEach((type) => mainElement.addEventListener(type, handleEvent, { passive: true }));
    mainElement.addEventListener("mousemove", throttledMouseMoveHandler as EventListener, { passive: true });

    return () => {
      if (touchInterval) clearInterval(touchInterval);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      directEventTypes.forEach((type) => mainElement.removeEventListener(type, handleEvent));
      mainElement.removeEventListener("mousemove", throttledMouseMoveHandler as EventListener);
    };
  },[startAnimation, scheduleStopAnimation, isSleepMode]); // Added isSleepMode to dependencies

  // Transition Pause Logic
  useEffect(() => {
    if (DISABLE_FLUID_EFFECT) return;
    const onStart = () => {
      if (simulationRef.current && isRunningRef.current) {
        simulationRef.current.stop();
        isRunningRef.current = false;
      }
    };
    const onComplete = () => {
      if (!isSleepMode) runIdle(() => startAnimation());
    };
    window.addEventListener(TRANSITION_START, onStart as EventListener);
    window.addEventListener(TRANSITION_COMPLETE, onComplete as EventListener);
    return () => {
      window.removeEventListener(TRANSITION_START, onStart as EventListener);
      window.removeEventListener(TRANSITION_COMPLETE, onComplete as EventListener);
    };
  }, [startAnimation, isSleepMode]);

  if (DISABLE_FLUID_EFFECT || tier !== 'high') return null;

  return (
    <div
      className="fixed inset-0 w-full pointer-events-none"
      style={{
        zIndex: -10,
        backgroundColor: "transparent",
        height: "100lvh",
        maxHeight: "100vh",
        // CSS optimization: entirely removes element from render tree when sleeping
        opacity: isSleepMode ? 0 : 1,
        visibility: isSleepMode ? 'hidden' : 'visible',
        transition: 'opacity 0.5s ease'
      }}
      aria-hidden={isSleepMode}
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default FluidEffect;