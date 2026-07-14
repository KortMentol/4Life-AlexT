/**
 * @module src/components/sections/MorphingVideoSection/index.tsx
 * @description Awwwards 2026 - Morphing Video Section.
 * ИСПРАВЛЕНИЯ: Внедрен React Conditional Rendering. На мобильных устройствах
 * десктопная разметка физически не рендерится в DOM, что освобождает ОЗУ телефона.
 * @author Geminis AI & Kort
 * @version 13.3.0
 */

import { Button } from "@/components/ui";
import ScrollNumber from "@/components/ui/ScrollNumber";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import { Icons } from "@/utils/icons";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import BiotechBackground from "@/components/effects/BiotechBackground";
import SectionFluidEffect from "@/components/effects/SectionFluidEffect";
import CustomCursor from "@/components/ui/CustomCursor";
import { usePerformanceTier } from "@/hooks";
import { useEffectsDebug } from "@/hooks/useEffectsDebug";

import { Grid3D } from "./components/Grid3D";
import { VideoBlock } from "./components/VideoBlock";
import { VimeoModal } from "./components/VimeoModal";
import { VIDEO_ASSETS, VIMEO_URLS } from "./config";

import "@/styles/components/morphing-video.css";

const useDeviceType = () => {
  return useMemo(() => {
    const isTouchDevice = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
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
          rx="30.2"
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
  const efxFlags = useEffectsDebug();
  const { isTouchDevice } = useDeviceType();

  const isGrid3dEnabled = efxFlags.grid3d;

  const sectionRef = useRef<HTMLDivElement>(null);
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);

  const [vimeoOpen, setVimeoOpen] = useState(false);
  const [vimeoUrl, setVimeoUrl] = useState("");
  const isCursorEnabled = !isTouchDevice;

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

  const boxBaseClass = "relative rounded-[2rem] transition-all duration-300";

  const boxEffectClass = efxFlags.renderCardsBackground
    ? efxFlags.cardsBackdropBlur
      ? "glass-backdrop-blur"
      : "glass-smoked-acrylic"
    : "bg-transparent border-none shadow-none";

  const boxClass = `${boxBaseClass} ${boxEffectClass}`;

  const customProperties = {
    "--card-blur-value": efxFlags.cardsBackdropBlur ? "16px" : "0px",
  } as React.CSSProperties;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-transparent">
      {isCursorEnabled && <CustomCursor />}

      <VimeoModal isOpen={vimeoOpen} onClose={handleCloseVimeoModal} tier={tier} videoUrl={vimeoUrl} />

      {!isTouchDevice && <SectionFluidEffect sectionRef={sectionRef} />}

      <div className="absolute inset-0 -z-30 overflow-hidden bg-transparent">
        <div className="absolute inset-0 w-full h-full">
          <BiotechBackground />
        </div>
      </div>

      {/* ФИКС: Рендерим десктоп ТОЛЬКО на не-тач устройствах */}
      {!isTouchDevice ? (
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
                      <div className={`${boxClass} px-8 py-10 md:px-10 md:py-12`} style={customProperties}>
                        {efxFlags.renderCardsBackground && (
                          <ContinuousGlowFrame blockIndex={1} neonColor1="#06b6d4" neonColor2="#0ea5e9" />
                        )}

                        <div className="absolute top-4 right-6 font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500/40 dark:text-slate-500/30 select-none">
                          [TF.01]
                        </div>

                        <h2 className="typography-h2 text-left text-white m-0">Исследования и Инновации</h2>
                        <ScrollTextReveal className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto">
                          В основе каждого продукта — запатентованные технологии. Ключевая из них — Трафер Факторы,
                          уникальные молекулы, которые "обучают" иммунную систему, оптимизируя её естественные защитные
                          функции для точного и своевременного реагирования. 4Life не просто следует науке — компания её
                          создаёт.
                        </ScrollTextReveal>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative z-10 min-h-[200vh]">
                {isGrid3dEnabled && <Grid3D type={1} triggerRef={block1Ref} />}
              </div>
            </div>

            {/* ── Блок 02 ── */}
            <div ref={block2Ref} className="relative">
              <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
                <div className="container mx-auto px-4 md:px-8 max-w-5xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 order-1">
                      <div className={`${boxClass} px-8 py-10 md:px-10 md:py-12 text-right`} style={customProperties}>
                        {efxFlags.renderCardsBackground && (
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
              <div className="relative z-10 min-h-[200vh]">
                {isGrid3dEnabled && <Grid3D type={2} triggerRef={block2Ref} />}
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
                      <div className={`${boxClass} px-8 py-10 md:px-10 md:py-12`} style={customProperties}>
                        {efxFlags.renderCardsBackground && (
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
              <div className="relative z-10 min-h-[200vh]">
                {isGrid3dEnabled && <Grid3D type={3} triggerRef={block3Ref} />}
              </div>
            </div>

            <div className="h-[20vh]"></div>
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
      ) : (
        /* ─── ФИКС: Рендерим мобайл ТОЛЬКО на тач устройствах ─── */
        <div className="relative z-30 px-5 pt-16 pb-20 max-w-xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-3 drop-shadow-md">
              Наука • Качество • Доверие
            </h2>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Почему 4Life?</h1>
            <p className="text-sm text-slate-400 mt-4 leading-relaxed text-pretty">
              Более двух десятилетий компания посвятила изучению иммунной системы, создавая продукты на стыке науки и
              природы.
            </p>
          </div>

          <div className="space-y-16">
            <div className="relative border-t border-cyan-500/10 pt-8 flex flex-col gap-5">
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-bold text-white">Исследования и Инновации</h2>
                <span className="text-4xl font-light text-cyan-400/25 font-heading">01</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed text-pretty">
                В основе каждого продукта — запатентованные технологии. Ключевая из них — Трансфер Факторы, молекулы,
                которые "обучают" иммунную систему, оптимизируя её естественные защитные функции для точного
                реагирования.
              </p>
              <div
                onClick={handleOpenVimeo1}
                className="relative aspect-video rounded-2xl overflow-hidden bg-[#03050a] border border-cyan-500/15 shadow-xl glass-smoked-acrylic cursor-pointer active:scale-[0.98] transition-all duration-200"
              >
                <video
                  src={VIDEO_ASSETS.video1}
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white shadow-lg active:scale-95 transition-transform duration-150">
                    <Icons.Play fill="currentColor" stroke="none" className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Смотреть</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative border-t border-cyan-500/10 pt-8 flex flex-col gap-5">
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-bold text-white">Контроль Качества</h2>
                <span className="text-4xl font-light text-cyan-400/25 font-heading">02</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed text-pretty">
                Каждый этап производства проходит строгий контроль. Современные технологии и сертифицированные процессы
                по стандарту cGMP гарантируют высочайшие стандарты чистоты, безопасности и эффективности продукции.
              </p>
              <div
                onClick={handleOpenVimeo2}
                className="relative aspect-video rounded-2xl overflow-hidden bg-[#03050a] border border-cyan-500/15 shadow-xl glass-smoked-acrylic cursor-pointer active:scale-[0.98] transition-all duration-200"
              >
                <video
                  src={VIDEO_ASSETS.video2}
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white shadow-lg active:scale-95 transition-transform duration-150">
                    <Icons.Play fill="currentColor" stroke="none" className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Смотреть</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative border-t border-cyan-500/10 pt-8 flex flex-col gap-5">
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-bold text-white">Подтверждённая Эффективность</h2>
                <span className="text-4xl font-light text-cyan-400/25 font-heading">03</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed text-pretty">
                Представьте утро, когда вы просыпаетесь с ощущением, что готовы свернуть горы. Энергия бьёт ключом,
                мысли ясные, настроение на высоте. Это не случайность — это результат того, что ваша иммунная система
                работает как швейцарские часы.
              </p>
              <div
                onClick={handleOpenVimeo3}
                className="relative aspect-video rounded-2xl overflow-hidden bg-[#03050a] border border-cyan-500/15 shadow-xl glass-smoked-acrylic cursor-pointer active:scale-[0.98] transition-all duration-200"
              >
                <video
                  src={VIDEO_ASSETS.video3}
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white shadow-lg active:scale-95 transition-transform duration-150">
                    <Icons.Play fill="currentColor" stroke="none" className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Смотреть</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 text-center">
            <Button
              to="/about"
              variant="primary"
              size="lg"
              className="from-cyan-600 to-blue-600 shadow-md rounded-full w-full justify-center"
              icon={<Icons.Info className="w-5 h-5" />}
            >
              Узнать больше о компании
            </Button>
          </div>
        </div>
      )}

      {/* ─── DESKTOP VIDEO OVERLAYS ─── */}
      {!isTouchDevice && (
        <>
          <VideoBlock
            blockRef={block1Ref}
            videoSrc={VIDEO_ASSETS.video1}
            blockIndex={0}
            isTouchDevice={isTouchDevice}
            onClick={handleOpenVimeo1}
            isModalOpen={vimeoOpen}
          />
          <VideoBlock
            blockRef={block2Ref}
            videoSrc={VIDEO_ASSETS.video2}
            blockIndex={1}
            isTouchDevice={isTouchDevice}
            onClick={handleOpenVimeo2}
            isModalOpen={vimeoOpen}
          />
          <VideoBlock
            blockRef={block3Ref}
            videoSrc={VIDEO_ASSETS.video3}
            blockIndex={2}
            isTouchDevice={isTouchDevice}
            onClick={handleOpenVimeo3}
            isModalOpen={vimeoOpen}
          />
        </>
      )}
    </section>
  );
};

export default MorphingVideoSection;
