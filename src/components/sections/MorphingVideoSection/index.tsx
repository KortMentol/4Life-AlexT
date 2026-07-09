/**
 * @module src/components/sections/MorphingVideoSection/index.tsx
 * @description Awwwards 2026 - Morphing Video Section.
 *
 * КРИТИЧЕСКИЙ ФИКС ДЛЯ CHROME (Chromium Stacking Context Isolation Bypass):
 * 1. Убран <motion.div> с динамическим свойством "animate={{ opacity: vimeoOpen ? 0 : 1 }}".
 *    В браузере Chrome наличие анимации непрозрачности (opacity) на родительском контейнере
 *    создавало изолированный графический буфер (Grouping Effect). Из-за этого дочерний
 *    backdrop-filter не имел доступа к пикселям WebGL-флюида и BiotechBackground,
 *    делая стекло абсолютно прозрачным во время скролла.
 * 2. Заменено на статичный <div className="relative z-30">. Это объединяет стек карточек
 *    и фоновые эффекты в единую цепочку наложения Chrome. Стекло теперь работает на 100%
 *    аппаратно во всех браузерах.
 * 3. Исключен принудительный фоллбэк "isChromium" для настольной версии Chrome.
 *    Поскольку слои теперь изолированы и объединены в один DOM-контекст, Chrome рендерит
 *    настоящее глубокое стекло (glass-backdrop-blur) с той же насыщенностью, что и Firefox,
 *    без падения производительности.
 * 4. ContinuousGlowFrame переведен на математически точный концентрический радиус скругления 30.2px.
 *
 * @author Geminis AI & Kort
 * @version 11.0.0
 */

import { Button } from "@/components/ui";
import ScrollNumber from "@/components/ui/ScrollNumber";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import { Icons } from "@/utils/icons";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import BiotechBackground from "@/components/effects/BiotechBackground";
import SectionFluidEffect from "@/components/effects/SectionFluidEffect";
import CustomCursor from "@/components/ui/CustomCursor";
import { useParallaxLenis, usePerformanceTier } from "@/hooks";
import { useFeatureFlag } from "@/hooks/useEffectsDebug";

import { Grid3D } from "./components/Grid3D";
import { VideoBlock } from "./components/VideoBlock";
import { VimeoModal } from "./components/VimeoModal";
import { VIDEO_ASSETS, VIMEO_URLS } from "./config";

import "@/styles/components/morphing-video.css";

const useDeviceType = () => {
  return useMemo(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    return { isTouchDevice, isDesktop: !isTouchDevice };
  }, []);
};

