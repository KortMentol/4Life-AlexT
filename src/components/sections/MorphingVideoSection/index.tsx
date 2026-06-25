/**
 * @module src/components/sections/MorphingVideoSection/index.tsx
 * @description Awwwards 2026 - Morphing Video Section.
 * Coordinates 3 distinct video blocks with precise performance tiers and layout alignment.
 * @author Geminis AI & Kort
 */

import { Button, ScrollHeadingReveal } from "@/components/ui";
import ScrollNumber from "@/components/ui/ScrollNumber";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import { Icons } from "@/utils/icons";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useMemo, useRef } from "react";

import BiotechBackground from "@/components/effects/BiotechBackground";
import SectionFluidEffect from "@/components/effects/SectionFluidEffect";
import { useParallaxLenis, usePerformanceTier } from "@/hooks";
import { useEffectsDebug } from "@/hooks/useEffectsDebug";

import { Grid3D } from "./components/Grid3D";
import { VideoBlock } from "./components/VideoBlock";
import { VIDEO_ASSETS } from "./config";

const useDeviceType = () => {
  return useMemo(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    return { isTouchDevice, isDesktop: !isTouchDevice };
  }, []);
};

const MorphingVideoSection: React.FC = () => {
  const tier = usePerformanceTier();
  const efxFlags = useEffectsDebug();
  const { isTouchDevice } = useDeviceType();

  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const parallaxStrength = tier === "low" ? 0 : tier === "medium" ? 30 : 60;

  useParallaxLenis(parallaxBgRef, sectionRef, {
    strength: parallaxStrength * 2,
    disabled: !isTouchDevice || tier === "low",
  });

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    isTouchDevice || tier === "low" ? ["0%", "0%"] : [`-${parallaxStrength / 2}%`, `${parallaxStrength / 2}%`],
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

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-transparent">
      <SectionFluidEffect sectionRef={sectionRef} />

      {/* Адаптивный фоновый слой с аппаратным параллаксом */}
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

      <div className="relative z-30">
        <div className="px-4 pt-24 md:pt-32 pb-12 text-center">
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
            <ScrollHeadingReveal tag="h1" className="mb-6 text-center">
              Почему 4Life?
            </ScrollHeadingReveal>
            <div className="typography-lead text-center max-w-4xl mx-auto opacity-80">
              <ScrollTextReveal>
                Более двух десятилетий компания 4Life посвятила углублённому изучению иммунной системы, создавая
                продукты, которые являются результатом фундаментальных исследований и передовых технологий.
              </ScrollTextReveal>
            </div>
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
                    <ScrollHeadingReveal tag="h2" className="text-left" direction="left" simpleMobile>
                      Исследования и Инновации
                    </ScrollHeadingReveal>
                    <ScrollTextReveal>
                      В основе каждого продукта — запатентованные технологии. Ключевая из них — Трансфер Факторы,
                      уникальные молекулы, которые "обучают" иммунную систему, оптимизируя её естественные защитные
                      функции для точного и своевременного реагирования. 4Life не просто следует науке — компания её
                      создаёт.
                    </ScrollTextReveal>
                  </div>
                </div>
              </div>
            </div>
            <div className={`relative z-10 ${isTouchDevice ? "min-h-[180vh]" : "min-h-[200vh]"}`}>
              {tier === "high" && (!import.meta.env.DEV || efxFlags.grid3d) && (
                <Grid3D
                  type={1}
                  triggerRef={block1Ref}
                  filterBlur={import.meta.env.DEV ? efxFlags.grid3dFilterBlur : true}
                />
              )}
            </div>
          </div>

          {/* Блок 02 - Производство */}
          <div ref={block2Ref} className="relative">
            <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
              <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-9 order-1 space-y-6 text-right">
                    <ScrollHeadingReveal tag="h2" className="text-right" direction="right" simpleMobile>
                      Бескомпромиссный Контроль Качества
                    </ScrollHeadingReveal>
                    <ScrollTextReveal className="text-xl md:text-2xl leading-relaxed max-w-4xl ml-auto">
                      Каждый этап производства проходит строгий контроль качества. Современные технологии и
                      сертифицированные процессы по стандарту cGMP гарантируют высочайшие стандарты чистоты,
                      безопасности и эффективности продукции.
                    </ScrollTextReveal>
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
            <div className={`relative z-10 ${isTouchDevice ? "min-h-[180vh]" : "min-h-[200vh]"}`}>
              {tier === "high" && (!import.meta.env.DEV || efxFlags.grid3d) && (
                <Grid3D
                  type={2}
                  triggerRef={block2Ref}
                  filterBlur={import.meta.env.DEV ? efxFlags.grid3dFilterBlur : true}
                />
              )}
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
                    <ScrollHeadingReveal tag="h2" className="text-center" simpleMobile>
                      Подтверждённая Эффективность
                    </ScrollHeadingReveal>
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
            <div className={`relative z-10 ${isTouchDevice ? "min-h-[180vh]" : "min-h-[200vh]"}`}>
              {tier === "high" && (!import.meta.env.DEV || efxFlags.grid3d) && (
                <Grid3D
                  type={3}
                  triggerRef={block3Ref}
                  filterBlur={import.meta.env.DEV ? efxFlags.grid3dFilterBlur : true}
                />
              )}
            </div>
          </div>

          <div className="h-[12vh] lg:h-[20vh]"></div>
        </div>

        {/* CTA кнопка */}
        <div className="relative z-30 px-4 pb-24 text-center">
          <div className="mx-auto max-w-4xl">
            <Button
              to="/about"
              variant="primary"
              size="lg"
              className="from-cyan-600 to-blue-600 shadow-lg"
              icon={<Icons.Info className="w-5 h-5" />}
            >
              Узнать больше о компании
            </Button>
          </div>
        </div>
      </div>

      {/* ВИДЕО КАРТОЧКИ: Каждая рендерится со своим уникальным ассетом */}
      <VideoBlock blockRef={block1Ref} videoSrc={VIDEO_ASSETS.video1} blockIndex={0} isTouchDevice={isTouchDevice} />
      <VideoBlock blockRef={block2Ref} videoSrc={VIDEO_ASSETS.video2} blockIndex={1} isTouchDevice={isTouchDevice} />
      <VideoBlock blockRef={block3Ref} videoSrc={VIDEO_ASSETS.video3} blockIndex={2} isTouchDevice={isTouchDevice} />
    </section>
  );
};

export default MorphingVideoSection;
