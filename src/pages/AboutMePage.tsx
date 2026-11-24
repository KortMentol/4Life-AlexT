/**
 * @module src/pages/AboutMePage.tsx
 * @description Ultra-Awwwards editorial monograph of Alexander Toshchev (Builder Elite 4Life, ID 12299550).
 * - AtmosphericBackdrop for deep Clinical Obsidian luminosity.
 * - Section 01: Asymmetric editorial portrait + verified Builder Elite credential ledger.
 * - Section 02: Crystal-sharp, ZERO-BLUR Cormorant Garamond Italic manifesto (1 of 3 flagship italic moments on site).
 * - Section 03: Interactive Personal Selection Matrix («С какой задачей вы пришли?») featuring 4 selectable goals
 *   with real .webp packshots from productsData, RC 67 wholesale RUB estimates, and prefilled WhatsApp/Telegram CTAs.
 * - Section 04: Direct calm dialogue closing band.
 */

import mentorPortraitImg from "@/assets/images/mentor_editorial_atmosphere_1795192951045.jpg";
import { PageEntrance } from "@/components/transitions/PageEntrance";
import { AtmosphericBackdrop, Button, OpticalSurface, ParallaxImage } from "@/components/ui";
import ScrollNumber from "@/components/ui/ScrollNumber";
import { productsData } from "@/data/productsData";
import { usePerformanceTier } from "@/hooks";
import { SEO } from "@/seo/SEO";
import { siteConfig } from "@/site-config/site";
import { formatRub } from "@/utils/catalogHelpers";
import { Icons } from "@/utils/icons";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";

const MANIFESTO_LINES = [
  "«Когда-то людей приучали чистить зубы. Сегодня никому не приходит в голову удивляться, что это нужно делать каждый день.",
  "Точно так же работает спокойная ежедневная забота о клеточном ресурсе: маленькие регулярные шаги дают больше, чем любые экстренные рывки».",
] as const;

interface GoalOption {
  id: string;
  index: string;
  tabTitle: string;
  tag: string;
  headline: string;
  approach: string;
  productIds: readonly string[];
  courseNote: string;
  prefillMessage: string;
  isPartnership?: boolean;
}

const SELECTION_GOALS: readonly GoalOption[] = [
  {
    id: "family-immunity",
    index: "01",
    tabTitle: "Иммунитет семьи и детей",
    tag: "Базовая клеточная защита",
    headline: "Спокойный фундамент на сезон нагрузок и школы",
    approach:
      "Не перегружаем организм лишними банками. Для детей и мягкого старта берём чистый Трансфер Фактор Классик из молозива, для взрослых — Трай-Фактор с тройной пептидной фракцией. Разберём точную схему приёма под возраст и режим семьи.",
    productIds: ["tf-classic", "tf-trifactor"],
    courseNote: "Оптимальный старт на 30 дней с оптовой скидкой −25% через РЦ 67",
    prefillMessage:
      "Здравствуйте, Александр! Интересует базовый подбор формул 4Life для иммунитета семьи и детей (Классик / Трай-Фактор). Подскажите схему старта.",
  },
  {
    id: "energy-stress",
    index: "02",
    tabTitle: "Энергия, сон и защита от стресса",
    tag: "Восстановление ресурса",
    headline: "Ровный тонус днём и глубокое восстановление ночью",
    approach:
      "Если привычная усталость больше не снимается кофе, работаем с причиной: адаптогены Ренуво снижают кортизоловый фон и защищают митохондрии, а Энерджи Гоу Стикс даёт мягкую концентрацию без резкого отката.",
    productIds: ["renuvo", "energy-go-stix"],
    courseNote: "Связка для предпринимателей, родителей и высоких нагрузок",
    prefillMessage:
      "Здравствуйте, Александр! Хочу подобрать связку 4Life для энергии, качества сна и восстановления от стресса (Ренуво / Энерджи Гоу Стикс).",
  },
  {
    id: "targeted-organs",
    index: "03",
    tabTitle: "Сердце, сосуды, мозг или ЖКТ",
    tag: "Целевые формулы",
    headline: "Точечная поддержка ведущей системы организма",
    approach:
      "Целевая линейка 4Life сочетает Трансфер Фактор с профильными нутриентами: Кардио — для сосудов и миокарда, Реколл — для памяти и когнитивной ясности, Пре/О Биотики — для микробиома, где живёт 70% иммунных клеток.",
    productIds: ["tf-cardio", "tf-recall", "pre-o-biotics"],
    courseNote: "Подберём 1–2 ключевые формулы под ваш приоритет без лишних позиций",
    prefillMessage:
      "Здравствуйте, Александр! Нужна консультация по целевым формулам 4Life (сердце / память и фокус / микробиом ЖКТ).",
  },
  {
    id: "partnership-income",
    index: "04",
    tabTitle: "Партнёрский доход с 4Life",
    tag: "Бизнес и наставничество",
    headline: "Прозрачная модель Life Rewards без складов и спама",
    approach:
      "Если вам близка тема здоровья и интересен дополнительный или основной доход на базе международного бренда в 70+ странах — спокойно разберём математику LP, правила РФ (НПД / ИП) и пошаговый план выхода на Builder Bonus и Diamond.",
    productIds: [],
    courseNote: "Вход без стартовых взносов • Официальные выплаты в РФ • Личное сопровождение",
    prefillMessage:
      "Здравствуйте, Александр! Хочу спокойно разобрать партнёрскую модель 4Life Life Rewards и формат старта в вашей команде.",
    isPartnership: true,
  },
] as const;

