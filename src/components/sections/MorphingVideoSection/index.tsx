/**
 * @module src/components/sections/MorphingVideoSection/index.tsx
 * @description Awwwards 2026 - Morphing Video Section.
 *
 * ИСПРАВЛЕНИЯ (Fluid Edge Feathering Architecture):
 * 1. [Fluid Masking Overlays]: Внедрены поверхностные маски затухания (z-10, h-[280px])
 *    с pointer-events: none. Теперь WebGL-флюид (z: -11) физически заплывает ПОД градиент
 *    и плавно растворяется в цвете #03050a, полностью исключая жесткий срез ножниц (scissor cut).
 * 2. [Zero-Block Cursor Interaction]: Маски абсолютно прозрачны для событий мыши,
 *    сохраняя 100% тактильный отклик флюида на движения курсора в любой точке секции.
 * @author Geminis AI & Kort
 * @version 16.2.0
 */

import { Button } from "@/components/ui";
import ScrollNumber from "@/components/ui/ScrollNumber";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import { Icons } from "@/utils/icons";
import { motion, useReducedMotion } from "framer-motion";
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

interface MobileChapterVideoCardProps {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  videoSrc: string;
  videoRef: React.Ref<HTMLVideoElement>;
  onPlay: () => void;
  shouldReveal: boolean;
}

const MobileChapterVideoCard: React.FC<MobileChapterVideoCardProps> = ({
  number,
  eyebrow,
  title,
  description,
  videoSrc,
  videoRef,
  onPlay,
  shouldReveal,
}) => (
  <motion.article
    initial={shouldReveal ? { opacity: 0, y: 16 } : false}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: shouldReveal ? 0.55 : 0, ease: [0.16, 1, 0.3, 1] }}
    className="flex flex-col gap-5 rounded-[2rem] border border-white/[0.08] bg-[#050811]/90 p-6 shadow-2xl"
  >
    <header className="flex items-start justify-between gap-5">
      <div className="min-w-0">
        <p className="typography-label mb-2 text-cyan-400/80">{eyebrow}</p>
        <h2 className="typography-h3 text-white">{title}</h2>
      </div>
      <span className="shrink-0 font-heading text-4xl font-light tabular-nums text-cyan-400/35">{number}</span>
    </header>
    <p className="typography-body text-slate-400 text-pretty">{description}</p>
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/[0.08] bg-[#03050a]">
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="h-full w-full object-cover opacity-75"
      />
      <button
        type="button"
        onClick={onPlay}
        aria-label={`Смотреть видео: ${title}`}
        className="absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400 active:scale-[0.96]"
      >
        <span className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-5 py-3 text-white">
          <Icons.Play fill="currentColor" stroke="none" className="h-4 w-4 text-cyan-400" aria-hidden="true" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Смотреть</span>
        </span>
      </button>
    </div>
  </motion.article>
);

