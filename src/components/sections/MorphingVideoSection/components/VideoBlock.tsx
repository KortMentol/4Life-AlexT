/**
 * @module src/components/sections/MorphingVideoSection/components/VideoBlock.tsx
 * @description Awwwards 2026 - Optimized Responsive Video Block (Dual Observer Architecture).
 * Все иконки строго импортируются из единого пульта @/utils/icons.
 *
 * ОПТИМИЗАЦИЯ И ИДЕАЛЬНЫЙ ВОСПРОИЗВЕДИТЕЛЬ (ZERO LAG):
 * 1. Dual Observer: Радар сети (1500px) предзагружает видео в кэш ДО появления на экране.
 * 2. Радар воспроизведения (150px) запускает видео строго при входе во вьюпорт.
 * 3. Promise Catching: Защита от крашей и лагов при бешеном скролле туда-сюда.
 * 4. Zero-State: Строгая пауза вне экрана (0% CPU/GPU).
 *
 * @author Geminis AI & Kort
 * @version 3.1.0
 */

import { usePerformanceTier } from "@/hooks";
import { useEffectsDebug } from "@/hooks/useEffectsDebug";
import { effectsDebugStore } from "@/utils/effectsDebug/effectsDebugStore";
import { Icons } from "@/utils/icons";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BLOCK_CONFIG } from "../config";

interface VideoBlockProps {
  blockRef: React.RefObject<HTMLDivElement>;
  videoSrc: string;
  posterSrc?: string;
  blockIndex: number;
  isTouchDevice: boolean;
  onClick?: () => void;
  isModalOpen: boolean;
}

