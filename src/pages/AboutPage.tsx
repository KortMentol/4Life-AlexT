/**
 * @module src/pages/AboutPage.tsx
 * @description Ultra-Awwwards scientific monograph for 4Life Research (verified RF / Eurasia 2026 facts):
 * - Full-bleed dark macro optical Hero (1 of 3 intentional Cormorant Garamond italic moments on site).
 * - Section 01: 270px Canvas 2D Cellular Bio-Field + Interactive 3-Mode Comparison Bench
 *   (Обычные витамины / Грубые иммуностимуляторы / Трансфер Фактор) + 3-Phase Immune Triptych (+437% NK).
 * - Section 02: Documentary Screening Theatre (Founders, Vineyard cGMP plant, Transfer Factor).
 * - Section 03: 1949 / 1998 / 2026 Editorial Storyline (single monumental ScrollNumber per epoch,
 *   exact Sandy UT R&D HQ + Vineyard UT NSF/cGMP plant geography, zero redundant ScrollTextReveal).
 * - Section 04: Interactive RF & Global Certification Registry (4 OpticalSurface passports:
 *   СГР ЕАЭС & «Честный ЗНАК», PDR США, РАН / Онкоцентр им. Н.Н. Блохина & Минздрав РФ, NSF cGMP / Halal / Kosher).
 */

import immuneCausticsImg from "@/assets/images/biotech_immune_caustics_1795234146065.jpg";
import timeline1949Img from "@/assets/images/timeline_1949_discovery_1795226255218.jpg";
import timeline1998Img from "@/assets/images/timeline_1998_synthesis_1795226256402.jpg";
import timelineModernImg from "@/assets/images/timeline_modern_craft_1795226256403.jpg";
import { DocumentaryFilmReel } from "@/components/sections/About/DocumentaryFilmReel";
import { ImmuneBioFieldCanvas } from "@/components/sections/About/ImmuneBioFieldCanvas";
import { PageEntrance } from "@/components/transitions/PageEntrance";
import { AtmosphericBackdrop, Button, OpticalSurface, ParallaxImage } from "@/components/ui";
import ScrollNumber from "@/components/ui/ScrollNumber";
import { usePerformanceTier } from "@/hooks";
import { SEO } from "@/seo/SEO";
import { Icons } from "@/utils/icons";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef, useState } from "react";

const COMPARISON_MODES = [
  {
    id: "vitamins",
    tabLabel: "Обычные витамины",
    badge: "СТРОИТЕЛЬНЫЙ МАТЕРИАЛ",
    role: "Питание клеток без обучения",
    mechanism:
      "Восполняют дефицит микроэлементов и коферментов, но не передают иммунным клеткам инструкцию о том, как распознать новую угрозу и вовремя остановиться.",
    riskProfile: "Нейтральный фон: полезны как база, но не ускоряют скорость первичного иммунного ответа.",
    highlight: false,
  },
  {
    id: "stimulants",
    tabLabel: "Грубые иммуностимуляторы",
    badge: "ПРИНУДИТЕЛЬНЫЙ РАЗГОН",
    role: "Искусственное подстёгивание",
    mechanism:
      "Форсируют выброс защитных клеток вслепую — словно нажимают педаль газа без руля и тормозов. При частом приёме приводят к истощению резервов и гиперреакциям.",
    riskProfile: "Не подходят для долгосрочной повседневной поддержки и требуют осторожности при аутоиммунных рисках.",
    highlight: false,
  },
  {
    id: "transfer-factor",
    tabLabel: "Трансфер Фактор 4Life",
    badge: "ИНФОРМАЦИОННЫЙ ПЕПТИДНЫЙ КОД",
    role: "Обучение, фокус и баланс (3 фракции)",
    mechanism:
      "Природные сигнальные пептиды молозива и желтка обучают иммунную систему работать разумно: быстрее распознавать угрозу, повышать активность NK-клеток до +437% и мягко завершать реакцию.",
    riskProfile: "Адаптогенная иммуномодуляция без истощения — природный механизм передачи клеточной памяти.",
    highlight: true,
  },
] as const;

