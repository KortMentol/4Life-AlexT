/**
 * @module SectionFluidEffect
 * @description WebGL fluid эффект, ограниченный границами секции через WebGL scissor test.
 *
 * THE FIX:
 * - Внедрен паттерн Callback Ref для абсолютной реактивности холста.
 * - При выключении флага `isFluidEnabled` узел размонтируется, вызывая очистку и уничтожение WebGL контекста.
 * - При повторном включении холст рендерится заново без утечек памяти и зависших "зеленых кадров".
 */

import { FluidInstance } from "@/context/FluidContext.types";
import { useFeatureFlag } from "@/hooks/useEffectsDebug";
import { useFluid } from "@/hooks/useFluid";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useTheme } from "@/hooks/useTheme";
import { rafLoop } from "@/lib/rafLoop";
import WebGLFluidEnhanced from "@/lib/webgl-fluid/index";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const TRANSITION_START = "menu-transition-start";
const TRANSITION_COMPLETE = "menu-transition-complete";

const runIdle = (cb: () => void) => {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(cb);
  } else {
    setTimeout(cb, 0);
  }
};

const getCommonConfig = (theme: string) => {
  const isLightTheme = theme === "light";
  return {
    transparent: true,
    brightness: isLightTheme ? 0.9 : 0.7,
    colorPalette: isLightTheme
      ? ["#172554", "#1e3a8a", "#312e81", "#0b1945", "#283593"]
      : ["#2563eb", "#4f46e5", "#7c3aed", "#8b5cf6", "#6366f1"],
    colorful: true,
    colorUpdateSpeed: 10,
    hover: true,
    backgroundColor: "#000000",
    inverted: false,
    bloom: false,
    sunraysResolution: 196,
    sunraysWeight: 1.0,
  };
};

interface SectionFluidEffectProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const SectionFluidEffect: React.FC<SectionFluidEffectProps> = ({ sectionRef }) => {
  const tier = usePerformanceTier();
  const { theme } = useTheme();
  const { setFluidInstance, resetKey } = useFluid();

