/**
 * @module src/components/sections/MorphingVideoSection/index.tsx
 * @description Awwwards 2026 - Morphing Video Section.
 * Coordinates 3 distinct video blocks with precise performance tiers and layout alignment.
 *
 * ИСПРАВЛЕНИЕ:
 * - Исправлена геометрическая погрешность (кривые углы) на стыках CSS-подложки и SVG-контура [1].
 *   * Базовый класс скруглений плашек изменен с `rounded-3xl` (что в Tailwind означает 24px) на явный `rounded-[2rem]` (32px).
 *   * SVG-контур теперь оборачивается в абсолютно позиционированный контейнер с компенсацией половины толщины обводки (`inset-[0.6px]`).
 *   * Благодаря этому, кривая скругления SVG-линии теперь накладывается на физическую грань контейнера с точностью до субпикселя (100% совпадение контуров).
 * - Рамка вокруг вводного описания и вокруг кнопки CTA удалена полностью для разгрузки интерфейса [1].
 * - Числа «01», «02», «03» вынесены за пределы рамок для парящего эффекта.
 * - Ошибки центрирования текста в шапке устранены.
 * - [ИСПРАВЛЕНИЕ PERFORMANCE]: Отрегулирован рендеринг подложек. Все тач-устройства (мобильные)
 *   и низкий ПК-тир теперь полностью освобождены от тяжелого backdrop-filter с сохранением глубокого
 *   полупрозрачного вида Smoked Acrylic. На ПК Medium/High сохранен потрясающий Backdrop Blur.
 *   Стили импортируются из чистого выделенного файла `src/styles/components/morphing-video.css`.
 *
 * @author Geminis AI & Kort
 * @version 7.1.0
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
import { useEffectsDebug } from "@/hooks/useEffectsDebug";

import { Grid3D } from "./components/Grid3D";
import { VideoBlock } from "./components/VideoBlock";
import { VimeoModal } from "./components/VimeoModal";
import { VIDEO_ASSETS, VIMEO_URLS } from "./config";

// ИМПОРТ ИСПРАВЛЕН: Подключен выделенный файл стилей карточек
import "@/styles/components/morphing-video.css";

const useDeviceType = () => {
  return useMemo(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    return { isTouchDevice, isDesktop: !isTouchDevice };
  }, []);
};

// ─── Единый, отзывчивый SVG-контур с плавными градиентными переходами (70% неона → серый) ───
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
          {/* Диагональный градиент: подсвечивает верх-лево и низ-право, плавно угасая в серый по центру */}
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
          rx="32" /* Соответствует rounded-[2rem] радиусу */
          ry="32"
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

  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);

  const [vimeoOpen, setVimeoOpen] = useState(false);
  const [vimeoUrl, setVimeoUrl] = useState("");
  const isCursorEnabled = !isTouchDevice;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  // Унифицируем сдвиг фона между Medium и High для идеального схождения нод
  const parallaxStrength = tier === "low" ? 0 : 40;

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

  // Базовые классы фреймов
  const boxBaseClass = "relative rounded-[2rem] transition-all duration-300";

  // КРИТИЧЕСКИЙ ФИКС: Определение эффекта подложки. Разделили логику.
  // На тачах и лоу-тире используется легкий, но глубокий .glass-smoked-acrylic (0ms GPU нагрузки).
  // На ПК средних и высоких тирах рендерится чистый .glass-backdrop-blur с настоящим размытием.
  const boxEffectClass = isTouchDevice || isLow ? "glass-smoked-acrylic" : "glass-backdrop-blur";
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

      <motion.div
        className="relative z-30"
        initial={false}
        animate={{ opacity: vimeoOpen ? 0 : 1, filter: vimeoOpen ? "blur(4px)" : "blur(0px)" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: vimeoOpen ? "none" : "auto" }}
      >
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

            {/* Для вводного описания возвращен класс .typography-lead (крупный лид-текст) вместо мелкого боди [1] */}
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
                {/* Сетка перераспределена на col-span-4 и col-span-8 для устранения горизонтального разрыва [1] */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-4 flex justify-end lg:pr-8 order-2 lg:order-1">
                    <ScrollNumber
                      number="01"
                      /* Толщина изменена на font-light для баланса веса элементов [1] */
                      className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-light leading-none"
                    />
                  </div>

                  {/* Текстовая плашка со швейцарской рамкой и лазерным градиентным свечением */}
                  <div className="lg:col-span-8 order-1 lg:order-2">
                    {/* Вертикальные отступы увеличены до py-10 md:py-12 для идеальной симметрии воздуха [1] */}
                    <div className={`${boxClass} px-8 py-10 md:px-10 md:py-12`}>
                      {/* Прецизионные лазерные градиентные контуры [5] */}
                      <ContinuousGlowFrame blockIndex={1} neonColor1="#06b6d4" neonColor2="#0ea5e9" />

                      {/* Тончайший, приглушенный служебный тег перенесен в правый верхний угол [1] */}
                      <div className="absolute top-4 right-6 font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500/40 dark:text-slate-500/30 select-none">
                        [TF.01]
                      </div>

                      <h2 className="typography-h2 text-left text-white m-0">Исследования и Инновации</h2>
                      <ScrollTextReveal className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto">
                        В основе каждого продукта — запатентованные технологии. Ключевая из них — Трансфер Факторы,
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
              {tier === "high" && (!import.meta.env.DEV || efxFlags.grid3d) && (
                <Grid3D
                  type={1}
                  triggerRef={block1Ref}
                  filterBlur={import.meta.env.DEV ? efxFlags.grid3dFilterBlur : true}
                />
              )}
            </div>
          </div>

          {/* ── Блок 02 ── */}
          <div ref={block2Ref} className="relative">
            <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
              <div className="container mx-auto px-4 md:px-8 max-w-5xl">
                {/* Сетка перераспределена на col-span-4 и col-span-8 для устранения горизонтального разрыва [1] */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Текстовая плашка со швейцарской рамкой */}
                  <div className="lg:col-span-8 order-1">
                    {/* Вертикальные отступы увеличены до py-10 md:py-12 для идеальной симметрии воздуха [1] */}
                    <div className={`${boxClass} px-8 py-10 md:px-10 md:py-12 text-right`}>
                      {/* Прецизионные лазерные градиентные контуры [5] */}
                      <ContinuousGlowFrame blockIndex={2} neonColor1="#3b82f6" neonColor2="#0ea5e9" />

                      {/* Тончайший служебный тег в правом углу [1] */}
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
                      /* Толщина изменена на font-light для баланса веса элементов [1] */
                      className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-light leading-none lg:translate-x-8"
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

          {/* ── Блок 03 ── */}
          <div ref={block3Ref} className="relative">
            <div className="sticky top-0 z-20 flex h-screen items-center justify-center">
              <div className="container mx-auto px-4 md:px-8 max-w-5xl">
                <div className="text-center space-y-8">
                  <ScrollNumber
                    number="03"
                    /* Толщина изменена на font-light для баланса веса элементов [1] */
                    className="text-[10rem] md:text-[16rem] lg:text-[20rem] font-light leading-none"
                  />

                  {/* Текстовая плашка со швейцарской рамкой */}
                  <div className="relative max-w-4xl mx-auto text-center">
                    {/* Вертикальные отступы увеличены до py-10 md:py-12 для идеальной симметрии воздуха [1] */}
                    <div className={`${boxClass} px-8 py-10 md:px-10 md:py-12`}>
                      {/* Прецизионные лазерные градиентные контуры [5] */}
                      <ContinuousGlowFrame blockIndex={3} neonColor1="#06b6d4" neonColor2="#3b82f6" />

                      {/* Тончайший служебный тег в правом углу [1] */}
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

        {/* ── Финальная CTA Нода ── */}
        {/* Рамка вокруг кнопки удалена полностью, кнопка парит свободно над световым сиянием [1] */}
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
