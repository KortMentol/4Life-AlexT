// === Файл: src/components/ui/ParallaxSection.tsx ===
/**
 * Параллакс секция с двумя стратегиями рендеринга:
 *
 * ДЕСКТОП (hover:hover pointer:fine):
 *   Паттерн Oliviera Larose — position:fixed + Framer Motion useScroll/useTransform
 *   Полный эффект глубины, плавный параллакс.
 *
 * ТАЧ (touch device):
 *   useParallaxLenis — прямой DOM transform в Lenis RAF callback.
 *   Compositor-only, 60fps, тот же визуальный эффект.
 *   position:absolute вместо fixed — нет лишнего GPU слоя.
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
}

// Определяем тач один раз на уровне модуля — не меняется
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
  imageBrightness = "brightness-[.6] dark:brightness-[.4]",
  blendMode = "",
  clipPath = "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
  skipPreload = false,
  lazyLoad = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const inView = useInView(containerRef, { once: true, margin: "200px" });
  const tier = usePerformanceTier();

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

  // Сила параллакса в px — насколько фон смещается относительно контента
  // Больше = сильнее эффект глубины. На FPS не влияет — только математика.
  // Тач: 300px high / 180px medium — заметный эффект погружения
  // Десктоп: 400px high / 200px medium — сильное ощущение глубины
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

  // --- ТАЧ: параллакс через RAF loop ---
  useParallaxLenis(parallaxBgRef, containerRef, {
    strength: IS_TOUCH ? finalStrength : 0,
    disabled: !IS_TOUCH || tier === "low",
  });

  // --- ДЕСКТОП: Framer Motion useScroll (паттерн Oliviera) ---
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

  // Intersection Observer для паузы/воспроизведения видео
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container || !backgroundVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0, rootMargin: "300px 0px 300px 0px" },
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [backgroundVideo, inView]);

  // ТАЧ: position:absolute + useParallaxLenis двигает bgRef напрямую
  if (IS_TOUCH) {
    return (
      <section
        ref={containerRef}
        className={`relative overflow-hidden ${height} ${blendMode}`}
        style={{ clipPath, WebkitClipPath: clipPath }}
      >
        <div className={`relative z-10 h-full ${contentClasses}`}>{children}</div>

        {/* Фон: position:absolute, увеличен чтобы параллакс не обнажал края */}
        <div
          className="absolute left-0 w-full -z-10"
          style={{
            top: `-${finalStrength / 2}px`,
            height: `calc(100% + ${finalStrength}px)`,
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

  // ДЕСКТОП: паттерн Oliviera — position:fixed + Framer Motion
  return (
    <section
      ref={containerRef}
      className={`relative overflow-hidden ${height} ${blendMode}`}
      style={{ clipPath, WebkitClipPath: clipPath }}
    >
      <div className={`relative z-10 h-full ${contentClasses}`}>{children}</div>

      <div
        className="-z-10"
        style={{
          position: "fixed",
          left: 0,
          width: "100%",
          height: `calc(100vh + ${finalStrength}px)`,
          top: `-${finalStrength / 2}px`,
        }}
      >
        <motion.div
          ref={parallaxBgRef}
          className={`relative w-full h-full ${imageBrightness}`}
          style={{
            y: desktopY,
            willChange: tier === "low" ? "auto" : "transform",
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
