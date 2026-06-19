/**
 * @module src/components/sections/MorphingVideoSection/MorphBlock.tsx
 * @description Awwwards 2026 — Adaptive video block with Persistent Ambient Playback + Zero off-screen footprint.
 * Uses Trigger-Actor Decoupling: view-state driven by parent via isInView, video preserves timestamp across modal open/close.
 * @author Kort
 * @version 5.0.0
 */

import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

type PerformanceTier = "low" | "medium" | "high";

export interface MorphBlockProps {
  videoSrc: string;
  posterSrc?: string;
  tier?: PerformanceTier;
  className?: string;
  onClick?: () => void;
  isInView?: boolean;
  isModalOpen?: boolean;
}

export const MorphBlock: React.FC<MorphBlockProps> = ({ 
  videoSrc, 
  tier: tierProp, 
  className = "", 
  onClick, 
  isInView = false, 
  isModalOpen = false 
}) => {
  const autoTier = usePerformanceTier();
  const tier: PerformanceTier = tierProp || autoTier;

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const savedTimeRef = useRef<number>(0);

  const isTouchDevice = useMemo(
    () => typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0),
    [],
  );

  // Persistent Ambient Playback — zero off-screen overhead, seamless timestamp resume
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let onMetadata: (() => void) | undefined;

    const startVideo = () => {
      video.src = videoSrc;
      video.load();

      onMetadata = () => {
        // Restore playhead position seamlessly before playing
        if (savedTimeRef.current > 0) {
          video.currentTime = savedTimeRef.current;
        }
        video.play().catch(() => {});
      };

      video.addEventListener("loadedmetadata", onMetadata);
    };

    const stopVideo = () => {
      // Save current timeline progress before purging the decoder from RAM
      if (video.currentTime > 0) {
        savedTimeRef.current = video.currentTime;
      }
      video.pause();
      video.removeAttribute("src");
      video.load(); // Flushes decoder buffers from GPU memory instantly
    };

    if (isInView && !isModalOpen) {
      startVideo();
    } else {
      stopVideo();
    }

    return () => {
      if (onMetadata) {
        video.removeEventListener("loadedmetadata", onMetadata);
      }
      stopVideo();
    };
  }, [isInView, isModalOpen, videoSrc]);

  // 2. Орбитальный радар (Работает на ВСЕХ тирах, обновляется напрямую в DOM)
  useEffect(() => {
    const video = videoRef.current;
    const circle = progressCircleRef.current;
    if (!video || !circle) return;

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
  }, []);

  // 3. Вызов глобального курсора (Только для ПК)
  const handleMouseEnter = useCallback(() => {
    window.dispatchEvent(new CustomEvent("video-cursor-enter"));
  }, []);

  const handleMouseLeave = useCallback(() => {
    window.dispatchEvent(new CustomEvent("video-cursor-leave"));
  }, []);

  return (
    <div
      ref={containerRef}
      className={[
        `relative overflow-hidden rounded-2xl cursor-pointer w-full h-full bg-[#0a0f1c]`,
        tier !== "low" && !isTouchDevice ? "cursor-none" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={!isTouchDevice ? handleMouseEnter : undefined}
      onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
      onClick={onClick}
    >
      {/* ЕДИНОЕ ВИДЕО ДЛЯ ВСЕХ ТИРОВ */}
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        muted
        playsInline
        loop
        preload={tier === "high" ? "auto" : "metadata"}
        style={{ imageRendering: (tier === "high" ? "optimizeQuality" : "auto") as any }}
      />

      {/* Оверлеи: Включаем красивое смешивание цветов только на High Tier */}
      {tier === "high" && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-black/10 mix-blend-overlay" />
      )}

      {/* CENTRAL CONCENTRIC PROGRESS ORB */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={[
            "w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 rounded-full flex items-center justify-center border border-white/10 transition-all duration-300 relative",
            tier === "low" ? "bg-black/50" : "bg-black/30 backdrop-blur-md shadow-2xl",
          ].join(" ")}
        >
          <svg className="w-12 md:w-16 lg:w-20 h-12 md:h-16 lg:h-20 -rotate-90 overflow-visible" viewBox="0 0 100 100">
            {/* Background thin track */}
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            
            {/* Cheap, GPU-friendly vector glow (No expensive blur filters) */}
            {tier !== "low" && (
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="6"
                strokeLinecap="round"
                className="opacity-20 transition-all duration-75"
              />
            )}
            
            {/* Main active progress arc */}
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

          {/* Minimalist 2026 Play Icon (Optically aligned +1px to the right) */}
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
    </div>
  );
};

export default MorphBlock;