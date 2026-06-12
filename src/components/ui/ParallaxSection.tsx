// === Файл: src/components/ui/ParallaxSection.tsx ===
/**
 * Параллакс секция — паттерн Olivier Larose.
 *
 * Desktop: фон всегда fixed (как у Оливье) + motion.div с y через useTransform.
 * Никакого динамического переключения position — ноль layout reflow.
 *
 * Touch: useParallaxLenis через RAF синглтон — compositor-only.
 *
 * edgeFade: аппаратные overlay-градиенты (pointer-events-none).
 * mask-image удалён — он создавал stacking context и блокировал compositor layer для fixed фона.
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
    colorLight?: string;
    colorDark?: string;
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
  const tier = usePerformanceTier();
  const isParallaxEnabled = useFeatureFlag("parallaxBackground", IS_TOUCH ? tier !== "low" : true);

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

  const touchStrength = tier === "low" ? 0 : 300;

  useParallaxLenis(parallaxBgRef, containerRef, {
    strength: IS_TOUCH ? touchStrength : 0,
    disabled: !IS_TOUCH || !isParallaxEnabled,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Паттерн Оливье Ларозе: проценты от высоты фона, масштабируется под любой экран
  // Оригинал: ["-10%", "10%"] на фоне 120vh → ~±130px на 1080p
  // medium и high одинаково — эффект погружения идентичный
  const desktopYFrom = tier === "low" ? "0%" : "-10%";
  const desktopYTo = tier === "low" ? "0%" : "10%";

  const desktopY = useTransform(
    scrollYProgress,
    [0, 1],
    !isParallaxEnabled ? ["0%", "0%"] : [desktopYFrom, desktopYTo],
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

  const sectionStyle: React.CSSProperties = {
    clipPath,
    WebkitClipPath: clipPath,
  };

  const fadeColorDark = edgeFade?.colorDark ?? "#000000";

  const renderEdgeFades = () => {
    if (!edgeFade) return null;
    return (
      <>
        {edgeFade.top && edgeFade.top > 0 && (
          <div
            className="absolute top-0 left-0 w-full pointer-events-none z-20"
            style={{
              height: `${edgeFade.top}px`,
              background: `linear-gradient(to bottom, ${fadeColorDark}, transparent)`,
            }}
          />
        )}
        {edgeFade.bottom && edgeFade.bottom > 0 && (
          <div
            className="absolute bottom-0 left-0 w-full pointer-events-none z-20"
            style={{
              height: `${edgeFade.bottom}px`,
              background: `linear-gradient(to top, ${fadeColorDark}, transparent)`,
            }}
          />
        )}
      </>
    );
  };

  // ─── TOUCH ────────────────────────────────────────────────────────────────
  if (IS_TOUCH) {
    return (
      <section ref={containerRef} className={`relative overflow-hidden ${height} ${blendMode}`} style={sectionStyle}>
        {renderEdgeFades()}
        <div className={`relative z-10 h-full ${contentClasses}`}>{children}</div>
        <div
          className="absolute left-0 w-full -z-10 pointer-events-none"
          style={{
            top: `-${touchStrength / 2}px`,
            height: `calc(100% + ${touchStrength}px)`,
            overflow: "hidden",
          }}
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
                  className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                  loading="lazy"
                />
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  // ─── DESKTOP — паттерн Оливье: fixed всегда, только y меняется ───────────
  return (
    <section ref={containerRef} className={`relative overflow-hidden ${height} ${blendMode}`} style={sectionStyle}>
      {renderEdgeFades()}
      <div className={`relative z-10 h-full ${contentClasses}`}>{children}</div>

      <div
        className="-z-10 pointer-events-none"
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
          className={`relative w-full h-full ${imageBrightness} pointer-events-none`}
          style={{
            y: desktopY,
            willChange: tier !== "low" ? "transform" : "auto",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
        >
          {backgroundVideo ? (
            <video
              ref={videoRef}
              key={inView ? "loaded" : "unloaded"}
              className="absolute inset-0 h-full w-full object-cover pointer-events-none"
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
                className="absolute inset-0 h-full w-full object-cover pointer-events-none"
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
