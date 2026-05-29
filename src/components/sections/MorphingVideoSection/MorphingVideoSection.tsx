/**
 * @module src/components/sections/MorphingVideoSection/MorphingVideoSection.tsx
 * @description AWWWARDS 2026 секция с тремя отдельными видео блоками и топовыми анимациями.
 * Версия 5.0.0: ПРОФЕССИОНАЛЬНЫЙ РЕФАКТОРИНГ - Единая система устройств и предсказуемые тайминги.
 * @author Kort
 * @version 5.0.0 - AWWWARDS Professional Architecture
 * @usage
 * 1. src/pages/HomePage.tsx - В основной секции "Почему 4Life?" для демонстрации преимуществ компании
 * @example
 * <MorphingVideoSection />
 */

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";

// Media imports
import productionVideo from "@/assets/videos/backgrounds/ProductsPage/Hero-section/bg-video-ProductsPage.mp4";

// Components
import { Button } from "@/components/ui";
import ScrollNumber from "@/components/ui/ScrollNumber";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import { Icons } from "@/utils/icons";

// Hooks
import SectionFluidEffect from "@/components/effects/SectionFluidEffect";
import { useParallaxLenis, usePerformanceTier } from "@/hooks";
import { useEffectsDebug } from "@/hooks/useEffectsDebug";
// Глобальные типы для GSAP
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    __menuTransitionInProgress?: boolean;
  }
}

// AWWWARDS ПРОФЕССИОНАЛЬНАЯ СИСТЕМА УСТРОЙСТВ
const useDeviceType = () => {
  return useMemo(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    return {
      isTouchDevice,
      isDesktop: !isTouchDevice,
    };
  }, []);
};

// AWWWARDS КОНФИГУРАЦИЯ БЛОКОВ - ЛЕГКО НАСТРАИВАТЬ!
const BLOCK_CONFIG = {
  // ВЫСОТЫ БЛОКОВ (vh = % от высоты экрана)
  heights: {
    touch: 180, // Все тач устройства (телефоны + планшеты)
    desktop: 200, // Только десктоп с мышкой
  },

  // ТАЙМИНГИ ДЛЯ ТАЧА (0.0 - 1.0) - НАСТРАИВАЙ ЗДЕСЬ! IMMERSIVE GARDEN STYLE
  touchTimings: {
    block1: {
      fadeInStart: 0.05, // Позже на 10% - после текста
      fadeInEnd: 0.55, // ТЯГУЧЕЕ появление (37% времени!)
      stickStart: 0.55, // Начало прилипания в центре
      stickEnd: 0.8, // Конец прилипания (20% времени)
      fadeOutStart: 0.8, // Начало исчезновения вверх
      fadeOutEnd: 0.999, // УЛЬТРА-ТЯГУЧЕЕ исчезновение (24.9% времени!)
    },
    block2: {
      fadeInStart: 0.05, // Позже на 10% //0.2
      fadeInEnd: 0.57, // ТЯГУЧЕЕ появление (37% времени!)
      stickStart: 0.57,
      stickEnd: 0.8, // Конец прилипания (18% времени)
      fadeOutStart: 0.8,
      fadeOutEnd: 0.999, // УЛЬТРА-ТЯГУЧЕЕ исчезновение (24.9% времени!)
    },
    block3: {
      fadeInStart: 0.05, // Позже на 10%
      fadeInEnd: 0.59, // ТЯГУЧЕЕ появление (37% времени!)
      stickStart: 0.59,
      stickEnd: 0.8, // Конец прилипания (16% времени)
      fadeOutStart: 0.8,
      fadeOutEnd: 0.999, // УЛЬТРА-ТЯГУЧЕЕ исчезновение (24.9% времени!)
    },
  },

  // ТАЙМИНГИ ДЛЯ ДЕСКТОПА (ХОРОШО НАСТРОЕННЫЕ - НЕ ТРОГАТЬ!)
  desktopTimings: {
    block1: {
      fadeInStart: 0.12,
      fadeInEnd: 0.47,
      stickStart: 0.47,
      stickEnd: 0.72,
      fadeOutStart: 0.72,
      fadeOutEnd: 0.985,
    },
    block2: {
      fadeInStart: 0.14,
      fadeInEnd: 0.49,
      stickStart: 0.49,
      stickEnd: 0.72,
      fadeOutStart: 0.72,
      fadeOutEnd: 0.985,
    },
    block3: {
      fadeInStart: 0.16,
      fadeInEnd: 0.51,
      stickStart: 0.51,
      stickEnd: 0.72,
      fadeOutStart: 0.72,
      fadeOutEnd: 0.985,
    },
  },
};

