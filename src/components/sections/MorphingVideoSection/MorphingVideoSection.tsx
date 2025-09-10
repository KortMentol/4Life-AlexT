/**
 * @module src/components/sections/MorphingVideoSection/MorphingVideoSection.tsx
 * @description Awwwards-level секция с параллакс-фоном, текстовыми эффектами окрашивания, 3D grid анимациями и парящими видео.
 * Оптимизирована для максимальной производительности на всех устройствах.
 * @author Kort
 * @version 2.0.0 - Complete rewrite with parallax background, text effects, 3D animations
 */

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
    offset: ["start 0.9", "start 0.25"]
  });

  const words = children.split(" ");

  return (
    <p ref={containerRef} className={`relative ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

const Word: React.FC<{ children: string; progress: any; range: [number, number] }> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.3, 1]);

  return (
    <span className="relative mr-3 mt-3 inline-block">
      <span className="absolute opacity-30 dark:opacity-20">{children}</span>
      <motion.span 
        style={{ 
          opacity,
          color: 'rgb(59, 130, 246)' // blue-500 for light
        }}
        className="dark:text-cyan-500"
      >
        {children}
      </motion.span>
    </span>
  );
};

// Компонент для парящего видео с Awwwards логикой
const FloatingVideo: React.FC<{ triggerRef: React.RefObject<HTMLElement> }> = ({ triggerRef }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canPlay, setCanPlay] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const { scrollYProgress } = useScroll({
    target: triggerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["50%", "-50%"]);

  // Awwwards логика: показываем видео как только можем, постер только при буферизации
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setCanPlay(true);
      setIsBuffering(false);
    };
    
    const handleWaiting = () => {
      setIsBuffering(true); // Видео ждет данных - показываем постер
    };
    
    const handlePlaying = () => {
      setIsBuffering(false); // Видео играет - скрываем постер
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, []);

  // Показываем постер только если видео буферизируется или еще не готово
  const showPoster = !canPlay || isBuffering;

  return (
    <motion.div
      ref={containerRef}
      style={{ y, transform: 'translateZ(0)' }}
      className="absolute left-1/2 top-1/2 z-20 w-[70vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 will-change-transform lg:w-[60vw]"
    >
      <div className="relative aspect-video overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm">
        {/* Постер - показывается только при буферизации */}
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${
            showPoster ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(/images/backgrounds/HomePage/img/1.jpg)`
          }}
        />
        
        {/* Видео - всегда пытается играть */}
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={productionVideo} type="video/mp4" />
        </video>
      </div>
    </motion.div>
  );
};

