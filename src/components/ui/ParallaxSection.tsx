import { motion, useScroll, useTransform } from "framer-motion";
import React, { ReactNode, useRef } from "react";

export interface ParallaxSectionProps {
  backgroundImage?: string; // Путь к фоновому изображению
  backgroundVideo?: string; // Путь к фоновому видео
  altText: string; // Альтернативный текст для фона
  children?: ReactNode; // Контент, который будет наложен поверх фона
  height?: string; // Высота секции (например, "h-screen", "h-[70vh]")
  contentClasses?: string; // Дополнительные классы для контейнера контента
  parallaxSpeed?: number; // Скорость параллакса (0.1 - 0.5, по умолчанию 0.2)
  imageBrightness?: string; // Яркость изображения ('brightness-[.6]' для светлого фона, 'brightness-[.4]' для темного)
  blendMode?: string; // Режим смешивания для текста (например, 'mix-blend-difference' для инверсии цвета)
  clipPath?: string; // Кастомный clipPath для обрезки секции
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  backgroundImage,
  backgroundVideo,
  altText,
  children,
  height = "h-screen", // Дефолтная высота
  contentClasses = "flex items-center justify-center", // Дефолтные классы для центрирования
  parallaxSpeed = 0.2, // Дефолтная скорость параллакса
  imageBrightness = "brightness-[.6] dark:brightness-[.4]",
  blendMode = "", // По умолчанию без blend-mode
  clipPath = "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)", // Дефолтный clipPath
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
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
      className={`relative flex items-center justify-center ${height} overflow-hidden`}
      style={{ clipPath: clipPath }}
    >
      {/* Контент секции с z-index выше фона */}
      <div className={`relative z-10 w-full h-full p-8 md:p-12 lg:p-16 ${contentClasses} ${blendMode}`}>{children}</div>

      {/* Фиксированный фоновый контейнер */}
      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full" style={{ zIndex: 1 }}>
        <motion.div style={{ y }} className="relative w-full h-full">
          {backgroundVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              className={`w-full h-full object-cover ${imageBrightness}`}
              aria-label={altText}
            >
              <source src={backgroundVideo} type="video/webm" />
              {/* Запасной вариант, если видео не поддерживается */}
              {backgroundImage && (
                <img src={backgroundImage} alt={altText} className={`w-full h-full object-cover ${imageBrightness}`} />
              )}
            </video>
          ) : backgroundImage ? (
            <img src={backgroundImage} alt={altText} className={`w-full h-full object-cover ${imageBrightness}`} />
          ) : null}
          {/* Слой для затемнения или наложения */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default ParallaxSection;
