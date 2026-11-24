/**
 * @module src/components/sections/MorphingVideoSection/components/VideoBlock.tsx
 * @description Optimized responsive video & cinema poster block for MorphingVideoSection.
 * Renders crisp studio cinematography immediately with graceful <video> upgrade when local streams exist,
 * preventing empty grey static boxes while launching the full Kinescope player on click.
 */

import { usePerformanceTier } from "@/hooks";
import { useEffectsDebug } from "@/hooks/useEffectsDebug";
import { Icons } from "@/utils/icons";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BLOCK_CONFIG } from "../config";

interface VideoBlockProps {
  blockRef: React.RefObject<HTMLDivElement | null>;
  videoSrc: string;
  posterImage: string;
  chapterLabel: string;
  chapterTitle: string;
  blockIndex: number;
  isTouchDevice: boolean;
  onClick?: () => void;
  isModalOpen: boolean;
}

export const VideoBlock: React.FC<VideoBlockProps> = ({
  blockRef,
  videoSrc,
  posterImage,
  chapterLabel,
  chapterTitle,
  blockIndex,
  isTouchDevice,
  onClick,
  isModalOpen,
}) => {
  const [isPlaybackInView, setIsPlaybackInView] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(!!window.__menuTransitionInProgress);
  const [isVideoLoaded, setIsVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

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

    const playbackObserver = new IntersectionObserver(
      ([entry]) => {
        setIsPlaybackInView(entry?.isIntersecting ?? false);
      },
      { threshold: 0.02, rootMargin: "0px" },
    );

    playbackObserver.observe(block);

    return () => {
      playbackObserver.disconnect();
    };
  }, [blockRef, isTouchDevice]);

  useEffect(() => {
    if (isTouchDevice || videoFailed || !videoSrc) return;

    const video = videoRef.current;
    if (!video || !isPlaybackInView) return;

    if (!video.src || !video.src.includes(videoSrc)) {
      video.src = videoSrc;
      video.load();
    }
  }, [isPlaybackInView, videoSrc, isTouchDevice, videoFailed]);

  useEffect(() => {
    if (isTouchDevice || videoFailed) return;

    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => setIsVideoReady(true);
    const handleError = () => {
      setVideoFailed(true);
      setIsVideoReady(false);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);
    if (video.readyState >= 3) setIsVideoReady(true);

    const shouldPlay = isPlaybackInView && !isModalOpen && !isTransitioning;

    if (shouldPlay && isVideoLoaded) {
      const p = video.play();
      if (p !== undefined) {
        playPromiseRef.current = p;
        p.catch(() => {});
      }
    } else if (!shouldPlay) {
      if (playPromiseRef.current) {
        playPromiseRef.current
          .then(() => {
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
            }
          })
          .catch(() => {});
      } else if (!video.paused) {
        video.pause();
      }
    }

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
    };
  }, [isPlaybackInView, isModalOpen, isTransitioning, isTouchDevice, isVideoLoaded, videoFailed]);

  useEffect(() => {
    if (isTouchDevice) return;

    const video = videoRef.current;
    const circle = progressCircleRef.current;

    if (!circle || !isPlaybackInView) return;

    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;

    // If running in crisp cinema-poster mode (when local video binary is not bundled),
    // display a subtle refined 35% editorial arc rather than an empty dead ring.
    if (!isVideoLoaded || !video) {
      circle.style.strokeDashoffset = `${circumference * 0.65}`;
      return;
    }

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
    ["95vh", "0vh", "0vh", "0vh", "0vh", "-95vh"],
  );

  const opacity = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.stickStart, t.stickEnd, t.fadeOutStart, t.fadeOutEnd],
    [0, 1, 1, 1, 1, 0],
  );

  const tzHigh = import.meta.env.DEV ? efxFlags.blockVideoTranslateZHigh : true;
  const tzVal = tier === "high" && tzHigh ? -360 : -180;
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
        className="w-[86vw] max-w-[780px] lg:w-[48vw] pointer-events-auto anti-pixel-snap"
      >
        <motion.button
          type="button"
          aria-label={`Смотреть видео: ${chapterTitle}`}
          initial={false}
          animate={{ opacity: isModalOpen ? 0 : 1, scale: isModalOpen ? 0.95 : 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative block w-full aspect-video overflow-hidden rounded-2xl gpu-mask-radius bg-[#050811] border border-cyan-300/25 shadow-[0_32px_90px_rgba(0,0,0,0.75)] cursor-pointer group video-cursor-target text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          onClick={onClick}
          style={{
            transform: "translate3d(0, 0, 0)",
            WebkitTransform: "translate3d(0, 0, 0)",
            isolation: "isolate",
          }}
        >
          {/* High-resolution cinema poster always ready (prevents blank grey box) */}
          <img
            src={posterImage}
            alt={chapterTitle}
            loading="eager"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              !isLow && isPlaybackInView && !isVideoLoaded ? "cinema-poster-drift" : ""
            }`}
            style={{
              opacity: isVideoLoaded ? 0 : 1,
            }}
          />

          {/* Optional local preview stream seamlessly crossfades over poster when present */}
          {!videoFailed && (
            <video
              ref={videoRef}
              className="relative z-10 h-full w-full object-cover transition-opacity duration-700"
              muted
              playsInline
              loop
              preload="none"
              disablePictureInPicture
              disableRemotePlayback
              style={{
                opacity: isTransitioning || !isVideoLoaded ? 0 : 1,
                transform: "translateZ(0)",
              }}
            />
          )}

          {/* Editorial dark vignette & top/bottom cinema framing */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(3,5,10,0.45) 0%, rgba(3,5,10,0.12) 45%, rgba(3,5,10,0.76) 100%)",
            }}
          />

          {/* Subtle editorial film-plate metadata at bottom edge */}
          <div className="absolute inset-x-5 bottom-4 z-30 flex items-end justify-between gap-4 pointer-events-none">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.24em] text-cyan-300/90 font-semibold">
                {chapterLabel}
              </span>
              <span className="block font-heading text-sm md:text-base font-semibold text-white tracking-tight">
                {chapterTitle}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/75 group-hover:text-cyan-300 transition-colors">
              Смотреть фильм →
            </span>
          </div>

          {efxFlags.videoProgressOrb && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div
                className={[
                  "w-16 md:w-20 h-16 md:h-20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 relative overflow-visible",
                  shouldBlurOrb
                    ? "bg-[#03050a]/45 backdrop-blur-md border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
                    : "bg-[#0b1324]/90 border border-cyan-400/35 shadow-lg",
                ].join(" ")}
                style={{ transform: "translateZ(0)" }}
              >
                <svg
                  className="absolute inset-0 w-full h-full -rotate-90 overflow-visible pointer-events-none"
                  viewBox="0 0 100 100"
                >
                  <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="opacity-25"
                  />
                  <circle
                    ref={progressCircleRef}
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="relative flex items-center justify-center translate-x-[2px]">
                  <Icons.Play
                    fill="currentColor"
                    stroke="none"
                    className="text-white opacity-95 transition-transform duration-300 group-hover:scale-110 w-5 h-5 md:w-6 md:h-6"
                  />
                </div>
              </div>
            </div>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};