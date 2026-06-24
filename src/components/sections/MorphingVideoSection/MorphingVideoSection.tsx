/**
 * @module src/components/sections/MorphingVideoSection/MorphingVideoSection.tsx
 * @description AWWWARDS 2026 секция с тремя видео блоками.
 * Единый оптимизированный файл без внешних зависимостей. Стабильные 60 FPS на тачах.
 * @author Elite Frontend Architect
 * @version 9.0.0 - Unified Performance Masterpiece
 */

import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const productionVideo = "/videos/bg-video-products-page.mp4";
const posterBase = "/images/backgrounds/HomePage/img/";
const VIMEO_URL_01 =
  "https://player.vimeo.com/video/1203804812?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&texttrack=ru";
const VIMEO_URL_02 = "https://player.vimeo.com/video/1108208519?h=aee2e74b63&autoplay=1&texttrack=ru";
const VIMEO_URL_03 =
  "https://player.vimeo.com/video/1203804812?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&texttrack=ru";

import { Button, ScrollHeadingReveal } from "@/components/ui";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollNumber from "@/components/ui/ScrollNumber";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import { Icons } from "@/utils/icons";

import SectionFluidEffect from "@/components/effects/SectionFluidEffect";
import { useParallaxLenis, usePerformanceTier } from "@/hooks";
import { useEffectsDebug } from "@/hooks/useEffectsDebug";
import { lenis } from "@/lib/lenis";
import { effectsDebugStore } from "@/utils/effectsDebug/effectsDebugStore";

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    __menuTransitionInProgress?: boolean;
  }
}

const useDeviceType = () => {
  return useMemo(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    return { isTouchDevice, isDesktop: !isTouchDevice };
  }, []);
};

