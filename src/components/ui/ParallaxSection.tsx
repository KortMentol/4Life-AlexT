import { motion, useScroll, useTransform } from "framer-motion";
import React, { ReactNode, useEffect, useRef, useState } from "react";

export interface ParallaxSectionProps {
  backgroundImage?: string; // Путь к фоновому изображению
  backgroundImageMobile?: string; // Путь к фоновому изображению для мобильных устройств
  backgroundImagePC?: string; // Путь к фоновому изображению для ПК
  backgroundVideo?: string; // Путь к фоновому видео
  altText: string; // Альтернативный текст для фона
  children?: ReactNode; // Контент, который будет наложен поверх фона
  height?: string; // Высота секции (например, "h-screen", "h-[70vh]")
  contentClasses?: string; // Дополнительные классы для контейнера контента
  parallaxSpeed?: number; // Скорость параллакса (0.1 - 0.5, по умолчанию 0.2)
  imageBrightness?: string; // Яркость изображения ('brightness-[.6]' для светлого фона, 'brightness-[.4]' для темного)
  blendMode?: string; // Режим смешивания для текста (например, 'mix-blend-difference' для инверсии цвета)
  clipPath?: string; // Кастомный clipPath для обрезки секции
  skipPreload?: boolean; // Пропустить предварительную загрузку (изображение уже загружено)
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  backgroundImage,
  backgroundImageMobile,
  backgroundImagePC,
  backgroundVideo,
  altText,
  children,
  height = "h-screen", // Дефолтная высота
  contentClasses = "flex items-center justify-center", // Дефолтные классы для центрирования
  parallaxSpeed = 0.2, // Дефолтная скорость параллакса
  imageBrightness = "brightness-[.6] dark:brightness-[.4]",
  blendMode = "", // По умолчанию без blend-mode
  clipPath = "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)", // Дефолтный clipPath
  skipPreload = false, // По умолчанию не пропускаем предварительную загрузку
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px - стандартная точка для мобильных устройств
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Выбираем подходящее изображение в зависимости от устройства
  const currentBackgroundImage =
    isMobile && backgroundImageMobile
      ? backgroundImageMobile
      : !isMobile && backgroundImagePC
        ? backgroundImagePC
        : backgroundImage;

  /**
   * Состояние, отвечающее за то, когда мы начинаем подгружать видео.
   * По-умолчанию видео не рендерится, чтобы не блокировать критический путь рендеринга.
   */
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  /** Загружаем фоновое изображение заранее, чтобы избежать эффекта "пролистывания" сверху вниз. */
  const [imageLoaded, setImageLoaded] = useState(skipPreload || !currentBackgroundImage);

  useEffect(() => {
    // Если изображение уже предварительно загружено или его нет, пропускаем загрузку
    if (skipPreload || !currentBackgroundImage) return;

    const img = new Image();
    img.src = currentBackgroundImage;
    img.onload = () => setImageLoaded(true);
  }, [currentBackgroundImage, skipPreload]);

  // После полной загрузки страницы начинаем загружать видео в фоне.
  useEffect(() => {
    if (!backgroundVideo) return;

    const startLoading = () => {
      // Переносим в requestIdleCallback, если доступен, чтобы не соревноваться с основным потоком.
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(() => setShouldLoadVideo(true));
      } else {
        // Fallback
        setTimeout(() => setShouldLoadVideo(true), 0);
      }
    };

    if (document.readyState === "complete") {
      startLoading();
      // Возвращаем void для обеспечения единообразного типа возвращаемого значения
      return;
    }

    window.addEventListener("load", startLoading);
    return () => window.removeEventListener("load", startLoading);
  }, [backgroundVideo]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Используем более простую трансформацию, как в примере
  // Это обеспечит более плавное движение на мобильных устройствах
  // Применяем parallaxSpeed для регулировки интенсивности эффекта
  const intensity = parallaxSpeed * 10; // Преобразуем скорость в проценты
  const y = useTransform(scrollYProgress, [0, 1], [`-${intensity}%`, `${intensity}%`]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${height} overflow-hidden transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
      style={{ clipPath: clipPath }}
    >
      {/* Контент секции с z-index выше фона */}
      <div className={`relative z-10 w-full h-full p-8 md:p-12 lg:p-16 ${contentClasses} ${blendMode}`}>{children}</div>

      {/* Фиксированный фоновый контейнер */}
      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full" style={{ zIndex: 1 }}>
        <motion.div style={{ y }} className="relative w-full h-full">
          {backgroundVideo && shouldLoadVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              preload="none"
              poster={currentBackgroundImage}
              className={`w-full h-full object-cover transition-opacity duration-700 ${imageBrightness}`}
              aria-label={altText}
            >
              <source src={backgroundVideo} type="video/webm" />
            </video>
          ) : currentBackgroundImage ? (
            <img
              src={currentBackgroundImage}
              alt={altText}
              className={`w-full h-full object-cover ${imageBrightness}`}
            />
          ) : null}
          {/* Слой для затемнения или наложения */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default ParallaxSection;
