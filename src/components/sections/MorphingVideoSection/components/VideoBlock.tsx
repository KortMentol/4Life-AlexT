/**
 * @module src/components/sections/MorphingVideoSection/components/VideoBlock.tsx
 * @description Awwwards 2026 - Optimized Responsive Video Block.
 * ИСПРАВЛЕНИЯ: Внедрено "Правило 2%". Видео-декодер больше не работает вхолостую
 * за пределами экрана. Воспроизведение начинается только при 2% пересечении вьюпорта.
 * @author Geminis AI & Kort
 * @version 7.1.0
 */

import { usePerformanceTier } from "@/hooks";
import { useEffectsDebug } from "@/hooks/useEffectsDebug";
import { Icons } from "@/utils/icons";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BLOCK_CONFIG } from "../config";

interface VideoBlockProps {
  blockRef: React.RefObject<HTMLDivElement>;
  videoSrc: string;
  blockIndex: number;
  isTouchDevice: boolean;
  onClick?: () => void;
  isModalOpen: boolean;
}

export const VideoBlock: React.FC<VideoBlockProps> = ({
  blockRef,
  videoSrc,
  blockIndex,
  isTouchDevice,
  onClick,
  isModalOpen,
}) => {
  const [isNetworkInView, setIsNetworkInView] = useState(false);
  const [isPlaybackInView, setIsPlaybackInView] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(!!window.__menuTransitionInProgress);
  const [isVideoLoaded, setIsVideoReady] = useState(false);

  const tier = usePerformanceTier();
  const efxFlags = useEffectsDebug();
  const isLow = tier === "low";

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!isTransitioning) return;
    const handleComplete = () => setIsTransitioning(false);
    window.addEventListener("menu-transition-complete", handleComplete, { once: true });
    return () => window.removeEventListener("menu-transition-complete", handleComplete);
  }, [isTransitioning]);

  useEffect(() => {
    if (isTouchDevice) return;

    const block = blockRef.current;
    if (!block) return;

    // Ранняя подгрузка метаданных
    const networkObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) setIsNetworkInView(true);
      },
      { threshold: 0, rootMargin: "1200px 0px" },
    );

    // ФИКС "ПРАВИЛО 2%": Старт воспроизведения ТОЛЬКО когда видео реально появилось на экране
    const playbackObserver = new IntersectionObserver(
      ([entry]) => {
        setIsPlaybackInView(entry?.isIntersecting ?? false);
      },
      { threshold: 0.02, rootMargin: "0px" },
    );

    networkObserver.observe(block);
    playbackObserver.observe(block);

    return () => {
      networkObserver.disconnect();
      playbackObserver.disconnect();
    };
  }, [blockRef, isTouchDevice]);

  useEffect(() => {
    if (isTouchDevice) return;

    const video = videoRef.current;
    if (!video || !isNetworkInView) return;

    if (!video.src || !video.src.includes(videoSrc)) {
      video.src = videoSrc;
      video.load();
    }
  }, [isNetworkInView, videoSrc, isTouchDevice]);

  useEffect(() => {
    if (isTouchDevice) return;

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
  }, [isPlaybackInView, isModalOpen, isTransitioning, isTouchDevice]);

  useEffect(() => {
    if (isTouchDevice) return;

    const video = videoRef.current;
    const circle = progressCircleRef.current;

    if (!video || !circle || !isPlaybackInView) return;

    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;

    let rafId: number | null = null;
    let lastTime = 0;

    const updateProgressRAF = (time: number) => {
      if (time - lastTime >= 33) {
        lastTime = time;
        if (!video.paused && video.duration && !isNaN(video.duration)) {
          const progress = video.currentTime / video.duration;
          const offset = circumference - progress * circumference;
          circle.style.strokeDashoffset = `${offset}`;
        }
      }
      if (!video.paused) {
        rafId = requestAnimationFrame(updateProgressRAF);
      } else {
        rafId = null;
      }
    };

    const updateProgressLow = () => {
      if (video.duration && !isNaN(video.duration)) {
        const progress = video.currentTime / video.duration;
        const offset = circumference - progress * circumference;
        circle.style.transition = "stroke-dashoffset 0.25s linear";
        circle.style.strokeDashoffset = `${offset}`;
      }
    };

    const handlePlay = () => {
      if (isLow) {
        video.addEventListener("timeupdate", updateProgressLow);
      } else if (rafId === null) {
        rafId = requestAnimationFrame(updateProgressRAF);
      }
    };

    const handlePause = () => {
      if (isLow) {
        video.removeEventListener("timeupdate", updateProgressLow);
      } else if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    if (!video.paused) {
      if (isLow) {
        video.addEventListener("timeupdate", updateProgressLow);
      } else {
        rafId = requestAnimationFrame(updateProgressRAF);
      }
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", updateProgressLow);
    };
  }, [isPlaybackInView, isVideoLoaded, isLow, isTouchDevice]);

  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: ["start 90%", "end 10%"],
  });

  const timings = useMemo(() => {
    const blockKey = `block${blockIndex + 1}` as keyof typeof BLOCK_CONFIG.desktopTimings;
    return BLOCK_CONFIG.desktopTimings[blockKey];
  }, [blockIndex]);

  const t = timings ?? BLOCK_CONFIG.desktopTimings.block1;

  const desktopRawY = useTransform(
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
  const tzVal = tier === "high" && tzHigh ? -400 : -200;
  const desktopTranslateZ = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.stickStart, t.stickEnd, t.fadeOutStart, t.fadeOutEnd],
    [tzVal, 0, 0, 0, 0, tzVal],
  );

  const pointerEvents = useTransform(opacity, (o: number) => (o > 0.15 ? "auto" : "none"));

  if (isTouchDevice || !efxFlags.renderVideoBlocks) {
    return null;
  }

  const shouldBlurOrb = efxFlags.playButtonBlur;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
      style={{ perspective: "1200px", height: "100vh" }}
    >
      <motion.div
        style={{
          y: desktopRawY,
          opacity,
          translateZ: desktopTranslateZ,
          pointerEvents,
          backfaceVisibility: "hidden",
          willChange: isLow ? "auto" : "transform, opacity",
        }}
        className="w-[90vw] max-w-[900px] lg:w-[55vw] pointer-events-auto anti-pixel-snap"
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
            className="absolute inset-0 bg-[#03050a] bg-noise-overlay transition-opacity duration-1000 pointer-events-none"
            style={{
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
              } as React.CSSProperties
            }
          />

          {tier === "high" && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 mix-blend-overlay pointer-events-none" />
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)" }}
              />
            </>
          )}

          {efxFlags.videoProgressOrb && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div
                className={[
                  "w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 rounded-full flex items-center justify-center transition-all duration-300 relative overflow-visible",
                  shouldBlurOrb
                    ? "bg-[#03050a]/40 backdrop-blur-md border border-white/10 shadow-2xl"
                    : "bg-[#0f172a]/85 border border-white/10 shadow-lg",
                ].join(" ")}
                style={{ transform: "translateZ(0)" }}
              >
                <svg
                  className="absolute inset-0 w-full h-full -rotate-90 overflow-visible pointer-events-none"
                  viewBox="0 0 100 100"
                  style={{
                    willChange: "stroke-dashoffset",
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