// Компонент для одного видео блока с AWWWARDS 2026 анимацией
const BlockVideo: React.FC<{
  blockRef: React.RefObject<HTMLDivElement>;
  videoSrc: string;
  blockIndex: number;
}> = ({ blockRef, videoSrc, blockIndex }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(!!window.__menuTransitionInProgress);
  const tier = usePerformanceTier();
  const efxFlags = useEffectsDebug();
  const { isTouchDevice } = useDeviceType();

  // Тайминги всегда вычисляем до любых условных return (Rules of Hooks)
  const timings = useMemo(() => {
    const blockKey = `block${blockIndex + 1}` as keyof typeof BLOCK_CONFIG.touchTimings;
    return isTouchDevice ? BLOCK_CONFIG.touchTimings[blockKey] : BLOCK_CONFIG.desktopTimings[blockKey];
  }, [blockIndex, isTouchDevice]);

  // Scroll progress для этого блока
  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: ["start 90%", "end 10%"],
  });

  // Все useTransform вызываем безусловно — Rules of Hooks
  const fallbackTimings = BLOCK_CONFIG.touchTimings.block1;
  const t = timings ?? fallbackTimings;

  const y = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.stickStart, t.stickEnd, t.fadeOutStart, t.fadeOutEnd],
    ["100vh", "0vh", "0vh", "0vh", "0vh", "-100vh"],
  );

  const opacity = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.stickStart, t.stickEnd, t.fadeOutStart, t.fadeOutEnd],
    [0, 1, 1, 1, 1, 0],
  );

  const tzHigh = import.meta.env.DEV ? efxFlags.blockVideoTranslateZHigh : true;
  // AWWWARDS 2026: Strictly disable translateZ on touch devices to prevent video scaling FPS drops
  const tzVal = isTouchDevice ? 0 : tier === "high" && tzHigh ? 400 : 200;
  const translateZ = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.stickStart, t.stickEnd, t.fadeOutStart, t.fadeOutEnd],
    [-tzVal, 0, 0, 0, 0, -tzVal],
  );

  // Обработка переходов меню
  useEffect(() => {
    if (!isTransitioning) return;
    const handleComplete = () => setIsTransitioning(false);
    window.addEventListener("menu-transition-complete", handleComplete, {
      once: true,
    });
    return () => window.removeEventListener("menu-transition-complete", handleComplete);
  }, [isTransitioning]);

  // Effect for video visibility (Lazy Mounting — предотвращает аллокацию 3 декодеров одновременно)
  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;

    const margin = isTouchDevice ? "100px" : "400px";
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry?.isIntersecting ?? false);
      },
      { threshold: 0, rootMargin: `${margin} 0px ${margin} 0px` },
    );

    observer.observe(block);

    return () => {
      observer.disconnect();
    };
  }, [blockRef, isTouchDevice]);

  return (
    <div
      className="fixed z-40 flex items-center justify-center pointer-events-none"
      style={{
        perspective: "1200px",
        // ПРОФИ ФИКС 2026: svh на тач = фиксированная высота без URL bar
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: isTouchDevice ? "100svh" : "100vh",
      }}
    >
      <motion.div
        style={{
          y,
          opacity,
          translateZ,
          // AWWWARDS 2026: Force stable GPU layer, remove dynamic will-change layout thrashing
          backfaceVisibility: "hidden",
        }}
        className={`w-[90vw] max-w-[900px] lg:w-[55vw] pointer-events-auto ${!isTouchDevice ? "anti-pixel-snap" : ""}`}
        transition={{
          type: "tween",
          duration: isTouchDevice ? 1.5 : 1.2,
          ease: [0.25, 0.1, 0.25, 1.0],
        }}
      >
        {/* ДОБАВЛЕН gpu-mask-radius ДЛЯ ИДЕАЛЬНЫХ УГЛОВ ПРИ СКРОЛЛЕ */}
        <div className="relative aspect-video overflow-hidden rounded-2xl gpu-mask-radius bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
          {/* Контейнер рамки вынесен ОТДЕЛЬНО от видео, чтобы не мерцать */}
          <div className="absolute inset-0 rounded-2xl border border-blue-500/0 z-10 pointer-events-none" />
          {/* Фоновое изображение */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(/images/backgrounds/HomePage/img/${blockIndex + 1}.jpg)`,
              opacity: isTransitioning ? 1 : 0,
            }}
          />

          {/* Видео - рендерится только когда карточка в зоне видимости */}
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
                } as React.CSSProperties
              }
            >
              {!isTransitioning && <source src={videoSrc} type="video/mp4" />}
            </video>
          )}

          {/* Современные overlay эффекты */}
          {tier === "high" && (
            <>
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/[0.02] via-transparent to-transparent pointer-events-none" />
              {/* Inner glow effect */}
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

// Компонент для 3D анимаций
const Grid3D: React.FC<{
  type: 1 | 2 | 3;
  triggerRef: React.RefObject<HTMLElement>;
  filterBlur?: boolean;
}> = ({ type, triggerRef, filterBlur = true }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supports3D = () => {
      const el = document.createElement("div");
      el.style.transform = "translate3d(0,0,0)";
      return el.style.transform !== "";
    };

    if (!window.gsap || !window.ScrollTrigger || window.innerWidth < 1024 || !supports3D()) return;

    const grid = gridRef.current;
    if (!grid) return;

    const gridWrap = grid.querySelector(".grid-wrap");
    const gridItems = grid.querySelectorAll(".grid__item");
    if (!gridWrap || !gridItems.length) return;

    let timeline: any;

    // ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ТЯЖЕЛОЙ МАТЕМАТИКИ
    const initGSAP = () => {
      const scrollTriggerConfig = {
        trigger: triggerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        ease: "none",
        invalidateOnRefresh: true,
      };

      switch (type) {
        case 1:
          grid.style.setProperty("--perspective", "1000px");
          grid.style.setProperty("--grid-inner-scale", "0.5");
          timeline = window.gsap
            .timeline({ scrollTrigger: scrollTriggerConfig })
            .set(gridWrap, { rotationY: 25, force3D: true })
            .set(gridItems, {
              z: () => window.gsap.utils.random(-1600, 200),
              force3D: true,
            })
            .fromTo(
              gridItems,
              { xPercent: () => window.gsap.utils.random(-1000, -500) },
              {
                xPercent: () => window.gsap.utils.random(500, 1000),
                ease: "none",
              },
            );
          break;
        case 2:
          grid.style.setProperty("--grid-width", "160%");
          grid.style.setProperty("--perspective", "2000px");
          grid.style.setProperty("--grid-inner-scale", "0.5");
          grid.style.setProperty("--grid-item-ratio", "0.8");
          grid.style.setProperty("--grid-columns", "6");
          grid.style.setProperty("--grid-gap", "14vw");

          timeline = window.gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: scrollTriggerConfig,
            })
            .set(gridWrap, { rotationX: 20, force3D: true })
            .set(gridItems, {
              z: () => window.gsap.utils.random(-3000, -1000),
              opacity: 0.3,
              force3D: true,
            })
            .fromTo(
              gridItems,
              {
                yPercent: () => window.gsap.utils.random(100, 1000),
                rotationY: -45,
                opacity: 0.3,
              },
              {
                ease: "power2",
                yPercent: () => window.gsap.utils.random(-1000, -100),
                rotationY: 45,
                opacity: 0.7,
              },
              0,
            )
            .fromTo(gridWrap, { rotationZ: -5 }, { rotationX: -20, rotationZ: 10, scale: 1.2 }, 0);
          break;
        case 3:
          grid.style.setProperty("--grid-width", "105%");
          grid.style.setProperty("--grid-columns", "8");
          grid.style.setProperty("--perspective", "1500px");
          grid.style.setProperty("--grid-inner-scale", "0.5");
          timeline = window.gsap
            .timeline({ scrollTrigger: scrollTriggerConfig })
            .set(gridItems, {
              transformOrigin: "50% 0%",
              z: () => window.gsap.utils.random(-5000, -2000),
              rotationX: () => window.gsap.utils.random(-65, -25),
              opacity: 0,
              force3D: true,
            })
            .to(gridItems, {
              xPercent: () => window.gsap.utils.random(-150, 150),
              yPercent: () => window.gsap.utils.random(-300, 300),
              rotationX: 0,
              opacity: 0.8,
              ease: "none",
            })
            .to(gridWrap, { z: 6500, ease: "none" }, 0);
          break;
      }
    };

    // AWWWARDS HACK: Если меню сейчас анимируется, откладываем GSAP
    if (window.__menuTransitionInProgress) {
      const onComplete = () => {
        initGSAP();
        window.removeEventListener("menu-transition-complete", onComplete);
      };
      window.addEventListener("menu-transition-complete", onComplete);
    } else {
      // Обычная загрузка - стартуем сразу
      initGSAP();
    }

    return () => {
      if (timeline) timeline.kill();
    };
  }, [type, triggerRef]);

  const imageCount = useMemo(() => (window.innerWidth >= 1024 ? 20 : 8), []);
  const images = useMemo(
    () => Array.from({ length: imageCount }, (_, i) => `/images/backgrounds/HomePage/img/${(i % 20) + 1}.jpg`),
    [imageCount],
  );

  return (
    <div
      ref={gridRef}
      className="absolute inset-0 z-10 hidden lg:block"
      style={{ perspective: "var(--perspective)" }}
      data-filter={String(filterBlur)}
    >
      <div className="grid-wrap grid h-full w-full p-8" style={{ transformStyle: "preserve-3d" }}>
        {images.map((src, i) => (
          <div key={i} className="grid__item aspect-[1.5] overflow-hidden rounded-xl">
            <div
              className="h-full w-full bg-cover bg-center rounded-xl"
              style={
                {
                  backgroundImage: `url(${src})`,
                  imageRendering: "auto",
                  WebkitImageRendering: "auto",
                  MozImageRendering: "auto",
                  msImageRendering: "auto",
                } as React.CSSProperties
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Основной компонент секции
const MorphingVideoSection: React.FC = () => {
  const tier = usePerformanceTier();
  const efxFlags = useEffectsDebug();
  const { isTouchDevice } = useDeviceType();
  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Сила параллакса: на тач используем useParallaxLenis, на десктоп — Framer Motion
  const parallaxStrength = tier === "low" ? 0 : tier === "medium" ? 30 : 60;

  // ТАЧ: параллакс через Lenis RAF — compositor-only, 60fps
  useParallaxLenis(parallaxBgRef, sectionRef, {
    strength: parallaxStrength * 2, // *2 т.к. фон занимает 100%+200px
    disabled: !isTouchDevice || tier === "low",
  });

  // ДЕСКТОП: Framer Motion useTransform
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    isTouchDevice || tier === "low" ? ["0%", "0%"] : [`-${parallaxStrength / 2}%`, `${parallaxStrength / 2}%`],
  );

  useEffect(() => {
    const preloadVideos = () => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = productionVideo;
      document.head.appendChild(link);
    };
    if (document.readyState === "complete") preloadVideos();
    else window.addEventListener("load", preloadVideos);
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-transparent">
      {/* WebGL Fluid — только high tier, ограничен границами секции */}
      {/* Рендерится через портал в body — вне overflow:hidden */}
      <SectionFluidEffect sectionRef={sectionRef} />

      {/* Параллакс фон */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <motion.div
          ref={parallaxBgRef}
          className="parallax-bg absolute inset-0 w-full"
          style={{
            y: bgY,
            height: "calc(100% + 200px)",
            top: "-100px",
            willChange: isTouchDevice ? "auto" : "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <div
            className="w-full h-full bg-repeat opacity-100 dark:opacity-0 transition-opacity duration-500"
            style={{
              backgroundImage: `url(/images/backgrounds/light-pattern.webp)`,
              backgroundSize: "400px 400px",
            }}
          />
          {/* ПК версия темного фона */}
          <div
            className="absolute inset-0 w-full h-full bg-repeat opacity-0 dark:opacity-100 transition-opacity duration-500 hidden md:block"
            style={{
              backgroundImage: `url(/images/backgrounds/dark-pattern.png)`,
              backgroundSize: "400px 400px",
              filter: "brightness(0.6) contrast(1.1)",
            }}
          />
          {/* Мобильная версия темного фона (светлее на 10%) */}
          <div
            className="absolute inset-0 w-full h-full bg-repeat opacity-0 dark:opacity-100 transition-opacity duration-500 block md:hidden"
            style={{
              backgroundImage: `url(/images/backgrounds/dark-pattern.png)`,
              backgroundSize: "400px 400px",
              filter: "brightness(0.7) contrast(1.1)",
            }}
          />
        </motion.div>
      </div>

      {/* Заголовок секции */}
      <div className="relative z-30 px-4 pt-24 pb-12 text-center">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-4 text-sm font-medium uppercase tracking-[0.2em]"
            style={{
              background: "linear-gradient(90deg, #0ea5e9, #06b6d4, #0ea5e9)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradient-shift 6s ease-in-out infinite",
              textShadow: "0 0 20px rgba(14, 165, 233, 0.3)",
              filter: "drop-shadow(0 0 8px rgba(14, 165, 233, 0.2))",
            }}
          >
            Наука • Качество • Доверие
          </h2>
          <h3
            className="mb-8 text-4xl font-semibold md:text-6xl"
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #334155 30%, #475569 60%, #1e293b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 2px rgba(59, 130, 246, 0.4))",
              position: "relative",
              lineHeight: "1.2",
              paddingBottom: "0.1em",
            }}
          >
            Почему 4Life?
          </h3>
          <ScrollTextReveal className="mx-auto max-w-4xl text-xl md:text-2xl leading-relaxed">
            Более двух десятилетий компания 4Life посвятила углублённому изучению иммунной системы, создавая продукты,
            которые являются результатом фундаментальных исследований и передовых технологий.
          </ScrollTextReveal>
        </div>
      </div>

      <div className="relative">
        {/* Блок 01 - Наука */}
        <div ref={block1Ref} className="relative">
          <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-3 order-2 lg:order-1">
                  <ScrollNumber
                    number="01"
                    className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-thin leading-none"
                  />
                </div>
                <div className="lg:col-span-9 order-1 lg:order-2 space-y-6">
                  <h4
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight"
                    style={{
                      background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 1px rgba(59, 130, 246, 0.3))",
                      position: "relative",
                    }}
                  >
                    Исследования и Инновации
                  </h4>
                  <ScrollTextReveal className="text-xl md:text-2xl leading-relaxed max-w-4xl">
                    В основе каждого продукта — запатентованные технологии. Ключевая из них — Трансфер Факторы,
                    уникальные молекулы, которые "обучают" иммунную систему, оптимизируя её естественные защитные
                    функции для точного и своевременного реагирования. 4Life не просто следует науке — компания её
                    создаёт.
                  </ScrollTextReveal>
                </div>
              </div>
            </div>
          </div>
          <div className={`relative z-10 ${isTouchDevice ? "min-h-[180vh]" : "min-h-[200vh]"}`}>
            {tier === "high" && (!import.meta.env.DEV || efxFlags.grid3d) && (
              <Grid3D
                type={1}
                triggerRef={block1Ref}
                filterBlur={import.meta.env.DEV ? efxFlags.grid3dFilterBlur : true}
              />
            )}
          </div>
        </div>

        {/* Блок 02 - Производство */}
        <div ref={block2Ref} className="relative">
          <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-9 order-1 space-y-6 text-right">
                  <h4
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight"
                    style={{
                      background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 1px rgba(59, 130, 246, 0.3))",
                      position: "relative",
                    }}
                  >
                    Бескомпромиссный Контроль Качества
                  </h4>
                  <ScrollTextReveal className="text-xl md:text-2xl leading-relaxed max-w-4xl ml-auto">
                    Каждый этап производства проходит строгий контроль качества. Современные технологии и
                    сертифицированные процессы по стандарту cGMP гарантируют высочайшие стандарты чистоты, безопасности
                    и эффективности продукции.
                  </ScrollTextReveal>
                </div>
                <div className="lg:col-span-3 order-2 flex justify-end lg:justify-center xl:justify-end">
                  <ScrollNumber
                    number="02"
                    className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-thin leading-none lg:translate-x-8"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={`relative z-10 ${isTouchDevice ? "min-h-[180vh]" : "min-h-[200vh]"}`}>
            {tier === "high" && (!import.meta.env.DEV || efxFlags.grid3d) && (
              <Grid3D
                type={2}
                triggerRef={block2Ref}
                filterBlur={import.meta.env.DEV ? efxFlags.grid3dFilterBlur : true}
              />
            )}
          </div>
        </div>

        {/* Блок 03 - Результат */}
        <div ref={block3Ref} className="relative">
          <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
              <div className="text-center space-y-8">
                <ScrollNumber
                  number="03"
                  className="text-[10rem] md:text-[16rem] lg:text-[20rem] font-thin leading-none"
                />
                <div className="space-y-6">
                  <h4
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight max-w-4xl mx-auto"
                    style={{
                      background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 1px rgba(59, 130, 246, 0.3))",
                      position: "relative",
                    }}
                  >
                    Подтверждённая Эффективность
                  </h4>
                  <ScrollTextReveal className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto">
                    Представьте утро, когда вы просыпаетесь с ощущением, что готовы свернуть горы. Энергия бьёт ключом,
                    мысли ясные, настроение на высоте. Это не случайность — это результат того, что ваша иммунная
                    система работает как швейцарские часы. Миллионы людей уже почувствовали эту разницу. Теперь ваша
                    очередь открыть для себя, каково это — жить в полную силу.
                  </ScrollTextReveal>
                </div>
              </div>
            </div>
          </div>
          <div className={`relative z-10 ${isTouchDevice ? "min-h-[180vh]" : "min-h-[200vh]"}`}>
            {tier === "high" && (!import.meta.env.DEV || efxFlags.grid3d) && (
              <Grid3D
                type={3}
                triggerRef={block3Ref}
                filterBlur={import.meta.env.DEV ? efxFlags.grid3dFilterBlur : true}
              />
            )}
          </div>
        </div>

        {/* Пространство после секции */}
        <div className="h-[12vh] lg:h-[20vh]"></div>
      </div>

      {/* CTA кнопка */}
      <div className="relative z-30 px-4 pb-24 text-center">
        <div className="mx-auto max-w-4xl">
          <Button
            to="/about"
            variant="primary"
            size="lg"
            className="from-cyan-600 to-blue-600 shadow-lg"
            icon={<Icons.Info className="w-5 h-5" />}
          >
            Узнать больше о компании
          </Button>
        </div>
      </div>
      {/* Все три видео компонента */}
      <BlockVideo blockRef={block1Ref} videoSrc={productionVideo} blockIndex={0} />
      <BlockVideo blockRef={block2Ref} videoSrc={productionVideo} blockIndex={1} />
      <BlockVideo blockRef={block3Ref} videoSrc={productionVideo} blockIndex={2} />
    </section>
  );
};

export default MorphingVideoSection;
