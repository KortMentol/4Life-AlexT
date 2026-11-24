/**
 * @module src/pages/PartnershipPage.tsx
 * @description Ultra-Awwwards 2026/2027 editorial monograph for /partnership (100% verified 4Life RF / Eurasia Nov 2026):
 * - AtmosphericBackdrop (gold variant) + liquid-inertia spring ChapterNav across all 6 chapters.
 * - Chapter 01: Cinema-poster Hero (1 of 3 flagship Cormorant Garamond italic moments on site).
 * - Chapter 02: Asymmetric crossfading photography stage + 4Life RF income streams (25%, 20% + 10→12→15% БЛ, $50–$800 TV≥600, 2/12/5%+Gen 4-10).
 * - Chapter 03: Executive GrowthModelSimulator with live 4-orbit SVG constellation, TV/L3V telemetry & RF glossary.
 * - Chapter 04: Interactive Retail vs 4Life Direct 64% Distribution Bar + Official RF Payout Formats (Товарный бонус / НПД 6% / ИП УСН 6%) + ПК vs Партнёр comparison.
 * - Chapter 05: 6-Tier 4Life Eurasia Career Track + Dynamic Selected-Rank OpticalSurface Passport (zero repeated static sculpture).
 * - Chapter 06: Direct calm dialogue closing band ("Александру Тощеву").
 */

import monolithImg from "@/assets/images/biotech_partnership_architecture_1795192950988.jpg";
import atriumImg from "@/assets/images/partnership_editorial_atrium_1795234146682.jpg";
import horizonImg from "@/assets/images/partnership_global_horizon_1795192951523.jpg";
import sculptureImg from "@/assets/images/partnership_global_sculpture_1795234145394.jpg";
import { GrowthModelSimulator } from "@/components/sections/Partnership/GrowthModelSimulator";
import { getPalette } from "@/components/sections/PartnershipSection/constants";
import ChapterNav, { type NavChapterItem } from "@/components/sections/PartnershipSection/ui/ChapterNav";
import Ticker from "@/components/sections/PartnershipSection/ui/Ticker";
import { PageEntrance } from "@/components/transitions/PageEntrance";
import { AtmosphericBackdrop, Button, OpticalSurface } from "@/components/ui";
import { usePerformanceTier } from "@/hooks";
import { scrollTo } from "@/lib/lenis";
import { rafLoop } from "@/lib/rafLoop";
import { SEO } from "@/seo/SEO";
import { siteConfig } from "@/site-config/site";
import { Icons } from "@/utils/icons";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PAGE_CHAPTERS: readonly NavChapterItem[] = [
  { id: "horizon", label: "Горизонт" },
  { id: "streams", label: "Механика" },
  { id: "simulator", label: "Расчёт" },
  { id: "platform", label: "Выплаты РФ" },
  { id: "ranks", label: "Уровни" },
  { id: "dialogue", label: "Диалог" },
] as const;

const INCOME_STREAMS = [
  {
    index: "01",
    figure: "25%",
    kicker: "Rapid Rewards",
    title: "Первые заказы по вашей рекомендации",
    detail:
      "25% от объёма LP первых покупок лично приглашённых Приоритетных Клиентов и партнёров начисляется оперативно — без собственного склада и без стартовых взносов.",
    caption: "Мгновенная обратная связь с первых шагов",
    image: atriumImg,
    imageClass: "object-center",
  },
  {
    index: "02",
    figure: "20% + 10–15% БЛ",
    kicker: "Личный объём и Лояльность РФ",
    title: "Возврат свыше 100 LP и накопительные Баллы Лояльности",
    detail:
      "Личный объём сверх базовых 100 LP приносит 20% денежного возврата, а Программа Лояльности РФ возвращает 10% (1–3 мес.) → 12% (4–12 мес.) → 15% (с 13-го мес., лимит 150 БЛ/мес) + бесплатный Продукт Месяца от 125 LP.",
    caption: "100–125 LP — две-три базовые формулы для себя и семьи",
    image: monolithImg,
    imageClass: "object-center",
  },
  {
    index: "03",
    figure: "$50 → $800",
    kicker: "Builder Bonus 3×3 (TV ≥ 600 LP)",
    title: "Фиксированная командная премия за дупликацию",
    detail:
      "Ежемесячная премия поверх процентов при личном заказе ≥ 100 LP по Лояльности, минимум 3 активных партнёрах L1 и командном объёме TV (вы + L1) ≥ 600 LP: $50 (L1), $200 (+9 на L2, ≥900 LP) и $800 (+27 на L3, ≥2 700 LP).",
    caption: "Предсказуемый фундамент на этапе становления группы",
    image: sculptureImg,
    imageClass: "w-[134%] max-w-none -ml-[30%] object-[88%_52%]",
  },
  {
    index: "04",
    figure: "2% / 12% / 5%",
    kicker: "Поколения (Gen 4–10) и Premier Pool",
    title: "Регулярный доход с повторных заказов структуры",
    detail:
      "В Евразии основной вес плана — 12% со второго уровня (L1 = 2%, L2 = 12%, L3 = 5%), далее поколения Infinity: Gen 4 = 6% (Diamond) / 12% (Presidential+), Gen 5–6 = 3%, Gen 7–10 = 2% и доля в глобальном Premier Pool.",
    caption: "Единый международный ID в 70+ странах мира",
    image: horizonImg,
    imageClass: "object-center",
  },
] as const;

