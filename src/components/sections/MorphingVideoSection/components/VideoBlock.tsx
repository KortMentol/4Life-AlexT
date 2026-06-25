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

  // Тайминги из золотого коммита
  const timings = useMemo(() => {
    const blockKey = `block${blockIndex + 1}` as keyof typeof BLOCK_CONFIG.touchTimings;
    return isTouchDevice ? BLOCK_CONFIG.touchTimings[blockKey] : BLOCK_CONFIG.desktopTimings[blockKey];
  }, [blockIndex, isTouchDevice]);

  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: isTouchDevice ? ["start 50%", "end 10%"] : ["start 90%", "end 10%"],
  });

  const t = timings ?? BLOCK_CONFIG.touchTimings.block1;

  const rawY = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.stickStart, t.stickEnd, t.fadeOutStart, t.fadeOutEnd],
    ["100vh", "0vh", "0vh", "0vh", "0vh", "-100vh"],
  );

  const rawOpacity = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.stickStart, t.stickEnd, t.fadeOutStart, t.fadeOutEnd],
    [0, 1, 1, 1, 1, 0],
  );

  const tzHigh = import.meta.env.DEV ? efxFlags.blockVideoTranslateZHigh : true;
  const tzVal = isTouchDevice ? 0 : tier === "high" && tzHigh ? 400 : 200;

  const rawTranslateZ = useTransform(
    scrollYProgress,
    [t.fadeInStart, t.fadeInEnd, t.stickStart, t.stickEnd, t.fadeOutStart, t.fadeOutEnd],
    [-tzVal, 0, 0, 0, 0, -tzVal],
  );

  // Математическая амортизация скролла
  const springConfig = { stiffness: 300, damping: 30, mass: 0.8 };
  const springY = useSpring(rawY, springConfig);
  const springTranslateZ = useSpring(rawTranslateZ, springConfig);

  // СТРОГО КАК В ОРИГИНАЛЕ (Spring на таче, Raw на десктопе):
  const y = isTouchDevice ? springY : rawY;
  const translateZ = isTouchDevice ? springTranslateZ : rawTranslateZ;
  const opacity = rawOpacity;

  useEffect(() => {
    if (!isTransitioning) return;
    const handleComplete = () => setIsTransitioning(false);
    window.addEventListener("menu-transition-complete", handleComplete, { once: true });
    return () => window.removeEventListener("menu-transition-complete", handleComplete);
  }, [isTransitioning]);

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
    return () => observer.disconnect();
  }, [blockRef, isTouchDevice]);

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
        style={{
          y,
          opacity,
          translateZ,
          backfaceVisibility: "hidden",
        }}
        className={`w-[90vw] max-w-[900px] lg:w-[55vw] pointer-events-auto ${!isTouchDevice ? "anti-pixel-snap" : ""}`}
        transition={{
          type: "tween",
          duration: isTouchDevice ? 1.5 : 1.2,
          ease: [0.25, 0.1, 0.25, 1.0],
        }}
      >
        <div className="relative aspect-video overflow-hidden rounded-2xl gpu-mask-radius bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
          <div className="absolute inset-0 rounded-2xl border border-blue-500/0 z-10 pointer-events-none" />
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
              style={{
                imageRendering: tier === "low" ? "auto" : "optimizeQuality",
              } as any}
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
