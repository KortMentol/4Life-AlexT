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
  clipPath?: string;       // Кастомный clipPath для обрезки секции
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  backgroundImage,
  altText,
  children,
  height = "h-screen", // Дефолтная высота
  contentClasses = "flex items-center justify-center", // Дефолтные классы для центрирования
  parallaxSpeed = 0.2, // Дефолтная скорость параллакса
  imageBrightness = "brightness-[.6] dark:brightness-[.4]",
  blendMode = "", // По умолчанию без blend-mode
  clipPath = "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" // Дефолтный clipPath
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Диапазон движения параллакс-фона
  // Увеличиваем диапазон для более заметного эффекта
  const parallaxRange = parallaxSpeed * 20; // Например, 0.2 * 20 = 4, значит -4vh до 4vh
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallaxRange}vh`, `${parallaxRange}vh`]);

  // Параметры для плавности движения
  const parallaxTransition = {
    type: "spring",
    stiffness: 150,
    damping: 25,
    mass: 1,
    restDelta: 0.001
  };

  // Расчет высоты для fixed контейнера изображения
  const fixedImageContainerHeight = `calc(100% + ${parallaxRange * 2}vh)`;
  const fixedImageContainerTop = `-${parallaxRange}vh`;

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${height} overflow-hidden`}
      style={{ clipPath: clipPath }} // Применяем clipPath к родительскому контейнеру
    >
      {/* Контейнер для фиксированного фонового изображения */}
      <div 
        className={`fixed left-0 w-full z-0 ${blendMode}`}
        style={{ top: fixedImageContainerTop, height: fixedImageContainerHeight }}
      >
        <motion.img
          src={backgroundImage}
          alt={altText}
          className={`w-full h-full object-cover ${imageBrightness} transition-all duration-700 ease-in-out`}
          style={{ y }}
          transition={parallaxTransition}
        />
      </div>

      {/* Слой для затемнения или наложения */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div> 

      {/* Контент секции, который прокручивается поверх фиксированного фона */}
      <div className={`relative z-20 w-full h-full p-8 md:p-12 lg:p-16 ${contentClasses}`}>
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;