const AboutMePage: React.FC = () => {
  const tier = usePerformanceTier();
  const isLow = tier === "low";
  const [selectedGoalId, setSelectedGoalId] = useState<string>(SELECTION_GOALS[0]!.id);

  const productsMap = useMemo(() => {
    const map = new Map<string, (typeof productsData)[number]>();
    for (const p of productsData) {
      map.set(p.id, p);
    }
    return map;
  }, []);

  const activeGoal = SELECTION_GOALS.find((g) => g.id === selectedGoalId) ?? SELECTION_GOALS[0]!;

  const activeProducts = useMemo(
    () =>
      activeGoal.productIds
        .map((id) => productsMap.get(id))
        .filter((p): p is (typeof productsData)[number] => Boolean(p)),
    [activeGoal.productIds, productsMap],
  );

  const bundleTotalRub = useMemo(
    () => activeProducts.reduce((sum, p) => sum + p.priceRub, 0),
    [activeProducts],
  );
  const bundleTotalLp = useMemo(
    () => activeProducts.reduce((sum, p) => sum + p.lp, 0),
    [activeProducts],
  );

  const whatsappPrefillUrl = `${siteConfig.contact.whatsapp}?text=${encodeURIComponent(activeGoal.prefillMessage)}`;

  return (
    <div className="relative min-h-screen bg-[#03050a] text-slate-300">
      <AtmosphericBackdrop variant="cyan" />

      <SEO
        title="Александр Тощев — Независимый дистрибьютор 4Life и наставник"
        description="Личный путь, философия культуры внутренней чистоты, интерактивный подбор курса под задачу и принципы работы Александра Тощева (Builder Elite 4Life, ID 12299550)."
        path="/about-me"
      />

      {/* HERO SECTION */}
      <section className="relative z-10 pt-36 md:pt-44 pb-16 md:pb-24 overflow-x-clip">
        <PageEntrance className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
          <div data-entrance="badge" className="flex items-center gap-3">
            <span className="w-7 h-px bg-cyan-400/80" aria-hidden="true" />
            <span className="typography-label text-cyan-400">
              {siteConfig.distributor.name} • {siteConfig.distributor.rank} 4Life
            </span>
          </div>

          <div data-entrance="title" className="max-w-5xl">
            <h1 className="typography-h1 text-white leading-[1.04]">
              Здоровье начинается с привычки{" "}
              <span className="text-cyan-300 block mt-1">мыслить категориями ресурса, а не усталости</span>
            </h1>
          </div>
        </PageEntrance>
      </section>

      {/* SECTION 01: ASYMMETRIC EDITORIAL PORTRAIT + PERSONAL STORY */}
      <section className="relative z-10 py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <ParallaxImage
              src={mentorPortraitImg}
              alt={`${siteConfig.distributor.name} — ${siteConfig.distributor.rank} 4Life`}
              caption={`${siteConfig.distributor.name} • Москва • ${siteConfig.distributor.rank}`}
              aspectClassName="aspect-[4/5]"
              priority
            />
          </div>

          <div className="lg:col-span-7 space-y-9 lg:pt-4">
            <span className="typography-label text-cyan-400 block">01 — Личный опыт</span>
            <h2 className="typography-h2 text-white">От личного интереса к осознанной практике</h2>

            <div className="space-y-6 text-base md:text-lg text-slate-300 leading-relaxed text-pretty">
              <p>
                Моё знакомство с Трансфер Факторами началось с простого человеческого запроса: хотелось не маскировать
                усталость кофе и короткими курсами витаминов, а понять, как помочь организму самому держать высокий
                тонус и восстанавливаться глубже.
              </p>
              <p>
                Когда первые месяцы принесли ощутимую разницу в качестве сна, ясности головы и устойчивости к нагрузкам,
                стало очевидно, насколько редко сегодня о сложной биологии говорят просто и честно. Так вокруг этого
                опыта постепенно сложилось дело и команда — без суеты, с уважением к выбору каждого человека.
              </p>
            </div>

            {/* Unboxed Swiss 3-column hairline credential ledger */}
            <div className="grid grid-cols-2 sm:grid-cols-3 border-y border-white/[0.1] divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
              <div className="py-5 sm:pr-6">
                <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-1.5">
                  Статус
                </span>
                <span className="font-heading text-xl font-bold text-white">{siteConfig.distributor.rank}</span>
              </div>
              <div className="py-5 sm:px-6">
                <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-1.5">
                  Партнёрский ID
                </span>
                <span className="typography-mono text-xl font-bold text-cyan-400">
                  {siteConfig.distributor.fourLifeId}
                </span>
              </div>
              <div className="py-5 sm:pl-6 col-span-2 sm:col-span-1">
                <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-1.5">
                  Локация
                </span>
                <span className="font-heading text-xl font-bold text-white">{siteConfig.contact.address}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02: CRYSTAL-SHARP ZERO-BLUR MANIFESTO QUOTE (Flagship Cormorant Italic Moment) */}
      <section className="relative z-10 py-28 md:py-40 border-t border-white/[0.08] overflow-x-clip">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <div className="flex justify-center mb-6 pointer-events-none select-none">
            <ScrollNumber
              number="02"
              className="font-heading text-[7rem] sm:text-[9.5rem] md:text-[12rem] font-light leading-none tracking-tighter opacity-85"
            />
          </div>

          <div className="space-y-4 mb-12">
            <span className="typography-label text-cyan-400 block">Философия регулярности</span>
            <h2 className="typography-h2 text-white">Культура внутренней чистоты</h2>
          </div>

          <blockquote
            data-manifesto-quote
            className="pt-10 border-t border-cyan-400/25 space-y-6 max-w-4xl mx-auto"
          >
            {MANIFESTO_LINES.map((line, idx) => (
              <motion.p
                key={idx}
                initial={isLow ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.65, delay: idx * 0.14, ease: [0.16, 1, 0.3, 1] }}
                className="typography-editorial-italic text-2xl sm:text-3xl md:text-4xl leading-snug text-white font-normal text-pretty"
              >
                {line}
              </motion.p>
            ))}
            <footer className="typography-mono text-xs uppercase tracking-[0.24em] text-cyan-400 pt-2">
              — {siteConfig.distributor.name}
            </footer>
          </blockquote>
        </div>
      </section>

      {/* SECTION 03: INTERACTIVE PERSONAL SELECTION MATRIX («С какой задачей вы пришли?») */}
      <section className="relative z-10 py-24 md:py-36 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl space-y-3">
            <span className="typography-label text-cyan-400 block">03 — Матрица подбора</span>
            <h2 className="typography-h2 text-white">
              С какой задачей <span className="text-cyan-300">вы пришли?</span>
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-sm text-pretty">
            Выберите ваш приоритет — покажу логику подбора, реальные стартовые формулы с оптовыми ценами РЦ 67 и
            подготовлю текст для диалога.
          </p>
        </div>

        <div data-goal-matrix className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left 5 cols: 4 Selectable Goal Tabs */}
          <div
            role="tablist"
            aria-label="Выбор цели обращения"
            className="lg:col-span-5 border-y border-white/[0.1] divide-y divide-white/[0.08]"
          >
            {SELECTION_GOALS.map((goal) => {
              const isSelected = goal.id === selectedGoalId;
              return (
                <button
                  key={goal.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  data-goal-tab={goal.id}
                  onClick={() => setSelectedGoalId(goal.id)}
                  className={`relative w-full text-left py-6 px-4 sm:px-5 transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 ${
                    isSelected ? "bg-cyan-500/[0.06]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className={`typography-mono text-2xl font-light leading-none w-9 flex-shrink-0 transition-colors ${
                        isSelected ? "text-cyan-300" : "text-white/25 group-hover:text-cyan-400/70"
                      }`}
                    >
                      {goal.index}
                    </span>
                    <div className="space-y-1 flex-1 min-w-0">
                      <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/85 block">
                        {goal.tag}
                      </span>
                      <span
                        className={`font-heading text-base sm:text-lg font-semibold block leading-snug ${
                          isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                        }`}
                      >
                        {goal.tabTitle}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-4 bottom-4 w-[2px] bg-cyan-400 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right 7 cols: OpticalSurface Detail Card with Real .webp Product Thumbnails */}
          <div className="lg:col-span-7">
            <OpticalSurface accent="cyan" className="rounded-[1.75rem] p-6 sm:p-8 lg:p-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGoal.id}
                  initial={isLow ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={isLow ? { opacity: 1 } : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-7"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="typography-mono text-[10px] uppercase tracking-[0.22em] text-cyan-400">
                        Сценарий {activeGoal.index} / 04 • {activeGoal.tag}
                      </span>
                      {bundleTotalRub > 0 && (
                        <span className="typography-mono text-xs text-cyan-200">
                          Старт: {bundleTotalLp} LP • ≈ {formatRub(bundleTotalRub)}
                        </span>
                      )}
                    </div>
                    <h3 className="typography-h3 text-white">{activeGoal.headline}</h3>
                    <p className="typography-body text-slate-300 leading-relaxed text-pretty">{activeGoal.approach}</p>
                  </div>

                  {/* Real .webp Product Thumbnails for Health Goals */}
                  {activeProducts.length > 0 ? (
                    <div className="space-y-3">
                      <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block">
                        Опорные формулы на старт (оптовый прайс РЦ 67 −25%)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {activeProducts.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#03050a]/90 border border-white/[0.08]"
                          >
                            <div
                              className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 p-1.5"
                              style={{
                                backgroundImage:
                                  "radial-gradient(circle at 50% 50%, rgba(6,182,212,0.18), rgba(5,8,17,0.95) 75%)",
                              }}
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="min-w-0 flex-1 space-y-1">
                              <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
                                {product.name}
                              </p>
                              <div className="flex items-center gap-2 typography-mono text-[11px]">
                                <span className="text-cyan-300 font-semibold">{formatRub(product.priceRub)}</span>
                                <span className="text-slate-500">• {product.lp} LP</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-[#03050a]/90 border border-cyan-400/20 space-y-3">
                      <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400 block">
                        Архитектура Life Rewards РФ 2026
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <span className="typography-mono text-base font-bold text-white block">25%</span>
                          <span className="text-slate-400">Rapid Rewards с 1-х заказов</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <span className="typography-mono text-base font-bold text-cyan-300 block">$50–$800</span>
                          <span className="text-slate-400">Builder Bonus (TV ≥ 600 LP)</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <span className="typography-mono text-base font-bold text-white block">НПД / ИП</span>
                          <span className="text-slate-400">Официальные выплаты в РФ</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-xs text-slate-400">{activeGoal.courseNote}</span>
                    <div className="flex flex-wrap gap-2.5 flex-shrink-0">
                      <a
                        href={whatsappPrefillUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-goal-whatsapp-cta
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-xs font-semibold text-emerald-200 transition-colors active:scale-95"
                      >
                        <Icons.WhatsApp className="w-4 h-4 text-emerald-400" />
                        <span>Обсудить в WhatsApp</span>
                      </a>
                      {activeGoal.isPartnership ? (
                        <Button
                          to="/partnership"
                          variant="secondary"
                          size="sm"
                          icon={<Icons.ArrowRight className="w-3.5 h-3.5" />}
                        >
                          К расчёту дохода
                        </Button>
                      ) : (
                        <Button
                          to="/products"
                          variant="secondary"
                          size="sm"
                          icon={<Icons.ArrowRight className="w-3.5 h-3.5" />}
                        >
                          Открыть каталог
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </OpticalSurface>
          </div>
        </div>
      </section>

      {/* SECTION 04: DIRECT DIALOGUE — FULL-BLEED UNCLIPPED CLOSING BAND */}
      <section className="relative z-10 py-24 md:py-32 border-t border-white/[0.08] overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
          <div className="max-w-2xl space-y-4">
            <span className="typography-label text-cyan-400 block">Прямой диалог</span>
            <h2 className="typography-h2 text-white">
              Напишите мне лично — <span className="text-cyan-300">обсудим задачу спокойно и по существу</span>
            </h2>
            <p className="typography-body text-slate-300">{siteConfig.contact.callSchedule}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              href={siteConfig.contact.whatsapp}
              isExternal
              variant="primary"
              size="lg"
              icon={<Icons.WhatsApp className="w-5 h-5 text-emerald-400" />}
            >
              Написать в WhatsApp
            </Button>
            <Button
              href={siteConfig.contact.telegram}
              isExternal
              variant="secondary"
              size="lg"
              icon={<Icons.Telegram className="w-5 h-5 text-sky-400" />}
            >
              Написать в Telegram
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(AboutMePage);