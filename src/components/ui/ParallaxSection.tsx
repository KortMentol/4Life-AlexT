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

/**
 * @module src/components/ui/ParallaxSection.tsx
 * @description Создает полноэкранную или кастомной высоты секцию с эффектом параллакса для фонового изображения или видео. Компонент оптимизирован для максимальной производительности, используя ленивую (lazy-loading) загрузку ассетов по мере их появления в области видимости.
 * @author Kort
 * @version 1.1.0
 * @param {string} [backgroundImage] - Резервный путь к фоновому изображению, если не указаны версии для ПК/мобильных.
 * @param {string} [backgroundImageMobile] - Путь к фоновому изображению для мобильных устройств (ширина < 768px).
 * @param {string} [backgroundImagePC] - Путь к фоновому изображению для десктопных устройств.
 * @param {string} [backgroundVideo] - Путь к фоновому видео в формате .webm. Компонент автоматически попытается загрузить .mp4 версию, заменив расширение.
 * @param {string} altText - Альтернативный текст для фона, важен для доступности (accessibility).
 * @param {React.ReactNode} [children] - Дочерние элементы, которые будут отображаться поверх фоновой секции.
 * @param {string} [height='h-screen'] - Высота секции в Tailwind классах. По умолчанию занимает весь экран.
 * @param {string} [contentClasses='flex items-center justify-center'] - Tailwind классы для стилизации контейнера с дочерними элементами.
 * @param {number} [parallaxStrength=40] - Сила эффекта параллакса в vh. Чем выше значение, тем сильнее смещение фона при скролле.
 * @param {string} [imageBrightness='brightness-[.6] dark:brightness-[.4]'] - Яркость фонового изображения/видео. Позволяет сделать текст более читаемым.
 * @param {string} [blendMode=''] - CSS-свойство `mix-blend-mode` для наложения фона на другие элементы.
 * @param {string} [clipPath='polygon(0% 0, 100% 0%, 100% 100%, 0 100%)'] - CSS-свойство `clip-path` для создания нестандартных форм секции.
 * @param {boolean} [skipPreload=false] - Если `true`, компонент не будет пытаться предзагрузить фоновое изображение. Полезно, если ассет уже загружен другим скриптом (например, прелоадером в index.html).
 * @param {boolean} [lazyLoad=true] - Включает/отключает ленивую загрузку. Если `true`, ассеты грузятся только при попадании в зону видимости.
 * @usage
 * 1. `src/pages/HomePage.tsx` - Используется в качестве главной hero-секции с видеофоном, отображающей основной оффер сайта.
 * 2. `src/pages/HomePage.tsx` - Используется в качестве фона для секции "Продукты", применяется статичное изображение с ленивой загрузкой.
 * 3. `src/pages/HomePage.tsx` - Используется в качестве фона для секции призыва к действию (CTA) в конце страницы.
 * @example
 * <ParallaxSection
 *   backgroundVideo="/videos/hero-background.webm"
 *   backgroundImagePC="/images/hero-poster-pc.jpg"
 *   backgroundImageMobile="/images/hero-poster-mobile.jpg"
 *   altText="Фон с природой для демонстрации продуктов"
 *   height="h-screen"
 *   parallaxStrength={50}
 * >
 *   <h1 className="text-white text-5xl">Ваш контент здесь</h1>
 * </ParallaxSection>
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
  parallaxStrength = 40,
  imageBrightness = "brightness-[.6] dark:brightness-[.4]",
  blendMode = "",
  clipPath = "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
  skipPreload = false,
  lazyLoad = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const inView = useInView(containerRef, { once: true, margin: "200px" });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    let resizeTimeout: number;
    const throttledResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(checkMobile, isMobile ? 250 : 100);
    };
    
    window.addEventListener("resize", throttledResize, { passive: true });
    return () => {
      window.removeEventListener("resize", throttledResize);
      clearTimeout(resizeTimeout);
    };
  }, [isMobile]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${parallaxStrength / 2}vh`, `${parallaxStrength / 2}vh`],
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

  // Intersection Observer для паузы видео при скролле (Awwwards уровень)
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    
    if (!video || !container || !backgroundVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Пользователь в зоне секции + 300px буфер - включаем видео
            video.play().catch(() => {});
          } else {
            // Пользователь за пределами зоны - ВСЕГДА пауза
            video.pause();
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '300px 0px 300px 0px' // 300px буфер со всех сторон
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [backgroundVideo, inView]);

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
        <motion.div
          className={`relative w-full h-full ${imageBrightness}`}
          style={{ 
            y,
            willChange: 'transform',
            contain: isMobile ? 'layout style paint' : 'none'
          }}
        >
          {backgroundVideo ? (
            <video
              ref={videoRef}
              key={inView ? "video-loaded" : "video-unloaded"}
              className="absolute top-0 left-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              disablePictureInPicture
              poster={isMobile ? backgroundImageMobile : undefined}
            >
              {/* Загружаем источники только когда видео в зоне видимости */}
              {inView && (
                <>
                  <source src={backgroundVideo} type="video/webm" />
                  <source
                    src={backgroundVideo.replace(".webm", ".mp4")}
                    type="video/mp4"
                  />
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

export default React.memo(ParallaxSection);
