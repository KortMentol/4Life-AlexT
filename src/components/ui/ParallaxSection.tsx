import React, { ReactNode, useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion, useInView } from "framer-motion";

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

/**
 * @module components/ui/ParallaxSection
 * @description Создает секцию с "умным" параллакс-эффектом, который адаптируется под любую силу, не допуская черных полос.
 * @author Kort
 * @version 4.0.0
 * @param {number} [parallaxStrength=40] - Общая дополнительная высота фона в `vh`. Например, 40 означает, что фон будет на 40vh выше экрана и будет двигаться на 20vh вверх и вниз от центра.
 */
const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  backgroundImage,
  backgroundImageMobile,
  backgroundImagePC,
  backgroundVideo,
  altText,
  children,
  height = "h-screen",
  contentClasses = "flex items-center justify-center",
  parallaxStrength = 40, // Рекомендованное значение для заметного, но плавного эффекта
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

  // Движение от -половины до +половины общей силы смещения
  const y = useTransform(scrollYProgress, [0, 1], [
    `-${parallaxStrength / 2}vh`,
    `${parallaxStrength / 2}vh`,
  ]);

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

      {/* Фон в отдельном fixed-контейнере для производительности */}
      <div
        className="fixed left-0 w-full -z-10"
        style={{
          // Фон выше на parallaxStrength, чтобы было куда двигаться
          height: `calc(100vh + ${parallaxStrength}vh)`,
          // Смещаем вверх на половину, чтобы центрировать
          top: `-${parallaxStrength / 2}vh`,
        }}
      >
        <motion.div
          className={`relative w-full h-full ${imageBrightness}`}
          style={{ y, willChange: "transform" }}
        >
          {backgroundVideo ? (
            <video
              className="absolute top-0 left-0 h-full w-full object-cover"
              src={inView ? backgroundVideo : undefined}
              autoPlay
              loop
              muted
              playsInline
              aria-label={altText}
            />
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