const IMMUNE_TRIPTYCH = [
  {
    index: "01",
    phase: "Распознавание",
    headline: "Увидеть угрозу раньше",
    signalLabel: "Индукторы",
    metricCode: "DETECTION • INDUCER FRACTION",
    description:
      "Индукторная фракция передаёт незрелым иммунным клеткам готовую готовность к распознаванию. Организм перестаёт тратить лишние дни на поиск ответа вслепую.",
  },
  {
    index: "02",
    phase: "Точный отклик",
    headline: "Активность NK-клеток до +437%",
    signalLabel: "Антиген-специфичные",
    metricCode: "RESPONSE • UP TO +437% NK",
    description:
      "Антиген-специфичная фракция фокусирует работу натуральных киллеров (NK-клеток) именно на цели — лабораторные исследования 4Life и РАН подтверждают рост их активности до 437%.",
  },
  {
    index: "03",
    phase: "Баланс и память",
    headline: "Вовремя вернуть спокойствие",
    signalLabel: "Супрессоры",
    metricCode: "HOMEOSTASIS • SUPPRESSOR LOCK",
    description:
      "Супрессорная фракция предотвращает чрезмерную реакцию, помогает мягко завершить иммунный ответ после решения задачи и сохранить клеточную память на будущее.",
  },
] as const;

const STORYLINE_EPOCHS = [
  {
    year: "1949",
    tag: "Фундаментальное открытие",
    title: "Доктор Шервуд Лоуренс открывает фактор переноса",
    description:
      "Иммунолог Нью-Йоркского университета доказал, что иммунную память можно передавать от одной клетки к другой с помощью крошечных сигнальных молекул — Transfer Factor. Природа заложила этот механизм в первое молозиво матери, чтобы обучить иммунитет новорождённого.",
    image: timeline1949Img,
    imageAlt: "Кристаллические сферы сигнальных пептидов иммунной памяти",
    caption: "1949 • Нью-Йоркский университет — открытие механизма клеточной памяти",
  },
  {
    year: "1998",
    tag: "Технологический прорыв • 1998–2007",
    title: "Основание 4Life Research и формула Трай-Фактор",
    description:
      "Дэвид и Бьянка Лизонби объединили запатентованную ультрафильтрацию коровьего молозива (УльтраФактор XF) и желтка куриных яиц (ОвоФактор), добавив низкомолекулярные нанофракции. Так появилась формула Трай-Фактор — ядро современной линейки 4Life.",
    image: timeline1998Img,
    imageAlt: "Оптическая фильтрация и разделение пептидных фракций",
    caption: "1998–2007 • Патентованная ультрафильтрация из двух природных источников",
  },
  {
    year: "2026",
    tag: "R&D в Сэнди и завод в Виньярде (Юта, США)",
    title: "Штаб-квартира R&D в Сэнди и собственный завод NSF/cGMP в Виньярде",
    description:
      "Научно-исследовательский центр и штаб-квартира 4Life расположены в Сэнди (Sandy, UT), а серийный выпуск — на собственном заводе полного цикла в Виньярде (Vineyard, UT). Хроматографический контроль каждой партии гарантирует единую чистоту от Юты до склада РЦ 67 в Москве.",
    image: timelineModernImg,
    imageAlt: "Архитектурный научно-производственный комплекс 4Life в штате Юта",
    caption: "Sandy UT (R&D HQ) + Vineyard UT (NSF/cGMP Plant) • Единый стандарт для 70+ стран",
  },
] as const;

