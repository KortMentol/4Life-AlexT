/**
 * @module src/components/sections/MorphingVideoSection/MorphingVideoSection.tsx
 * @description Awwwards-level секция с 3D grid анимациями. Профессионально адаптирована для React, GSAP ScrollTrigger и Lenis scroll,
 * с кинематографичными анимациями, адаптивным дизайном и премиальным UI/UX.
 *
 * @author Kort (адаптация для React/Lenis) / Codrops (оригинальная концепция)
 * @version 9.0.0 - Final Awwwards Polish: Redesigned UI, cinematic animations, theme adaptive background, perfect performance.
 * @see https://tympanus.net/Development/Scroll3DGrid/ - оригинальная демо Codrops
 */

import React, { useEffect, useRef } from "react";

// Объявляем gsap глобально, так как он подключается через CDN
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

// Компонент для стилизованного видео с Sci-Fi рамкой
const SciFiVideo: React.FC<{ scale: number; className?: string }> = ({ scale, className = "" }) => (
  <div className={`grid__item-inner ${className}`} style={{ transform: `scale(${scale})` }}>
    <div className="relative w-full h-full p-1 sci-fi-border rounded-2xl">
      <div className="absolute inset-0 rounded-xl blur-md sci-fi-border-glow" />
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster=""
        style={{ borderRadius: "12px", filter: "brightness(1.1) contrast(1.05)" }}
      >
        <source src="/src/assets/videos/homepage/Production/Production-4Life.mp4" type="video/mp4" />
      </video>
    </div>
  </div>
);

