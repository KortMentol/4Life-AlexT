/**
 * @module src/components/sections/MorphingVideoSection/MorphingVideoSection.tsx
 * @description Awwwards-level секция с параллакс-фоном, текстовыми эффектами, 3D grid анимациями и парящими видео.
 * Версия 3.1.0: Добавлена мобильная оптимизация с сохранением ПК функциональности.
 * @author Kort
 * @version 3.1.0 - Mobile optimization added while preserving desktop functionality.
 * @usage
 * 1. src/pages/HomePage.tsx - В основной секции "Почему 4Life?" для демонстрации преимуществ компании
 * @example
 * <MorphingVideoSection />
 */

import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";

// Media imports
import productionVideo from "@/assets/videos/backgrounds/ProductsPage/Hero-section/bg-video-ProductsPage.mp4";

// Components
import ScrollNumber from "@/components/ui/ScrollNumber";

// Hooks
import { useTheme } from "@/hooks";

// Глобальные типы для GSAP
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

// Компонент для текста с эффектом окрашивания при скролле
const ScrollText: React.FC<{ children: string; className?: string }> = ({ children, className = "" }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 1", "end 0.6"],
  });

  const words = children.split(" ");

  return (
    <p ref={containerRef} className={`relative ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

const Word: React.FC<{ children: string; progress: any; range: [number, number] }> = ({
  children,
  progress,
  range,
}) => {
  const { theme } = useTheme();
  const opacity = useTransform(progress, range, [theme === "dark" ? 0.1 : 0.2, 1]);

  return (
    <span className="relative mr-3 mt-3 inline-block">
      <span className="absolute opacity-0">{children}</span>
      <motion.span
        style={{
          opacity,
          color: theme === "dark" ? "#00d4ff" : "#0066ff",
        }}
      >
        {children}
      </motion.span>
    </span>
  );
};

// Компонент для парящего видео с правильной логикой для трех блоков
const FloatingVideo: React.FC<{
  block1Ref: React.RefObject<HTMLDivElement>;
  block2Ref: React.RefObject<HTMLDivElement>;
  block3Ref: React.RefObject<HTMLDivElement>;
}> = ({ block1Ref, block2Ref, block3Ref }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canPlay, setCanPlay] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const isMobile = useMemo(() => typeof window !== "undefined" && window.innerWidth < 768, []);

  // Создаем motion values для y и opacity
  const y = useMotionValue("100vh");
  const opacity = useMotionValue(0);

  // Используем useScroll для отслеживания общего скролла страницы
  const { scrollY } = useScroll();

  // Ref для хранения кешированных позиций и размеров.
  const geometries = useRef<{ [key: string]: { top: number; height: number } }>({});

  // Эффект №1: Кеширование геометрии блоков.
  // Срабатывает один раз при монтировании и при изменении размера окна.
  useEffect(() => {
    const updateGeometries = () => {
      // Используем requestAnimationFrame для гарантии, что DOM уже отрисован
      requestAnimationFrame(() => {
        if (block1Ref.current) geometries.current['1'] = { top: block1Ref.current.offsetTop, height: block1Ref.current.offsetHeight };
        if (block2Ref.current) geometries.current['2'] = { top: block2Ref.current.offsetTop, height: block2Ref.current.offsetHeight };
        if (block3Ref.current) geometries.current['3'] = { top: block3Ref.current.offsetTop, height: block3Ref.current.offsetHeight };
      });
    };

    updateGeometries(); // Вызываем один раз для начального кеширования
    window.addEventListener('resize', updateGeometries, { passive: true });

    return () => {
      window.removeEventListener('resize', updateGeometries);
    };
  }, [block1Ref, block2Ref, block3Ref]); // Зависимости от ref'ов

  // Эффект №2: Анимация на основе скролла и кешированных данных.
  useEffect(() => {
    const calculateState = (latestScrollY: number) => {
      const vh = window.innerHeight;
      let finalY = 100 * vh;
      let finalOpacity = 0;

      // ВАША ФУНКЦИЯ ОБРАБОТКИ БЛОКА С ОДНИМ ИЗМЕНЕНИЕМ
      const processBlock = (blockIndex: number) => {
        const geo = geometries.current[String(blockIndex)];
        if (!geo) return { y: 100 * vh, opacity: 0 };
        
        const start = geo.top; // БЕРЕМ ИЗ КЕША
        const blockHeight = geo.height; // БЕРЕМ ИЗ КЕША

        // Вся ваша логика ниже остается АБСОЛЮТНО НЕИЗМЕННОЙ
        const progress = (latestScrollY + vh - start) / (vh + blockHeight);

        let appearStart, appearEnd, disappearStart, disappearEnd;
        if (isMobile) {
          appearStart = 0.55; appearEnd = 0.95; disappearStart = 1.2; disappearEnd = 1.6;
        } else {
          appearStart = blockIndex === 3 ? 0.65 : 0.6;
          appearEnd = blockIndex === 3 ? 0.85 : 0.8;
          disappearStart = 1.1;
          disappearEnd = 1.35;
        }
        
        if (progress >= appearStart && progress <= disappearEnd) {
          if (progress <= appearEnd) {
            const localProgress = Math.max(0, Math.min(1, (progress - appearStart) / (appearEnd - appearStart)));
            return { y: (1 - localProgress) * vh, opacity: localProgress };
          }
          if (progress >= disappearStart) {
            const localProgress = Math.max(0, Math.min(1, (progress - disappearStart) / (disappearEnd - disappearStart)));
            return { y: -localProgress * vh, opacity: Math.max(0, 1 - localProgress) };
          }
          return { y: 0, opacity: 1 };
        }
        return { y: 100 * vh, opacity: 0 };
      };

      const state1 = processBlock(1);
      const state2 = processBlock(2);
      const state3 = processBlock(3);

      if (state1.opacity > finalOpacity) { finalY = state1.y; finalOpacity = state1.opacity; }
      if (state2.opacity > finalOpacity) { finalY = state2.y; finalOpacity = state2.opacity; }
      if (state3.opacity > finalOpacity) { finalY = state3.y; finalOpacity = state3.opacity; }

      y.set(`${(finalY / vh) * 100}vh`);
      opacity.set(Math.min(1, finalOpacity));
    };

    const unsubscribe = scrollY.on("change", calculateState);
    return () => unsubscribe();
  }, [scrollY, y, opacity, isMobile]); // Убираем ref'ы из зависимостей

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleCanPlay = () => {
      setCanPlay(true);
      setIsBuffering(false);
    };
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
    };
  }, []);

  const showPoster = !canPlay || isBuffering;

  // Используем motion values напрямую в motion.div
  return (
    <>
      <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
        <motion.div
          style={{ y, opacity }} // <--- Прямое использование
          className="w-[95vw] max-w-[1000px] will-change-transform lg:w-[60vw] pointer-events-auto"
        >
          <div className="relative aspect-video overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm">
            <div
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${showPoster ? "opacity-100" : "opacity-0"}`}
              style={{ backgroundImage: `url(/images/backgrounds/HomePage/img/1.jpg)` }}
            />
            <video ref={videoRef} className="h-full w-full object-cover" autoPlay loop muted playsInline preload="auto">
              <source src={productionVideo} type="video/mp4" />
            </video>
          </div>
        </motion.div>
      </div>
    </>
  );
};

