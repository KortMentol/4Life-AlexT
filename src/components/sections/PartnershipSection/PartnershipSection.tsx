/**
 * @module PartnershipSection
 * @description Awwwards SOTY 2027+ Clinical Obsidian + Editorial Gold broadsheet showcase for HomePage.
 * Features:
 * - Zero-flash stacked optical shutter gallery (all 3 photographs pre-mounted & eager-decoded, no SVG clutter).
 * - Seamless 160px top & bottom #03050a dissolve masks (zero horizontal seam with adjacent sections).
 * - Full 3-tier hardware adaptation (High: scroll parallax + clip-path shutter; Medium: crossfade; Low: static instant).
 */

import factoryDioramaImg from "@/assets/images/partnership_pillar_factory_1795226257592.jpg";
import mentorDioramaImg from "@/assets/images/partnership_pillar_mentor_1795226256521.jpg";
import networkDioramaImg from "@/assets/images/partnership_pillar_network_1795226255565.jpg";
import { Button } from "@/components/ui";
import { usePerformanceTier } from "@/hooks";
import { Icons } from "@/utils/icons";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { memo, useMemo, useRef, useState } from "react";
import { getPalette } from "./constants";
import Ticker from "./ui/Ticker";

interface PartnershipPillar {
  index: string;
  tag: string;
  microSpec: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  captionTitle: string;
  captionDetail: string;
}

const PILLARS: readonly PartnershipPillar[] = [
  {
    index: "01",
    tag: "Инфраструктура уже работает",
    microSpec: "cGMP · Юта · РЦ 67",
    title: "Собственный завод cGMP и склады в 70+ странах",
    summary:
      "Вам не нужно заниматься логистикой, сертификацией, складами или кассами. Вся операционная база 4Life Research уже выстроена — в России заказы обрабатывает официальный Региональный Центр РЦ 67.",
    image: factoryDioramaImg,
    imageAlt: "Биотехнологический контроль качества и производство 4Life Research",
    captionTitle: "Сэнди, Юта · Официальный склад РЦ 67",
    captionDetail: "Производство, сертификация и доставка уже на стороне компании",
  },
  {
    index: "02",
    tag: "Честная экономика без вложений",
    microSpec: "до 64% · 0 ₽ вход",
    title: "До 64% от товарооборота возвращается партнёрам",
    summary:
      "Доход складывается из понятных частей: вознаграждение за первые заказы, кэшбэк свыше 100 LP, командные премии и процент с глубины структуры. Вход свободный — без стартовых взносов и обязательных закупок.",
    image: networkDioramaImg,
    imageAlt: "Архитектура прозрачных вознаграждений и международных связей 4Life",
    captionTitle: "Life Rewards Plan · Единый стандарт LP",
    captionDetail: "Прозрачные расчёты на всех международных рынках без скрытых условий",
  },
  {
    index: "03",
    tag: "Спокойный масштаб и наставничество",
    microSpec: "100 LP · Личный куратор",
    title: "Личный ритм рядом с практиком",
    summary:
      "Можно совмещать с основной работой или выстроить полноценное направление. Вы опираетесь на собственный опыт с формулами, понятные инструменты и прямую поддержку Александра Тощева.",
    image: mentorDioramaImg,
    imageAlt: "Спокойное стратегическое планирование и наставничество в команде",
    captionTitle: "Прямой диалог без скриптов и давления",
    captionDetail: "Пошаговое сопровождение и комфортный ритм 100 LP в месяц",
  },
] as const;