const RETAIL_VS_DIRECT_MODELS = {
  retail: {
    label: "Классический ритейл / аптека",
    summary:
      "В традиционной рознице до 70–75% конечной цены уходит на цепочку оптовых посредников, аренду торговых полок и дорогую ТВ/диджитал-рекламу.",
    segments: [
      { label: "Завод и сырьё", pct: 25, color: "rgba(148,163,184,0.45)" },
      { label: "Дистрибьюторы", pct: 25, color: "rgba(148,163,184,0.28)" },
      { label: "Аптека / полка", pct: 25, color: "rgba(148,163,184,0.18)" },
      { label: "Реклама", pct: 25, color: "rgba(148,163,184,0.10)" },
    ],
  },
  direct: {
    label: "Прямая модель 4Life (до 64% в сеть)",
    summary:
      "4Life владеет собственным заводом NSF/cGMP в Виньярде и складом РЦ 67 в Москве, отказывается от маркетплейсов и ТВ-рекламы — и направляет до 64% оборота LP напрямую в выплаты партнёрам.",
    segments: [
      { label: "R&D, завод cGMP и логистика", pct: 36, color: "rgba(34,211,238,0.45)" },
      { label: "До 64% — фонд выплат Life Rewards партнёрам", pct: 64, color: "#C9A659" },
    ],
  },
} as const;

const RF_PAYOUT_FORMATS = [
  {
    index: "01",
    tag: "СТАРТ С 1-ГО МЕСЯЦА",
    title: "Товарный бонус на счёт 4Life",
    detail:
      "На старте начисленные вознаграждения можно сразу списывать на оплату собственных заказов в РЦ 67 — формулы для себя и семьи выходят на полную самоокупаемость без бумажной волокиты.",
    taxLabel: "Без оформления ИП/НПД",
  },
  {
    index: "02",
    tag: "ОФИЦИАЛЬНЫЙ ВЫВОД НА КАРТУ",
    title: "Самозанятость (НПД 6%)",
    detail:
      "Регистрация в приложении «Мой налог» за 5 минут. Официальный договор с российским представительством 4Life, прозрачный вывод комиссионных на карту физлица с автоматическим чеком и налогом 6%.",
    taxLabel: "Налог 6% • без отчётности",
  },
  {
    index: "03",
    tag: "МАСШТАБНЫЙ ДОХОД",
    title: "ИП на УСН 6% (расчётный счёт)",
    detail:
      "При регулярных выплатах от ранга Diamond и выше открывается ИП на УСН «Доходы 6%». Прямые официальные перечисления на расчётный счёт в российском банке с белым подтверждением дохода.",
    taxLabel: "Белый бизнес • УСН 6%",
  },
] as const;

interface CareerMilestone {
  rank: string;
  shortVolume: string;
  focus: string;
  requirements: readonly string[];
  payoutDepth: string;
  privileges: string;
  rubBenchmark: string;
  description: string;
}

