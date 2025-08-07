// === Файл: src/components/ui/ParallaxSection.tsx (НАДЕЖНАЯ ВЕРСИЯ) ===

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
  parallaxStrength?: number;
  imageBrightness?: string;
  blendMode?: string;
  clipPath?: string;
  skipPreload?: boolean;
  lazyLoad?: boolean;
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
  parallaxStrength = 40,
  imageBrightness = "brightness-[.6] dark:brightness-[.4]",
  blendMode = "",
  clipPath = "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
  skipPreload = false,
  lazyLoad = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const inView = useInView(containerRef, { once: true, margin: "200px" });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${parallaxStrength / 2}vh`, `${parallaxStrength / 2}vh`]);

  const finalBackgroundImage = isMobile
    ? backgroundImageMobile || backgroundImage
    : backgroundImagePC || backgroundImage;

  useEffect(() => {
    if (finalBackgroundImage && !skipPreload) {
      const img = new Image();
      img.src = finalBackgroundImage;
    }
  }, [finalBackgroundImage, skipPreload]);

  return (
    <section
      ref={containerRef}
      className={`relative overflow-hidden ${height} ${blendMode}`}
      style={{ clipPath: clipPath, WebkitClipPath: clipPath }}
    >
      <div className={`relative z-10 h-full ${contentClasses}`}>{children}</div>

      <div
        className="fixed left-0 w-full -z-10"
        style={{
          height: `calc(100vh + ${parallaxStrength}vh)`,
          top: `-${parallaxStrength / 2}vh`,
        }}
      >
        <motion.div className={`relative w-full h-full ${imageBrightness}`} style={{ y, willChange: "transform" }}>
          {backgroundVideo ? (
            <video
              key={inView ? "video-loaded" : "video-unloaded"} // 🔥 ИЗМЕНЕНИЕ 1: Добавляем key для перерисовки видео
              className="absolute top-0 left-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              // 🔥 ИЗМЕНЕНИЕ 2: Используем poster для мобильных устройств, чтобы убрать вспышку.
              poster={isMobile ? backgroundImageMobile : undefined}
            >
              {/* 🔥 ИЗМЕНЕНИЕ 3: Загружаем источники только когда видео в зоне видимости */}
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
                className="absolute top-0 left-0 h-full w-full object-cover"
                loading="lazy"
              />
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ParallaxSection;