// Компонент для 3D анимаций (только на десктопе)
const Grid3D: React.FC<{ type: 1 | 2 | 3; triggerRef: React.RefObject<HTMLElement> }> = ({ type, triggerRef }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Проверяем поддержку 3D трансформаций
    const supports3D = () => {
      const el = document.createElement('div');
      el.style.transform = 'translate3d(0,0,0)';
      return el.style.transform !== '';
    };
    
    if (!window.gsap || !window.ScrollTrigger || window.innerWidth < 1024 || !supports3D()) return;
    


    const grid = gridRef.current;
    if (!grid) return;

    const gridWrap = grid.querySelector('.grid-wrap');
    const gridItems = grid.querySelectorAll('.grid__item');
    
    if (!gridWrap || !gridItems.length) return;

    let timeline: any;

    switch (type) {
      case 1: // Движение слева направо
        grid.style.setProperty('--perspective', '1000px');
        timeline = window.gsap.timeline({
          scrollTrigger: {
            trigger: triggerRef.current,
            start: 'top bottom+=20%',
            end: 'bottom top-=20%',
            scrub: 1.2,
            fastScrollEnd: true,
            refreshPriority: -1,
            invalidateOnRefresh: false
          }
        })
        .set(gridWrap, { rotationY: 25, force3D: true })
        .set(gridItems, { 
          z: () => window.gsap.utils.random(-1600, 200),
          force3D: true,
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden'
        })
        .fromTo(gridItems, 
          { 
            xPercent: () => window.gsap.utils.random(-1000, -500),
            force3D: true
          },
          { 
            xPercent: () => window.gsap.utils.random(500, 1000),
            force3D: true,
            ease: 'none'
          }
        );
        break;

      case 2: // Подъем снизу вверх
        grid.style.setProperty('--perspective', '2000px');
        timeline = window.gsap.timeline({
          scrollTrigger: {
            trigger: triggerRef.current,
            start: 'top bottom+=20%',
            end: 'bottom top-=20%',
            scrub: 1.2,
            fastScrollEnd: true,
            refreshPriority: -1,
            invalidateOnRefresh: false
          }
        })
        .set(gridWrap, { rotationX: 20, force3D: true })
        .set(gridItems, { 
          z: () => window.gsap.utils.random(-3000, -1000),
          force3D: true,
          backfaceVisibility: 'hidden'
        })
        .fromTo(gridItems,
          { 
            yPercent: () => window.gsap.utils.random(100, 1000), 
            filter: 'brightness(200%)',
            force3D: true
          },
          { 
            yPercent: () => window.gsap.utils.random(-1000, -100), 
            filter: 'brightness(0%)',
            force3D: true,
            ease: 'none'
          }
        );
        break;

      case 3: // Движение из глубины
        grid.style.setProperty('--perspective', '1500px');
        timeline = window.gsap.timeline({
          scrollTrigger: {
            trigger: triggerRef.current,
            start: 'top bottom+=20%',
            end: 'bottom top-=20%',
            scrub: 1.2,
            fastScrollEnd: true,
            refreshPriority: -1,
            invalidateOnRefresh: false
          }
        })
        .set(gridItems, {
          z: () => window.gsap.utils.random(-5000, -2000),
          rotationX: () => window.gsap.utils.random(-65, -25),
          filter: 'brightness(0%)',
          force3D: true,
          backfaceVisibility: 'hidden'
        })
        .to(gridItems, {
          rotationX: 0,
          filter: 'brightness(120%)',
          force3D: true,
          ease: 'none'
        })
        .to(gridWrap, { 
          z: 6500, 
          force3D: true,
          ease: 'none'
        }, '<');
        break;
    }

    return () => {
      if (timeline) timeline.kill();
    };
  }, [type, triggerRef]);

  // Генерируем изображения - оптимизировано для производительности
  const imageCount = window.innerWidth >= 1024 ? 15 : 8;
  const images = Array.from({ length: imageCount }, (_, i) => 
    `/images/backgrounds/HomePage/img/${(i % 20) + 1}.jpg`
  );

  return (
    <div ref={gridRef} className="absolute inset-0 z-10 hidden lg:block" style={{ perspective: 'var(--perspective)' }}>
      <div className="grid-wrap grid h-full w-full grid-cols-4 gap-[2vw] p-8" style={{ transformStyle: 'preserve-3d' }}>
        {images.map((src, i) => (
          <div key={i} className="grid__item aspect-[1.25] overflow-hidden rounded-xl">
            <div 
              className="h-full w-full bg-cover bg-center rounded-xl"
              style={{ backgroundImage: `url(${src})` }}
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

  // Оптимизированный параллакс с throttling
  useEffect(() => {
    let lastTime = 0;
    const throttleDelay = 16; // ~60fps максимум
    
    const handleScroll = () => {
      const now = performance.now();
      if (now - lastTime < throttleDelay) return;
      lastTime = now;
      
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const yPos = (scrolled - 0.5) * 20; // -10% to 10%
      
      const bg = sectionRef.current.querySelector('.parallax-bg') as HTMLElement;
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
    
    window.addEventListener('scroll', optimizedScroll, { passive: true });
    return () => window.removeEventListener('scroll', optimizedScroll);
  }, []);

  // Предзагрузка видео сразу после загрузки страницы
  useEffect(() => {
    const preloadVideos = () => {
      // Используем link preload для эффективной предзагрузки
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = productionVideo;
      document.head.appendChild(link);
    };

    if (document.readyState === 'complete') {
      preloadVideos();
    } else {
      window.addEventListener('load', preloadVideos);
    }
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[400vh] overflow-hidden bg-transparent">
      {/* Параллакс фон - плитки как у Immersive Garden */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <div 
          className="parallax-bg absolute inset-0 w-full"
          style={{ 
            height: 'calc(100% + 200px)',
            top: '-100px',
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        >
          <div 
            className="w-full h-full bg-repeat opacity-100 dark:opacity-0 transition-opacity duration-500"
            style={{
              backgroundImage: `url(/images/backgrounds/light-pattern.webp)`,
              backgroundSize: '400px 400px',
              backgroundPosition: '0 0'
            }}
          />
          <div 
            className="absolute inset-0 w-full h-full bg-repeat opacity-0 dark:opacity-100 transition-opacity duration-500"
            style={{
              backgroundImage: `url(/images/backgrounds/dark-pattern.png)`,
              backgroundSize: '400px 400px',
              backgroundPosition: '0 0'
            }}
          />
        </div>
      </div>

      {/* Заголовок секции */}
      <div className="relative z-30 px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-400">
            Наука • Качество • Доверие
          </h2>
          <h3 className="mb-8 text-4xl font-semibold text-gray-900 dark:text-white md:text-6xl">
            Почему 4Life?
          </h3>
          <ScrollText className="mx-auto max-w-4xl text-lg leading-relaxed">
            Более двух десятилетий компания 4Life посвятила углублённому изучению иммунной системы, создавая продукты, которые являются результатом фундаментальных исследований и передовых технологий.
          </ScrollText>
        </div>
      </div>

      {/* Блок 01 - Наука */}
      <div ref={block1Ref} className="relative z-20 min-h-screen px-4 py-16">
        <Grid3D type={1} triggerRef={block1Ref} />
        <FloatingVideo triggerRef={block1Ref} />
        
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-8 text-8xl font-light text-gray-300 dark:text-gray-600">01</div>
          <h4 className="mb-6 text-3xl font-semibold text-gray-900 dark:text-white md:text-5xl">
            Исследования и Инновации
          </h4>
          <h5 className="mb-8 text-xl font-bold uppercase tracking-[0.2em] text-blue-500">
            НАУКА
          </h5>
          <ScrollText className="mx-auto max-w-5xl text-lg leading-relaxed">
            В основе каждого продукта — запатентованные технологии. Ключевая из них — Трансфер Факторы, уникальные молекулы, которые "обучают" иммунную систему, оптимизируя её естественные защитные функции для точного и своевременного реагирования. 4Life не просто следует науке — компания её создаёт.
          </ScrollText>
        </div>
      </div>

      {/* Блок 02 - Производство */}
      <div ref={block2Ref} className="relative z-20 min-h-screen px-4 py-16">
        <Grid3D type={2} triggerRef={block2Ref} />
        <FloatingVideo triggerRef={block2Ref} />
        
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-8 text-8xl font-light text-gray-300 dark:text-gray-600">02</div>
          <h4 className="mb-6 text-3xl font-semibold text-gray-900 dark:text-white md:text-5xl">
            Бескомпромиссный Контроль Качества
          </h4>
          <h5 className="mb-8 text-xl font-bold uppercase tracking-[0.2em] text-blue-600">
            ПРОИЗВОДСТВО
          </h5>
          <ScrollText className="mx-auto max-w-5xl text-lg leading-relaxed">
            Каждый этап производства проходит строгий контроль качества. Современные технологии и сертифицированные процессы по стандарту cGMP гарантируют высочайшие стандарты чистоты, безопасности и эффективности продукции.
          </ScrollText>
        </div>
      </div>

      {/* Блок 03 - Результат */}
      <div ref={block3Ref} className="relative z-20 min-h-screen px-4 py-16">
        <Grid3D type={3} triggerRef={block3Ref} />
        <FloatingVideo triggerRef={block3Ref} />
        
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-8 text-8xl font-light text-gray-300 dark:text-gray-600">03</div>
          <h4 className="mb-6 text-3xl font-semibold text-gray-900 dark:text-white md:text-5xl">
            Подтверждённая Эффективность
          </h4>
          <h5 className="mb-8 text-xl font-bold uppercase tracking-[0.2em] text-blue-600">
            РЕЗУЛЬТАТ
          </h5>
          <ScrollText className="mx-auto max-w-5xl text-lg leading-relaxed">
            Миллионы довольных клиентов по всему миру подтверждают эффективность продукции 4Life. Научно обоснованные решения приносят реальные, ощутимые результаты для здоровья, энергии и качества жизни.
          </ScrollText>
        </div>
      </div>
    </section>
  );
};

export default MorphingVideoSection;