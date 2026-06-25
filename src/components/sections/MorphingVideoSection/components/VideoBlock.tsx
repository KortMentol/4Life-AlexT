/**
 * @module src/components/sections/MorphingVideoSection/components/VideoBlock.tsx
 * @description Awwwards 2026 - Optimized Responsive Video Block.
 * PC is returned 1:1 to its original raw string transform. Touch has elite scroll-driven mappings.
 * @author Geminis AI & Kort
 */

import { usePerformanceTier } from "@/hooks";
import { useEffectsDebug } from "@/hooks/useEffectsDebug";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { BLOCK_CONFIG } from "../config";

interface VideoBlockProps {
  blockRef: React.RefObject<HTMLDivElement>;
  videoSrc: string;
  blockIndex: number;
  isTouchDevice: boolean;
}

export const VideoBlock: React.FC<VideoBlockProps> = ({ blockRef, videoSrc, blockIndex, isTouchDevice }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(!!window.__menuTransitionInProgress);
  const tier = usePerformanceTier();
  const efxFlags = useEffectsDebug();

  const isLow = tier === "low";

  // Динамически получаем высоту окна для pixel-perfect расчетов на тачах
  const [vh, setVh] = useState(typeof window !== "undefined" ? window.innerHeight : 800);
  useEffect(() => {
    if (typeof window === "undefined") return; // Ранний возврат для гигиены типов TypeScript
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ─── 1. НАСТРОЙКИ ОТСЛЕЖИВАНИЯ СКРОЛЛА ───
  // ПК и Тачи имеют свои независимые области трекинга
  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: isTouchDevice ? ["start 100%", "end 0%"] : ["start 90%", "end 10%"],
  });

  // ─── 2. ЛОГИКА ДЛЯ ДЕСКТОПА (ВОЗВРАЩЕНО К ОРИГИНАЛУ 1:1) ───
  const desktopTimings = useMemo(() => {
    const blockKey = `block${blockIndex + 1}` as keyof typeof BLOCK_CONFIG.desktopTimings;
    return BLOCK_CONFIG.desktopTimings[blockKey];
  }, [blockIndex]);

  const t = desktopTimings ?? BLOCK_CONFIG.desktopTimings.block1;

  // Оригинальные строковые 100% GPU-трансформации ПК-версии (без useSpring)
  const desktopRawY = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.stickStart, t.stickEnd, t.fadeOutStart, t.fadeOutEnd],
    ["100vh", "0vh", "0vh", "0vh", "0vh", "-100vh"],
  );

  const desktopRawOpacity = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.stickStart, t.stickEnd, t.fadeOutStart, t.fadeOutEnd],
    [0, 1, 1, 1, 1, 0],
  );

  const tzHigh = import.meta.env.DEV ? efxFlags.blockVideoTranslateZHigh : true;
  const tzVal = tier === "high" && tzHigh ? -400 : -200;

  const desktopTranslateZ = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.stickStart, t.stickEnd, t.fadeOutStart, t.fadeOutEnd],
    [tzVal, 0, 0, 0, 0, tzVal],
  );

  // ─── 3. ЛОГИКА ДЛЯ ТАЧ-УСТРОЙСТВ (1:1 Инженерный скролл-скраббинг) ───

  // =========================================================================
  // РУЧНЫЕ НАСТРОЙКИ АНИМАЦИИ ДЛЯ LOW / MEDIUM / HIGH НА ТАЧАХ
  // Все значения нормализованы от 0.0 (начало блока) до 1.0 (конец блока).
  // =========================================================================
  const TOUCH_CONFIG = {
    fadeInStart: 0.25, // Видео начинает плавно появляться раньше (было 0.35)
    fadeInEnd: 0.5, // Видео полностью проявляется в центре (разница старта и конца в 25% дает ультра-плавный выход)
    fadeOutStart: 0.75, // Видео начинает уходить вверх
    fadeOutEnd: 0.95, // Видео полностью исчезает
  };

  // Пиксельный трекинг Y на тачах для предотвращения падений физических пружин Framer Motion
  const touchRawY = useTransform(
    scrollYProgress,
    [TOUCH_CONFIG.fadeInStart, TOUCH_CONFIG.fadeInEnd, TOUCH_CONFIG.fadeOutStart, TOUCH_CONFIG.fadeOutEnd],
    [vh * 0.65, 0, 0, -vh * 0.65],
  );

  const touchRawOpacity = useTransform(
    scrollYProgress,
    [TOUCH_CONFIG.fadeInStart, TOUCH_CONFIG.fadeInEnd, TOUCH_CONFIG.fadeOutStart, TOUCH_CONFIG.fadeOutEnd],
    [0, 1, 1, 0],
  );

  // Пружины для Medium и High тиров тач-устройств
  const springConfigHigh = { stiffness: 180, damping: 28, mass: 1.2 };
  const springConfigMedium = { stiffness: 220, damping: 24, mass: 0.8 };

  const springYHigh = useSpring(touchRawY, springConfigHigh);
  const springYMedium = useSpring(touchRawY, springConfigMedium);

  // ─── 4. РАСПРЕДЕЛЕНИЕ ПАРАМЕТРОВ ПО УСТРОЙСТВАМ ───
  const y = useMemo(() => {
    if (!isTouchDevice) return desktopRawY; // ПК: Возвращен оригинальный жесткий трекинг
    if (isLow) return 0; // Low Touch: Статично в центре (0% JS-нагрузки на движение)
    if (tier === "high") return springYHigh; // High Touch: Плавный масляный занос
    return springYMedium; // Medium Touch: Отзывчивая пружина
  }, [isTouchDevice, isLow, tier, desktopRawY, springYHigh, springYMedium]);

  const opacity = useMemo(() => {
    if (!isTouchDevice) return desktopRawOpacity; // ПК: Оригинальный opacity
    return touchRawOpacity; // Тачи: Наша новая сверхплавная кривая появления
  }, [isTouchDevice, desktopRawOpacity, touchRawOpacity]);

  const translateZ = useMemo(() => {
    if (isTouchDevice) return 0; // На тачах 3D-глубина отключена для сохранения филлрейта GPU
    return desktopTranslateZ; // ПК: Оригинальная 3D-перспектива
  }, [isTouchDevice, desktopTranslateZ]);

  useEffect(() => {
    if (!isTransitioning) return;
    const handleComplete = () => setIsTransitioning(false);
    window.addEventListener("menu-transition-complete", handleComplete, { once: true });
    return () => window.removeEventListener("menu-transition-complete", handleComplete);
  }, [isTransitioning]);

  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;

    // Монтируем видео глубоко под экраном, чтобы избежать лага загрузки в момент появления
    const margin = isTouchDevice ? "350px" : "400px";
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry?.isIntersecting ?? false);
      },
      { threshold: 0, rootMargin: `${margin} 0px ${margin} 0px` },
    );

    observer.observe(block);
    return () => observer.disconnect();
  }, [blockRef, isTouchDevice]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
      style={{
        perspective: "1200px",
        height: isTouchDevice ? "100svh" : "100vh",
      }}
    >
      <motion.div
        style={{
          y,
          opacity,
          translateZ,
          backfaceVisibility: "hidden", // Гарантирует создание аппаратного композитного слоя
        }}
        className={`w-[90vw] max-w-[900px] lg:w-[55vw] pointer-events-auto ${!isTouchDevice ? "anti-pixel-snap" : ""}`}
      >
        {/* bg-[#03050a] создает непрозрачную физическую карточку, которая перекрывает текст под собой */}
        <div className="relative aspect-video overflow-hidden rounded-2xl gpu-mask-radius bg-[#03050a] border border-blue-500/20 shadow-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(/images/backgrounds/HomePage/img/${blockIndex + 1}.jpg)`,
              opacity: isTransitioning ? 1 : 0,
            }}
          />

          {isIntersecting && (
            <video
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload={tier === "high" ? "auto" : "metadata"}
              style={
                {
                  imageRendering: tier === "low" ? "auto" : "optimizeQuality",
                } as any
              }
            >
              {!isTransitioning && <source src={videoSrc} type="video/mp4" />}
            </video>
          )}

          {tier === "high" && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 mix-blend-overlay" />
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)",
                }}
              />
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
