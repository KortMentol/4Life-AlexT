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
 * @module components/ui/ParallaxSection
 * @description
 * Создает полноэкранную или кастомную секцию с "умным" параллакс-эффектом для фона (изображение или видео).
 * Анимация реализована через `framer-motion` для максимальной производительности и плавности.
 * Компонент автоматически рассчитывает смещение, чтобы избежать появления пустых полей при любой силе параллакса.
 *
 * @author Kort
 * @version 1.1.0
 *
 * @param {string} [backgroundImage] - URL фонового изображения по умолчанию.
 * @param {string} [backgroundImageMobile] - URL фонового изображения для мобильных устройств.
 * @param {string} [backgroundImagePC] - URL фонового изображения для десктопных устройств.
 * @param {string} [backgroundVideo] - URL фонового видео (имеет приоритет над изображениями).
 * @param {string} altText - Альтернативный текст для фонового изображения.
 * @param {ReactNode} [children] - Дочерние элементы, отображаемые поверх фона.
 * @param {string} [height='h-screen'] - Высота секции (CSS-класс).
 * @param {string} [contentClasses] - CSS-классы для стилизации контейнера с контентом.
 * @param {number} [parallaxStrength=40] - Сила параллакс-эффекта в `vh`. **Примечание:** В `HomePage.tsx` это значение переопределяется глобальной константой `GLOBAL_PARALLAX_STRENGTH`.
 * @param {string} [imageBrightness] - CSS-класс для управления яркостью фона.
 * @param {boolean} [lazyLoad=true] - Включает ленивую загрузку для фонового изображения.
 *
 * @usage
 * Компонент является основой для всех крупных визуальных секций на главной странице:
 * 1. **`src/pages/HomePage.tsx` (строка 125):** Главный экран (Hero Section).
 *    - **Контекст:** Используется с фоновым видео на десктопе и статичным изображением на мобильных.
 *    - **Ключевые props:** `backgroundVideo`, `backgroundImageMobile`, `height="h-screen"`, `parallaxStrength={GLOBAL_PARALLAX_STRENGTH}`.
 * 2. **`src/pages/HomePage.tsx` (строка 256):** Секция с продуктами.
 *    - **Контекст:** Демонстрирует карусель/сетку продуктов на фоне статичного изображения.
 *    - **Ключевые props:** `backgroundImage`, `height="auto"`, `lazyLoad={true}`, `parallaxStrength={GLOBAL_PARALLAX_STRENGTH}`.
 *
 * @example
 * <ParallaxSection
 *   backgroundImagePC="/assets/images/background.jpg"
 *   backgroundImageMobile="/assets/images/background-mobile.jpg"
 *   altText="Красивый фон"
 *   parallaxStrength={40}
 * >
 *   <h1 className="text-white">Контент секции</h1>
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
        <motion.div className={`relative w-full h-full ${imageBrightness}`} style={{ y, willChange: "transform" }}>
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