export const PartnershipSection: React.FC = () => {
  const tier = usePerformanceTier();
  const palette = useMemo(() => getPalette(), []);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const sectionRef = useRef<HTMLElement>(null);
  const isLow = tier === "low";
  const isHigh = tier === "high";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const dioramaParallaxY = useTransform(scrollYProgress, [0, 1], isHigh ? ["-4.5%", "4.5%"] : ["0%", "0%"]);
  const activePillar = PILLARS[activeIndex] ?? PILLARS[0]!;

  return (
    <section
      ref={sectionRef}
      id="partnership"
      aria-label="Партнёрство 4Life"
      className="relative overflow-x-clip bg-[#03050a]"
    >
      {/* Interior atmospheric gold & deep-obsidian illumination strictly contained inside the middle band */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 62% 44% at 18% 28%, rgba(185, 151, 74, 0.11), transparent 68%), radial-gradient(ellipse 52% 40% at 84% 52%, rgba(22, 68, 248, 0.08), transparent 70%)",
        }}
      />

      {/* Seamless top dissolve into Clinical Obsidian */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-32 z-[2]"
        style={{
          backgroundImage: "linear-gradient(to bottom, #03050a 0%, rgba(3,5,10,0) 100%)",
        }}
      />

      {/* Subtle architectural rank ticker */}
      <div className="relative z-10 border-t border-white/[0.06]">
        <Ticker tier={tier} palette={palette} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-28 md:pt-32 md:pb-40">
        {/* Top Editorial Broadsheet Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end pb-14 md:pb-20 mb-14 md:mb-20 border-b border-white/[0.09]">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px" style={{ backgroundColor: palette.gold }} />
              <span className="typography-label" style={{ color: palette.gold }}>
                Партнёрская архитектура 4Life
              </span>
            </div>

            <h2 className="typography-h1 leading-[1.03]" style={{ color: palette.cream }}>
              Когда личный опыт
              <span
                className="block typography-editorial-italic mt-1"
                style={{ color: palette.gold }}
              >
                превращается в масштаб
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 space-y-7">
            <p className="typography-lead text-slate-300 text-pretty">
              Не нужно становиться продавцом или держать товар дома. Вы рекомендуете формулы, которыми пользуетесь сами
              — а международная система 4Life берёт на себя производство, расчёты и доставку.
            </p>

            <div className="grid grid-cols-3 gap-5 pt-5 border-t border-white/[0.09]">
              <div>
                <span
                  className="font-sans text-2xl md:text-3xl font-semibold tabular-nums tracking-tight block"
                  style={{ color: palette.cream }}
                >
                  70+
                </span>
                <span className="text-[11px] text-slate-400">стран присутствия</span>
              </div>
              <div>
                <span
                  className="font-sans text-2xl md:text-3xl font-semibold tabular-nums tracking-tight block"
                  style={{ color: palette.gold }}
                >
                  до 64%
                </span>
                <span className="text-[11px] text-slate-400">в партнёрскую сеть</span>
              </div>
              <div>
                <span
                  className="font-sans text-2xl md:text-3xl font-semibold tabular-nums tracking-tight block"
                  style={{ color: palette.cream }}
                >
                  0 ₽
                </span>
                <span className="text-[11px] text-slate-400">вход без взносов</span>
              </div>
            </div>
          </div>
        </div>

        {/* Asymmetric Broadsheet: Interactive Hairline Ledger (left 6) + Zero-Flash Optical Shutter Stage (right 6) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Left 6 cols: Unboxed hairline index rows */}
          <div className="lg:col-span-6 border-y border-white/[0.09] divide-y divide-white/[0.09]">
            {PILLARS.map((pillar, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={pillar.index}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onFocus={() => setActiveIndex(idx)}
                  aria-pressed={isSelected}
                  className="group relative w-full text-left py-8 md:py-9 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B9974A] transition-colors active:scale-[0.995]"
                >
                  {/* Subtle ambient gold spotlight on active row */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                      isSelected ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      backgroundImage:
                        "radial-gradient(ellipse 75% 90% at 15% 50%, rgba(185, 151, 74, 0.1), transparent 72%)",
                    }}
                  />

                  <div className="relative z-10 flex items-start gap-5 md:gap-7">
                    <span
                      className="font-sans text-3xl md:text-4xl font-light tabular-nums leading-none pt-1 transition-colors duration-300 w-11 flex-shrink-0"
                      style={{ color: isSelected ? palette.gold : "rgba(240,237,232,0.22)" }}
                    >
                      {pillar.index}
                    </span>

                    <div className="flex-1 min-w-0 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span
                          className="text-[11px] uppercase tracking-[0.2em] font-medium transition-colors duration-300"
                          style={{ color: isSelected ? palette.gold : "rgba(148,163,184,0.68)" }}
                        >
                          {pillar.tag}
                        </span>
                        <span className="text-white/20 text-[10px]" aria-hidden="true">
                          ·
                        </span>
                        <span className="typography-mono text-[10px] tracking-[0.12em] text-slate-500">
                          {pillar.microSpec}
                        </span>
                      </div>

                      <h3
                        className={`typography-h3 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isSelected ? "translate-x-1" : "group-hover:translate-x-1"
                        }`}
                        style={{ color: isSelected ? palette.cream : "rgba(240,237,232,0.74)" }}
                      >
                        {pillar.title}
                      </h3>

                      <p
                        className={`text-sm md:text-[15px] leading-relaxed text-pretty transition-colors duration-300 ${
                          isSelected ? "text-slate-200" : "text-slate-400"
                        }`}
                      >
                        {pillar.summary}
                      </p>
                    </div>

                    <Icons.ArrowRight
                      className={`w-5 h-5 flex-shrink-0 mt-2 transition-all duration-300 ${
                        isSelected ? "translate-x-1 text-[#B9974A] opacity-100" : "text-slate-600 opacity-50"
                      }`}
                    />
                  </div>

                  {/* Animated bottom gold hairline indicator */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-px origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      backgroundColor: palette.gold,
                      transform: isSelected ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Right 6 cols: Stacked Pre-Decoded Optical Shutter Gallery (Zero Flash, Zero Wireframe Mush) */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 space-y-8">
            <div className="relative rounded-[1.75rem] overflow-hidden border border-[#B9974A]/25 bg-[#050811] aspect-[4/3] shadow-[0_32px_90px_rgba(0,0,0,0.75)]">
              {/* All 3 artworks remain permanently mounted & eager-decoded so switching is instant with zero black flicker */}
              {PILLARS.map((pillar, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <motion.div
                    key={pillar.index}
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scale: isActive ? 1 : isLow ? 1 : 1.045,
                      clipPath: isLow
                        ? "inset(0% 0% 0% 0%)"
                        : isActive
                          ? "inset(0% 0% 0% 0%)"
                          : "inset(4% 0% 4% 0%)",
                    }}
                    transition={{
                      duration: isLow ? 0.16 : 0.62,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ zIndex: isActive ? 2 : 1 }}
                    className="absolute inset-0 pointer-events-none"
                    aria-hidden={!isActive}
                  >
                    <motion.img
                      src={pillar.image}
                      alt={pillar.imageAlt}
                      loading="eager"
                      decoding="async"
                      style={{ y: dioramaParallaxY }}
                      className="w-full h-[110%] -top-[5%] relative object-cover"
                    />
                  </motion.div>
                );
              })}

              {/* Clean museum-grade editorial scrim (no wireframe overlay) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(3,5,10,0.48) 0%, rgba(3,5,10,0.06) 36%, rgba(3,5,10,0.22) 64%, rgba(3,5,10,0.92) 100%)",
                }}
              />

              {/* Top architectural index bar */}
              <div className="absolute top-5 left-6 right-6 z-20 flex items-center justify-between gap-4">
                <span
                  className="typography-mono text-[11px] uppercase tracking-[0.22em] font-medium"
                  style={{ color: palette.gold }}
                >
                  {activePillar.index} / 03
                </span>
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {PILLARS.map((p, idx) => (
                    <span
                      key={p.index}
                      className="h-0.5 w-6 rounded-full origin-left transition-transform duration-300"
                      style={{
                        transform: idx === activeIndex ? "scaleX(1)" : "scaleX(0.35)",
                        backgroundColor: idx === activeIndex ? palette.gold : "rgba(240,237,232,0.28)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom editorial caption plate */}
              <div className="absolute bottom-5 left-6 right-6 z-20 space-y-1">
                <p className="font-sans text-base md:text-lg font-semibold text-white tracking-tight">
                  {activePillar.captionTitle}
                </p>
                <p className="text-xs md:text-sm text-slate-300/90 text-pretty">{activePillar.captionDetail}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5 pt-2">
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-xs text-pretty">
                На отдельной странице разобраны все уровни роста, живой калькулятор LP и ответы без давления.
              </p>

              <Button
                to="/partnership"
                variant="primary"
                size="lg"
                className="justify-center rounded-full btn-special-fill flex-shrink-0"
                style={
                  {
                    "--btn-fill-1": palette.gold,
                    "--btn-fill-2": palette.blue,
                  } as React.CSSProperties
                }
                icon={<Icons.ArrowRight className="w-5 h-5" />}
              >
                Разобрать модель
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Seamless 180px bottom dissolve to pure Clinical Obsidian (#03050a) — zero seam with FinalCTASection */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 inset-x-0 h-44 z-[2]"
        style={{
          backgroundImage: "linear-gradient(to top, #03050a 0%, rgba(3,5,10,0.85) 38%, rgba(3,5,10,0) 100%)",
        }}
      />
    </section>
  );
};

export default memo(PartnershipSection);