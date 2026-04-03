// === Файл: src/components/ui/ParallaxSection.tsx ===
/**
 * Параллакс секция с двумя стратегиями рендеринга.
 *
 * ВАРИАНТ 2 — mask-image для бесшовных переходов:
 * Проп `edgeFade` добавляет CSS mask-image на секцию.
 * Верх/низ фото растворяются в прозрачность автоматически,
 * без привязки к цвету соседней секции. Работает в обеих темах.
 * Compositor-only, 0 JS, 0 FPS cost.
 */

import { useParallaxLenis } from "@/hooks/useParallaxLenis";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
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
  /**
   * Растворяет края секции в прозрачность через CSS mask-image.
   * top/bottom — высота зоны растворения в px (default 120).
   * Не зависит от цвета соседних секций — работает везде.
   */
  edgeFade?: { top?: number; bottom?: number };
}

const IS_TOUCH = typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;

/** Строит CSS mask-image для растворения краёв */
function buildMask(top: number, bottom: number): string {
  const t = top > 0 ? `${top}px` : "0px";
  const b = bottom > 0 ? `${bottom}px` : "0px";
  if (top > 0 && bottom > 0) {
    return `linear-gradient(to bottom, transparent 0px, black ${t}, black calc(100% - ${b}), transparent 100%)`;
  }
  if (top > 0) {
    return `linear-gradient(to bottom, transparent 0px, black ${t})`;
  }
  if (bottom > 0) {
    return `linear-gradient(to top, transparent 0px, black ${b})`;
  }
  return "none";
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  backgroundImage,
  backgroundImageMobile,
  backgroundImagePC,
  backgroundVideo,
  altText,
  children,
  height = "h-screen",
  contentClasses = "flex items-center justify-center",
  imageBrightness = "brightness-[.6] dark:brightness-[.4]",
  blendMode = "",
  clipPath = "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
  skipPreload = false,
  lazyLoad = true,
  edgeFade,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const inView = useInView(containerRef, { once: true, margin: "200px" });
  const [isNearViewport, setIsNearViewport] = useState(true);
  const tier = usePerformanceTier();

  // mask-image строка — вычисляем один раз
  const maskStyle = edgeFade ? buildMask(edgeFade.top ?? 0, edgeFade.bottom ?? 0) : undefined;

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

  useEffect(() => {
    if (IS_TOUCH) return;
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => setIsNearViewport(e.isIntersecting)),
      { threshold: 0, rootMargin: "300px 0px 300px 0px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const finalStrength = IS_TOUCH
    ? tier === "low"
      ? 0
      : tier === "medium"
        ? 180
        : 300
    : tier === "low"
      ? 0
      : tier === "medium"
        ? 200
        : 400;

  useParallaxLenis(parallaxBgRef, containerRef, {
    strength: IS_TOUCH ? finalStrength : 0,
    disabled: !IS_TOUCH || tier === "low",
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const desktopY = useTransform(
    scrollYProgress,
    [0, 1],
    IS_TOUCH || tier === "low" ? ["0vh", "0vh"] : [`-${finalStrength / 2}px`, `${finalStrength / 2}px`],
  );

  const finalBackgroundImage = isMobile
    ? backgroundImageMobile || backgroundImage
    : backgroundImagePC || backgroundImage;

  useEffect(() => {
    if (finalBackgroundImage && !skipPreload) {
      const img = new Image();
      img.src = finalBackgroundImage;
    }
  }, [finalBackgroundImage, skipPreload]);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container || !backgroundVideo) return;
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
  }, [backgroundVideo, inView]);

  // Общий стиль секции с mask-image
  const sectionStyle: React.CSSProperties = {
    clipPath,
    WebkitClipPath: clipPath,
    ...(maskStyle
      ? {
          maskImage: maskStyle,
          WebkitMaskImage: maskStyle,
        }
      : {}),
  };

  if (IS_TOUCH) {
    return (
      <section ref={containerRef} className={`relative overflow-hidden ${height} ${blendMode}`} style={sectionStyle}>
        <div className={`relative z-10 h-full ${contentClasses}`}>{children}</div>
        <div
          className="absolute left-0 w-full -z-10"
          style={{ top: `-${finalStrength / 2}px`, height: `calc(100% + ${finalStrength}px)`, overflow: "hidden" }}
        >
          <div
            ref={parallaxBgRef}
            className={`relative w-full h-full ${imageBrightness}`}
            style={{ backfaceVisibility: "hidden" }}
          >
            {backgroundVideo ? (
              <video
                ref={videoRef}
                key={inView ? "loaded" : "unloaded"}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                disablePictureInPicture
                poster={isMobile ? backgroundImageMobile : undefined}
              >
                {inView && (
                  <>
                    <source src={backgroundVideo} type="video/webm" />
                    <source src={backgroundVideo.replace(".webm", ".mp4")} type="video/mp4" />
                  </>
                )}
              </video>
            ) : (
              finalBackgroundImage && (
                <img
                  src={lazyLoad && !inView ? undefined : finalBackgroundImage}
                  alt={altText}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className={`relative overflow-hidden ${height} ${blendMode}`} style={sectionStyle}>
      <div className={`relative z-10 h-full ${contentClasses}`}>{children}</div>
      <div
        className="-z-10"
        style={{
          position: isNearViewport ? "fixed" : "absolute",
          left: 0,
          width: "100%",
          height: isNearViewport ? `calc(100vh + ${finalStrength}px)` : "100%",
          top: isNearViewport ? `-${finalStrength / 2}px` : 0,
        }}
      >
        <motion.div
          ref={parallaxBgRef}
          className={`relative w-full h-full ${imageBrightness}`}
          style={{
            y: isNearViewport ? desktopY : 0,
            willChange: isNearViewport && tier !== "low" ? "transform" : "auto",
            backfaceVisibility: "hidden",
          }}
        >
          {backgroundVideo ? (
            <video
              ref={videoRef}
              key={inView ? "loaded" : "unloaded"}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              disablePictureInPicture
              poster={backgroundImageMobile}
            >
              {inView && (
                <>
                  <source src={backgroundVideo} type="video/webm" />
                  <source src={backgroundVideo.replace(".webm", ".mp4")} type="video/mp4" />
                </>
              )}
            </video>
          ) : (
            finalBackgroundImage && (
              <img
                src={lazyLoad && !inView ? undefined : finalBackgroundImage}
                alt={altText}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(ParallaxSection);