// Внутренний компонент для рендеринга текстового блока секции
const SectionBlock: React.FC<{
  num: string;
  title: string;
  subtitle: string;
  desc: string;
  subtitleColor: string;
  dataPoint1: string;
  dataPoint2: string;
  status: string;
  metric: string;
}> = ({ num, title, subtitle, desc, subtitleColor, dataPoint1, dataPoint2, status, metric }) => (
  <div className="max-w-6xl mx-auto text-center mb-32 relative group px-4 md:px-0">
    {/* Neon glow background */}
    <div className="absolute -inset-8 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl blur-xl group-hover:from-cyan-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 transition-all duration-700" />

    {/* Sci-fi border frame */}
    <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent h-px top-0" />
    <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent h-px bottom-0" />
    <div className="absolute -inset-4 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent w-px left-0" />
    <div className="absolute -inset-4 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent w-px right-0" />

    {/* Corner accents */}
    <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/60" />
    <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/60" />
    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/60" />
    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/60" />

    <div className="relative p-6 md:p-12 z-10 pb-16 md:pb-12">
      {/* Mobile top-left data point - ближе к углу с адаптивным шрифтом */}
      <div className="md:hidden absolute top-2 left-2 text-[10px] sm:text-xs font-mono opacity-60 text-blue-600 dark:text-cyan-400">
        {dataPoint2}
      </div>

      {/* Holographic number */}
      <div className="relative mb-6 md:mb-8">
        <div className="text-6xl md:text-8xl lg:text-9xl font-light bg-gradient-to-br from-gray-200 via-cyan-200 to-gray-400 dark:from-gray-600 dark:via-cyan-400 dark:to-gray-500 bg-clip-text text-transparent tracking-wider relative">
          {num}
          <div className="absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-light text-cyan-400/20 blur-sm animate-pulse">
            {num}
          </div>
        </div>

        <div className="absolute -left-6 md:-left-8 bottom-2 md:bottom-4 text-xs font-mono opacity-60 text-blue-600 dark:text-cyan-400 hidden md:block">
          {dataPoint2}
        </div>
      </div>

      {/* Enhanced title */}
      <div className="relative mb-6 md:mb-8">
        <h4 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-gray-900 dark:text-white tracking-tight leading-tight relative px-2 md:px-0">
          {title}
        </h4>
      </div>

      {/* Neon subtitle with glow */}
      <div className="relative mb-8 md:mb-10">
        <h5
          className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r ${subtitleColor} bg-clip-text text-transparent tracking-[0.15em] md:tracking-[0.2em] uppercase relative inline-block`}
        >
          {subtitle}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-cyan-400/20 blur-lg opacity-50" />
        </h5>
        {/* Holographic underline */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </div>

      {/* Enhanced description with mobile optimization */}
      <div className="relative px-2 md:px-0">
        <p className="text-gray-700 dark:text-gray-300 max-w-5xl mx-auto leading-relaxed text-base sm:text-lg md:text-lg font-medium relative z-10 text-left sm:text-center">
          <span className="font-mono text-sm opacity-60 text-blue-600 dark:text-cyan-400 block mb-2 text-center">
            {"> "}
          </span>
          {desc}
        </p>
        {/* Subtle scan line animation */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse" />
      </div>

      {/* Mobile bottom data point - ближе к нижней границе */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-[10px] sm:text-xs font-mono opacity-60 text-blue-600 dark:text-cyan-400">
        {dataPoint1}
      </div>

      {/* Desktop floating metrics */}
      <div className="absolute top-2 md:top-4 right-2 md:right-4 text-xs font-mono space-y-1 text-blue-600/70 dark:text-cyan-400/70 hidden md:block">
        <div>STATUS: {status}</div>
        <div>{metric}</div>
      </div>

      {/* Mobile metrics - в правом верхнем углу, ближе к углу с адаптивным шрифтом */}
      <div className="md:hidden absolute top-2 right-2 text-[10px] sm:text-xs font-mono space-y-1 text-blue-600/70 dark:text-cyan-400/70">
        <div className="text-right">STATUS: {status}</div>
        <div className="text-right">{metric}</div>
      </div>
    </div>
  </div>
);

const MorphingVideoSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scienceGridRef = useRef<HTMLDivElement>(null);
  const productionGridRef = useRef<HTMLDivElement>(null);
  const resultGridRef = useRef<HTMLDivElement>(null);
  const resultVideoRef = useRef<HTMLDivElement>(null);

  // Автоматический счетчик лет с момента основания 4Life
  const getCompanyYears = () => {
    const foundingYear = 1998;
    const currentYear = new Date().getFullYear();
    return currentYear - foundingYear;
  };

  const getResponsiveConfig = () => {
    const vw = window.innerWidth;
    if (vw <= 768) {
      // Mobile & Tablet
      return {
        perspective: 1500,
        scaleVideo: 1.3,
        scaleImage: 1.2,
        columns: 2,
        gap: "4vw",
        zRange: [-2000, 200],
        rotationMultiplier: 0.7,
      };
    } else {
      // Desktop
      return {
        perspective: 1500,
        scaleVideo: 1.5,
        scaleImage: 1.2,
        columns: 4,
        gap: "2vw",
        zRange: [-5000, -2000],
        rotationMultiplier: 1.0,
      };
    }
  };

  const generateLocalImages = (count: number) => {
    const images = [];
    const totalImagesAvailable = 49;
    for (let i = 1; i <= count; i++) {
      const imageIndex = ((i - 1) % totalImagesAvailable) + 1;
      images.push(`/src/assets/images/backgrounds/img/${imageIndex}.jpg`);
    }
    return images;
  };

  // --- АНИМАЦИИ В СТИЛЕ CODROPS, АДАПТИРОВАННЫЕ ДЛЯ REACT И LENIS ---

  const applyScienceAnimation = (grid: HTMLElement) => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gridWrap = grid.querySelector(".grid-wrap");
    if (!gridWrap) return;

    grid.style.setProperty("--perspective", `3000px`);

    window.gsap.fromTo(
      gridWrap,
      {
        xPercent: 75,
        yPercent: 50,
        rotationY: -45,
        scale: 0.7,
        opacity: 0,
      },
      {
        xPercent: 0,
        yPercent: 0,
        rotationY: 0,
        scale: 1,
        opacity: 1,
        scrollTrigger: {
          trigger: grid,
          start: "top bottom",
          end: "center center",
          scrub: 2,
          ease: "power4.out",
          immediateRender: false,
          fastScrollEnd: true,
        },
      }
    );
    window.gsap.to(gridWrap, {
      z: -4000,
      scrollTrigger: {
        trigger: grid,
        start: "center center",
        end: "bottom top",
        scrub: 1.5,
        immediateRender: false,
        fastScrollEnd: true,
      },
    });
  };

  const applyProductionAnimation = (grid: HTMLElement) => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gridWrap = grid.querySelector(".grid-wrap");
    const gridItems = grid.querySelectorAll(".grid__item");
    if (!gridWrap || !gridItems) return;

    const config = getResponsiveConfig();
    grid.style.setProperty("--perspective", `${config.perspective}px`);

    window.gsap
      .timeline({
        scrollTrigger: {
          trigger: grid,
          start: "top 80%",
          end: "bottom top",
          scrub: 2.5,
          immediateRender: false,
          fastScrollEnd: true,
        },
      })
      .fromTo(
        gridItems,
        {
          z: config.zRange[0],
          rotationX: -45 * config.rotationMultiplier,
          filter: "brightness(0%)",
          yPercent: 20,
        },
        {
          z: 0,
          rotationX: 0,
          yPercent: 0,
          filter: "brightness(120%)",
          ease: "power1.inOut",
        }
      )
      .to(gridWrap, { z: 8000 * (config.perspective / 1500) }, "<");
  };

  const applyResultImagesAnimation = (grid: HTMLElement) => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gridWrap = grid.querySelector(".grid-wrap");
    const gridItems = grid.querySelectorAll(".grid__item");
    if (!gridWrap || !gridItems) return;

    const config = getResponsiveConfig();
    grid.style.setProperty("--perspective", `${config.perspective * 2}px`);
    grid.style.setProperty("--grid-columns", config.columns.toString());

    window.gsap
      .timeline({
        scrollTrigger: {
          trigger: gridWrap,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.8,
          immediateRender: false,
          fastScrollEnd: true,
        },
      })
      .set(gridWrap, { rotationY: 30 * config.rotationMultiplier })
      .fromTo(
        gridItems,
        {
          rotationX: -70 * config.rotationMultiplier,
          filter: "brightness(0%)",
        },
        {
          rotationX: 70 * config.rotationMultiplier,
          filter: "brightness(120%)",
          stagger: 0.04,
        }
      );
  };

  const applyResultVideoAnimation = (videoContainer: HTMLElement, trigger: HTMLElement) => {
    if (!window.gsap || !window.ScrollTrigger) return;
    window.gsap.fromTo(
      videoContainer,
      { yPercent: 100, opacity: 0.5 },
      {
        yPercent: -100,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
          immediateRender: false,
          fastScrollEnd: true,
        },
      }
    );
  };

  // Функция для мгновенной установки финальных состояний без анимации
  const setFinalStatesWithoutAnimation = () => {
    if (!window.gsap) return;

    const config = getResponsiveConfig();

    // Устанавливаем финальные состояния для результатов (левая секция)
    if (resultGridRef.current) {
      const gridWrap = resultGridRef.current.querySelector(".grid-wrap");
      const gridItems = resultGridRef.current.querySelectorAll(".grid__item");

      if (gridWrap && gridItems.length > 0) {
        window.gsap.set(gridWrap, { rotationY: 30 * config.rotationMultiplier });
        window.gsap.set(gridItems, {
          rotationX: 70 * config.rotationMultiplier,
          filter: "brightness(120%)",
        });
      }
    }

    // Устанавливаем финальное состояние для видео (правая секция)
    if (resultVideoRef.current) {
      // Устанавливаем в зависимости от позиции скролла
      const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const yPercent = 100 - scrollProgress * 200; // от 100 до -100

      window.gsap.set(resultVideoRef.current, {
        yPercent: Math.max(-100, Math.min(100, yPercent)),
        opacity: 1,
      });
    }
  };

  useEffect(() => {
    let triggers: any[] = [];
    const timeoutId = setTimeout(() => {
      if (!window.gsap || !window.ScrollTrigger) return;

      // Проверяем, если пользователь вернулся назад (не на верху страницы)
      const isPageRestored = window.scrollY > 0;

      if (isPageRestored) {
        // При восстановлении страницы - сразу устанавливаем финальные состояния
        setFinalStatesWithoutAnimation();
      }

      // Применяем анимации
      if (scienceGridRef.current) applyScienceAnimation(scienceGridRef.current);
      if (productionGridRef.current) applyProductionAnimation(productionGridRef.current);
      if (resultGridRef.current) applyResultImagesAnimation(resultGridRef.current);
      if (resultVideoRef.current && resultGridRef.current) {
        applyResultVideoAnimation(resultVideoRef.current, resultGridRef.current);
      }

      triggers = window.ScrollTrigger.getAll();
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  const config = getResponsiveConfig();
  const gridItemCount = Math.min(Math.max(config.columns * 5, 10), 20);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-white dark:bg-gray-950 -z-20" />
      <style>{`
          .content { position: relative; margin-bottom: 35vh; }
          .grid { display: grid; place-items: center; padding: 2rem; width: 100%; perspective: var(--perspective); }
          .grid-wrap { height: auto; width: 100%; display: grid; grid-template-columns: repeat(var(--grid-columns, 4), 1fr); gap: var(--grid-gap, 2vw); transform-style: preserve-3d; }
          .grid__item { aspect-ratio: 1.25; width: 100%; height: auto; position: relative; display: grid; place-items: center; will-change: transform; transform-style: preserve-3d; }
          .grid__item-inner { position: relative; width: 100%; height: 100%; background-size: cover; background-position: 50% 50%; border-radius: 12px;}
          .grid__item--video-large { grid-column: 1 / -1; width: 70vw; max-width: 840px; aspect-ratio: 16/9; }
          
          .result-section-layout { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 2rem; min-height: 150vh; }
          @media (max-width: 1024px) {
              .result-section-layout { grid-template-columns: 1fr; min-height: auto; }
              .result-video-container { display: none; }
          }
          .sci-fi-border { background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(6,182,212,0.1)); }
          .sci-fi-border-glow { background: linear-gradient(135deg, rgba(59,130,246,0.05), rgba(6,182,212,0.05)); }
      `}</style>

      {/* Заголовок всей секции */}
      <div className="relative z-10 pt-16 md:pt-24 pb-16 md:pb-20 px-4 text-center">
        <div className="max-w-5xl mx-auto relative group">
          {/* Holographic background glow */}
          <div className="absolute -inset-6 md:-inset-8 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl group-hover:from-cyan-500/15 group-hover:via-blue-500/15 group-hover:to-purple-500/15 transition-all duration-1000" />

          {/* Matrix-style border */}
          <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent h-px top-0 animate-pulse" />
          <div
            className="absolute -inset-2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent h-px bottom-0 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />

          <div className="relative p-6 md:p-10 z-10">
            {/* Enhanced header with HUD elements */}
            <div className="relative mb-6">
              <h2 className="text-xs sm:text-sm font-medium tracking-[0.2em] md:tracking-[0.3em] uppercase bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent relative inline-block">
                <span className="relative z-10">Наука • Качество • Доверие</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-cyan-400/20 blur-md opacity-60" />
              </h2>

              {/* Desktop status indicators */}
              <div
                className="absolute -right-12 md:-right-16 top-0 flex flex-col text-xs font-mono space-y-1 text-blue-600/60 dark:text-cyan-400/60 hidden lg:flex"
                style={{ textAlign: "left" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>●</span>
                  <span style={{ marginLeft: "4px" }}>ONLINE</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>●</span>
                  <span style={{ marginLeft: "4px" }}>SECURED</span>
                </div>
              </div>

              {/* Mobile status indicators - под заголовком */}
              <div className="lg:hidden flex justify-center gap-6 mt-2">
                <div className="flex items-center text-xs font-mono text-blue-600/60 dark:text-cyan-400/60">
                  <span>●</span>
                  <span className="ml-1">ONLINE</span>
                </div>
                <div className="flex items-center text-xs font-mono text-blue-600/60 dark:text-cyan-400/60">
                  <span>●</span>
                  <span className="ml-1">SECURED</span>
                </div>
              </div>
            </div>

            {/* Holographic main title */}
            <div className="relative mb-8 md:mb-10">
              <h3 className="text-3xl sm:text-4xl md:text-6xl font-semibold bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-cyan-100 dark:to-white bg-clip-text text-transparent leading-tight relative px-2 md:px-0">
                Почему 4Life?
                <div className="absolute inset-0 text-3xl sm:text-4xl md:text-6xl font-semibold text-cyan-400/10 blur-sm animate-pulse">
                  Почему 4Life?
                </div>
              </h3>
            </div>

            {/* Enhanced description with mobile optimization */}
            <div className="relative px-2 md:px-0">
              <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto font-medium relative text-left sm:text-center">
                <span className="font-mono text-sm opacity-70 block mb-3 text-center text-blue-600 dark:text-cyan-400">
                  {"[SYSTEM_INFO] "}
                </span>
                Более двух десятилетий компания 4Life посвятила углублённому изучению иммунной системы, создавая
                продукты, которые являются результатом фундаментальных исследований и передовых технологий.
              </p>

              {/* Data visualization accent */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 01 НАУКА */}
      <section className="content py-4 px-4">
        <SectionBlock
          num="01"
          title="Исследования и Инновации"
          subtitle="НАУКА"
          subtitleColor="from-blue-500 to-cyan-400"
          dataPoint1="EST.1998"
          dataPoint2="[DR.LAWRENCE]"
          status="PATENTED"
          metric="TF™: ACTIVE"
          desc='В основе каждого продукта — запатентованные технологии. Ключевая из них — Трансфер Факторы, уникальные молекулы, которые "обучают" иммунную систему, оптимизируя её естественные защитные функции для точного и своевременного реагирования. 4Life не просто следует науке — компания её создаёт. Собственный Научно-консультативный совет, состоящий из врачей и иммунологов, гарантирует, что каждая формула является передовой и эффективной.'
        />
        <div ref={scienceGridRef} className="grid">
          <div className="grid-wrap">
            <div className="grid__item grid__item--video-large">
              <SciFiVideo scale={1} />
            </div>
          </div>
        </div>
      </section>

      {/* 02 ПРОИЗВОДСТВО */}
      <section className="content py-4 px-4">
        <SectionBlock
          num="02"
          title="Бескомпромиссный Контроль Качества"
          subtitle="ПРОИЗВОДСТВО"
          subtitleColor="from-blue-600 to-cyan-500"
          dataPoint1="cGMP"
          dataPoint2="[ISO-CERT]"
          status="VERIFIED"
          metric="QC: 100%"
          desc="Каждый этап производства проходит строгий контроль качества. Современные технологии и сертифицированные процессы по стандарту cGMP гарантируют высочайшие стандарты чистоты, безопасности и эффективности продукции. Компания тестирует сырье, промежуточные образцы и готовые продукты, чтобы потребители были уверены в каждой капсуле."
        />
        <div ref={productionGridRef} className="grid">
          <div className="grid-wrap">
            <div className="grid__item grid__item--video-large">
              <SciFiVideo scale={1} />
            </div>
          </div>
        </div>
      </section>

      {/* 03 РЕЗУЛЬТАТ */}
      <section className="content py-4 px-4 pb-8">
        <SectionBlock
          num="03"
          title="Подтверждённая Эффективность"
          subtitle="РЕЗУЛЬТАТ"
          subtitleColor="from-blue-600 to-cyan-500"
          dataPoint1="50+ COUNTRIES"
          dataPoint2="[$316M]"
          status="PROVEN"
          metric={`GLOBAL: ${getCompanyYears()}Y`}
          desc="Миллионы довольных клиентов по всему миру подтверждают эффективность продукции 4Life. Научно обоснованные решения приносят реальные, ощутимые результаты для здоровья, энергии и качества жизни. Это не просто слова — это глобальное сообщество людей, изменивших свою жизнь к лучшему благодаря синергии науки и природы."
        />
        <div className="result-section-layout">
          <div ref={resultGridRef} className="grid">
            <div className="grid-wrap">
              {generateLocalImages(gridItemCount).map((src) => (
                <div key={src} className="grid__item">
                  <div
                    className="grid__item-inner"
                    style={{ backgroundImage: `url(${src})`, transform: `scale(${config.scaleImage})` }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div ref={resultVideoRef} className="result-video-container h-full flex items-center justify-center">
            <div className="w-[80%] aspect-video">
              <SciFiVideo scale={1} />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default MorphingVideoSection;
