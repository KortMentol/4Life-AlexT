/**
 * @module SectionFluidEffect
 * @description WebGL fluid эффект, ограниченный границами секции через WebGL scissor test.
 *
 * ОПТИМИЗАЦИЯ "ШВЕЙЦАРСКИЕ ЧАСЫ" (0% GPU в простое):
 * 1. Канвас физически не существует в DOM-дереве при первой загрузке или скролле без мыши (0% нагрузки).
 * 2. Инициализация и монтирование происходят мгновенно (<2ms) только при первом движении мыши (mousemove) внутри секции.
 * 3. Если мышь не двигается 4.5 секунды, канвас плавно угасает и полностью удаляется из DOM-дерева, освобождая VRAM.
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
  sectionRef: React.RefObject<HTMLElement>;
}

const SectionFluidEffect: React.FC<SectionFluidEffectProps> = ({ sectionRef }) => {
  const tier = usePerformanceTier();
  const { setFluidInstance, resetKey } = useFluid();

  // Жестко отключаем на тач-устройствах (мобилках)
  const isTouchDevice = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
    [],
  );

  // Читаем флаги оптимизации из стора
  const isFluidEnabled = useFeatureFlag("webglFluid", tier !== "low");
  const isPressureHigh = useFeatureFlag("webglFluidPressureHigh", tier === "high");
  const isSunrays = useFeatureFlag("webglFluidSunrays", tier === "high");
  const isShading = useFeatureFlag("webglFluidShading", tier !== "low");

  // Стейт физического присутствия канваса в DOM-дереве
  const [isMounted, setIsMounted] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainer(node);
  }, []);

  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRunningRef = useRef<boolean>(false);
  const isInViewportRef = useRef<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Плавный и быстрый запуск симуляции
  const startAnimation = useCallback(() => {
    if (simulationRef.current && !isRunningRef.current) {
      simulationRef.current.start();
      isRunningRef.current = true;
    }
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    setIsFadingOut(false);
  }, []);

  // Плавное угасание и ПОЛНОЕ удаление канваса из DOM
  const scheduleStopAnimation = useCallback(() => {
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);

    stopTimerRef.current = setTimeout(() => {
      setIsFadingOut(true);
      // Даем 500ms на плавный CSS-переход непрозрачности перед размонтированием
      stopTimerRef.current = setTimeout(() => {
        if (simulationRef.current && isRunningRef.current) {
          simulationRef.current.stop();
          isRunningRef.current = false;
        }
        setIsMounted(false); // Полностью вырезаем канвас из DOM
        setContainer(null);
      }, 500);
    }, 4500); // 4.5 секунды бездействия (идеально для LERP_DISSIPATION = 1.5)
  }, [setIsFadingOut, setContainer]);

  // ИНИЦИАЛИЗАЦИЯ И НАСТРОЙКА WEBGL (Реагирует на монтирование контейнера)
  useEffect(() => {
    if (isTouchDevice || !isFluidEnabled || !container || !isMounted) {
      setFluidInstance(null);
      return;
    }

    try {
      simulationRef.current = new WebGLFluidEnhanced(container);

      // Адаптивная конфигурация физики и разрешений
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
        colorPalette: ["#2563eb", "#4f46e5", "#7c3aed", "#8b5cf6", "#6366f1"], // Палитра Clinical Obsidian
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
      setFluidInstance(simulationRef.current as unknown as FluidInstance);

      if (isInViewportRef.current) {
        startAnimation();
      }
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
    isMounted,
    isFluidEnabled,
    isPressureHigh,
    isSunrays,
    isShading,
    tier,
    startAnimation,
  ]);

  // SCISSOR TEST (Ограничение области рендеринга видеокарты)
  useEffect(() => {
    const section = sectionRef.current;
    const simulation = simulationRef.current;
    if (!section || !simulation || !isFluidEnabled || !container || !isMounted) return;

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
  }, [sectionRef, isFluidEnabled, container, isMounted]);

  // INTERSECTION OBSERVER (Следит за присутствием секции на экране)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !isFluidEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInViewportRef.current = entry.isIntersecting;
          if (!entry.isIntersecting) {
            // Если секция ушла с экрана — мгновенно вырезаем канвас из DOM
            if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
            if (simulationRef.current && isRunningRef.current) {
              simulationRef.current.stop();
              isRunningRef.current = false;
            }
            setIsMounted(false);
          }
        });
      },
      { threshold: 0, rootMargin: "200px 0px 200px 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionRef, isFluidEnabled]);

  // СЛУШАТЕЛЬ МЫШИ (Монтирует канвас строго при первом движении мыши внутри секции)
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

      // Если канвас еще не примонтирован — монтируем его мгновенно
      if (!isMounted) {
        setIsMounted(true);
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
  }, [sectionRef, startAnimation, scheduleStopAnimation, isFluidEnabled, isMounted, container]);

  // ИНТЕГРАЦИЯ С ПЕРЕХОДАМИ СТРАНИЦ
  useEffect(() => {
    const onStart = () => {
      if (simulationRef.current && isRunningRef.current) {
        simulationRef.current.stop();
        isRunningRef.current = false;
      }
      setIsMounted(false);
    };
    window.addEventListener(TRANSITION_START, onStart);
    return () => {
      window.removeEventListener(TRANSITION_START, onStart);
    };
  }, []);

  if (isTouchDevice || !isFluidEnabled) return null;

  return createPortal(
    <div
      className="fixed inset-0 w-full pointer-events-none"
      style={{
        zIndex: -11,
        height: "100lvh",
        maxHeight: "100vh",
        backgroundColor: "transparent",
        opacity: isMounted && !isFadingOut ? 1 : 0,
        transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      aria-hidden="true"
    >
      {isMounted && <div ref={containerRef} className="w-full h-full" />}
    </div>,
    document.body,
  );
};

export default SectionFluidEffect;