// Компонент для 3D анимаций
const Grid3D: React.FC<{ type: 1 | 2 | 3; triggerRef: React.RefObject<HTMLElement> }> = ({ type, triggerRef }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supports3D = () => {
      const el = document.createElement("div");
      el.style.transform = "translate3d(0,0,0)";
      return el.style.transform !== "";
    };

    if (!window.gsap || !window.ScrollTrigger || window.innerWidth < 1024 || !supports3D()) return;

    const grid = gridRef.current;
    if (!grid) return;

    const gridWrap = grid.querySelector(".grid-wrap");
    const gridItems = grid.querySelectorAll(".grid__item");
    if (!gridWrap || !gridItems.length) return;

    let timeline: any;

    const scrollTriggerConfig = {
      trigger: triggerRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.5,
      ease: "none",
      invalidateOnRefresh: true,
    };

    switch (type) {
      case 1:
        grid.style.setProperty("--perspective", "1000px");
        grid.style.setProperty("--grid-inner-scale", "0.5");
        timeline = window.gsap
          .timeline({ scrollTrigger: scrollTriggerConfig })
          .set(gridWrap, { rotationY: 25, force3D: true })
          .set(gridItems, { z: () => window.gsap.utils.random(-1600, 200), force3D: true })
          .fromTo(
            gridItems,
            { xPercent: () => window.gsap.utils.random(-1000, -500) },
            { xPercent: () => window.gsap.utils.random(500, 1000), ease: "none" }
          );
        break;

      case 2:
        grid.style.setProperty("--grid-width", "160%");
        grid.style.setProperty("--perspective", "2000px");
        grid.style.setProperty("--grid-inner-scale", "0.5");
        grid.style.setProperty("--grid-item-ratio", "0.8");
        grid.style.setProperty("--grid-columns", "6");
        grid.style.setProperty("--grid-gap", "14vw");

        timeline = window.gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: scrollTriggerConfig })
          .set(gridWrap, { rotationX: 20, force3D: true })
          .set(gridItems, { z: () => window.gsap.utils.random(-3000, -1000), force3D: true })
          .fromTo(
            gridItems,
            { yPercent: () => window.gsap.utils.random(100, 1000), rotationY: -45, filter: "brightness(200%)" },
            {
              ease: "power2",
              yPercent: () => window.gsap.utils.random(-1000, -100),
              rotationY: 45,
              filter: "brightness(50%)",
            },
            0
          )
          .fromTo(gridWrap, { rotationZ: -5 }, { rotationX: -20, rotationZ: 10, scale: 1.2 }, 0);
        break;

      case 3:
        grid.style.setProperty("--grid-width", "105%");
        grid.style.setProperty("--grid-columns", "8");
        grid.style.setProperty("--perspective", "1500px");
        grid.style.setProperty("--grid-inner-scale", "0.5");
        timeline = window.gsap
          .timeline({ scrollTrigger: scrollTriggerConfig })
          .set(gridItems, {
            transformOrigin: "50% 0%",
            z: () => window.gsap.utils.random(-5000, -2000),
            rotationX: () => window.gsap.utils.random(-65, -25),
            filter: "brightness(0%)",
            force3D: true,
          })
          .to(gridItems, {
            xPercent: () => window.gsap.utils.random(-150, 150),
            yPercent: () => window.gsap.utils.random(-300, 300),
            rotationX: 0,
            filter: "brightness(200%)",
            ease: "none",
          })
          .to(gridWrap, { z: 6500, ease: "none" }, 0);
        break;
    }

    return () => {
      if (timeline) timeline.kill();
    };
  }, [type, triggerRef]);

  const imageCount = useMemo(() => (window.innerWidth >= 1024 ? 20 : 8), []);
  const images = useMemo(
    () => Array.from({ length: imageCount }, (_, i) => `/images/backgrounds/HomePage/img/${(i % 20) + 1}.jpg`),
    [imageCount]
  );

  return (
    <div ref={gridRef} className="absolute inset-0 z-10 hidden lg:block" style={{ perspective: "var(--perspective)" }}>
      <div className="grid-wrap grid h-full w-full p-8" style={{ transformStyle: "preserve-3d" }}>
        {images.map((src, i) => (
          <div key={i} className="grid__item aspect-[1.5] overflow-hidden rounded-xl">
            <div
              className="h-full w-full bg-cover bg-center rounded-xl"
              style={
                {
                  backgroundImage: `url(${src})`,
                  imageRendering: "auto",
                  WebkitImageRendering: "auto",
                  MozImageRendering: "auto",
                  msImageRendering: "auto",
                } as React.CSSProperties
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Основной компонент секции
const MorphingVideoSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const yPos = (scrolled - 0.5) * 120;
      const bg = sectionRef.current.querySelector(".parallax-bg") as HTMLElement;
      if (bg) {
        bg.style.transform = `translate3d(0, ${yPos}%, 0)`;
      }
    };

    let ticking = false;
    const optimizedScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", optimizedScroll, { passive: true });
    return () => window.removeEventListener("scroll", optimizedScroll);
  }, []);

  useEffect(() => {
    const preloadVideos = () => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = productionVideo;
      document.head.appendChild(link);
    };
    if (document.readyState === "complete") preloadVideos();
    else window.addEventListener("load", preloadVideos);
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-transparent">
      {/* Параллакс фон */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <div
          className="parallax-bg absolute inset-0 w-full"
          style={{
            height: "calc(100% + 200px)",
            top: "-100px",
            willChange: "transform",
            contain: window.innerWidth < 768 ? "layout style paint" : "none",
          }}
        >
          <div
            className="w-full h-full bg-repeat opacity-100 dark:opacity-0 transition-opacity duration-500"
            style={{ backgroundImage: `url(/images/backgrounds/light-pattern.webp)`, backgroundSize: "400px 400px" }}
          />
          {/* ПК версия темного фона */}
          <div
            className="absolute inset-0 w-full h-full bg-repeat opacity-0 dark:opacity-100 transition-opacity duration-500 hidden md:block"
            style={{
              backgroundImage: `url(/images/backgrounds/dark-pattern.png)`,
              backgroundSize: "400px 400px",
              filter: "brightness(0.6) contrast(1.1)",
            }}
          />
          {/* Мобильная версия темного фона (светлее на 10%) */}
          <div
            className="absolute inset-0 w-full h-full bg-repeat opacity-0 dark:opacity-100 transition-opacity duration-500 block md:hidden"
            style={{
              backgroundImage: `url(/images/backgrounds/dark-pattern.png)`,
              backgroundSize: "400px 400px",
              filter: "brightness(0.7) contrast(1.1)",
            }}
          />
        </div>
      </div>

      {/* Заголовок секции */}
      <div className="relative z-30 px-4 pt-24 pb-12 text-center">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-4 text-sm font-medium uppercase tracking-[0.2em]"
            style={{
              background: "linear-gradient(90deg, #0ea5e9, #06b6d4, #0ea5e9)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradient-shift 6s ease-in-out infinite",
              textShadow: "0 0 20px rgba(14, 165, 233, 0.3)",
              filter: "drop-shadow(0 0 8px rgba(14, 165, 233, 0.2))",
            }}
          >
            Наука • Качество • Доверие
          </h2>
          <h3
            className="mb-8 text-4xl font-semibold md:text-6xl"
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #334155 30%, #475569 60%, #1e293b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 2px rgba(59, 130, 246, 0.4))",
              position: "relative",
            }}
          >
            Почему 4Life?
          </h3>
          <ScrollText className="mx-auto max-w-4xl text-lg leading-relaxed">
            Более двух десятилетий компания 4Life посвятила углублённому изучению иммунной системы, создавая продукты,
            которые являются результатом фундаментальных исследований и передовых технологий.
          </ScrollText>
        </div>
      </div>

      <div className="relative">
        {/* Блок 01 - Наука */}
        <div ref={block1Ref} className="relative">
          <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-3 order-2 lg:order-1">
                  <ScrollNumber
                    number="01"
                    className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-thin leading-none"
                  />
                </div>
                <div className="lg:col-span-9 order-1 lg:order-2 space-y-6">
                  <h4
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight"
                    style={{
                      background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 1px rgba(59, 130, 246, 0.3))",
                      position: "relative",
                    }}
                  >
                    Исследования и Инновации
                  </h4>
                  <ScrollText className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 dark:text-cyan-300 max-w-4xl">
                    В основе каждого продукта — запатентованные технологии. Ключевая из них — Трансфер Факторы,
                    уникальные молекулы, которые "обучают" иммунную систему, оптимизируя её естественные защитные
                    функции для точного и своевременного реагирования. 4Life не просто следует науке — компания её
                    создаёт.
                  </ScrollText>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 min-h-[200vh] lg:min-h-[180vh]">
            <Grid3D type={1} triggerRef={block1Ref} />
          </div>
        </div>

        {/* Блок 02 - Производство */}
        <div ref={block2Ref} className="relative">
          <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-9 order-1 space-y-6 text-right">
                  <h4
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight"
                    style={{
                      background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 1px rgba(59, 130, 246, 0.3))",
                      position: "relative",
                    }}
                  >
                    Бескомпромиссный Контроль Качества
                  </h4>
                  <ScrollText className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 dark:text-cyan-300 max-w-4xl ml-auto">
                    Каждый этап производства проходит строгий контроль качества. Современные технологии и
                    сертифицированные процессы по стандарту cGMP гарантируют высочайшие стандарты чистоты, безопасности
                    и эффективности продукции.
                  </ScrollText>
                </div>
                <div className="lg:col-span-3 order-2 flex justify-end lg:justify-center xl:justify-end">
                  <ScrollNumber
                    number="02"
                    className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-thin leading-none lg:translate-x-8"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 min-h-[200vh] lg:min-h-[180vh]">
            <Grid3D type={2} triggerRef={block2Ref} />
          </div>
        </div>

        {/* Блок 03 - Результат */}
        <div ref={block3Ref} className="relative">
          <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
              <div className="text-center space-y-8">
                <ScrollNumber
                  number="03"
                  className="text-[10rem] md:text-[16rem] lg:text-[20rem] font-thin leading-none"
                />
                <div className="space-y-6">
                  <h4
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight max-w-4xl mx-auto"
                    style={{
                      background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 1px rgba(59, 130, 246, 0.3))",
                      position: "relative",
                    }}
                  >
                    Подтверждённая Эффективность
                  </h4>
                  <ScrollText className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 dark:text-cyan-300 max-w-4xl mx-auto">
                    Миллионы довольных клиентов по всему миру подтверждают эффективность продукции 4Life. Научно
                    обоснованные решения приносят реальные, ощутимые результаты для здоровья, энергии и качества жизни.
                  </ScrollText>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 min-h-[200vh] lg:min-h-[180vh]">
            <Grid3D type={3} triggerRef={block3Ref} />
          </div>
        </div>

        {/* Пространство после секции */}
        <div className="h-[36vh] lg:h-[45vh]"></div>
      </div>

      {/* Единое видео для всех блоков */}
      <FloatingVideo block1Ref={block1Ref} block2Ref={block2Ref} block3Ref={block3Ref} />
    </section>
  );
};

export default MorphingVideoSection;
