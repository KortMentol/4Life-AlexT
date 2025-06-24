import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px - стандартная точка для мобильных устройств
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Отслеживание движения курсора для эффекта псевдо-3D
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      // Преобразуем координаты в диапазон от -1 до 1
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = (clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile, mouseX, mouseY]);

  // Выбираем подходящее изображение в зависимости от устройства
  const currentBackgroundImage =
    isMobile && backgroundImageMobile
      ? backgroundImageMobile
      : !isMobile && backgroundImagePC
        ? backgroundImagePC
        : backgroundImage;

  // Создаем трансформируемые motion values для разных слоев
  const contentX = useTransform(mouseX, [-1, 1], [15, -15]);
  const contentY = useTransform(mouseY, [-1, 1], [10, -10]);

  // Округляем значения, чтобы устранить субпиксельное дрожание текста
  const contentXRounded = useTransform(contentX, (v) => Math.round(v));
  const contentYRounded = useTransform(contentY, (v) => Math.round(v));
  const bgX = useTransform(mouseX, [-1, 1], [-25, 25]);

  /**
   * Состояние, отвечающее за то, когда мы начинаем подгружать видео.
   * По-умолчанию видео не рендерится, чтобы не блокировать критический путь рендеринга.
   */
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  /** Загружаем фоновое изображение заранее, чтобы избежать эффекта "пролистывания" сверху вниз. */
  const [imageLoaded, setImageLoaded] = useState(
    skipPreload || !currentBackgroundImage,
  );

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
        (
          window as unknown as {
            requestIdleCallback: (callback: () => void) => void;
          }
        ).requestIdleCallback(() => setShouldLoadVideo(true));
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
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${intensity}%`, `${intensity}%`],
  );

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${height} overflow-hidden transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
      style={{ clipPath: clipPath }}
    >
      {/* Контент секции с z-index выше фона */}
      <motion.div
        className={`relative z-10 w-full h-full p-8 md:p-12 lg:p-16 ${contentClasses} ${blendMode}`}
        style={{
          x: isMobile ? 0 : contentXRounded,
          y: isMobile ? 0 : contentYRounded,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        {children}
      </motion.div>

      {/* Фиксированный фоновый контейнер */}
      <div
        className="fixed top-[-10vh] left-0 h-[120vh] w-full"
        style={{ zIndex: 1 }}
      >
        <motion.div
          style={{
            y: y,
            x: isMobile ? 0 : bgX,
            scale: 1.1, // Увеличиваем фон, чтобы избежать пустых краев
          }}
          className="relative w-full h-full"
        >
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
