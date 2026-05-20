/**
 * @module SectionFluidEffect
 * @description WebGL fluid эффект, ограниченный границами секции через WebGL scissor test.
 *
 * Архитектура:
 * - Canvas: position fixed, 100vw × 100vh — полноэкранный
 * - Физика: симулируется на весь viewport — жидкость проходит сквозь границы секции
 * - Рендер: WebGL scissor test обрезает вывод только внутри секции
 * - Портал в body — вне overflow:hidden родителей
 * - GPU: stop()/start() через IntersectionObserver с rootMargin 200px
 * - Оптимизация: один RAF для scissor, без clip-path, без bounds в шейдерах
 */

import { FluidInstance } from "@/context/FluidContext.types";
import { useEffectsDebug } from "@/hooks/useEffectsDebug";
import { useFluid } from "@/hooks/useFluid";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { useTheme } from "@/hooks/useTheme";
import WebGLFluidEnhanced from "@/lib/webgl-fluid/index";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

const getFluidConfig = (
  tier: string,
  isMobile: boolean,
  pressureHigh: boolean,
  sunrays: boolean,
  shading: boolean,
) => ({
  dyeResolution: isMobile ? 512 : 1024,
  simResolution: isMobile ? 150 : 256,
  densityDissipation: 1,
  velocityDissipation: isMobile ? 0.9 : 0.3,
  pressure: 0.01,
  pressureIterations: pressureHigh
    ? tier === "high"
      ? 50
      : tier === "medium"
        ? 25
        : 10
    : 20,
  curl: isMobile ? 25 : 35,
  splatRadius: isMobile ? 0.18 : 0.22,
  splatForce: isMobile ? 6000 : 7000,
  shading: tier === "high" && shading,
  sunrays: tier === "high" && sunrays,
});

const getCommonConfig = (
  theme: string,
  isMobile: boolean,
  isTouchDevice: boolean,
) => {
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
    ...(isMobile && { paused: false, embedded: true, multipleSplats: 0 }),
  };
};