const CAREER_MILESTONES: readonly CareerMilestone[] = [
  {
    rank: "Associate",
    shortVolume: "100 LP",
    focus: "Личная практика и доступ",
    requirements: ["Личный объём: 100 LP / мес", "Лично приглашённые: не требуются", "Вход без стартовых взносов"],
    payoutDepth: "Rapid Rewards 25% + возврат 20% >100 LP + L1 (2%) / L2 (12%)",
    privileges: "Оптовый прайс −25% • Программа Лояльности (10%→12%→15% БЛ) • Продукт месяца от 125 LP",
    rubBenchmark: "Самоокупаемость курса",
    description:
      "Спокойное знакомство с формулами 4Life, доступ к оптовым ценам РЦ 67 и первые выплаты Rapid Rewards с рекомендаций знакомым.",
  },
  {
    rank: "Builder & Builder Elite",
    shortVolume: "3 L1 • TV 1 000 LP",
    focus: "Первая рабочая ячейка",
    requirements: [
      "Личный объём: 100 LP / мес",
      "Лично приглашённые: от 3 активных партнёров L1",
      "Builder Elite: командный объём TV ≥ 1 000 LP (Builder Bonus: TV ≥ 600 LP)",
    ],
    payoutDepth: "L1 (2%) • L2 (12%) • L3 (5%) + Builder Bonus $50 / $200",
    privileges: "Фиксированная премия Builder Bonus поверх процентов + наставнический доступ",
    rubBenchmark: "~25 000 – 55 000 ₽ / мес",
    description:
      "Формируется первая линия активных партнёров: открываются все 3 базовых уровня и фиксированный ежемесячный Builder Bonus.",
  },
  {
    rank: "Diamond & Diamond Elite",
    shortVolume: "6 L1 • L3V 3–5K LP",
    focus: "Устойчивый ежемесячный доход",
    requirements: [
      "Личный объём: 100 LP / мес",
      "Лично приглашённые: от 6 активных партнёров L1",
      "Diamond: L3V ≥ 3 000 LP • Diamond Elite: L3V ≥ 5 000 LP + 2 ветки Builder",
    ],
    payoutDepth: "L1–L3 (2% / 12% / 5%) + Gen 4 Infinity (6%) + Builder Bonus до $800",
    privileges: "Открывается 4-е поколение Infinity (6%) и лидерские программы признания",
    rubBenchmark: "~75 000 – 180 000 ₽ / мес",
    description:
      "Основной уровень зрелой команды: высокий процент со 2-го уровня (12%) и открытая глубина Gen 4 складываются в предсказуемый регулярный доход.",
  },
  {
    rank: "Presidential & Elite",
    shortVolume: "8 L1 • L3V 10–15K LP",
    focus: "Региональное лидерство",
    requirements: [
      "Личный объём: 100 LP / мес",
      "Лично приглашённые: от 8 активных партнёров L1",
      "Presidential: L3V ≥ 10 000 LP + 2 ветки Diamond • Elite: L3V 15 000 LP + OV 30 000 LP",
    ],
    payoutDepth: "L1–L3 + Gen 4 Infinity (12%) + Gen 5–6 (3%) + Builder Bonus $800",
    privileges: "Удвоенная ставка Gen 4 (12%) • Корпоративные поездки Great Escape на двоих",
    rubBenchmark: "~300 000 – 550 000 ₽ / мес",
    description:
      "Организация с самостоятельными лидерами уровня Diamond в нескольких городах, глубокие поколенческие выплаты и статус регионального лидера.",
  },
  {
    rank: "Bronze & Silver Int.",
    shortVolume: "10 L1 • OV 50–100K LP",
    focus: "Международный масштаб",
    requirements: [
      "Личный объём: 100 LP + 10 лично приглашённых + L3V ≥ 20 000 LP",
      "Ветки: 2–3 независимые ветки Presidential Diamond",
      "Организационный объём (OV): 50 000 LP (Bronze) / 100 000 LP (Silver)",
    ],
    payoutDepth: "Gen 4 (12%) + Gen 5–6 (3%) + Gen 7–8 (2%) + доля Premier Pool",
    privileges: "Международный бизнес в 70+ странах по единому ID • Признание на глобальных конвенциях",
    rubBenchmark: "~750 000 – 1,8 млн ₽ / мес",
    description:
      "Официальные международные ступени 4Life Евразия: развитие структуры на рынках России, СНГ, Европы и Азии с лидерскими пулами.",
  },
  {
    rank: "Gold & Platinum Int.",
    shortVolume: "OV 250K – 1M LP",
    focus: "Доля мирового оборота",
    requirements: [
      "L3V ≥ 20 000 LP + 3 ветки Bronze Int. (Gold) / 3 ветки Gold Int. (Platinum)",
      "Организационный объём (OV): 250 000 LP (Gold) / 1 000 000 LP (Platinum)",
      "Участие в высшем лидерском совете компании",
    ],
    payoutDepth: "Полная глубина до Gen 10 (2%) + максимальная доля глобального Premier Pool",
    privileges: "Участие в распределении мирового товарооборота 4Life Research + Platinum Pinnacle",
    rubBenchmark: "От 2,5+ млн ₽ / мес",
    description:
      "Высшие ступени карьерной архитектуры 4Life Research: долгосрочный международный актив и участие в глобальном Premier Pool.",
  },
] as const;

