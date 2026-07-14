/**
 * @module SectionFluidEffect
 * @description Оптимизированный WebGL fluid эффект с мягким засыпанием.
 * Внедрен принудительный однокадровый прогрев (Pre-compile & Link) шейдеров под прелоадером.
 * @author Geminis AI & Kort
 * @version 9.1.0
 */

import { FluidInstance } from "@/context/FluidContext.types";
import { useFeatureFlag } from "@/hooks/useEffectsDebug";
import { useFluid } from "@/hooks/useFluid";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { rafLoop } from "@/lib/rafLoop";
import WebGLFluidEnhanced from "@/lib/webgl-fluid/index";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const TRANSITION_START = "menu-transition-start";

interface SectionFluidEffectProps {
  sectionRef: React.RefObject<HTMLElement | null>;
}

const SectionFluidEffect: React.FC<SectionFluidEffectProps> = ({ sectionRef }) => {
  const tier = usePerformanceTier();
  const { setFluidInstance, resetFluid, resetKey } = useFluid();

  const isTouchDevice = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
    [],
  );

  const isFluidEnabled = useFeatureFlag("webglFluid", tier !== "low");
  const isPressureHigh = useFeatureFlag("webglFluidPressureHigh", tier === "high");
  const isSunrays = useFeatureFlag("webglFluidSunrays", tier === "high");
  const isShading = useFeatureFlag("webglFluidShading", tier !== "low");

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainer(node);
  }, []);

  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRunningRef = useRef<boolean>(false);
  const isInViewportRef = useRef<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);

  // Рефы для отслеживания времени сворачивания вкладки и мгновенного DOM-скрытия
  const outerWrapperRef = useRef<HTMLDivElement>(null);
  const tabHiddenTimeRef = useRef<number>(0);
  const wasRunningBeforeHideRef = useRef<boolean>(false);

  const startAnimation = useCallback(() => {
    if (simulationRef.current && !isRunningRef.current) {
      simulationRef.current.start();
      isRunningRef.current = true;
    }
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    setIsVisible(true);
  }, []);

  const scheduleStopAnimation = useCallback(() => {
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);

    // Мягкое засыпание через 4.5 секунды бездействия
    stopTimerRef.current = setTimeout(() => {
      setIsVisible(false); // Плавно гасим прозрачность через CSS Transition (0.5s)

      stopTimerRef.current = setTimeout(() => {
        if (simulationRef.current && isRunningRef.current) {
          simulationRef.current.stop(); // Останавливаем расчеты физики (0% GPU)
          isRunningRef.current = false;
        }
      }, 500);
    }, 4500);
  }, []);

  // ИНИЦИАЛИЗАЦИЯ И ОДНОКАДРОВЫЙ ПРОГРЕВ WEBGL ШЕЙДЕРОВ ПОД ЗАНАВЕСОМ
  useEffect(() => {
    if (isTouchDevice || !isFluidEnabled || !container) {
      setFluidInstance(null);
      return;
    }

    try {
      simulationRef.current = new WebGLFluidEnhanced(container);

      const fluidConfig = {
        dyeResolution: tier === "high" ? 1024 : 512,
        simResolution: 200,
        densityDissipation: 1.7,
        velocityDissipation: 0.2,
        pressure: 0.01,
        pressureIterations: isPressureHigh ? 40 : 15,
        curl: 30,
        splatRadius: 0.22,
        splatForce: 7000,
        shading: isShading,
        sunrays: isSunrays,
      };

      const commonConfig = {
        transparent: true,
        brightness: 0.7,
        colorPalette: ["#2563eb", "#4f46e5", "#7c3aed", "#8b5cf6", "#6366f1"],
        colorful: true,
        colorUpdateSpeed: 10,
        hover: true,
        backgroundColor: "#000000",
        inverted: false,
        bloom: false,
        sunraysResolution: 196,
        sunraysWeight: 1.0,
      };

      simulationRef.current.setConfig({ ...fluidConfig, ...commonConfig });

      // ─── РЕШЕНИЕ: Однокадровый принудительный прогрев (Warm-up) ───
      // Запускаем симуляцию на 1 кадр для мгновенной линковки шейдеров в VRAM,
      // пока прелоадер еще закрывает экран. Это убирает просадку FPS при первом скролле.
      simulationRef.current.start();
      requestAnimationFrame(() => {
        if (simulationRef.current) {
          simulationRef.current.stop(); // Мягко гасим расчеты, сохраняя скомпилированный контекст
          isRunningRef.current = false;
        }
      });

      setFluidInstance(simulationRef.current as unknown as FluidInstance);
    } catch (error) {
      console.error("[SectionFluidEffect] WebGL Init Error:", error);
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
        console.error("[SectionFluidEffect] WebGL Cleanup Error:", error);
      }
    };
  }, [
    setFluidInstance,
    isTouchDevice,
    resetKey,
    container,
    isFluidEnabled,
    isPressureHigh,
    isSunrays,
    isShading,
    tier,
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
    if (!section || !isFluidEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInViewportRef.current = entry.isIntersecting;
          if (!entry.isIntersecting) {
            if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
            if (simulationRef.current && isRunningRef.current) {
              simulationRef.current.stop();
              isRunningRef.current = false;
            }
            setIsVisible(false);
          }
        });
      },
      { threshold: 0, rootMargin: "200px 0px 200px 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionRef, isFluidEnabled]);

  // СЛУШАТЕЛЬ МЫШИ
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !isFluidEnabled) return;

    let animationFrameId: number | null = null;
    let lastMouseEvent: MouseEvent | null = null;

    const updateAnimation = () => {
      if (!lastMouseEvent) {
        animationFrameId = null;
        return;
      }

      const canvas = container?.querySelector("canvas");
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

  // ИНТЕГРАЦИЯ С ПЕРЕХОДАМИ СТРАНИЦ
  useEffect(() => {
    const onStart = () => {
      if (simulationRef.current && isRunningRef.current) {
        simulationRef.current.stop();
        isRunningRef.current = false;
      }
      setIsVisible(false);
    };
    window.addEventListener(TRANSITION_START, onStart);
    return () => {
      window.removeEventListener(TRANSITION_START, onStart);
    };
  }, []);

  // ИНТЕЛЛЕКТУАЛЬНЫЙ КОНТРОЛЬ СВЕРТЫВАНИЯ ВКЛАДКИ (VISIBILITY API)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabHiddenTimeRef.current = Date.now();
        wasRunningBeforeHideRef.current = isRunningRef.current;

        if (stopTimerRef.current) {
          clearTimeout(stopTimerRef.current);
          stopTimerRef.current = null;
        }
      } else {
        const timeAway = (Date.now() - tabHiddenTimeRef.current) / 1000;

        if (timeAway > 4.5 && wasRunningBeforeHideRef.current) {
          if (simulationRef.current && isRunningRef.current) {
            simulationRef.current.stop();
            isRunningRef.current = false;
          }

          if (outerWrapperRef.current) {
            outerWrapperRef.current.style.transition = "none";
            outerWrapperRef.current.style.opacity = "0";
          }

          setIsVisible(false);
          resetFluid();
        } else if (wasRunningBeforeHideRef.current) {
          if (simulationRef.current && !isRunningRef.current) {
            simulationRef.current.start();
            isRunningRef.current = true;
          }
          setIsVisible(true);
          scheduleStopAnimation();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [resetFluid, scheduleStopAnimation]);

  if (isTouchDevice || !isFluidEnabled) return null;

  return createPortal(
    <div
      ref={outerWrapperRef}
      className="fixed inset-0 w-full pointer-events-none"
      style={{
        zIndex: -11,
        height: "100lvh",
        maxHeight: "100vh",
        backgroundColor: "transparent",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: "translate3d(0, 0, 0)",
        willChange: "opacity",
      }}
      aria-hidden="true"
    >
      <div ref={containerRef} className="w-full h-full" />
    </div>,
    document.body,
  );
};

export default SectionFluidEffect;
