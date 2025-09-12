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

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

// Media imports
import productionVideo from "@/assets/videos/backgrounds/ProductsPage/Hero-section/bg-video-ProductsPage.mp4";

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
    offset: ["start 0.9", "start 0.25"],
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
  const opacity = useTransform(progress, range, [0.3, 1]);

  return (
    <span className="relative mr-3 mt-3 inline-block">
      <span className="absolute opacity-30 dark:opacity-20">{children}</span>
      <motion.span
        style={{
          opacity,
          color: "rgb(59, 130, 246)", // blue-500 for light
        }}
        className="dark:text-cyan-500"
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [canPlay, setCanPlay] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  const isMobile = window.innerWidth < 768;

  // Отдельные useScroll для каждого блока с разными настройками для ПК и мобильных
  const { scrollYProgress: block1Progress } = useScroll({
    target: block1Ref,
    offset: isMobile ? ["start +60%", "end start"] : ["start +50%", "end start"],
  });

  const { scrollYProgress: block2Progress } = useScroll({
    target: block2Ref,
    offset: isMobile ? ["start +65%", "end start"] : ["start +50%", "end start"],
  });

  const { scrollYProgress: block3Progress } = useScroll({
    target: block3Ref,
    offset: isMobile ? ["start +65%", "end start"] : ["start +50%", "end start"],
  });

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // 📱 НАСТРОЙКИ ПЛАВНОСТИ (только для мобильных)
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // Здесь можно включить пружину для сглаживания (сейчас отключена для точности)
  const smoothBlock1Progress = block1Progress;
  const smoothBlock2Progress = block2Progress;
  const smoothBlock3Progress = block3Progress;

  // Логика движения видео
  const y = useTransform([smoothBlock1Progress, smoothBlock2Progress, smoothBlock3Progress], (values: number[]) => {
    const [p1 = 0, p2 = 0, p3 = 0] = values;

    if (isMobile) {
      // 📱 МОБИЛЬНАЯ ЛОГИКА: Медленное движение 1:1 к скроллу
      // Блок 1
      if (p1 > 0.05 && p1 <= 0.95) {
        if (p1 <= 0.4) {
          const localProgress = (p1 - 0.05) / 0.35; // 35% блока на появление
          return `${100 - localProgress * 100}vh`;
        }
        if (p1 > 0.8) {
          const localProgress = (p1 - 0.8) / 0.15; // 25% блока на уход
          return `${-localProgress * 100}vh`;
        }
        return "0vh"; // Прилипание 0.4-0.8 (Прилипание 40% блока)
      }

      // Блок 2
      if (p2 > 0.05 && p2 <= 0.95) {
        if (p2 <= 0.4) {
          const localProgress = (p2 - 0.05) / 0.35; // 35% блока на появление
          return `${100 - localProgress * 100}vh`;
        }
        if (p2 > 0.8) {
          const localProgress = (p2 - 0.8) / 0.15; // 25% блока на уход
          return `${-localProgress * 100}vh`;
        }
        return "0vh"; // Прилипание 0.4-0.8 (Прилипание 40% блока)
      }

      // Блок 3
      if (p3 > 0.05 && p3 <= 0.95) {
        if (p3 <= 0.4) {
          const localProgress = (p3 - 0.05) / 0.35; // 35% блока на появление
          return `${100 - localProgress * 100}vh`;
        }
        if (p3 > 0.8) {
          const localProgress = (p3 - 0.8) / 0.15; // 25% блока на уход
          return `${-localProgress * 100}vh`;
        }
        return "0vh"; // Прилипание 0.4-0.8 (Прилипание 40% блока)
      }
    } else {
      // 🖥️ ПК ЛОГИКА: Оригинальная быстрая логика
      // Блок 1
      if (p1 > 0.1 && p1 <= 0.9) {
        if (p1 <= 0.3) {
          const localProgress = (p1 - 0.1) / 0.2;
          return `${100 - localProgress * 100}vh`;
        }
        if (p1 > 0.7) {
          const localProgress = (p1 - 0.7) / 0.2;
          return `${-localProgress * 100}vh`;
        }
        return "0vh";
      }

      // Блок 2
      if (p2 > 0.1 && p2 <= 0.9) {
        if (p2 <= 0.3) {
          const localProgress = (p2 - 0.1) / 0.2;
          return `${100 - localProgress * 100}vh`;
        }
        if (p2 > 0.7) {
          const localProgress = (p2 - 0.7) / 0.2;
          return `${-localProgress * 100}vh`;
        }
        return "0vh";
      }

      // Блок 3
      if (p3 > 0.1 && p3 <= 0.9) {
        if (p3 <= 0.3) {
          const localProgress = (p3 - 0.1) / 0.2;
          return `${100 - localProgress * 100}vh`;
        }
        if (p3 > 0.7) {
          const localProgress = (p3 - 0.7) / 0.2;
          return `${-localProgress * 100}vh`;
        }
        return "0vh";
      }
    }

    return "100vh";
  });

  // Opacity для каждого блока с раздельной логикой для ПК и мобильных
  const opacity = useTransform(
    [smoothBlock1Progress, smoothBlock2Progress, smoothBlock3Progress],
    (values: number[]) => {
      const [p1 = 0, p2 = 0, p3 = 0] = values;

      const processOpacity = (p: number) => {
        if (isMobile) {
          // 📱 НОВАЯ ЛОГИКА ПРОЗРАЧНОСТИ ДЛЯ МОБИЛЬНЫХ
          if (p > 0.05 && p <= 0.95) {
            // Появление происходит на первых 35% пути (до p = 0.4)
            if (p <= 0.25) { // Становится непрозрачным на полпути к центру
              return (p - 0.05) / 0.20;
            }
            // Исчезновение начинается, когда видео двигается вверх (p > 0.8)
            if (p > 0.8) {
              return 1 - (p - 0.8) / 0.15;
            }
            return 1; // Полностью видимо
          }
        } else {
          // 🖥️ СТАРАЯ ЛОГИКА ПРОЗРАЧНОСТИ ДЛЯ ПК (работает идеально)
          if (p > 0.1 && p <= 0.9) {
            if (p <= 0.2) return (p - 0.1) / 0.1;
            if (p >= 0.7) return 1 - (p - 0.7) / 0.2;
            return 1;
          }
        }
        return 0; // Скрыто по умолчанию
      };

      // Применяем логику к каждому блоку
      const opacity1 = processOpacity(p1);
      const opacity2 = processOpacity(p2);
      const opacity3 = processOpacity(p3);

      // Возвращаем максимальное значение, чтобы обеспечить плавный переход
      return Math.max(opacity1, opacity2, opacity3);
    }
  );

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

  return (
    <>
      <div ref={sectionRef} className="absolute inset-0 pointer-events-none" />
      <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
        <motion.div
          style={{ y, opacity }}
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
      scrub: true,
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

  const imageCount = window.innerWidth >= 1024 ? 20 : 8;
  const images = Array.from({ length: imageCount }, (_, i) => `/images/backgrounds/HomePage/img/${(i % 20) + 1}.jpg`);

  return (
    <div ref={gridRef} className="absolute inset-0 z-10 hidden lg:block" style={{ perspective: "var(--perspective)" }}>
      <div className="grid-wrap grid h-full w-full p-8" style={{ transformStyle: "preserve-3d" }}>
        {images.map((src, i) => (
          <div key={i} className="grid__item aspect-[1.5] overflow-hidden rounded-xl">
            <div className="h-full w-full bg-cover bg-center rounded-xl" style={{ backgroundImage: `url(${src})` }} />
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
      const yPos = (scrolled - 0.5) * 80;
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
          style={{ height: "calc(100% + 200px)", top: "-100px", willChange: "transform" }}
        >
          <div
            className="w-full h-full bg-repeat opacity-100 dark:opacity-0 transition-opacity duration-500"
            style={{ backgroundImage: `url(/images/backgrounds/light-pattern.webp)`, backgroundSize: "400px 400px" }}
          />
          <div
            className="absolute inset-0 w-full h-full bg-repeat opacity-0 dark:opacity-100 transition-opacity duration-500"
            style={{
              backgroundImage: `url(/images/backgrounds/dark-pattern.png)`,
              backgroundSize: "400px 400px",
              filter: "brightness(0.5) contrast(1.1)",
            }}
          />
        </div>
      </div>

      {/* Заголовок секции */}
      <div className="relative z-30 px-4 pt-24 pb-12 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-400">
            Наука • Качество • Доверие
          </h2>
          <h3 className="mb-8 text-4xl font-semibold text-gray-900 dark:text-white md:text-6xl">Почему 4Life?</h3>
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
            <div className="relative mx-auto max-w-6xl text-center">
              <div className="mb-8 text-8xl font-light text-gray-300 dark:text-gray-600">01</div>
              <h4 className="mb-6 text-3xl font-semibold text-gray-900 dark:text-white md:text-5xl">
                Исследования и Инновации
              </h4>
              <h5 className="mb-8 text-xl font-bold uppercase tracking-[0.2em] text-blue-500">НАУКА</h5>
              <ScrollText className="mx-auto max-w-5xl text-lg leading-relaxed">
                В основе каждого продукта — запатентованные технологии. Ключевая из них — Трансфер Факторы, уникальные
                молекулы, которые "обучают" иммунную систему, оптимизируя её естественные защитные функции для точного и
                своевременного реагирования. 4Life не просто следует науке — компания её создаёт.
              </ScrollText>
            </div>
          </div>
          <div className="relative z-10 min-h-[190vh] lg:min-h-[200vh]">
            <Grid3D type={1} triggerRef={block1Ref} />
          </div>
        </div>

        {/* Блок 02 - Производство */}
        <div ref={block2Ref} className="relative">
          <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
            <div className="relative mx-auto max-w-6xl text-center">
              <div className="mb-8 text-8xl font-light text-gray-300 dark:text-gray-600">02</div>
              <h4 className="mb-6 text-3xl font-semibold text-gray-900 dark:text-white md:text-5xl">
                Бескомпромиссный Контроль Качества
              </h4>
              <h5 className="mb-8 text-xl font-bold uppercase tracking-[0.2em] text-blue-600">ПРОИЗВОДСТВО</h5>
              <ScrollText className="mx-auto max-w-5xl text-lg leading-relaxed">
                Каждый этап производства проходит строгий контроль качества. Современные технологии и сертифицированные
                процессы по стандарту cGMP гарантируют высочайшие стандарты чистоты, безопасности и эффективности
                продукции.
              </ScrollText>
            </div>
          </div>
          <div className="relative z-10 min-h-[190vh] lg:min-h-[200vh]">
            <Grid3D type={2} triggerRef={block2Ref} />
          </div>
        </div>

        {/* Блок 03 - Результат */}
        <div ref={block3Ref} className="relative">
          <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
            <div className="relative mx-auto max-w-6xl text-center">
              <div className="mb-8 text-8xl font-light text-gray-300 dark:text-gray-600">03</div>
              <h4 className="mb-6 text-3xl font-semibold text-gray-900 dark:text-white md:text-5xl">
                Подтверждённая Эффективность
              </h4>
              <h5 className="mb-8 text-xl font-bold uppercase tracking-[0.2em] text-blue-600">РЕЗУЛЬТАТ</h5>
              <ScrollText className="mx-auto max-w-5xl text-lg leading-relaxed">
                Миллионы довольных клиентов по всему миру подтверждают эффективность продукции 4Life. Научно
                обоснованные решения приносят реальные, ощутимые результаты для здоровья, энергии и качества жизни.
              </ScrollText>
            </div>
          </div>
          <div className="relative z-10 min-h-[190vh] lg:min-h-[200vh]">
            <Grid3D type={3} triggerRef={block3Ref} />
          </div>
        </div>

        {/* Пространство после секции */}
        <div className="h-[50vh]"></div>
      </div>

      {/* Единое видео для всех блоков */}
      <FloatingVideo block1Ref={block1Ref} block2Ref={block2Ref} block3Ref={block3Ref} />
    </section>
  );
};

export default MorphingVideoSection;