const MorphingVideoSection: React.FC = () => {
  const tier = usePerformanceTier();
  const efxFlags = useEffectsDebug();
  const { isTouchDevice } = useDeviceType();

  const isAdvancedDesktop = !isTouchDevice && tier === "high";
  const isGrid3dEnabled = isAdvancedDesktop && efxFlags.grid3d;

  const sectionRef = useRef<HTMLDivElement>(null);
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);
  const mobileVideoRefs = useRef<Array<HTMLVideoElement | null>>([null, null, null]);

  const [vimeoOpen, setVimeoOpen] = useState(false);
  const [vimeoUrl, setVimeoUrl] = useState("");
  const isCursorEnabled = isAdvancedDesktop;
  const prefersReducedMotion = useReducedMotion();
  const shouldRevealStaticScenes = tier !== "low" && !prefersReducedMotion;

  useEffect(() => {
    if (!isAdvancedDesktop) return;

    const preloadVideos = () => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = VIDEO_ASSETS.video1;
      document.head.appendChild(link);
    };

    if (document.readyState === "complete") {
      preloadVideos();
      return;
    }

    window.addEventListener("load", preloadVideos, { once: true });
    return () => window.removeEventListener("load", preloadVideos);
  }, [isAdvancedDesktop]);

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

  useEffect(() => {
    if (isAdvancedDesktop || vimeoOpen) return;

    const videos = mobileVideoRefs.current.filter((video): video is HTMLVideoElement => video !== null);
    if (videos.length === 0) return;

    const visibility = new Map<HTMLVideoElement, number>(videos.map((video): [HTMLVideoElement, number] => [video, 0]));
    let activeVideo: HTMLVideoElement | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target instanceof HTMLVideoElement) {
            visibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
          }
        }

        let nextVideo: HTMLVideoElement | null = null;
        let highestRatio = 0.6;
        for (const video of videos) {
          const ratio = visibility.get(video) ?? 0;
          if (ratio >= highestRatio) {
            highestRatio = ratio;
            nextVideo = video;
          }
        }

        if (activeVideo !== nextVideo) activeVideo?.pause();
        activeVideo = nextVideo;
        for (const video of videos) {
          if (video !== activeVideo) video.pause();
        }
        if (activeVideo?.paused) void activeVideo.play().catch(() => undefined);
      },
      { threshold: [0, 0.6] },
    );

    videos.forEach((video) => observer.observe(video));
    return () => {
      observer.disconnect();
      videos.forEach((video) => video.pause());
    };
  }, [isAdvancedDesktop, vimeoOpen]);

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
      {/* ─── ВЕРХНЯЯ МАСКА: Растворяет флюид и фон сверху в чистый Clinical Obsidian ─── */}
      <div
        className="absolute top-0 left-0 right-0 h-[280px] pointer-events-none z-10"
        style={{
          background: `linear-gradient(to bottom,
            rgba(3, 5, 10, 1) 0%,
            rgba(3, 5, 10, 0.98) 15%,
            rgba(3, 5, 10, 0.85) 35%,
            rgba(3, 5, 10, 0.5) 60%,
            rgba(3, 5, 10, 0.15) 85%,
            rgba(3, 5, 10, 0) 100%
          )`,
        }}
      />

      {isCursorEnabled && <CustomCursor />}

      <VimeoModal isOpen={vimeoOpen} onClose={handleCloseVimeoModal} tier={tier} videoUrl={vimeoUrl} />

      {isAdvancedDesktop && <SectionFluidEffect sectionRef={sectionRef} />}

      <div className="absolute inset-0 -z-30 overflow-hidden bg-transparent">
        <div className="absolute inset-0 w-full h-full">
          <BiotechBackground />
        </div>
      </div>

      {isAdvancedDesktop ? (
        <motion.div
          className="relative z-30"
          style={{ pointerEvents: vimeoOpen ? "none" : "auto", willChange: "opacity" }}
          initial={false}
          animate={{ opacity: vimeoOpen ? 0 : 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="px-4 pt-24 md:pt-32 pb-12 text-center">
            <div className="mx-auto max-w-4xl relative">
              <p className="typography-label mb-4 text-cyan-300">Компания · формулы · документы</p>
              <h1 className="typography-h1 mb-6 text-center text-white">Почему 4Life?</h1>

              <div className="mx-auto flex max-w-3xl items-center justify-center">
                <ScrollTextReveal className="typography-lead mx-auto max-w-3xl text-center text-white/75">
                  История компании, подходы к производству и составы — через проверяемую информацию, а не обещания результата.
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

                        <p className="typography-label absolute right-6 top-4 max-w-[70%] text-right text-cyan-300/70">Иммунный интеллект</p>

                        <h2 className="typography-h2 text-left text-white m-0">Исследования и Инновации</h2>
                        <ScrollTextReveal className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto">
                          Transfer Factor — название, которое компания использует для компонентов ряда формул. Состав и заявленные свойства различаются: для конкретного продукта сверяйтесь с этикеткой и официальной информацией для своего рынка.
                        </ScrollTextReveal>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative z-10 min-h-[130vh]">
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

                        <p className="typography-label absolute right-6 top-4 max-w-[70%] text-right text-cyan-300/70">Стандарт чистоты cGMP</p>

                        <h2 className="typography-h2 text-right text-white m-0">Бескомпромиссный Контроль Качества</h2>
                        <ScrollTextReveal className="text-xl md:text-2xl leading-relaxed max-w-4xl ml-auto">
                          Производитель сообщает о стандартах производства и контроле качества, включая cGMP. Актуальные сертификаты и сведения о конкретной формуле проверяйте в документах 4Life для вашего региона.
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
              <div className="relative z-10 min-h-[130vh]">
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

                        <p className="typography-label absolute right-6 top-4 max-w-[70%] text-right text-cyan-300/70">Энергия и тонус жизни</p>

                        <h2 className="typography-h2 text-center text-white m-0">Подтверждённая Эффективность</h2>
                        <ScrollTextReveal className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto">
                          Каталог помогает сравнить состав, формат выпуска и маркировку. Индивидуальные ощущения различаются; пищевые добавки не заменяют сбалансированный рацион и медицинскую помощь.
                        </ScrollTextReveal>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative z-10 min-h-[130vh]">
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
        </motion.div>
      ) : (
        <motion.div
          className="relative z-30 px-5 pt-16 pb-20 max-w-xl mx-auto"
          style={{ pointerEvents: vimeoOpen ? "none" : "auto", willChange: "opacity" }}
          initial={false}
          animate={{ opacity: vimeoOpen ? 0 : 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-14 text-center">
            <h2 className="typography-label mb-3 text-cyan-400">Наука · качество · осознанный выбор</h2>
            <h1 className="typography-h2 text-white">Почему 4Life?</h1>
            <p className="typography-body mt-4 text-slate-400 text-pretty">
              История компании, производственные подходы и маркировка — через проверяемую информацию.
            </p>
          </div>

          <div className="flex flex-col gap-28">
            <MobileChapterVideoCard
              number="01"
              eyebrow="Иммунный интеллект"
              title="Исследования и инновации"
              description="Transfer Factor — название, которое 4Life использует для компонентов ряда формул. Состав конкретного продукта смотрите в актуальной маркировке."
              videoSrc={VIDEO_ASSETS.video1}
              videoRef={(video) => { mobileVideoRefs.current[0] = video; }}
              onPlay={handleOpenVimeo1}
              shouldReveal={shouldRevealStaticScenes}
            />
            <MobileChapterVideoCard
              number="02"
              eyebrow="Стандарт чистоты cGMP"
              title="Контроль качества"
                description="Производитель публикует сведения о стандартах и контроле качества. Актуальные сертификаты и данные о конкретном рынке сверяйте в официальных материалах."
              videoSrc={VIDEO_ASSETS.video2}
              videoRef={(video) => { mobileVideoRefs.current[1] = video; }}
              onPlay={handleOpenVimeo2}
              shouldReveal={shouldRevealStaticScenes}
            />
            <MobileChapterVideoCard
              number="03"
              eyebrow="Энергия и тонус жизни"
              title="Повседневная поддержка"
              description="Ощущения и результаты индивидуальны. Пищевые добавки не заменяют сбалансированное питание, лечение или рекомендации медицинского специалиста."
              videoSrc={VIDEO_ASSETS.video3}
              videoRef={(video) => { mobileVideoRefs.current[2] = video; }}
              onPlay={handleOpenVimeo3}
              shouldReveal={shouldRevealStaticScenes}
            />
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
        </motion.div>
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

      {/* ─── НИЖНЯЯ МАСКА: Растворяет флюид и фон снизу в чистый Clinical Obsidian ─── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[280px] pointer-events-none z-10"
        style={{
          background: `linear-gradient(to top,
            rgba(3, 5, 10, 1) 0%,
            rgba(3, 5, 10, 0.98) 15%,
            rgba(3, 5, 10, 0.85) 35%,
            rgba(3, 5, 10, 0.5) 60%,
            rgba(3, 5, 10, 0.15) 85%,
            rgba(3, 5, 10, 0) 100%
          )`,
        }}
      />
    </section>
  );
};

export default MorphingVideoSection;