const PartnershipPage: React.FC = () => {
  const tier = usePerformanceTier();
  const palette = useMemo(() => getPalette(), []);
  const isLow = tier === "low";

  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [activeStreamIdx, setActiveStreamIdx] = useState<number>(0);
  const [selectedRankIdx, setSelectedRankIdx] = useState<number>(2);
  const [distView, setDistView] = useState<"direct" | "retail">("direct");

  const heroRef = useRef<HTMLElement>(null);
  const streamsRef = useRef<HTMLElement>(null);
  const simulatorRef = useRef<HTMLElement>(null);
  const platformRef = useRef<HTMLElement>(null);
  const ranksRef = useRef<HTMLElement>(null);
  const dialogueRef = useRef<HTMLElement>(null);

  const lastActiveRef = useRef<number>(0);
  const programmaticLockUntilRef = useRef<number>(0);

  const chapterRefs = useMemo(
    () => [heroRef, streamsRef, simulatorRef, platformRef, ranksRef, dialogueRef],
    [],
  );

  const handleSelectChapter = useCallback((idx: number) => {
    programmaticLockUntilRef.current = performance.now() + 1250;
    lastActiveRef.current = idx;
    setActiveChapter(idx);
  }, []);

  // Deterministic viewport-anchor scroll-spy synced with liquid ChapterNav
  useEffect(() => {
    let lastScrollY = -1;

    const evaluateActiveChapter = (scrollY: number) => {
      if (Math.abs(scrollY - lastScrollY) < 2) return;
      lastScrollY = scrollY;

      if (performance.now() < programmaticLockUntilRef.current) return;

      const docHeight = document.documentElement.scrollHeight;
      const vh = window.innerHeight;
      const anchorY = vh * 0.42;

      let nextIdx = 0;

      if (scrollY + vh >= docHeight - 100) {
        nextIdx = chapterRefs.length - 1;
      } else {
        for (let i = 0; i < chapterRefs.length; i++) {
          const el = chapterRefs[i]?.current;
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= anchorY) {
            nextIdx = i;
          }
        }
      }

      if (nextIdx !== lastActiveRef.current) {
        lastActiveRef.current = nextIdx;
        setActiveChapter(nextIdx);
      }
    };

    evaluateActiveChapter(window.scrollY);
    return rafLoop.subscribe(evaluateActiveChapter);
  }, [chapterRefs]);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroImageY = useTransform(heroScroll, [0, 1], isLow ? ["0%", "0%"] : ["0%", "14%"]);
  const heroImageScale = useTransform(heroScroll, [0, 1], isLow ? [1, 1] : [1.04, 1.13]);

  const activeStream = INCOME_STREAMS[activeStreamIdx] ?? INCOME_STREAMS[0]!;
  const selectedRank = CAREER_MILESTONES[selectedRankIdx] ?? CAREER_MILESTONES[0]!;
  const activeDistModel = RETAIL_VS_DIRECT_MODELS[distView];

  // Centered editorial container with balanced margin for right liquid ChapterNav
  const sectionContainer = "max-w-6xl mx-auto px-5 md:px-10 lg:pr-28 xl:pr-28";

  return (
    <div className="min-h-screen bg-[#03050a] text-slate-300 relative overflow-x-clip">
      <AtmosphericBackdrop variant="gold" />

      <SEO
        title="Партнёрство 4Life в России — План Life Rewards, расчёт дохода и выплаты РФ"
        description="Официальная партнёрская модель 4Life Евразия: до 64% выплат, Rapid Rewards 25%, L2 12%, Builder Bonus (TV ≥ 600 LP), официальный вывод в РФ (НПД/ИП) и наставничество Александра Тощева."
        path="/partnership"
      />

      {/* Liquid-inertia right navigation */}
      <ChapterNav
        active={activeChapter}
        tier={tier}
        palette={palette}
        visible={true}
        chapters={PAGE_CHAPTERS}
        chapterRefs={chapterRefs}
        onSelectChapter={handleSelectChapter}
      />

      {/* CHAPTER 01: CINEMA-POSTER HERO (1 of 3 flagship Cormorant Italic moments) */}
      <section
        ref={heroRef}
        id="horizon"
        className="relative z-10 min-h-[96svh] flex flex-col justify-end overflow-hidden pt-32 pb-16 md:pb-24"
      >
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <motion.img
            src={horizonImg}
            alt=""
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            style={{ y: heroImageY, scale: heroImageScale }}
            className="w-full h-full object-cover opacity-65"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(3,5,10,0.58) 0%, rgba(3,5,10,0.28) 42%, rgba(3,5,10,0.92) 88%, #03050a 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 68% 50% at 50% 34%, rgba(201,166,89,0.16), transparent 72%)",
            }}
          />
        </div>

        <PageEntrance className={`relative z-10 w-full ${sectionContainer}`}>
          <div className="max-w-4xl space-y-8">
            <div data-entrance="badge" className="flex items-center gap-3.5">
              <span className="w-8 h-px" style={{ backgroundColor: palette.gold }} aria-hidden="true" />
              <span className="typography-label" style={{ color: palette.gold }}>
                Life Rewards Plan · 4Life Россия и Евразия
              </span>
            </div>

            <div data-entrance="title">
              <h1 className="typography-display leading-[1.01]" style={{ color: palette.cream }}>
                Дело, которое растёт
                <span className="block typography-editorial-italic mt-1" style={{ color: palette.gold }}>
                  из доверия и точных цифр
                </span>
              </h1>
            </div>

            <div data-entrance="lead">
              <p className="typography-lead text-slate-200/90 max-w-2xl">
                Без собственных складов, стартовых взносов и навязчивых скриптов. Прозрачный международный план
                вознаграждений на базе завода NSF/cGMP 4Life, официальных выплат в РФ и спокойной системы сопровождения
                в команде Александра Тощева.
              </p>
            </div>

            <div data-entrance="buttons" className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                href={siteConfig.distributor.signupUrl}
                isExternal
                variant="primary"
                size="lg"
                className="rounded-full btn-special-fill"
                style={
                  {
                    "--btn-fill-1": palette.gold,
                    "--btn-fill-2": palette.blue,
                  } as React.CSSProperties
                }
                icon={<Icons.ExternalLink className="w-4 h-4" />}
              >
                Оформить партнёрский ID
              </Button>
              <Button
                href={siteConfig.contact.telegram}
                isExternal
                variant="secondary"
                size="lg"
                icon={<Icons.Telegram className="w-4 h-4 text-sky-400" />}
              >
                Обсудить с Александром
              </Button>
            </div>
          </div>

          {/* Minimal Editorial Scroll Cue */}
          <div className="mt-16 pt-6 border-t border-white/[0.1] flex items-center justify-between gap-4">
            <span className="typography-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Единый ID в 70+ странах мира · Вход без стартового взноса · До 64% выплат
            </span>
            <button
              type="button"
              onClick={() => {
                handleSelectChapter(1);
                if (streamsRef.current) {
                  scrollTo(streamsRef.current, { offset: -24, duration: 1.05 });
                }
              }}
              className="hidden sm:inline-flex items-center gap-2 typography-mono text-[11px] uppercase tracking-[0.2em] text-[#C9A659] hover:text-[#F0EDE8] transition-colors cursor-pointer"
            >
              <span>Разбор механики</span>
              <Icons.ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </PageEntrance>
      </section>

      <Ticker tier={tier} palette={palette} />

      {/* CHAPTER 02: ASYMMETRIC VISUAL STAGE + EDITORIAL INCOME INDEX */}
      <section ref={streamsRef} id="streams" className="relative z-10 py-24 md:py-36 border-t border-white/[0.08]">
        <div className={sectionContainer}>
          <div className="max-w-3xl space-y-5 mb-16 md:mb-20">
            <span className="typography-label block" style={{ color: palette.gold }}>
              02 · Анатомия вознаграждений РФ
            </span>
            <h2 className="typography-h2" style={{ color: palette.cream }}>
              Четыре опоры <span style={{ color: palette.gold }}>плана Life Rewards</span>
            </h2>
            <p className="typography-lead text-slate-300 max-w-2xl">
              Вся экономика строится вокруг единой единицы LP (Life Points). Нажмите или наведите на любой поток —
              слева раскрывается его роль в общей системе выплат Евразии.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left 5 cols: Sticky Art-Directed Visual Plate */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-5">
              <div className="relative aspect-[4/3] rounded-[1.75rem] overflow-hidden bg-[#060a14] border border-white/[0.09]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStream.index}
                    initial={isLow ? false : { opacity: 0, clipPath: "inset(8% 0% 8% 0% round 1.75rem)", scale: 1.05 }}
                    animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 1.75rem)", scale: 1 }}
                    exit={isLow ? undefined : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <img
                      src={activeStream.image}
                      alt={activeStream.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover ${activeStream.imageClass}`}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, rgba(3,5,10,0.12) 0%, rgba(3,5,10,0.28) 52%, rgba(3,5,10,0.92) 100%)",
                      }}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-x-6 bottom-6 z-10 flex items-end justify-between gap-4">
                  <div className="space-y-1">
                    <span className="typography-mono text-[10px] uppercase tracking-[0.22em] text-[#C9A659] block">
                      {activeStream.index} · {activeStream.kicker}
                    </span>
                    <p className="text-sm text-[#F0EDE8] leading-snug max-w-xs">{activeStream.caption}</p>
                  </div>
                  <span
                    className="typography-mono text-xl md:text-2xl font-semibold flex-shrink-0 text-right"
                    style={{ color: palette.gold }}
                  >
                    {activeStream.figure}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between px-1 text-xs text-slate-400">
                <span>Базовая активность партнёра</span>
                <span className="typography-mono text-[#F0EDE8]">100–125 LP / мес.</span>
              </div>
            </div>

            {/* Right 7 cols: Serene Editorial List */}
            <div className="lg:col-span-7 border-y border-white/[0.1] divide-y divide-white/[0.08]">
              {INCOME_STREAMS.map((stream, idx) => {
                const isActive = idx === activeStreamIdx;
                return (
                  <button
                    key={stream.index}
                    type="button"
                    onMouseEnter={() => setActiveStreamIdx(idx)}
                    onFocus={() => setActiveStreamIdx(idx)}
                    onClick={() => setActiveStreamIdx(idx)}
                    aria-pressed={isActive}
                    className="relative w-full text-left py-8 md:py-9 pl-6 pr-2 cursor-pointer transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A659]"
                  >
                    {isActive && (
                      <motion.span
                        layoutId={isLow ? undefined : "stream-active-filament"}
                        aria-hidden="true"
                        className="absolute left-0 top-6 bottom-6 w-[2px] rounded-full"
                        style={{ backgroundColor: palette.gold }}
                        transition={{ type: "spring", stiffness: 260, damping: 28 }}
                      />
                    )}

                    <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2.5">
                      <div className="flex items-baseline gap-3">
                        <span
                          className="typography-mono text-xs tracking-[0.2em]"
                          style={{ color: isActive ? palette.gold : "rgba(148,163,184,0.5)" }}
                        >
                          {stream.index}
                        </span>
                        <span className="typography-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          {stream.kicker}
                        </span>
                      </div>

                      <span
                        className="typography-mono text-base md:text-lg font-semibold transition-colors duration-300"
                        style={{ color: isActive ? palette.gold : "rgba(240,237,232,0.52)" }}
                      >
                        {stream.figure}
                      </span>
                    </div>

                    <h3
                      className="typography-h3 transition-colors duration-300"
                      style={{ color: isActive ? "#ffffff" : "rgba(240,237,232,0.78)" }}
                    >
                      {stream.title}
                    </h3>
                    <p
                      className={`typography-body mt-2.5 max-w-2xl transition-colors duration-300 ${
                        isActive ? "text-slate-300" : "text-slate-400/80"
                      }`}
                    >
                      {stream.detail}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 03: EXECUTIVE GROWTH MODEL SIMULATOR */}
      <section ref={simulatorRef} id="simulator" className="relative z-10 py-24 md:py-36 border-t border-white/[0.08]">
        <div className={sectionContainer}>
          <div className="max-w-3xl space-y-5 mb-14">
            <span className="typography-label block" style={{ color: palette.gold }}>
              03 · Наглядная экономика
            </span>
            <h2 className="typography-h2" style={{ color: palette.cream }}>
              Как масштаб команды <span style={{ color: palette.gold }}>переводится в доход</span>
            </h2>
            <p className="typography-lead text-slate-300 max-w-2xl">
              Выберите масштаб модели и сдвиньте ползунок первой линии — симулятор рассчитает командный объём TV, L3V,
              квалификацию и структуру выплат по официальным правилам Евразии.
            </p>
          </div>

          <GrowthModelSimulator palette={palette} tier={tier} />
        </div>
      </section>

      {/* CHAPTER 04: RETAIL VS 4LIFE 64% DISTRIBUTION + OFFICIAL RF PAYOUT FORMATS + ПК VS ПАРТНЁР */}
      <section ref={platformRef} id="platform" className="relative z-10 py-24 md:py-36 border-t border-white/[0.08]">
        <div className={`${sectionContainer} space-y-16`}>
          {/* 4A. Interactive Distribution Bar: Retail vs 4Life Direct 64% */}
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-4">
                <span className="typography-label block" style={{ color: palette.gold }}>
                  04 · Откуда берутся до 64% и как получать доход в РФ
                </span>
                <h2 className="typography-h2" style={{ color: palette.cream }}>
                  Классическая аптека vs <span style={{ color: palette.gold }}>прямая модель 4Life</span>
                </h2>
              </div>

              <div
                role="tablist"
                aria-label="Сравнение моделей распределения цены"
                className="inline-flex rounded-xl p-1 bg-[#060a14] border border-white/[0.1] self-start lg:self-auto"
              >
                {(
                  [
                    { id: "direct" as const, label: "Модель 4Life (до 64%)" },
                    { id: "retail" as const, label: "Классический ритейл" },
                  ] as const
                ).map((item) => {
                  const active = distView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      data-dist-mode={item.id}
                      onClick={() => setDistView(item.id)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        active ? "bg-[#C9A659]/20 text-[#F0EDE8] border border-[#C9A659]/45" : "text-slate-400 hover:text-white border border-transparent"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <OpticalSurface accent="gold" className="rounded-[1.75rem] p-6 sm:p-8 space-y-6" data-distribution-bar>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-heading text-lg sm:text-xl font-semibold text-white">{activeDistModel.label}</h3>
                <span className="typography-mono text-xs text-[#C9A659]">
                  {distView === "direct" ? "0% на маркетплейсы и ТВ-рекламу" : "75% уходит на посредников и рекламу"}
                </span>
              </div>

              {/* Segmented Horizontal Distribution Bar */}
              <div className="h-12 w-full rounded-xl overflow-hidden flex border border-white/[0.1] bg-[#03050a]">
                {activeDistModel.segments.map((seg) => (
                  <div
                    key={seg.label}
                    style={{ width: `${seg.pct}%`, backgroundColor: seg.color }}
                    className="h-full flex items-center justify-center px-2 text-center transition-all duration-500 border-r border-[#03050a]/60 last:border-r-0"
                  >
                    <span className="typography-mono text-[11px] font-bold text-[#03050a] sm:text-xs truncate">
                      {seg.pct}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-x-6 gap-y-2.5 text-xs">
                {activeDistModel.segments.map((seg) => (
                  <div key={seg.label} className="flex items-center gap-2 text-slate-300">
                    <span
                      aria-hidden="true"
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span>
                      {seg.label} — <strong className="typography-mono text-white">{seg.pct}%</strong>
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed pt-4 border-t border-white/[0.08] text-pretty">
                {activeDistModel.summary}
              </p>
            </OpticalSurface>
          </div>

          {/* 4B. How to Officially Receive Payouts in Russia */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="typography-mono text-[10px] uppercase tracking-[0.22em] text-[#C9A659] block">
                Легальный вывод средств в России
              </span>
              <h3 className="typography-h3 text-white">Три официальных формата получения вознаграждений</h3>
            </div>

            <div data-rf-payout-formats className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {RF_PAYOUT_FORMATS.map((fmt) => (
                <OpticalSurface
                  key={fmt.index}
                  accent="gold"
                  className="rounded-[1.5rem] p-6 flex flex-col justify-between gap-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="typography-mono text-xs text-[#C9A659]">{fmt.index}</span>
                      <span className="typography-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                        {fmt.tag}
                      </span>
                    </div>
                    <h4 className="font-heading text-lg font-semibold text-white">{fmt.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed text-pretty">{fmt.detail}</p>
                  </div>
                  <div className="pt-3 border-t border-white/[0.08]">
                    <span className="typography-mono text-[11px] text-[#E2C379]">{fmt.taxLabel}</span>
                  </div>
                </OpticalSurface>
              ))}
            </div>
          </div>

          {/* 4C. Clean Comparison: Preferred Customer (ПК) vs Partner / Distributor */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-y border-white/[0.1] divide-y md:divide-y-0 md:divide-x divide-white/[0.1]">
            <div className="py-8 md:pr-10 space-y-4">
              <span className="typography-mono text-[10px] uppercase tracking-[0.22em] text-cyan-400 block">
                Статус 01 • Для здоровья семьи
              </span>
              <h3 className="font-heading text-xl font-semibold text-white">Приоритетный Клиент (ПК)</h3>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Icons.Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Оптовая цена −25% с первой баночки, регистрация бесплатная</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icons.Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Программа Лояльности от 50 LP (10% → 12% → 15% БЛ) + Продукт Месяца от 125 LP</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icons.Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Ноль обязательств по ежемесячным покупкам или рекомендациям</span>
                </li>
              </ul>
            </div>

            <div className="py-8 md:pl-10 space-y-4">
              <span className="typography-mono text-[10px] uppercase tracking-[0.22em] text-[#C9A659] block">
                Статус 02 • Для дохода и команды
              </span>
              <h3 className="font-heading text-xl font-semibold text-white">Партнёр / Дистрибьютор</h3>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <Icons.Check className="w-4 h-4 text-[#C9A659] flex-shrink-0 mt-0.5" />
                  <span>Все привилегии ПК + Rapid Rewards 25%, личный возврат 20% (свыше 100 LP) и Builder Bonus $50–$800</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icons.Check className="w-4 h-4 text-[#C9A659] flex-shrink-0 mt-0.5" />
                  <span>Построение структуры в 70+ странах (L1 2% / L2 12% / L3 5% / Gen 4–10 + Premier Pool)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icons.Check className="w-4 h-4 text-[#C9A659] flex-shrink-0 mt-0.5" />
                  <span>Бесплатный переход из ПК в Партнёры в любой момент без потери накопленных БЛ</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 05: 6-TIER CAREER TRACK + DYNAMIC SELECTED-RANK PASSPORT */}
      <section ref={ranksRef} id="ranks" className="relative z-10 py-24 md:py-36 border-t border-white/[0.08]">
        <div className={sectionContainer}>
          <div className="max-w-3xl space-y-5 mb-14">
            <span className="typography-label block" style={{ color: palette.gold }}>
              05 · Квалификации 4Life Евразия
            </span>
            <h2 className="typography-h2" style={{ color: palette.cream }}>
              Последовательная траектория <span style={{ color: palette.gold }}>без искусственной гонки</span>
            </h2>
            <p className="typography-lead text-slate-300">
              Выберите любую из шести ступеней — паспорт справа обновит точные квалификационные условия РФ, открытые
              поколения и ориентир ежемесячного дохода.
            </p>
          </div>

          {/* Horizontal 6-step Trajectory Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-white/[0.12]">
            {CAREER_MILESTONES.map((item, idx) => {
              const isSelected = idx === selectedRankIdx;
              const isReached = idx <= selectedRankIdx;
              return (
                <button
                  key={item.rank}
                  type="button"
                  data-rank-tab={idx}
                  onClick={() => setSelectedRankIdx(idx)}
                  aria-pressed={isSelected}
                  className="relative flex flex-col justify-start text-left py-5 pr-4 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A659]"
                >
                  <span
                    className="typography-mono text-xs mb-1.5 transition-colors"
                    style={{ color: isReached ? palette.gold : "rgba(148,163,184,0.45)" }}
                  >
                    0{idx + 1}
                  </span>
                  <span
                    className="font-heading text-sm md:text-base font-semibold leading-snug transition-colors"
                    style={{
                      color: isSelected
                        ? palette.cream
                        : isReached
                          ? "rgba(240,237,232,0.8)"
                          : "rgba(240,237,232,0.42)",
                    }}
                  >
                    {item.rank}
                  </span>
                  <span className="typography-mono text-[10px] text-slate-500 mt-1">{item.shortVolume}</span>

                  {isSelected && (
                    <motion.span
                      layoutId={isLow ? undefined : "rank-active-underline"}
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ backgroundColor: palette.gold }}
                      transition={{ type: "spring", stiffness: 280, damping: 28 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Dynamic Editorial Summary + Dynamic Selected-Rank Passport */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pt-12 items-start">
            <div className="lg:col-span-6 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedRank.rank}
                  initial={isLow ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={isLow ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <span className="typography-mono text-xs uppercase tracking-[0.22em] block" style={{ color: palette.gold }}>
                    Ступень 0{selectedRankIdx + 1} / 06 · {selectedRank.focus}
                  </span>
                  <h3 className="typography-h2" style={{ color: palette.cream }}>
                    {selectedRank.rank}
                  </h3>
                  <p className="typography-lead text-slate-200">{selectedRank.description}</p>
                </motion.div>
              </AnimatePresence>

              {/* Progress Scale */}
              <div className="pt-4 max-w-xl">
                <div className="h-[2px] w-full bg-white/[0.1] overflow-hidden rounded-full">
                  <motion.div
                    className="h-full origin-left"
                    style={{ backgroundColor: palette.gold }}
                    animate={{ scaleX: (selectedRankIdx + 1) / CAREER_MILESTONES.length }}
                    transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  />
                </div>
                <div className="flex justify-between typography-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 mt-2.5">
                  <span>Associate</span>
                  <span>Diamond</span>
                  <span>Gold & Platinum</span>
                </div>
              </div>
            </div>

            {/* Dynamic Selected-Rank OpticalSurface Passport */}
            <div className="lg:col-span-6">
              <OpticalSurface
                accent="gold"
                tilt
                className="rounded-[1.75rem] p-6 sm:p-8"
                data-rank-passport
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedRank.rank}
                    initial={isLow ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={isLow ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-3 pb-4 border-b border-white/[0.09]">
                      <div>
                        <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 block">
                          Паспорт квалификации РФ
                        </span>
                        <span className="font-heading text-xl font-semibold text-white">{selectedRank.rank}</span>
                      </div>
                      <span className="typography-mono text-sm font-semibold" style={{ color: palette.gold }}>
                        {selectedRank.rubBenchmark}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block">
                        Официальные условия Евразии
                      </span>
                      <ul className="space-y-2 text-sm text-slate-200">
                        {selectedRank.requirements.map((req) => (
                          <li key={req} className="flex items-start gap-2.5">
                            <span
                              aria-hidden="true"
                              className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                              style={{ backgroundColor: palette.gold }}
                            />
                            <span className="leading-relaxed">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/[0.08] text-xs">
                      <div className="space-y-1">
                        <span className="typography-mono text-[10px] uppercase tracking-[0.18em] text-[#C9A659] block">
                          Открытая глубина выплат
                        </span>
                        <p className="text-slate-300 leading-relaxed">{selectedRank.payoutDepth}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="typography-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300 block">
                          Привилегии ступени
                        </span>
                        <p className="text-slate-300 leading-relaxed">{selectedRank.privileges}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </OpticalSurface>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 06: DIRECT DIALOGUE */}
      <section ref={dialogueRef} id="dialogue" className="relative z-10 py-24 md:py-36 border-t border-white/[0.08]">
        <div className={`${sectionContainer} grid grid-cols-1 lg:grid-cols-12 gap-10 items-end`}>
          <div className="lg:col-span-7 space-y-5">
            <span className="typography-label block" style={{ color: palette.gold }}>
              06 · Прямой разговор
            </span>
            <h2 className="typography-h2" style={{ color: palette.cream }}>
              Спокойный диалог <span style={{ color: palette.gold }}>до принятия решения</span>
            </h2>
            <p className="typography-lead text-slate-300 max-w-2xl">
              Если модель созвучна вашему подходу, напишите напрямую Александру Тощеву. Разберём ваши цели, комфортный
              темп и реальные цифры — без давления и шаблонных скриптов.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3">
            <Button
              href={siteConfig.distributor.signupUrl}
              isExternal
              variant="primary"
              size="lg"
              className="w-full justify-center rounded-full btn-special-fill"
              style={
                {
                  "--btn-fill-1": palette.gold,
                  "--btn-fill-2": palette.blue,
                } as React.CSSProperties
              }
              icon={<Icons.ExternalLink className="w-4 h-4" />}
            >
              Оформить партнёрский ID
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                href={siteConfig.contact.telegram}
                isExternal
                variant="secondary"
                size="md"
                className="w-full justify-center"
                icon={<Icons.Telegram className="w-4 h-4 text-sky-400" />}
              >
                Telegram
              </Button>
              <Button
                href={siteConfig.contact.whatsapp}
                isExternal
                variant="secondary"
                size="md"
                className="w-full justify-center"
                icon={<Icons.WhatsApp className="w-4 h-4 text-emerald-400" />}
              >
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(PartnershipPage);