  // Жестко отключаем на тач-устройствах (мобилках)
  const isTouchDevice = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
    [],
  );

  // Читаем DEV-флаги
  const isFluidEnabled = useFeatureFlag("webglFluid", tier !== "low");
  const isPressureHigh = useFeatureFlag("webglFluidPressureHigh", tier === "high");
  const isSunrays = useFeatureFlag("webglFluidSunrays", tier === "high");
  const isShading = useFeatureFlag("webglFluidShading", tier === "high");

  // THE FIX: Callback Ref вместо useRef гарантирует, что мы получим живой DOM-узел
  // ровно в момент его монтирования/размонтирования, избегая race conditions.
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainer(node);
  }, []);

  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRunningRef = useRef<boolean>(false);
  const isInViewportRef = useRef<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);

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
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    stopTimerRef.current = setTimeout(() => {
      if (simulationRef.current && isRunningRef.current) {
        simulationRef.current.stop();
        isRunningRef.current = false;
      }
    }, 7000);
  }, []);

  // ИНИЦИАЛИЗАЦИЯ (Реагирует напрямую на монтирование контейнера)
  useEffect(() => {
    if (isTouchDevice || !isFluidEnabled || !container) {
      setFluidInstance(null);
      return;
    }

    try {
      simulationRef.current = new WebGLFluidEnhanced(container);

      const fluidConfig = {
        dyeResolution: 1024,
        simResolution: 200,
        densityDissipation: 1,
        velocityDissipation: 0.3,
        pressure: 0.01,
        pressureIterations: isPressureHigh ? 50 : 15,
        curl: 30,
        splatRadius: 0.22,
        splatForce: 7000,
        shading: isShading,
        sunrays: isSunrays,
      };

      const commonConfig = getCommonConfig(theme);
      simulationRef.current.setConfig({ ...fluidConfig, ...commonConfig });
      setFluidInstance(simulationRef.current as unknown as FluidInstance);

      if (isInViewportRef.current) startAnimation();
    } catch (error) {
      console.error("[SectionFluidEffect] Init Error:", error);
    }

    return () => {
      try {
        if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
        if (simulationRef.current) {
          simulationRef.current.destroy();
          simulationRef.current = null;
        }
        if (container) container.innerHTML = "";
        setFluidInstance(null);
        isRunningRef.current = false;
      } catch (error) {
        console.error("[SectionFluidEffect] Cleanup Error:", error);
      }
    };
  }, [
    setFluidInstance,
    theme,
    isTouchDevice,
    resetKey,
    container, // THE FIX: Жизненный цикл завязан на стейт контейнера
    isFluidEnabled,
    isPressureHigh,
    isSunrays,
    isShading,
    startAnimation,
  ]);

  // SCISSOR TEST
  useEffect(() => {
    const section = sectionRef.current;
    const simulation = simulationRef.current;
    if (!section || !simulation || !isFluidEnabled || !container) return;

    const updateScissor = () => {
      if (!isInViewportRef.current) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      if (rect.bottom <= 0 || rect.top >= vh) {
        simulation.clearScissor();
      } else {
        const top = Math.max(0, rect.top);
        const bottom = Math.min(vh, rect.bottom);
        const left = Math.max(0, rect.left);
        const right = Math.min(window.innerWidth, rect.right);

        simulation.setScissor(left, vh - bottom, right - left, bottom - top);
      }
    };

    const unsub = rafLoop.subscribe(updateScissor);
    return () => {
      unsub();
      simulation.clearScissor();
    };
  }, [sectionRef, isFluidEnabled, container]);

  // INTERSECTION OBSERVER
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !isFluidEnabled || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInViewportRef.current = entry.isIntersecting;
          setIsVisible(entry.isIntersecting);
          if (entry.isIntersecting) {
            runIdle(() => startAnimation());
          } else {
            if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
            if (simulationRef.current && isRunningRef.current) {
              simulationRef.current.stop();
              isRunningRef.current = false;
            }
          }
        });
      },
      { threshold: 0, rootMargin: "200px 0px 200px 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionRef, startAnimation, isFluidEnabled, container]);

  // MOUSE EVENTS
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !isFluidEnabled || !container) return;

    let animationFrameId: number | null = null;
    let lastMouseEvent: MouseEvent | null = null;

    const updateAnimation = () => {
      if (!lastMouseEvent) {
        animationFrameId = null;
        return;
      }
      const canvas = container.querySelector("canvas");
      if (canvas) {
        startAnimation();
        scheduleStopAnimation();
        canvas.dispatchEvent(
          new MouseEvent(lastMouseEvent.type, {
            clientX: lastMouseEvent.clientX,
            clientY: lastMouseEvent.clientY,
            bubbles: true,
            cancelable: true,
            view: window,
            button: lastMouseEvent.button,
            buttons: lastMouseEvent.buttons,
          }),
        );
      }
      animationFrameId = null;
    };

    const throttledMouseMoveHandler = (event: MouseEvent) => {
      lastMouseEvent = event;
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(updateAnimation);
      }
    };

    section.addEventListener("mousemove", throttledMouseMoveHandler, { passive: true });
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      section.removeEventListener("mousemove", throttledMouseMoveHandler);
    };
  }, [sectionRef, startAnimation, scheduleStopAnimation, isFluidEnabled, container]);

  // TRANSITIONS
  useEffect(() => {
    const onStart = () => {
      if (simulationRef.current && isRunningRef.current) {
        simulationRef.current.stop();
        isRunningRef.current = false;
      }
    };
    const onComplete = () => {
      if (isInViewportRef.current && isFluidEnabled && container) runIdle(() => startAnimation());
    };
    window.addEventListener(TRANSITION_START, onStart);
    window.addEventListener(TRANSITION_COMPLETE, onComplete);
    return () => {
      window.removeEventListener(TRANSITION_START, onStart);
      window.removeEventListener(TRANSITION_COMPLETE, onComplete);
    };
  }, [startAnimation, isFluidEnabled, container]);

  if (isTouchDevice || !isFluidEnabled) return null;

  return createPortal(
    <div
      className="fixed inset-0 w-full pointer-events-none"
      style={{
        zIndex: -11,
        height: "100lvh",
        maxHeight: "100vh",
        backgroundColor: "transparent",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
      aria-hidden="true"
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>,
    document.body,
  );
};

export default SectionFluidEffect;