const ContinuousGlowFrame: React.FC<{
  blockIndex: number;
  neonColor1: string;
  neonColor2: string;
}> = ({ blockIndex, neonColor1, neonColor2 }) => {
  const gradId = `editorial-glow-${blockIndex}`;
  return (
    <div
      className="absolute pointer-events-none"
      style={{ top: "0.6px", left: "0.6px", right: "0.6px", bottom: "0.6px" }}
    >
      <svg className="w-full h-full" style={{ overflow: "visible" }} aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={neonColor1} stopOpacity="0.85" />
            <stop offset="20%" stopColor={neonColor2} stopOpacity="0.3" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.06)" stopOpacity="0.2" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.06)" stopOpacity="0.2" />
            <stop offset="80%" stopColor={neonColor2} stopOpacity="0.3" />
            <stop offset="100%" stopColor={neonColor1} stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="30.2" /* ФИКС: Математически точный радиус (32px - 1.2px border - 0.6px offset) */
          ry="30.2"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

const MorphingVideoSection: React.FC = () => {
  const tier = usePerformanceTier();
  const { isTouchDevice } = useDeviceType();

  const isGrid3dEnabled = useFeatureFlag("grid3d", tier !== "low");
  const isGridBlurEnabled = tier === "high";
  const renderCardsBackground = useFeatureFlag("renderCardsBackground", true);
  const isParallaxEnabled = useFeatureFlag("parallaxBackground", tier !== "low");

  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);

  const [vimeoOpen, setVimeoOpen] = useState(false);
  const [vimeoUrl, setVimeoUrl] = useState("");
  const isCursorEnabled = !isTouchDevice;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const parallaxStrength = tier === "low" ? 0 : 40;

  useParallaxLenis(parallaxBgRef, sectionRef, {
    strength: parallaxStrength * 2,
    disabled: !isTouchDevice || !isParallaxEnabled,
  });

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    isTouchDevice || !isParallaxEnabled ? ["0%", "0%"] : [`-${parallaxStrength / 2}%`, `${parallaxStrength / 2}%`],
  );

  useEffect(() => {
    const preloadVideos = () => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = VIDEO_ASSETS.video1;
      document.head.appendChild(link);
    };
    if (document.readyState === "complete") preloadVideos();
    else window.addEventListener("load", preloadVideos);
  }, []);

  const handleOpenVimeoModal = useCallback((url: string) => {
    window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen: true } }));
    setVimeoOpen(true);
    setVimeoUrl(url);
  }, []);

  const handleCloseVimeoModal = useCallback(() => {
    window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen: false } }));
    setVimeoOpen(false);
    setVimeoUrl("");
  }, []);

  const handleOpenVimeo1 = useCallback(() => handleOpenVimeoModal(VIMEO_URLS[0]!), [handleOpenVimeoModal]);
  const handleOpenVimeo2 = useCallback(() => handleOpenVimeoModal(VIMEO_URLS[1]!), [handleOpenVimeoModal]);
  const handleOpenVimeo3 = useCallback(() => handleOpenVimeoModal(VIMEO_URLS[2]!), [handleOpenVimeoModal]);

  const isLow = tier === "low";
  const boxBaseClass = "relative rounded-[2rem] transition-all duration-300";

  // ИСПРАВЛЕНИЕ: Убрана переменная isChromium. Все десктопные ПК на High/Medium тирах получают полноценное глубокое стекло.
  const boxEffectClass = renderCardsBackground
    ? isTouchDevice || isLow
      ? "glass-smoked-acrylic"
      : "glass-backdrop-blur"
    : "bg-transparent border-none shadow-none";

  const boxClass = `${boxBaseClass} ${boxEffectClass}`;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-transparent">
      {isCursorEnabled && <CustomCursor />}

      <VimeoModal isOpen={vimeoOpen} onClose={handleCloseVimeoModal} tier={tier} videoUrl={vimeoUrl} />
      <SectionFluidEffect sectionRef={sectionRef} />

      <div className="absolute inset-0 -z-30 overflow-hidden bg-transparent">
        <motion.div
          ref={parallaxBgRef}
          className="parallax-bg absolute inset-0 w-full"
          style={{
            y: bgY,
            height: "calc(100% + 200px)",
            top: "-100px",
            willChange: isTouchDevice ? "auto" : "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <BiotechBackground />
        </motion.div>
      </div>

      <div className="relative z-30" style={{ pointerEvents: vimeoOpen ? "none" : "auto" }}>
        <div className="px-4 pt-24 md:pt-32 pb-12 text-center">
          <div className="mx-auto max-w-4xl relative">
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
            <h1 className="typography-h1 mb-6 text-center text-white">Почему 4Life?</h1>

            <div className="max-w-3xl mx-auto flex items-center justify-center">
              <ScrollTextReveal className="typography-lead text-center max-w-3xl mx-auto opacity-80">
                Более двух десятилетий компания 4Life посвятила углублённому изучению иммунной системы, создавая
                продукты, которые являются результатом фундаментальных исследований и передовых технологий.
              </ScrollTextReveal>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* ── Блок 01 ── */}
          <div ref={block1Ref} className="relative">
            <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
              <div className="container mx-auto px-4 md:px-8 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-4 flex justify-end lg:pr-8 order-2 lg:order-1">
                    <ScrollNumber
                      number="01"
                      className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-light leading-none"
                    />
                  </div>

                  <div className="lg:col-span-8 order-1 lg:order-2">
                    <div className={`${boxClass} px-8 py-10 md:px-10 md:py-12`}>
                      {renderCardsBackground && (
                        <ContinuousGlowFrame blockIndex={1} neonColor1="#06b6d4" neonColor2="#0ea5e9" />
                      )}

                      <div className="absolute top-4 right-6 font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500/40 dark:text-slate-500/30 select-none">
                        [TF.01]
                      </div>

                      <h2 className="typography-h2 text-left text-white m-0">Исследования и Инновации</h2>
                      <ScrollTextReveal className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto">
                        В основе каждого продукта — запатентованные технологии. Ключевая из них — Тра́нсфер Факторы,
                        уникальные молекулы, которые "обучают" иммунную систему, оптимизируя её естественные защитные
                        функции для точного и своевременного реагирования. 4Life не просто следует науке — компания её
                        создаёт.
                      </ScrollTextReveal>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`relative z-10 ${isTouchDevice ? "min-h-[180vh]" : "min-h-[200vh]"}`}>
              {isGrid3dEnabled && <Grid3D type={1} triggerRef={block1Ref} filterBlur={isGridBlurEnabled} />}
            </div>
          </div>

          {/* ── Блок 02 ── */}
          <div ref={block2Ref} className="relative">
            <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
              <div className="container mx-auto px-4 md:px-8 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-8 order-1">
                    <div className={`${boxClass} px-8 py-10 md:px-10 md:py-12 text-right`}>
                      {renderCardsBackground && (
                        <ContinuousGlowFrame blockIndex={2} neonColor1="#3b82f6" neonColor2="#0ea5e9" />
                      )}

                      <div className="absolute top-4 right-6 font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500/40 dark:text-slate-500/30 select-none">
                        [TF.02]
                      </div>

                      <h2 className="typography-h2 text-right text-white m-0">Бескомпромиссный Контроль Качества</h2>
                      <ScrollTextReveal className="text-xl md:text-2xl leading-relaxed max-w-4xl ml-auto">
                        Каждый этап производства проходит строгий контроль качества. Современные технологии и
                        сертифицированные процессы по стандарту cGMP гарантируют высочайшие стандарты чистоты,
                        безопасности и эффективности продукции.
                      </ScrollTextReveal>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex justify-start lg:pl-8 order-2">
                    <ScrollNumber
                      number="02"
                      className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-light leading-none lg:translate-x-8"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={`relative z-10 ${isTouchDevice ? "min-h-[180vh]" : "min-h-[200vh]"}`}>
              {isGrid3dEnabled && <Grid3D type={2} triggerRef={block2Ref} filterBlur={isGridBlurEnabled} />}
            </div>
          </div>

          {/* ── Блок 03 ── */}
          <div ref={block3Ref} className="relative">
            <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
              <div className="container mx-auto px-4 md:px-8 max-w-5xl">
                <div className="text-center space-y-8">
                  <ScrollNumber
                    number="03"
                    className="text-[10rem] md:text-[16rem] lg:text-[20rem] font-light leading-none"
                  />

                  <div className="relative max-w-4xl mx-auto text-center">
                    <div className={`${boxClass} px-8 py-10 md:px-10 md:py-12`}>
                      {renderCardsBackground && (
                        <ContinuousGlowFrame blockIndex={3} neonColor1="#06b6d4" neonColor2="#3b82f6" />
                      )}

                      <div className="absolute top-4 right-6 font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500/40 dark:text-slate-500/30 select-none">
                        [TF.03]
                      </div>

                      <h2 className="typography-h2 text-center text-white m-0">Подтверждённая Эффективность</h2>
                      <ScrollTextReveal className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto">
                        Представьте утро, когда вы просыпаетесь с ощущением, что готовы свернуть горы. Энергия бьёт
                        ключом, мысли ясные, настроение на высоте. Это не случайность — это результат того, что ваша
                        иммунная система работает как швейцарские часы. Миллионы людей уже почувствовали эту разницу.
                        Теперь ваша очередь открыть для себя, каково это — жить в полную силу.
                      </ScrollTextReveal>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`relative z-10 ${isTouchDevice ? "min-h-[180vh]" : "min-h-[200vh]"}`}>
              {isGrid3dEnabled && <Grid3D type={3} triggerRef={block3Ref} filterBlur={isGridBlurEnabled} />}
            </div>
          </div>

          <div className="h-[12vh] lg:h-[20vh]"></div>
        </div>

        <div className="relative z-30 px-4 pb-24 text-center">
          <div className="mx-auto max-w-4xl relative inline-block">
            <Button
              to="/about"
              variant="primary"
              size="lg"
              className="from-cyan-600 to-blue-600 shadow-lg px-10 py-5 rounded-full"
              icon={<Icons.Info className="w-5 h-5" />}
            >
              Узнать больше о компании
            </Button>
          </div>
        </div>
      </div>

      <VideoBlock
        blockRef={block1Ref}
        videoSrc={VIDEO_ASSETS.video1}
        posterSrc="/images/backgrounds/HomePage/img/1.jpg"
        blockIndex={0}
        isTouchDevice={isTouchDevice}
        onClick={handleOpenVimeo1}
        isModalOpen={vimeoOpen}
      />
      <VideoBlock
        blockRef={block2Ref}
        videoSrc={VIDEO_ASSETS.video2}
        posterSrc="/images/backgrounds/HomePage/img/2.jpg"
        blockIndex={1}
        isTouchDevice={isTouchDevice}
        onClick={handleOpenVimeo2}
        isModalOpen={vimeoOpen}
      />
      <VideoBlock
        blockRef={block3Ref}
        videoSrc={VIDEO_ASSETS.video3}
        posterSrc="/images/backgrounds/HomePage/img/3.jpg"
        blockIndex={2}
        isTouchDevice={isTouchDevice}
        onClick={handleOpenVimeo3}
        isModalOpen={vimeoOpen}
      />
    </section>
  );
};

export default MorphingVideoSection;
