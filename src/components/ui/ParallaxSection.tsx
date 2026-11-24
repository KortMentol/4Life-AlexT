/**
 * @module components/ui/ParallaxSection
 * @description Параллакс секция — паттерн Olivier Larose.
 * ИСПРАВЛЕНИЯ AWWWARDS PRO:
 * Внедрен идеальный "Fade to Void" (кубическая маска градиента) для мягкого растворения
 * фотографий в цвете Clinical Obsidian (#03050a) без ступенек и жестких срезов.
 * @author Geminis AI & Kort
 * @version 10.1.0
 */

import { useFeatureFlag, usePerformanceTier } from "@/hooks";
import { useParallaxLenis } from "@/hooks/useParallaxLenis";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import React, { ReactNode, useEffect, useRef, useState } from "react";

export interface ParallaxSectionProps {
  backgroundImage?: string;
  backgroundImageMobile?: string;
  backgroundImagePC?: string;
  backgroundVideo?: string;
  altText: string;
  children?: ReactNode;
  height?: string;
  contentClasses?: string;
  imageBrightness?: string;
  blendMode?: string;
  clipPath?: string;
  skipPreload?: boolean;
  lazyLoad?: boolean;
  edgeFade?: {
    top?: number;
    bottom?: number;
    colorDark?: string; // Оставляем в интерфейсе для обратной совместимости пропсов, но маска теперь хардкодится под Obsidian
  };
}

