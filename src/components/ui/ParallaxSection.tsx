import React, { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  backgroundImage: string; // Путь к фоновому изображению
  altText: string;         // Альтернативный текст для изображения
  children?: ReactNode;    // Контент, который будет наложен поверх фона
  height?: string;         // Высота секции (например, "h-screen", "h-[70vh]")
  contentClasses?: string; // Дополнительные классы для контейнера контента
  parallaxSpeed?: number;  // Скорость параллакса (0.1 - 0.5, по умолчанию 0.2)
  imageBrightness?: string; // Яркость изображения ('brightness-[.6]' для светлого фона, 'brightness-[.4]' для темного)
  blendMode?: string;      // Режим смешивания для текста (например, 'mix-blend-difference' для инверсии цвета)
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  backgroundImage,
  altText,
  children,
  height = "h-screen", // Дефолтная высота
  contentClasses = "flex items-center justify-center", // Дефолтные классы для центрирования
  parallaxSpeed = 0.2, // Дефолтная скорость параллакса
  imageBrightness = "brightness-[.6] dark:brightness-[.4]",
  blendMode = "" // По умолчанию без blend-mode
}) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });

  // Диапазон движения параллакса (от -X% до X%)
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallaxSpeed * 100}%`, `${parallaxSpeed * 100}%`]);

  return (
    <div
      ref={container}
      className={`relative w-full ${height} overflow-hidden`}
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }} // Обрезка для эффекта
    >
      {/* Фоновое изображение с параллаксом */}
      <motion.div
        style={{ y }}
        className={`absolute inset-0 z-0 ${blendMode}`} // Применяем blendMode к фону, если нужно
      >
        <img
          src={backgroundImage}
          alt={altText}
          className={`w-full h-full object-cover ${imageBrightness} transition-all duration-700 ease-in-out`}
        />
      </motion.div>

      {/* Контент, который остается на месте (или движется медленнее) */}
      <div className={`relative z-10 w-full h-full p-8 md:p-12 lg:p-16 ${contentClasses}`}>
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;