interface SectionFluidEffectProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const SectionFluidEffect: React.FC<SectionFluidEffectProps> = ({
  sectionRef,
}) => {
  const tier = usePerformanceTier();
  const efxFlags = useEffectsDebug();
  const { theme } = useTheme();
  const { setFluidInstance, resetKey } = useFluid();

  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRunningRef = useRef<boolean>(false);
  const isInViewportRef = useRef<boolean>(false);
  const scissorRafRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const isTouchDevice = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches,
    [],
  );
  const isMobile = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ),
    [],
  );

  // РАННИЕ ВОЗВРАТЫ перенесены ВНИЗ — после всех хуков (Rules of Hooks).
  // Здесь только вычисления, которые нужны хукам ниже.

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
    }, 5000);
  }, []);

  /**
   * Обновляет WebGL scissor rect в RAF loop.
   * Scissor test — аппаратно ускоренная обрезка рендера.
   * Физика симулируется на весь viewport, рендер только внутри секции.
   */
  useEffect(() => {
    const section = sectionRef.current;
    const simulation = simulationRef.current;
    if (!section || !simulation) return;

    const updateScissor = () => {
      // Не вызываем getBoundingClientRect если секция вне viewport —
      // экономим forced layout каждый кадр
      if (!isInViewportRef.current) {
        scissorRafRef.current = requestAnimationFrame(updateScissor);
        return;
      }

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      // Проверяем, видна ли секция
      if (rect.bottom <= 0 || rect.top >= vh) {
        // Секция вне viewport — отключаем scissor (ничего не рендерим)
        simulation.clearScissor();
      } else {
        // Вычисляем пересечение секции с viewport
        const top = Math.max(0, rect.top);
        const bottom = Math.min(vh, rect.bottom);
        const left = Math.max(0, rect.left);
        const right = Math.min(window.innerWidth, rect.right);

        const width = right - left;
        const height = bottom - top;

        // WebGL координаты: y от НИЖНЕГО края
        const y = vh - bottom;

        // Устанавливаем scissor rect
        simulation.setScissor(left, y, width, height);
      }

      scissorRafRef.current = requestAnimationFrame(updateScissor);
    };

    scissorRafRef.current = requestAnimationFrame(updateScissor);

    return () => {
      if (scissorRafRef.current) {
        cancelAnimationFrame(scissorRafRef.current);
      }
      simulation.clearScissor();
    };
  }, [sectionRef]);

  // ИНИЦИАЛИЗАЦИЯ
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      simulationRef.current = new WebGLFluidEnhanced(container);
      const fluidConfig = getFluidConfig(
        tier,
        isMobile,
        import.meta.env.DEV ? efxFlags.webglFluidPressureHigh : true,
        import.meta.env.DEV ? efxFlags.webglFluidSunrays : true,
        import.meta.env.DEV ? efxFlags.webglFluidShading : true,
      );
      const commonConfig = getCommonConfig(theme, isMobile, isTouchDevice);
      simulationRef.current.setConfig({ ...fluidConfig, ...commonConfig });
      setFluidInstance(simulationRef.current as unknown as FluidInstance);
    } catch (error) {
      console.error("[SectionFluidEffect] Init Error:", error);
    }

    return () => {
      try {
        if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
        if (simulationRef.current) {
          simulationRef.current.stop();
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
    tier,
    isTouchDevice,
    isMobile,
    resetKey,
    efxFlags,
  ]);

  // INTERSECTION OBSERVER — прогрев 200px
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

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
  }, [sectionRef, startAnimation]);

  // СОБЫТИЯ МЫШИ — слушаем на секции
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let lastTouchEvent: TouchEvent | null = null;
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
      if (!containerRef.current) return;
      const canvas = containerRef.current.querySelector("canvas");
      if (!canvas) return;

      startAnimation();

      if (["mouseup", "touchend", "mousemove"].includes(event.type)) {
        scheduleStopAnimation();
      }

      if (event instanceof MouseEvent) {
        canvas.dispatchEvent(
          new MouseEvent(event.type, {
            clientX: event.clientX,
            clientY: event.clientY,
            bubbles: true,
            cancelable: true,
            view: window,
            button: event.button,
            buttons: event.buttons,
          }),
        );
      } else if (event instanceof TouchEvent) {
        const touch = event.touches[0] || event.changedTouches[0];
        if (!touch) return;
        if (event.type === "touchmove") lastTouchEvent = event;

        const mouseEventType =
          event.type === "touchstart"
            ? "mousedown"
            : event.type === "touchend"
              ? "mouseup"
              : "mousemove";
        canvas.dispatchEvent(
          new MouseEvent(mouseEventType, {
            clientX: touch.clientX,
            clientY: touch.clientY,
            bubbles: true,
            cancelable: true,
            view: window,
            button: 0,
            buttons: event.type === "touchend" ? 0 : 1,
          }),
        );

        if (event.type === "touchstart") {
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          const simulateMove = () => {
            if (lastTouchEvent?.touches[0] && canvas) {
              canvas.dispatchEvent(
                new MouseEvent("mousemove", {
                  clientX: lastTouchEvent.touches[0].clientX,
                  clientY: lastTouchEvent.touches[0].clientY,
                  bubbles: true,
                  cancelable: true,
                  view: window,
                  button: 0,
                  buttons: 1,
                }),
              );
              animationFrameId = requestAnimationFrame(simulateMove);
            }
          };
          animationFrameId = requestAnimationFrame(simulateMove);
        } else if (event.type === "touchend") {
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          lastTouchEvent = null;
        }
      }
    }

    const directEventTypes = [
      "mousedown",
      "mouseup",
      "touchstart",
      "touchmove",
      "touchend",
    ];
    directEventTypes.forEach((type) =>
      section.addEventListener(type, handleEvent, { passive: true }),
    );
    section.addEventListener(
      "mousemove",
      throttledMouseMoveHandler as EventListener,
      { passive: true },
    );

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      directEventTypes.forEach((type) =>
        section.removeEventListener(type, handleEvent),
      );
      section.removeEventListener(
        "mousemove",
        throttledMouseMoveHandler as EventListener,
      );
    };
  }, [sectionRef, startAnimation, scheduleStopAnimation]);

  // ПАУЗА при переходах между страницами
  useEffect(() => {
    const onStart = () => {
      if (simulationRef.current && isRunningRef.current) {
        simulationRef.current.stop();
        isRunningRef.current = false;
      }
    };
    const onComplete = () => {
      if (isInViewportRef.current) runIdle(() => startAnimation());
    };
    window.addEventListener(TRANSITION_START, onStart as EventListener);
    window.addEventListener(TRANSITION_COMPLETE, onComplete as EventListener);
    return () => {
      window.removeEventListener(TRANSITION_START, onStart as EventListener);
      window.removeEventListener(
        TRANSITION_COMPLETE,
        onComplete as EventListener,
      );
    };
  }, [startAnimation]);

  // ─── РАННИЕ ВОЗВРАТЫ — после всех хуков (Rules of Hooks соблюдены) ───
  if (isTouchDevice || tier !== "high") return null;
  if (import.meta.env.DEV && !efxFlags.webglFluid) return null;

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