const CERTIFICATION_PASSPORTS = [
  {
    id: "eaeu-znak",
    index: "01",
    code: "РФ И ЕАЭС • ОФИЦИАЛЬНЫЙ ВВОЗ",
    title: "СГР ЕАЭС и маркировка «Честный ЗНАК»",
    summary:
      "Каждая формула каталога прошла государственную регистрацию на территории Евразийского экономического союза и отгружается с обязательным кодом DataMatrix «Честный ЗНАК».",
    verification: "Проверяется за 3 секунды сканером в официальном приложении «Честный ЗНАК» на любой баночке из РЦ 67.",
  },
  {
    id: "pdr-usa",
    index: "02",
    code: "МЕДИЦИНСКИЙ СПРАВОЧНИК США",
    title: "PDR — Physicians' Desk Reference",
    summary:
      "Ключевые формулы 4Life Transfer Factor многократно включены в настольный медицинский справочник врачей США (PDR) — открытый стандарт прозрачности состава и дозировок.",
    verification: "Независимая публикация профилей безопасности и концентрации пептидных фракций.",
  },
  {
    id: "ran-minzdrav",
    index: "03",
    code: "РОССИЙСКАЯ КЛИНИЧЕСКАЯ БАЗА",
    title: "РАН, Онкоцентр им. Н.Н. Блохина и Минздрав РФ",
    summary:
      "Проведена серия российских клинических и лабораторных исследований (включая исследования в НМИЦ онкологии им. Н.Н. Блохина и институтах РАН) + издано Методическое письмо Минздрава РФ по иммунореабилитации.",
    verification: "Зафиксирован рост функциональной активности NK-клеток до +437% в исследованиях Трай-Фактор Плюс.",
  },
  {
    id: "nsf-cgmp",
    index: "04",
    code: "ПРОИЗВОДСТВО • VINEYARD, UTAH",
    title: "NSF International cGMP, Halal & Kosher",
    summary:
      "Собственный завод 4Life в Виньярде (штат Юта) сертифицирован независимым аудитором NSF International по стандарту cGMP (21 CFR Part 111) и защищён патентами США на методы экстракции.",
    verification: "Сертификаты чистоты Halal и Kosher + многоступенчатый лабораторный анализ каждой партии.",
  },
] as const;

