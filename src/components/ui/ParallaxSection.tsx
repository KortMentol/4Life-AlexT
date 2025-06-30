import React, { ReactNode, useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export interface ParallaxSectionProps {
  backgroundImage?: string;
  backgroundImageMobile?: string;
  backgroundImagePC?: string;
  backgroundVideo?: string;
  altText: string;
  children?: ReactNode;
  height?: string;
  contentClasses?: string;
  parallaxStrength?: number; // Сила параллакса (например, 20 для 20% смещения)
  imageBrightness?: string;
  blendMode?: string;
  clipPath?: string;
  skipPreload?: boolean;
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
  parallaxStrength = 20, // Дефолтная сила 20% -> "-20%" to "20%"
  imageBrightness = "brightness-[.6] dark:brightness-[.4]",
  blendMode = "",
  clipPath = "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
  skipPreload = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  // NEW: Transform in vh units for predictable movement
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${parallaxStrength}vh`, `${parallaxStrength}vh`]
  );

  const finalBackgroundImage = isMobile
    ? backgroundImageMobile || backgroundImage
    : backgroundImagePC || backgroundImage;

  // Preload logic
  useEffect(() => {
    if (finalBackgroundImage && !skipPreload) {
      const img = new Image();
      img.src = finalBackgroundImage;
    }
  }, [finalBackgroundImage, skipPreload]);

  // NEW: Calculate height needed to cover travel distance
  const backgroundHeight = 100 + parallaxStrength * 2;

  return (
    <section
      ref={containerRef}
      className={`relative ${height} overflow-hidden`}
      style={{ clipPath }}
    >
      {/* Контейнер для контента */}
      <div
        className={`relative z-10 w-full h-full ${contentClasses} ${blendMode}`}
      >
        {children}
      </div>

      {/* Background Container: fixed, covers viewport, hides overflow */}
      <div className="fixed top-0 left-0 w-full h-screen -z-10 overflow-hidden">
        {/* Background Image: Taller than viewport, moves with transform */}
        <motion.div
          className={`relative w-full ${imageBrightness}`}
          style={{
            y,
            height: `${backgroundHeight}vh`,
            top: `-${parallaxStrength}vh`,
            willChange: "transform",
          }}
        >
          {backgroundVideo ? (
            <video
              className="h-full w-full object-cover"
              src={backgroundVideo}
              autoPlay
              loop
              muted
              playsInline
              aria-label={altText}
              controls={false}
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
            />
          ) : (
            finalBackgroundImage && (
              <img
                src={finalBackgroundImage}
                alt={altText}
                className="h-full w-full object-cover"
                loading="eager"
              />
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ParallaxSection;