export const VideoBlock: React.FC<VideoBlockProps> = ({
  blockRef,
  videoSrc,
  posterSrc,
  blockIndex,
  isTouchDevice,
  onClick,
  isModalOpen,
}) => {
  const [isNetworkInView, setIsNetworkInView] = useState(false);
  const [isPlaybackInView, setIsPlaybackInView] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(!!window.__menuTransitionInProgress);
  const [isVideoLoaded, setIsVideoReady] = useState(false);
  const [showProgressOrb, setShowProgressOrb] = useState<boolean>(
    () => effectsDebugStore.getFlag("videoProgressOrb") as boolean,
  );

  const tier = usePerformanceTier();
  const efxFlags = useEffectsDebug();
  const isLow = tier === "low";

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    const unsub = effectsDebugStore.subscribe((flags) => {
      setShowProgressOrb(flags.videoProgressOrb);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!isTransitioning) return;
    const handleComplete = () => setIsTransitioning(false);
    window.addEventListener("menu-transition-complete", handleComplete, { once: true });
    return () => window.removeEventListener("menu-transition-complete", handleComplete);
  }, [isTransitioning]);

  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;

    const networkObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsNetworkInView(true);
        }
      },
      { threshold: 0, rootMargin: "1500px 0px 1500px 0px" },
    );

    const playMargin = isTouchDevice ? "150px" : "250px";
    const playbackObserver = new IntersectionObserver(
      ([entry]) => {
        setIsPlaybackInView(entry?.isIntersecting ?? false);
      },
      { threshold: 0, rootMargin: `${playMargin} 0px ${playMargin} 0px` },
    );

    networkObserver.observe(block);
    playbackObserver.observe(block);

    return () => {
      networkObserver.disconnect();
      playbackObserver.disconnect();
    };
  }, [blockRef, isTouchDevice]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isNetworkInView) return;

    if (!video.src || !video.src.includes(videoSrc)) {
      video.src = videoSrc;
      video.load();
    }
  }, [isNetworkInView, videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => setIsVideoReady(true);
    video.addEventListener("loadeddata", handleLoadedData);
    if (video.readyState >= 3) setIsVideoReady(true);

    const shouldPlay = isPlaybackInView && !isModalOpen && !isTransitioning;

    if (shouldPlay) {
      const p = video.play();
      if (p !== undefined) {
        playPromiseRef.current = p;
        p.catch(() => {});
      }
    } else {
      if (playPromiseRef.current) {
        playPromiseRef.current
          .then(() => {
            const isStillShouldBePaused = !isPlaybackInView || isModalOpen || isTransitioning;
            if (isStillShouldBePaused && videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
            }
          })
          .catch(() => {});
      } else {
        video.pause();
      }
    }

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [isPlaybackInView, isModalOpen, isTransitioning]);

  useEffect(() => {
    const video = videoRef.current;
    const circle = progressCircleRef.current;

    if (!video || !circle || !isPlaybackInView || isLow) return;

    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;

    let rafId: number;
    let lastTime = 0;

    const updateProgress = (time: number) => {
      if (time - lastTime >= 66) {
        lastTime = time;
        if (!video.paused && video.duration && !isNaN(video.duration)) {
          const progress = video.currentTime / video.duration;
          const offset = circumference - progress * circumference;
          circle.style.strokeDashoffset = `${offset}`;
        }
      }
      rafId = requestAnimationFrame(updateProgress);
    };

    rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaybackInView, isVideoLoaded, isLow]);

  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: isTouchDevice ? ["start 100%", "end 0%"] : ["start 90%", "end 10%"],
  });

  const timings = useMemo(() => {
    const blockKey = `block${blockIndex + 1}` as keyof typeof BLOCK_CONFIG.desktopTimings;
    return isTouchDevice ? BLOCK_CONFIG.touchTimings[blockKey] : BLOCK_CONFIG.desktopTimings[blockKey];
  }, [blockIndex, isTouchDevice]);

  const t = timings ?? BLOCK_CONFIG.touchTimings.block1;

  const desktopRawY = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.stickStart, t.stickEnd, t.fadeOutStart, t.fadeOutEnd],
    ["100vh", "0vh", "0vh", "0vh", "0vh", "-100vh"],
  );
  const y = isTouchDevice ? 0 : desktopRawY;

  const opacity = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.stickStart, t.stickEnd, t.fadeOutStart, t.fadeOutEnd],
    [0, 1, 1, 1, 1, 0],
  );

  const scale = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.fadeOutStart, t.fadeOutEnd],
    isTouchDevice ? [0.96, 1, 1, 0.96] : [1, 1, 1, 1],
  );

  const tzHigh = import.meta.env.DEV ? efxFlags.blockVideoTranslateZHigh : true;
  const tzVal = tier === "high" && tzHigh ? -400 : -200;
  const desktopTranslateZ = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.stickStart, t.stickEnd, t.fadeOutStart, t.fadeOutEnd],
    [tzVal, 0, 0, 0, 0, tzVal],
  );
  const translateZ = isTouchDevice ? 0 : desktopTranslateZ;
  const pointerEvents = useTransform(opacity, (o: number) => (o > 0.15 ? "auto" : "none"));

  if (!efxFlags.renderVideoBlocks) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
      style={{ perspective: "1200px", height: isTouchDevice ? "100svh" : "100vh" }}
    >
      <motion.div
        style={{
          y,
          opacity,
          scale,
          translateZ,
          pointerEvents,
          backfaceVisibility: "hidden",
          willChange: isTouchDevice || isLow ? "auto" : "transform, opacity",
        }}
        className={`w-[90vw] max-w-[900px] lg:w-[55vw] pointer-events-auto ${!isTouchDevice ? "anti-pixel-snap" : ""}`}
      >
        <motion.div
          initial={false}
          animate={{ opacity: isModalOpen ? 0 : 1, scale: isModalOpen ? 0.95 : 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-video overflow-hidden rounded-2xl gpu-mask-radius bg-[#03050a] border border-blue-500/20 shadow-2xl cursor-pointer group video-cursor-target"
          onClick={onClick}
          style={{
            transform: "translate3d(0, 0, 0)",
            WebkitTransform: "translate3d(0, 0, 0)",
            isolation: "isolate",
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 pointer-events-none"
            style={{
              backgroundImage: `url(${posterSrc})`,
              opacity: isTransitioning || !isVideoLoaded ? 1 : 0,
              transform: "translateZ(0)",
            }}
          />

          <video
            ref={videoRef}
            className="h-full w-full object-cover transition-opacity duration-1000"
            muted
            playsInline
            loop
            preload="none"
            disablePictureInPicture
            disableRemotePlayback
            style={
              {
                opacity: isTransitioning || !isVideoLoaded ? 0 : 1,
                imageRendering: tier === "high" ? "optimizeQuality" : "auto",
                transform: "translateZ(0)",
              } as any
            }
          />

          {tier === "high" && !isTouchDevice && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 mix-blend-overlay pointer-events-none" />
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)" }}
              />
            </>
          )}

          {showProgressOrb && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div
                className={[
                  "w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 rounded-full flex items-center justify-center transition-all duration-300 relative overflow-visible",
                  tier === "low"
                    ? "bg-[#0f172a]/85 border border-white/10 shadow-lg"
                    : "bg-[#03050a]/40 backdrop-blur-md border border-white/10 shadow-2xl",
                ].join(" ")}
                style={{ transform: "translateZ(0)" }}
              >
                {/* Structural SVG for progress ring (Mathematical Mask) */}
                {tier !== "low" && (
                  <svg
                    className="absolute inset-0 w-full h-full -rotate-90 overflow-visible pointer-events-none"
                    viewBox="0 0 100 100"
                    style={{
                      willChange: "stroke-dashoffset",
                      transition: "stroke-dashoffset 0.1s linear",
                    }}
                  >
                    <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="6"
                      strokeLinecap="round"
                      className="opacity-20"
                    />
                    <circle
                      ref={progressCircleRef}
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}

                <div className="relative flex items-center justify-center translate-x-[2px] md:translate-x-[3px]">
                  <Icons.Play
                    fill="currentColor"
                    stroke="none"
                    className="text-white opacity-90 transition-transform duration-300 group-hover:scale-110 w-[18px] h-[18px] md:w-6 md:h-6"
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