const IS_TOUCH = typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  backgroundImage,
  backgroundImageMobile,
  backgroundImagePC,
  backgroundVideo,
  altText,
  children,
  height = "h-screen",
  contentClasses = "flex items-center justify-center",
  imageBrightness = "",
  blendMode = "",
  clipPath = "inset(0px)",
  skipPreload = false,
  lazyLoad = true,
  edgeFade,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const inView = useInView(containerRef, { once: true, margin: "200px" });
  const tier = usePerformanceTier();

  const isParallaxEnabled = useFeatureFlag("parallaxBackground", tier !== "low");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    let t: number;
    const onResize = () => {
      clearTimeout(t);
      t = window.setTimeout(checkMobile, 250);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, []);

  const touchStrength = isParallaxEnabled ? 300 : 0;

  useParallaxLenis(parallaxBgRef, containerRef, {
    strength: IS_TOUCH ? touchStrength : 0,
    disabled: !IS_TOUCH || !isParallaxEnabled,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const desktopYFrom = isParallaxEnabled ? "-10%" : "0%";
  const desktopYTo = isParallaxEnabled ? "10%" : "0%";

  const desktopY = useTransform(scrollYProgress, [0, 1], [desktopYFrom, desktopYTo]);

  const finalBackgroundImage = isMobile
    ? backgroundImageMobile || backgroundImage
    : backgroundImagePC || backgroundImage;

  useEffect(() => {
    if (finalBackgroundImage && !skipPreload) {
      const img = new Image();
      img.src = finalBackgroundImage;
    }
  }, [finalBackgroundImage, skipPreload]);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveDataEnabled =
    typeof navigator !== "undefined" &&
    Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  const canPlayVideo = Boolean(backgroundVideo) && !prefersReducedMotion && !saveDataEnabled;

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container || !canPlayVideo) return;

    if (video.readyState >= 2) {
      setIsVideoReady(true);
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) video.play().catch(() => {});
          else video.pause();
        }),
      { threshold: 0, rootMargin: "300px 0px 300px 0px" },
    );
    observer.observe(container);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [canPlayVideo, inView]);

  const sectionStyle: React.CSSProperties = {
    clipPath,
    WebkitClipPath: clipPath,
  };

  // Smooth cubic "Fade to Void" with a solid 4% #03050a shoulder + -2px seam bleed overlap
  // to eliminate Chromium subpixel 1px bright seam flashes during high-velocity scroll.
  const easingGradientStr = `
    rgba(3, 5, 10, 1) 0%,
    rgba(3, 5, 10, 1) 4%,
    rgba(3, 5, 10, 0.98) 14%,
    rgba(3, 5, 10, 0.9) 28%,
    rgba(3, 5, 10, 0.7) 48%,
    rgba(3, 5, 10, 0.4) 68%,
    rgba(3, 5, 10, 0.1) 86%,
    rgba(3, 5, 10, 0) 100%
  `;

  const renderEdgeFades = () => {
    if (!edgeFade) return null;
    return (
      <>
        {edgeFade.top && edgeFade.top > 0 && (
          <div
            aria-hidden="true"
            className="absolute left-0 w-full pointer-events-none z-20"
            style={{
              top: "-2px",
              height: `${edgeFade.top + 2}px`,
              backgroundImage: `linear-gradient(to bottom, ${easingGradientStr})`,
            }}
          />
        )}
        {edgeFade.bottom && edgeFade.bottom > 0 && (
          <div
            aria-hidden="true"
            className="absolute left-0 w-full pointer-events-none z-20"
            style={{
              bottom: "-2px",
              height: `${edgeFade.bottom + 2}px`,
              backgroundImage: `linear-gradient(to top, ${easingGradientStr})`,
            }}
          />
        )}
      </>
    );
  };

  const renderBackgroundMedia = () => {
    const showVideo = canPlayVideo;
    const shouldLoadMedia = !lazyLoad || skipPreload || inView;
    const videoSources = backgroundVideo?.endsWith(".webm")
      ? [{ src: backgroundVideo, type: "video/webm" }]
      : backgroundVideo?.endsWith(".mp4")
        ? [{ src: backgroundVideo, type: "video/mp4" }]
        : [];

    return (
      <>
        {finalBackgroundImage && (
          <img
            src={shouldLoadMedia ? finalBackgroundImage : undefined}
            alt={altText}
            className={`absolute inset-0 h-full w-full object-cover pointer-events-none transition-opacity duration-700 ${imageBrightness} ${
              showVideo && isVideoReady ? "opacity-0" : "opacity-100"
            }`}
            loading={skipPreload ? "eager" : "lazy"}
            decoding="async"
          />
        )}
        {showVideo && backgroundVideo && (
          <video
            ref={videoRef}
            key={shouldLoadMedia ? "loaded" : "unloaded"}
            className={`absolute inset-0 h-full w-full object-cover pointer-events-none transition-opacity duration-700 ${
              isVideoReady ? "opacity-100" : "opacity-0"
            }`}
            autoPlay
            loop
            muted
            playsInline
            preload={skipPreload ? "auto" : "metadata"}
            disablePictureInPicture
            onLoadedData={() => setIsVideoReady(true)}
            onCanPlay={() => setIsVideoReady(true)}
          >
            {shouldLoadMedia &&
              videoSources.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
          </video>
        )}
      </>
    );
  };

  if (IS_TOUCH) {
    return (
      <section
        ref={containerRef}
        className={`relative overflow-hidden bg-[#03050a] ${height} ${blendMode}`}
        style={sectionStyle}
      >
        {renderEdgeFades()}
        <div className={`relative z-10 h-full ${contentClasses}`}>{children}</div>
        <div
          className="absolute left-0 w-full z-0 pointer-events-none"
          style={{
            top: `-${touchStrength / 2}px`,
            height: `calc(100% + ${touchStrength}px)`,
            overflow: "hidden",
          }}
        >
          <div
            ref={parallaxBgRef}
            className="relative w-full h-full"
            style={{ backfaceVisibility: "hidden" }}
          >
            {renderBackgroundMedia()}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className={`relative overflow-hidden bg-[#03050a] ${height} ${blendMode}`}
      style={sectionStyle}
    >
      {renderEdgeFades()}
      <div className={`relative z-10 h-full ${contentClasses}`}>{children}</div>

      <div
        className="z-0 pointer-events-none"
        style={{
          position: "fixed",
          top: "-20vh",
          left: 0,
          width: "100%",
          height: "140vh",
        }}
      >
        <motion.div
          ref={parallaxBgRef}
          className="relative w-full h-full pointer-events-none"
          style={{
            y: desktopY,
            willChange: isParallaxEnabled ? "transform" : "auto",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
        >
          {renderBackgroundMedia()}
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(ParallaxSection);