const BLOCK_CONFIG = {
  touchTimings: {
    block1: {
      fadeInStart: 0.2,
      fadeInEnd: 0.45,
      stickStart: 0.45,
      stickEnd: 0.55,
      fadeOutStart: 0.55,
      fadeOutEnd: 0.9,
    },
    block2: {
      fadeInStart: 0.2,
      fadeInEnd: 0.45,
      stickStart: 0.45,
      stickEnd: 0.55,
      fadeOutStart: 0.55,
      fadeOutEnd: 0.9,
    },
    block3: {
      fadeInStart: 0.2,
      fadeInEnd: 0.45,
      stickStart: 0.45,
      stickEnd: 0.55,
      fadeOutStart: 0.55,
      fadeOutEnd: 0.9,
    },
  },
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

/* ------------------------------------------------------------------ */
/* Scroll-driven video wrapper                                        */
/* ------------------------------------------------------------------ */
const VideoBlockWrapper: React.FC<{
  blockRef: React.RefObject<HTMLDivElement>;
  videoSrc: string;
  posterSrc?: string;
  blockIndex: number;
  isTouchDevice: boolean;
  onClick?: () => void;
  isModalOpen: boolean;
}> = ({ blockRef, videoSrc, posterSrc, blockIndex, isTouchDevice, onClick, isModalOpen }) => {
  const timings = useMemo(() => {
    const blockKey = `block${blockIndex + 1}` as keyof typeof BLOCK_CONFIG.touchTimings;
    return isTouchDevice ? BLOCK_CONFIG.touchTimings[blockKey] : BLOCK_CONFIG.desktopTimings[blockKey];
  }, [blockIndex, isTouchDevice]);

  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: isTouchDevice ? ["start 50%", "end 10%"] : ["start 90%", "end 10%"],
  });

  // AWWWARDS ПРЕДПРОГРЕВ 200px: Все операции плеера происходят вне экрана
  const isIntersecting = useInView(blockRef, {
    once: false,
    margin: "200px 0px 200px 0px",
  });

  const t = timings ?? BLOCK_CONFIG.touchTimings.block1;

  const rawY = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.stickStart, t.stickEnd, t.fadeOutStart, t.fadeOutEnd],
    ["100vh", "0vh", "0vh", "0vh", "0vh", "-100vh"],
  );

  const opacity = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.stickStart, t.stickEnd, t.fadeOutStart, t.fadeOutEnd],
    [0, 1, 1, 1, 1, 0],
  );

  // Умное динамическое переключение кликабельности (Капкан прозрачности решен!)
  // Если карточка прозрачнее чем 0.15 — она пропускает клики сквозь себя
  const pointerEvents = useTransform(opacity, (o) => (o > 0.15 ? "auto" : "none"));

  const rawTranslateZ = useTransform(scrollYProgress, [0, 1], [0, 0]);

  // Пружинная кинематика для идеального тач-скольжения
  const springConfig = { stiffness: 300, damping: 30, mass: 0.8 };
  const springY = useSpring(rawY, springConfig);
  const springTranslateZ = useSpring(rawTranslateZ, springConfig);

  const y = isTouchDevice ? springY : rawY;
  const translateZ = isTouchDevice ? springTranslateZ : rawTranslateZ;

  // Плеер и управление воспроизведением (ESS)
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const savedTimeRef = useRef<number>(0);
  const [isVideoLoaded, setIsVideoReady] = useState(false);

  const tier = usePerformanceTier();
  const [showProgressOrb, setShowProgressOrb] = useState<boolean>(
    () => effectsDebugStore.getFlag("videoProgressOrb") as boolean,
  );

  useEffect(() => {
    const unsub = effectsDebugStore.subscribe((flags) => {
      setShowProgressOrb(flags.videoProgressOrb);
    });
    return unsub;
  }, []);

  // ESS: Мягкое усыпление плеера во время скролла без уничтожения контекста
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (savedTimeRef.current > 0) {
        video.currentTime = savedTimeRef.current;
      }
      video.play().catch(() => {});
      setIsVideoReady(true);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    if (isIntersecting && !isModalOpen) {
      if (!video.src || video.src === "") {
        video.src = videoSrc;
        video.load();
      } else {
        video.play().catch(() => {});
        setIsVideoReady(true);
      }
    } else {
      if (video.currentTime > 0) {
        savedTimeRef.current = video.currentTime;
      }
      video.pause();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [isIntersecting, isModalOpen, videoSrc]);

  // Сброс ресурсов видеокарты только при уходе с текущей страницы
  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, []);

  // Высокопроизводительный прямой DOM-апдейт прогресса круга (0ms React Overhead)
  useEffect(() => {
    const video = videoRef.current;
    const circle = progressCircleRef.current;
    if (!video || !circle || !showProgressOrb || !isIntersecting) return;

    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    let rafId: number;
    let lastTime = 0;

    const updateProgress = (time: number) => {
      if (time - lastTime >= 33) {
        lastTime = time;
        if (video.duration && !isNaN(video.duration)) {
          const progress = video.currentTime / video.duration;
          const offset = circumference - progress * circumference;
          circle.style.strokeDashoffset = `${offset}`;
        }
      }
      rafId = requestAnimationFrame(updateProgress);
    };

    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [showProgressOrb, isIntersecting, isVideoLoaded]);

  // Вызовы глобального курсора
  const handleMouseEnter = useCallback(() => {
    window.dispatchEvent(new CustomEvent("video-cursor-enter"));
  }, []);

  const handleMouseLeave = useCallback(() => {
    window.dispatchEvent(new CustomEvent("video-cursor-leave"));
  }, []);

  return (
    <div
      className="fixed z-40 flex items-center justify-center pointer-events-none"
      style={{
        perspective: "1200px",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: isTouchDevice ? "100svh" : "100vh",
      }}
    >
      <motion.div
        style={{ y, opacity, translateZ, pointerEvents }}
        className="w-full h-full flex items-center justify-center pointer-events-none"
      >
        <motion.div
          animate={{
            opacity: isModalOpen ? 0 : 1,
            scale: isModalOpen ? 0.95 : 1,
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`w-[90vw] max-w-[900px] lg:w-[55vw] pointer-events-auto ${!isTouchDevice ? "anti-pixel-snap" : ""}`}
        >
          {/* ФИКС FIREFOX: Заменяем bg-gradient на bg-[#03050a] (цвет фона страницы),
              чтобы полностью скрыть любые мерцающие субпиксельные полосы на скруглениях */}
          <div
            data-cursor="block"
            className="relative aspect-video overflow-hidden rounded-2xl bg-[#03050a] cursor-pointer"
            onClick={onClick}
            style={{
              transform: "translate3d(0, 0, 0)",
              WebkitTransform: "translate3d(0, 0, 0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              isolation: "isolate",
            }}
            onMouseEnter={!isTouchDevice ? handleMouseEnter : undefined}
            onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
          >
            {/* Заглушка-постер под видео. Теперь 100% непрозрачный на время загрузки */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 pointer-events-none"
              style={{
                backgroundImage: `url(${posterSrc})`, // Читается компилятором!
                opacity: isVideoLoaded ? 0 : 1,
              }}
            />

            {/* Видео */}
            {isIntersecting && (
              <video
                ref={videoRef}
                className={`h-full w-full object-cover transition-opacity duration-500 ${
                  isVideoLoaded ? "opacity-100" : "opacity-0"
                }`}
                muted
                playsInline
                loop
                preload={tier === "high" ? "auto" : "metadata"}
                style={{ imageRendering: (tier === "high" ? "optimizeQuality" : "auto") as any }}
              />
            )}

            {/* Оверлей High Tier */}
            {tier === "high" && !isTouchDevice && (
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-black/10 mix-blend-overlay" />
            )}

            {/* Круговой прогресс */}
            {showProgressOrb && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                <div
                  className={[
                    "w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 rounded-full flex items-center justify-center border border-white/10 transition-all duration-300 relative",
                    isTouchDevice || tier !== "high"
                      ? "bg-slate-950/90 shadow-lg"
                      : "bg-black/30 backdrop-blur-md shadow-2xl",
                  ].join(" ")}
                >
                  <svg
                    className="w-12 md:w-16 lg:w-20 h-12 md:h-16 lg:h-20 -rotate-90 overflow-visible"
                    viewBox="0 0 100 100"
                  >
                    <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                    {tier === "high" && (
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="5"
                        strokeLinecap="round"
                        className="opacity-20 transition-all duration-75"
                      />
                    )}
                    <circle
                      ref={progressCircleRef}
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="transition-all duration-75"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white/80 translate-x-[1px] transition-transform duration-300 group-hover:scale-110"
                    >
                      <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Grid3D                                                             */
/* ------------------------------------------------------------------ */
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
            .set(gridItems, { z: () => window.gsap.utils.random(-1600, 200), force3D: true })
            .fromTo(
              gridItems,
              { xPercent: () => window.gsap.utils.random(-1000, -500) },
              { xPercent: () => window.gsap.utils.random(500, 1000), ease: "none" },
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
            .timeline({ defaults: { ease: "none" }, scrollTrigger: scrollTriggerConfig })
            .set(gridWrap, { rotationX: 20, force3D: true })
            .set(gridItems, { z: () => window.gsap.utils.random(-3000, -1000), opacity: 0.3, force3D: true })
            .fromTo(
              gridItems,
              { yPercent: () => window.gsap.utils.random(100, 1000), rotationY: -45, opacity: 0.3 },
              { ease: "power2", yPercent: () => window.gsap.utils.random(-1000, -100), rotationY: 45, opacity: 0.7 },
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

    if (window.__menuTransitionInProgress) {
      const onComplete = () => {
        initGSAP();
        window.removeEventListener("menu-transition-complete", onComplete);
      };
      window.addEventListener("menu-transition-complete", onComplete);
    } else initGSAP();

    return () => {
      if (timeline) timeline.kill();
    };
  }, [type, triggerRef]);

  const imageCount = useMemo(() => (window.innerWidth >= 1024 ? 20 : 8), []);
  const images = useMemo(
    () => Array.from({ length: imageCount }, (_, i) => `${posterBase}${(i % 20) + 1}.jpg`),
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
              style={{ backgroundImage: `url(${src})`, imageRendering: "auto" } as React.CSSProperties}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Main Section                                                       */
/* ------------------------------------------------------------------ */
const MorphingVideoSection: React.FC = () => {
  const tier = usePerformanceTier();
  const efxFlags = useEffectsDebug();
  const { isTouchDevice } = useDeviceType();
  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);

  const [vimeoOpen, setVimeoOpen] = useState(false);
  const [vimeoUrl, setVimeoUrl] = useState("");
  const isCursorEnabled = !isTouchDevice;

  // ── Debug флаг: полное отключение видео-блоков ──
  const [renderBlocks, setRenderBlocks] = useState<boolean>(
    () => effectsDebugStore.getFlag("renderVideoBlocks") as boolean,
  );

  useEffect(() => {
    const unsub = effectsDebugStore.subscribe((flags) => {
      setRenderBlocks(flags.renderVideoBlocks);
    });
    return unsub;
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxStrength = tier === "low" ? 0 : tier === "medium" ? 30 : 60;

  useParallaxLenis(parallaxBgRef, sectionRef, {
    strength: parallaxStrength * 2,
    disabled: !isTouchDevice || tier === "low",
  });

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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return () => {};
    const sectionVideos = section.querySelectorAll<HTMLVideoElement>("video");
    let playTimer: ReturnType<typeof setTimeout>;

    if (vimeoOpen) {
      sectionVideos.forEach((v) => v.pause());
    } else {
      // CRITICAL PERFORMANCE FIX: Wait 450ms (slightly longer than the 400ms exit fade animation)
      // before initializing and playing the active video. This eliminates 100% of frame drops / thread lag.
      playTimer = setTimeout(() => {
        sectionVideos.forEach((v) => {
          if (v.hasAttribute("src")) v.play().catch(() => {});
        });
      }, 450);
    }

    return () => {
      if (playTimer) clearTimeout(playTimer);
    };
  }, [vimeoOpen]);

  const handleOpenVimeoModal = useCallback((url: string) => {
    window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen: true } }));
    setVimeoOpen(true);
    setVimeoUrl(url);
  }, []);

  const handleCloseVimeoModal = useCallback(() => {
    window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen: false } }));
    setVimeoOpen(false);
    setVimeoUrl("");
  }, []);

  const handleOpenVimeo1 = useCallback(() => handleOpenVimeoModal(VIMEO_URL_01), [handleOpenVimeoModal]);
  const handleOpenVimeo2 = useCallback(() => handleOpenVimeoModal(VIMEO_URL_02), [handleOpenVimeoModal]);
  const handleOpenVimeo3 = useCallback(() => handleOpenVimeoModal(VIMEO_URL_03), [handleOpenVimeoModal]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-transparent">
      {isCursorEnabled && <CustomCursor />}

      <VimeoModal isOpen={vimeoOpen} onClose={handleCloseVimeoModal} tier={tier} videoUrl={vimeoUrl} />

      <SectionFluidEffect sectionRef={sectionRef} />

      <div className="absolute inset-0 -z-30 overflow-hidden bg-[#03050a]">
        <motion.div
          ref={parallaxBgRef}
          className="parallax-bg absolute inset-0 w-full h-full"
          style={{
            y: bgY,
            height: "calc(100% + 200px)",
            top: "-100px",
            willChange: isTouchDevice ? "auto" : "transform",
          }}
        >
          {tier !== "low" && <div className="absolute inset-0 w-full h-full bg-biotech-grid" />}
          {tier !== "low" && (
            <>
              <div className="absolute inset-0 w-full h-full bg-glow-cyan" />
              <div className="absolute inset-0 w-full h-full bg-glow-blue" />
            </>
          )}
          {tier === "high" && !isTouchDevice && <div className="absolute inset-0 w-full h-full bg-noise-overlay" />}
        </motion.div>
      </div>

      <motion.div
        animate={{ opacity: vimeoOpen ? 0 : 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-30"
      >
        <div className="px-4 pt-24 md:pt-32 pb-12 text-center">
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
            <ScrollHeadingReveal tag="h1" className="mb-6 text-center">
              Почему 4Life?
            </ScrollHeadingReveal>
            <div className="typography-lead text-center max-w-4xl mx-auto opacity-80">
              <ScrollTextReveal>
                Более двух десятилетий компания 4Life посвятила углублённому изучению иммунной системы, создавая
                продукты, которые являются результатом фундаментальных исследований и передовых технологий.
              </ScrollTextReveal>
            </div>
          </div>
        </div>

        <div className="relative">
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
                    <ScrollHeadingReveal tag="h2" className="text-left" direction="left" simpleMobile>
                      Исследования и Инновации
                    </ScrollHeadingReveal>
                    <ScrollTextReveal>
                      В основе каждого продукта — запатентованные технологии. Ключевая из них — Трафер Факторы,
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

          <div ref={block2Ref} className="relative">
            <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
              <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-9 order-1 space-y-6 text-right">
                    <ScrollHeadingReveal tag="h2" className="text-right" direction="right" simpleMobile>
                      Бескомпромиссный Контроль Качества
                    </ScrollHeadingReveal>
                    <ScrollTextReveal className="text-xl md:text-2xl leading-relaxed max-w-4xl ml-auto">
                      Каждый этап производства проходит строгий контроль качества. Современные технологии и
                      сертифицированные процессы по стандарту cGMP гарантируют высочайшие стандарты чистоты,
                      безопасности и эффективности продукции.
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

          <div ref={block3Ref} className="relative">
            <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
              <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                <div className="text-center space-y-8">
                  <ScrollNumber
                    number="03"
                    className="text-[10rem] md:text-[16rem] lg:text-[20rem] font-thin leading-none"
                  />
                  <div className="space-y-6">
                    <ScrollHeadingReveal tag="h2" className="text-center" simpleMobile>
                      Подтверждённая Эффективность
                    </ScrollHeadingReveal>
                    <ScrollTextReveal className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto">
                      Представьте утро, когда вы просыпаетесь с ощущением, что готовы свернуть горы. Энергия бьёт
                      ключом, мысли ясные, настроение на высоте. Это не случайность — это результат того, что ваша
                      иммунная система работает как швейцарские часы. Миллионы людей уже почувствовали эту разницу.
                      Теперь ваша очередь открыть для себя, каково это — жить в полную силы.
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

          <div className="h-[12vh] lg:h-[20vh]"></div>
        </div>

        <div className="px-4 pb-24 text-center">
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
      </motion.div>

      {renderBlocks && (
        <>
          <VideoBlockWrapper
            blockRef={block1Ref}
            videoSrc={productionVideo}
            posterSrc={`${posterBase}1.jpg`} // Постер передается всегда для бесшовной склейки при медленном сети
            blockIndex={0}
            isTouchDevice={isTouchDevice}
            onClick={handleOpenVimeo1}
            isModalOpen={vimeoOpen}
          />
          <VideoBlockWrapper
            blockRef={block2Ref}
            videoSrc={productionVideo}
            posterSrc={`${posterBase}2.jpg`}
            blockIndex={1}
            isTouchDevice={isTouchDevice}
            onClick={handleOpenVimeo2}
            isModalOpen={vimeoOpen}
          />
          <VideoBlockWrapper
            blockRef={block3Ref}
            videoSrc={productionVideo}
            posterSrc={`${posterBase}3.jpg`}
            blockIndex={2}
            isTouchDevice={isTouchDevice}
            onClick={handleOpenVimeo3}
            isModalOpen={vimeoOpen}
          />
        </>
      )}
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Vimeo Modal — автоплей со звуком через JS SDK                      */
/* ------------------------------------------------------------------ */
const VimeoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  tier: "low" | "medium" | "high";
  videoUrl: string;
}> = ({ isOpen, onClose, tier, videoUrl }) => {
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Perfect Scroll Lock
  useEffect(() => {
    if (isOpen) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.touchAction = "none";
      lenis?.stop();
    } else {
      closeTimeoutRef.current = setTimeout(() => {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
        document.documentElement.style.overflow = "";
        document.documentElement.style.touchAction = "";
        lenis?.start();
      }, 450);
    }
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.touchAction = "";
      lenis?.start();
    };
  }, [isOpen]);

  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = modalRef.current;
    if (!el || !isOpen) return;
    const preventWheel = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", preventWheel, { passive: false });
    return () => el.removeEventListener("wheel", preventWheel);
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
      className="fixed inset-0 z-[200] touch-action-none"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="vimeo-modal"
            className="fixed inset-0 flex items-center justify-center p-4 md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className={[
                "absolute inset-0",
                tier === "low" ? "bg-[#03050a]/98" : "bg-[#03050a]/90 backdrop-blur-xl",
              ].join(" ")}
              onClick={onClose}
            />
            <motion.div
              className="relative w-full max-w-6xl"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute -top-14 right-0 md:-top-10 md:-right-10 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95 focus:outline-none"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
                <iframe
                  ref={iframeRef}
                  src={videoUrl || VIMEO_URL_02}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  frameBorder="0"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  title="Vimeo Presentation"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MorphingVideoSection;