const AboutPage: React.FC = () => {
  const tier = usePerformanceTier();
  const isLow = tier === "low";
  const [activePhase, setActivePhase] = useState<number>(0);
  const [comparisonId, setComparisonId] = useState<(typeof COMPARISON_MODES)[number]["id"]>("transfer-factor");
  const storylineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: storylineProgress } = useScroll({
    target: storylineRef,
    offset: ["start 75%", "end 65%"],
  });

  const lineScaleY = useTransform(storylineProgress, [0, 1], isLow ? [1, 1] : [0.06, 1]);

  const activeComparison =
    COMPARISON_MODES.find((m) => m.id === comparisonId) ?? COMPARISON_MODES[2]!;

  return (
    <div className="relative min-h-screen bg-[#03050a] text-slate-300">
      <AtmosphericBackdrop variant="cyan" />

      <SEO
        title="О компании 4Life Research — Наука Трансфер Фактора и сертификация РФ"
        description="История 4Life Research с 1998 года: R&D в Сэнди и завод NSF/cGMP в Виньярде (Юта), открытие Transfer Factor (1949), три фракции иммунного обучения, СГР ЕАЭС, Честный ЗНАК, PDR и исследования РАН."
        path="/about"
      />

      {/* CINEMA EDITORIAL HERO — FULL-BLEED OPTICAL CAUSTICS */}
      <section className="relative z-10 min-h-[82svh] flex items-end pt-36 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={immuneCausticsImg}
            alt="Оптическая модель клеточного взаимодействия 4Life Research"
            className="w-full h-full object-cover object-center opacity-60"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(3,5,10,0.68) 0%, rgba(3,5,10,0.34) 44%, rgba(3,5,10,0.95) 95%, #03050a 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 68% 58% at 24% 48%, rgba(6,182,212,0.16), transparent 72%)",
            }}
          />
        </div>

        <PageEntrance className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 space-y-10">
          <div className="max-w-4xl space-y-6">
            <div data-entrance="badge" className="flex items-center gap-3">
              <span className="w-7 h-px bg-cyan-400/80" aria-hidden="true" />
              <span className="typography-label text-cyan-400">Сэнди и Виньярд, Юта • С 1998 года</span>
            </div>

            <div data-entrance="title">
              <h1 className="typography-h1 text-white leading-[1.04]">
                4Life Research —{" "}
                <span className="typography-editorial-italic text-cyan-300 font-normal block sm:inline">
                  наука иммунной памяти
                </span>
              </h1>
            </div>

            <div data-entrance="lead" className="max-w-2xl">
              <p className="typography-lead text-slate-300">
                Более четверти века компания развивает трансферцевтику — направление на стыке фундаментальной
                иммунологии и фармацевтического стандарта собственного завода NSF/cGMP в штате Юта.
              </p>
            </div>
          </div>

          <div
            data-entrance="buttons"
            className="pt-8 border-t border-white/[0.12] flex flex-wrap items-center justify-between gap-6"
          >
            <div className="flex flex-wrap gap-x-10 gap-y-3">
              <div>
                <span className="typography-mono text-2xl font-semibold text-white block">1949</span>
                <span className="text-xs text-slate-400">Открытие Transfer Factor</span>
              </div>
              <div>
                <span className="typography-mono text-2xl font-semibold text-white block">1998</span>
                <span className="text-xs text-slate-400">Основание 4Life Research</span>
              </div>
              <div>
                <span className="typography-mono text-2xl font-semibold text-cyan-300 block">+437%</span>
                <span className="text-xs text-slate-400">Рост активности NK-клеток</span>
              </div>
            </div>

            <Button to="/products" variant="secondary" size="md" icon={<Icons.ArrowRight className="w-4 h-4" />}>
              К 17 формулам каталога
            </Button>
          </div>
        </PageEntrance>
      </section>

      {/* SECTION 01: 270PX BIO-FIELD + 3-MODE COMPARISON BENCH + 3-PHASE IMMUNE TRIPTYCH */}
      <section className="relative z-10 py-24 md:py-36 border-t border-white/[0.08] overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-5">
              <span className="typography-label text-cyan-400 block">01 — Принцип действия</span>
              <h2 className="typography-h2 text-white">
                Не витамин и не стимулятор —{" "}
                <span className="text-cyan-300">язык, на котором общается иммунитет</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="typography-body text-slate-300 text-pretty">
                Витамины дают клеткам строительный материал. Трансфер Факторы передают им саму инструкцию: как вовремя
                увидеть задачу, точно сработать и спокойно вернуться в равновесие.
              </p>
            </div>
          </div>

          {/* Interactive 270px Tier-Aware Canvas 2D Cellular Bio-Field */}
          <ImmuneBioFieldCanvas activePhase={activePhase} />

          {/* Interactive 3-Mode Comparison Bench */}
          <div
            data-comparison-bench
            className="rounded-[1.75rem] bg-[#050811] border border-white/[0.09] p-6 sm:p-8 space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <span className="typography-mono text-[10px] uppercase tracking-[0.22em] text-cyan-400">
                Сравнительный стенд механизмов
              </span>
              <div role="tablist" aria-label="Сравнение механизмов поддержки иммунитета" className="flex flex-wrap gap-2">
                {COMPARISON_MODES.map((mode) => {
                  const isSelected = mode.id === comparisonId;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      data-compare-mode={mode.id}
                      onClick={() => setComparisonId(mode.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        isSelected
                          ? mode.highlight
                            ? "bg-cyan-500/20 border-cyan-400/55 text-cyan-200"
                            : "bg-white/[0.1] border-white/[0.28] text-white"
                          : "bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white"
                      }`}
                    >
                      {mode.tabLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-white/[0.08] items-start">
              <div className="lg:col-span-4 space-y-2">
                <span
                  className={`typography-mono text-[10px] uppercase tracking-[0.2em] block ${
                    activeComparison.highlight ? "text-cyan-300" : "text-slate-400"
                  }`}
                >
                  {activeComparison.badge}
                </span>
                <h3 className="font-heading text-xl font-semibold text-white">{activeComparison.role}</h3>
              </div>
              <div className="lg:col-span-5">
                <p className="text-sm text-slate-300 leading-relaxed text-pretty">{activeComparison.mechanism}</p>
              </div>
              <div className="lg:col-span-3 lg:border-l lg:border-white/[0.08] lg:pl-6">
                <span className="typography-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 block mb-1.5">
                  Профиль безопасности
                </span>
                <p
                  className={`text-xs leading-relaxed ${
                    activeComparison.highlight ? "text-cyan-200/90" : "text-slate-400"
                  }`}
                >
                  {activeComparison.riskProfile}
                </p>
              </div>
            </div>
          </div>

          {/* 3-Column Simultaneous OpticalSurface Triptych */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {IMMUNE_TRIPTYCH.map((item, idx) => {
              const isSelected = idx === activePhase;
              return (
                <OpticalSurface
                  key={item.index}
                  accent="cyan"
                  tilt
                  onMouseEnter={() => setActivePhase(idx)}
                  onClick={() => setActivePhase(idx)}
                  data-immune-phase={item.index}
                  className={`group rounded-[1.75rem] p-7 lg:p-8 cursor-pointer transition-colors duration-300 ${
                    isSelected ? "border-cyan-400/45" : ""
                  }`}
                >
                  <article className="flex flex-col justify-between gap-8 h-full">
                    <div className="space-y-6">
                      <div className="flex items-baseline justify-between gap-4">
                        <span
                          className={`typography-mono text-4xl md:text-5xl font-light leading-none transition-colors duration-300 ${
                            isSelected ? "text-cyan-300" : "text-white/25 group-hover:text-cyan-400/70"
                          }`}
                        >
                          {item.index}
                        </span>
                        <span className="typography-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
                          {item.signalLabel}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <span className="block typography-mono text-xs uppercase tracking-[0.2em] text-cyan-400">
                          {item.phase}
                        </span>
                        <h3 className="typography-h3 text-white group-hover:text-cyan-100 transition-colors">
                          {item.headline}
                        </h3>
                        <p className="typography-body text-slate-300 leading-relaxed text-pretty">{item.description}</p>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between text-[10px] typography-mono tracking-[0.16em] text-slate-500">
                      <span>{item.metricCode}</span>
                      <span className={isSelected ? "text-cyan-300" : "text-slate-600"}>ФАЗА {item.index}</span>
                    </div>
                  </article>
                </OpticalSurface>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 02: DOCUMENTARY FILM REEL (FOUNDERS, CGMP PLANT, SCIENCE) */}
      <section className="relative z-10 py-24 md:py-36 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <DocumentaryFilmReel />
      </section>

      {/* SECTION 03: CINEMATIC ALTERNATING PHOTO + STORY EDITORIAL STORYLINE (1949 / 1998 / 2026) */}
      <section className="relative z-10 py-24 md:py-36 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="max-w-3xl space-y-5 mb-20 md:mb-28">
          <span className="typography-label text-cyan-400 block">03 — Научная хронология</span>
          <h2 className="typography-h2 text-white">
            Путь от открытия 1949 года до{" "}
            <span className="text-cyan-300">завода NSF/cGMP в Виньярде</span>
          </h2>
          <p className="typography-body text-slate-300">
            За каждой формулой стоит более семидесяти лет иммунологических исследований, патентованная ультрафильтрация
            природных пептидов и производство полного цикла в штате Юта.
          </p>
        </div>

        <div ref={storylineRef} className="relative">
          {/* Vertical Scroll-Driven Optical Progress Thread */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-white/[0.08]"
          >
            <motion.div
              className="w-full h-full origin-top bg-gradient-to-b from-cyan-400 via-cyan-300/80 to-cyan-500/20"
              style={{ scaleY: lineScaleY }}
            />
          </div>

          <div className="space-y-20 md:space-y-32">
            {STORYLINE_EPOCHS.map((epoch, idx) => {
              const isReversed = idx % 2 === 1;
              return (
                <article
                  key={epoch.year}
                  className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
                >
                  <div
                    aria-hidden="true"
                    className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-3.5 h-3.5 rounded-full bg-[#03050a] border-2 border-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.65)]"
                  />

                  <div className={`lg:col-span-6 ${isReversed ? "lg:order-2 lg:pl-8" : "lg:pr-8"}`}>
                    <ParallaxImage
                      src={epoch.image}
                      alt={epoch.imageAlt}
                      caption={epoch.caption}
                      aspectClassName="aspect-[16/10]"
                    />
                  </div>

                  <div className={`lg:col-span-6 space-y-5 relative ${isReversed ? "lg:order-1 lg:pr-8" : "lg:pl-8"}`}>
                    <div className="space-y-2">
                      <ScrollNumber
                        number={epoch.year}
                        className="font-heading text-6xl sm:text-7xl md:text-8xl font-light leading-none tracking-tighter block"
                      />
                      <span className="typography-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400 block">
                        {epoch.tag}
                      </span>
                    </div>

                    <h3 className="typography-h2 text-white leading-tight">{epoch.title}</h3>
                    <p className="typography-lead text-slate-300 leading-relaxed text-pretty">{epoch.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 04: INTERACTIVE RF & GLOBAL CERTIFICATION REGISTRY + CATALOG HANDOFF */}
      <section className="relative z-10 py-24 md:py-32 border-t border-white/[0.08] overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7 space-y-4">
              <span className="typography-label text-cyan-400 block">04 — Реестр стандартов и сертификации РФ</span>
              <h2 className="typography-h2 text-white">
                Подлинность и клинические стандарты,{" "}
                <span className="text-cyan-300">подтверждённые документально</span>
              </h2>
            </div>
            <p className="lg:col-span-5 typography-body text-slate-400 text-pretty">
              Вся линейка для России проходит государственную регистрацию ЕАЭС, маркируется в системе «Честный ЗНАК»
              и опирается на международную производственную сертификацию NSF cGMP.
            </p>
          </div>

          <div
            data-certifications-registry
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {CERTIFICATION_PASSPORTS.map((cert) => (
              <OpticalSurface
                key={cert.id}
                accent="cyan"
                tilt
                className="rounded-[1.75rem] p-7 sm:p-8 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
                      {cert.code}
                    </span>
                    <span className="typography-mono text-xs text-slate-500">{cert.index} / 04</span>
                  </div>
                  <h3 className="typography-h3 text-white leading-snug">{cert.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed text-pretty">{cert.summary}</p>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-start gap-2.5 text-xs text-cyan-200/85">
                  <Icons.Shield className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{cert.verification}</span>
                </div>
              </OpticalSurface>
            ))}
          </div>

          <div className="pt-14 border-t border-white/[0.08] flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="typography-label text-cyan-400 block">Следующий шаг</span>
              <h2 className="typography-h2 text-white">
                Познакомьтесь с коллекцией <span className="text-cyan-300">из 17 целевых формул</span>
              </h2>
              <p className="typography-body text-slate-300">
                От базовой иммунной памяти до целевой поддержки сердца, когнитивного фокуса, микробиома и клеточной
                энергии.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button to="/products" variant="primary" size="lg" icon={<Icons.ArrowRight className="w-5 h-5" />}>
                Открыть каталог
              </Button>
              <Button to="/how-to-buy" variant="secondary" size="lg">
                Как оформить заказ
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(AboutPage);