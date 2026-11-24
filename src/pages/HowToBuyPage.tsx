/**
 * @module src/pages/HowToBuyPage.tsx
 * @description Russian-first Awwwards editorial ordering & logistics guide via official RC 67 Moscow & CDEK:
 * - Full-bleed dark concierge Hero with live MSK status (Mon–Fri 10–20, Sat 10–17, Sun online intake).
 * - Section 01: Interactive Moscow RC 67 vs All-Russia CDEK Route Stage (strict city validation).
 * - Section 02: Interactive Buyer Savings Calculator (1–6 bottles slider, RF Loyalty 10%→12%→15%, cap 150 БЛ/мес,
 *   free Bonus Product of the Month >= 125 LP) + Fast Order vs Preferred Customer Account strip.
 * - Section 03: RC 67 Moscow Warehouse Passport + Delivery FAQ.
 */

import moscowConciergeImg from "@/assets/images/moscow_rc67_concierge_1795234146619.jpg";
import { InteractiveRouteStage } from "@/components/sections/HowToBuy/InteractiveRouteStage";
import { PageEntrance } from "@/components/transitions/PageEntrance";
import { AtmosphericBackdrop, Button, FAQItem, OpticalSurface } from "@/components/ui";
import { SEO } from "@/seo/SEO";
import { siteConfig } from "@/site-config/site";
import { formatRub } from "@/utils/catalogHelpers";
import { Icons } from "@/utils/icons";
import { getRc67OfficeStatus } from "@/utils/officeHours";
import {
  calculateBuyerLoyaltySavings,
  LOYALTY_MONTHLY_CAP_BL,
  type LoyaltyTenureId,
} from "@/utils/partnershipEconomics";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const LOYALTY_TENURES: readonly { id: LoyaltyTenureId; label: string; rate: string }[] = [
  { id: "m1_3", label: "1–3 мес.", rate: "10% БЛ" },
  { id: "m4_12", label: "4–12 мес.", rate: "12% БЛ" },
  { id: "m13_plus", label: "13+ мес.", rate: "15% БЛ" },
] as const;

const DELIVERY_FAQ = [
  {
    question: "Почему официальный склад РЦ 67 надёжнее сторонних маркетплейсов?",
    answer:
      "4Life Research не поставляет продукцию на маркетплейсы. Региональный Центр РЦ 67 в Москве получает сертифицированные партии (СГР ЕАЭС) напрямую от производителя с кодами «Честный ЗНАК», контролем сроков годности и условий хранения.",
  },
  {
    question: "Как рассчитывается цена в рублях и скидка 25%?",
    answer:
      "В каталоге уже указаны ориентировочные оптовые цены РЦ 67 (−25%). После отправки списка менеджер склада подтверждает наличие свежей партии по ID 12299550 и присылает точную итоговую сумму в рублях до оплаты.",
  },
  {
    question: "Что даёт собственный ID Приоритетного Клиента при регулярных заказах?",
    answer:
      "Личный бесплатный ID открывает официальную Программу Лояльности 4Life в РФ: при заказах от 50 LP возвращается накопительный кэшбэк баллами (10% в 1–3 мес. → 12% в 4–12 мес. → 15% с 13-го мес., лимит 150 БЛ/мес, баллы не сгорают), а при заказе от 125 LP добавляется бесплатный Бонусный Продукт Месяца (~3 800–4 500 ₽).",
  },
  {
    question: "Можно ли сначала посоветоваться по составу до оформления?",
    answer:
      "Да. Напишите напрямую Александру Тощеву в WhatsApp или Telegram — спокойно разберём задачу и подберём оптимальную связку без лишних позиций.",
  },
] as const;

const HowToBuyPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [officeStatus, setOfficeStatus] = useState(() => getRc67OfficeStatus());

  // Interactive Buyer Savings Calculator state (defaults to 3 bottles to showcase Bonus Product unlock)
  const [bottlesPerMonth, setBottlesPerMonth] = useState<number>(2);
  const [loyaltyTenure, setLoyaltyTenure] = useState<LoyaltyTenureId>("m4_12");

  const savings = useMemo(
    () => calculateBuyerLoyaltySavings({ bottlesPerMonth, loyaltyTenure }),
    [bottlesPerMonth, loyaltyTenure],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setOfficeStatus(getRc67OfficeStatus());
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const handleFaqToggle = useCallback((idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  }, []);

  const handleCopy = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard fallback ignored silently
    }
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2400);
  }, []);

  const statusDotClass = officeStatus.isOpen
    ? "bg-emerald-400"
    : officeStatus.isSundayOnlineOnly
      ? "bg-cyan-400"
      : "bg-amber-400";

  const statusShortLabel = officeStatus.isOpen
    ? "Открыт"
    : officeStatus.isSundayOnlineOnly
      ? "Онлайн-заявки"
      : "Закрыт";

  const statusTextClass = officeStatus.isOpen
    ? "text-emerald-400"
    : officeStatus.isSundayOnlineOnly
      ? "text-cyan-300"
      : "text-amber-400";

  return (
    <div className="relative min-h-screen bg-[#03050a] text-slate-300">
      <AtmosphericBackdrop variant="cyan" />

      <SEO
        title="Как приобрести 4Life в России со скидкой 25% — РЦ 67 Москва и СДЭК"
        description="Официальный порядок покупки оригинальных продуктов 4Life в Москве (РЦ 67 у м. Новослободская) и с доставкой СДЭК по всей России со скидкой 25% по ID 12299550."
        path="/how-to-buy"
      />

      {/* CINEMA EDITORIAL HERO — RUSSIAN-FIRST FOCUS */}
      <section className="relative z-10 min-h-[82svh] flex items-end pt-36 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={moscowConciergeImg}
            alt="Официальный Региональный Центр 4Life РЦ 67 в Москве"
            className="w-full h-full object-cover object-center opacity-55"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(3,5,10,0.72) 0%, rgba(3,5,10,0.42) 42%, rgba(3,5,10,0.96) 96%, #03050a 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 68% 58% at 22% 46%, rgba(6,182,212,0.14), transparent 72%)",
            }}
          />
        </div>

        <PageEntrance className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 space-y-10">
          <div className="max-w-4xl space-y-6">
            <div data-entrance="badge" className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="typography-label text-cyan-400">Официальная выдача в РФ • РЦ 67 Москва</span>
              <span className="inline-flex items-center gap-2 typography-mono text-[11px] text-slate-200/85">
                <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${statusDotClass}`} />
                {officeStatus.statusLabel} ({officeStatus.moscowTimeFormatted})
              </span>
            </div>

            <div data-entrance="title">
              <h1 className="typography-h1 text-white leading-[1.04]">
                Оригинальный 4Life в Москве и по всей России —{" "}
                <span className="text-cyan-300 block sm:inline">со скидкой 25% с первого заказа</span>
              </h1>
            </div>

            <div data-entrance="lead" className="max-w-2xl">
              <p className="typography-lead text-slate-300">
                Прямые поставки через официальный московский склад РЦ 67 и доставку СДЭК в любой город страны.
                Партнёрский ID уже встроен в корзину сайта — оптовая цена применяется сразу, без лишних анкет.
              </p>
            </div>
          </div>

          {/* Inline Action Row + Built-in Partner ID Strip */}
          <div
            data-entrance="buttons"
            className="pt-8 border-t border-white/[0.12] flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="flex flex-wrap items-center gap-4">
              <Button to="/products" variant="primary" size="lg" icon={<Icons.ArrowRight className="w-5 h-5" />}>
                Собрать заказ в каталоге
              </Button>
              <Button
                href={siteConfig.distributor.signupUrl}
                isExternal
                variant="secondary"
                size="lg"
                icon={<Icons.ExternalLink className="w-4 h-4" />}
              >
                Личный ID Приоритетного Клиента
              </Button>
            </div>

            {/* Minimal One-Click ID Ledger */}
            <div className="flex items-center gap-4 self-start lg:self-auto">
              <div>
                <span className="typography-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 block">
                  Оптовый ID −25%
                </span>
                <span className="selectable-text typography-mono text-xl font-bold text-white tracking-wider">
                  {siteConfig.distributor.fourLifeId}
                </span>
              </div>
              <button
                type="button"
                onClick={() => void handleCopy(siteConfig.distributor.fourLifeId, "hero-id")}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer active:scale-95 ${
                  copiedKey === "hero-id"
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/50"
                    : "bg-white/[0.06] text-white border-white/[0.14] hover:border-cyan-400/50"
                }`}
              >
                {copiedKey === "hero-id" ? (
                  <Icons.Check className="w-3.5 h-3.5 text-cyan-300" />
                ) : (
                  <Icons.Copy className="w-3.5 h-3.5 text-cyan-300" />
                )}
                <span>{copiedKey === "hero-id" ? "Скопировано" : "Скопировать"}</span>
              </button>
            </div>
          </div>
        </PageEntrance>
      </section>

      {/* SECTION 01: INTERACTIVE MOSCOW VS RUSSIA ROUTE BLUEPRINT */}
      <section className="relative z-10 py-24 md:py-32 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <InteractiveRouteStage officeStatus={officeStatus} />
      </section>

      {/* SECTION 02: INTERACTIVE BUYER SAVINGS CALCULATOR + ORDERING FORMATS */}
      <section className="relative z-10 py-24 md:py-32 border-t border-white/[0.08] overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7 space-y-4">
              <span className="typography-label text-cyan-400 block">02 — Калькулятор выгоды покупателя</span>
              <h2 className="typography-h2 text-white">
                Посчитайте вашу экономию в рублях —{" "}
                <span className="text-cyan-300">от 1 баночки до курса семьи</span>
              </h2>
            </div>
            <p className="lg:col-span-5 typography-body text-slate-400 text-pretty">
              Сравните разовую покупку со скидкой −25% по встроенному ID и регулярный заказ по Программе Лояльности
              4Life в России (10% → 12% → 15% баллами + Продукт Месяца от 125 LP).
            </p>
          </div>

          {/* Interactive Savings Workbench */}
          <OpticalSurface
            accent="cyan"
            className="rounded-[2rem] p-6 sm:p-8 lg:p-10"
            data-buyer-savings-calculator
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Controls: Bottles Slider + Loyalty Tenure */}
              <div className="lg:col-span-6 space-y-8">
                {/* Bottles slider */}
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400 block mb-1">
                        Объём заказа в месяц
                      </span>
                      <label htmlFor="buyer-bottles-slider" className="font-heading text-lg font-semibold text-white">
                        Количество формул для себя или семьи
                      </label>
                    </div>
                    <div className="text-right">
                      <span
                        data-buyer-bottles-value
                        className="typography-mono text-2xl sm:text-3xl font-bold text-white tabular-nums"
                      >
                        {savings.bottles} шт.
                      </span>
                      <span className="typography-mono text-xs text-cyan-300 block tabular-nums">
                        ≈ {savings.estimatedLp} LP
                      </span>
                    </div>
                  </div>

                  <input
                    id="buyer-bottles-slider"
                    data-buyer-bottles-slider
                    type="range"
                    min={1}
                    max={6}
                    step={1}
                    value={bottlesPerMonth}
                    onChange={(e) => setBottlesPerMonth(Number(e.target.value))}
                    className="w-full h-2 rounded-full bg-white/[0.12] accent-cyan-400 cursor-pointer"
                  />

                  <div className="grid grid-cols-6 gap-1 text-center">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setBottlesPerMonth(n)}
                        className={`py-1.5 rounded-lg typography-mono text-[11px] transition-colors cursor-pointer ${
                          bottlesPerMonth === n
                            ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/50"
                            : "text-slate-500 hover:text-slate-200 border border-transparent"
                        }`}
                      >
                        {n} {n === 1 ? "банка" : n < 5 ? "банки" : "банок"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loyalty Tenure Switcher */}
                <div className="space-y-3 pt-6 border-t border-white/[0.08]">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      Стаж в Программе Лояльности РФ (от 50 LP)
                    </span>
                    <span className="typography-mono text-[10px] text-slate-500">
                      Лимит {LOYALTY_MONTHLY_CAP_BL} БЛ/мес • баллы не сгорают
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {LOYALTY_TENURES.map((tenure) => {
                      const active = loyaltyTenure === tenure.id;
                      return (
                        <button
                          key={tenure.id}
                          type="button"
                          onClick={() => setLoyaltyTenure(tenure.id)}
                          data-loyalty-tenure={tenure.id}
                          className={`px-3 py-3 rounded-xl border text-left transition-colors cursor-pointer ${
                            active
                              ? "bg-cyan-500/15 border-cyan-400/50 text-white"
                              : "bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white"
                          }`}
                        >
                          <span className="block text-xs font-semibold">{tenure.label}</span>
                          <span className="typography-mono text-[11px] text-cyan-300 mt-0.5 block">{tenure.rate}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status Recommendation Banner */}
                <div className="p-4 rounded-2xl bg-[#03050a]/85 border border-white/[0.08] space-y-1.5">
                  <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400 block">
                    Активный уровень выгоды
                  </span>
                  <p className="text-sm text-white font-medium">{savings.tierLabel}</p>
                </div>
              </div>

              {/* Right Breakdown Ledger */}
              <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-[#03050a]/90 border border-white/[0.09] space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4 pb-5 border-b border-white/[0.08]">
                  <div>
                    <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 block mb-1">
                      Суммарная выгода в месяц
                    </span>
                    <p
                      data-buyer-total-benefit
                      className="typography-mono text-3xl sm:text-4xl font-bold text-cyan-300 tabular-nums"
                    >
                      +{formatRub(savings.totalMonthlyBenefitRub)}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="typography-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 block">
                      Опт РЦ 67 vs Розница
                    </span>
                    <span className="typography-mono text-sm font-semibold text-white tabular-nums">
                      {formatRub(savings.wholesalePriceRub)}{" "}
                      <span className="text-slate-500 line-through font-normal">
                        {formatRub(savings.retailPriceRub)}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-white/[0.07] text-sm">
                  <div className="py-3.5 flex items-baseline justify-between gap-4">
                    <div>
                      <span className="text-white font-medium block">Оптовая скидка −25%</span>
                      <span className="text-xs text-slate-500">
                        Сразу с 1-й баночки по ID {siteConfig.distributor.fourLifeId}
                      </span>
                    </div>
                    <span className="typography-mono text-white font-semibold tabular-nums whitespace-nowrap flex-shrink-0">
                      +{formatRub(savings.wholesaleDiscountRub)}
                    </span>
                  </div>

                  <div className="py-3.5 flex items-baseline justify-between gap-4">
                    <div>
                      <span className="text-white font-medium block">
                        Баллы Лояльности ({savings.loyaltyRatePercent > 0 ? `${savings.loyaltyRatePercent}%` : "от 50 LP"})
                      </span>
                      <span className="text-xs text-slate-500">
                        {savings.loyaltyPointsBl > 0
                          ? `Начислится ${savings.loyaltyPointsBl} БЛ на бесплатные продукты`
                          : "Добавьте 2-ю формулу (≥ 50 LP), чтобы включить кэшбэк 10–15%"}
                      </span>
                    </div>
                    <span
                      className={`typography-mono font-semibold tabular-nums whitespace-nowrap flex-shrink-0 ${
                        savings.loyaltyValueRub > 0 ? "text-cyan-300" : "text-slate-600"
                      }`}
                    >
                      {savings.loyaltyValueRub > 0 ? `+${formatRub(savings.loyaltyValueRub)}` : "0 ₽"}
                    </span>
                  </div>

                  <div className="py-3.5 flex items-baseline justify-between gap-4">
                    <div>
                      <span className="text-white font-medium flex flex-wrap items-center gap-2">
                        <span>Бонусный Продукт Месяца</span>
                        {savings.hasBonusProduct && (
                          <span
                            data-bonus-product-badge
                            className="typography-mono text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 whitespace-nowrap"
                          >
                            Открыт ≥ 125 LP
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-slate-500">
                        {savings.hasBonusProduct
                          ? "Бесплатный полноразмерный продукт 4Life добавляется к заказу автоматически"
                          : "Сдвиньте ползунок до 3 формул (≥ 125 LP), чтобы получать продукт в подарок каждый месяц"}
                      </span>
                    </div>
                    <span
                      className={`typography-mono font-semibold tabular-nums whitespace-nowrap flex-shrink-0 ${
                        savings.hasBonusProduct ? "text-emerald-300" : "text-slate-600"
                      }`}
                    >
                      {savings.hasBonusProduct ? `+${formatRub(savings.bonusProductValueRub)}` : "от 125 LP"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </OpticalSurface>

          {/* Compact Two-Format Action Strip below Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 border-y border-white/[0.1] divide-y lg:divide-y-0 lg:divide-x divide-white/[0.1]">
            <div className="lg:col-span-6 py-8 lg:pr-10 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="typography-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400">
                    Вариант 01 • Без регистрации
                  </span>
                  <span className="typography-mono text-xs text-white">ID {siteConfig.distributor.fourLifeId}</span>
                </div>
                <h3 className="typography-h3 text-white">Быстрый заказ через корзину сайта</h3>
                <p className="text-sm text-slate-400 leading-relaxed text-pretty">
                  Для первой пробы или разовой покупки. Скидка −25% с первой баночки, готовый чек с суммой в рублях и
                  QR-код для менеджера РЦ 67.
                </p>
              </div>
              <div>
                <Button to="/products" variant="primary" size="md" icon={<Icons.ArrowRight className="w-4 h-4" />}>
                  Открыть каталог 17 формул
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6 py-8 lg:pl-10 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="typography-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    Вариант 02 • Регулярный курс
                  </span>
                  <span className="typography-mono text-xs text-cyan-300">10% → 12% → 15% БЛ</span>
                </div>
                <h3 className="typography-h3 text-white">Личный ID Приоритетного Клиента</h3>
                <p className="text-sm text-slate-400 leading-relaxed text-pretty">
                  Бесплатное оформление за 2 минуты. Закрепляет за вами наставника, открывает накопительные Баллы
                  Лояльности (до 150 БЛ/мес) и Продукт Месяца в подарок от 125 LP.
                </p>
              </div>
              <div>
                <Button
                  href={siteConfig.distributor.signupUrl}
                  isExternal
                  variant="secondary"
                  size="md"
                  icon={<Icons.ExternalLink className="w-4 h-4" />}
                >
                  Оформить бесплатный ID
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: RC 67 MOSCOW PASSPORT + DELIVERY FAQ */}
      <section className="relative z-10 py-24 md:py-32 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Clean Architectural Warehouse Passport */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="typography-label text-cyan-400 block">03 — Реквизиты склада</span>
              <h2 className="typography-h2 text-white">{siteConfig.office.name}</h2>
            </div>

            <div className="border-y border-white/[0.1] divide-y divide-white/[0.08]">
              <div className="py-5 space-y-1.5">
                <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block">
                  Адрес и часы работы
                </span>
                <p className="selectable-text text-sm md:text-base text-white leading-relaxed">{siteConfig.office.address}</p>
                <p className="typography-mono text-xs text-cyan-300/90 pt-1">
                  Пн–Пт 10:00–20:00 • Сб 10:00–17:00 • Вс — приём онлайн-заявок МСК
                </p>
              </div>

              <div className="py-5 flex items-baseline justify-between gap-4">
                <div>
                  <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
                    Телефон выдачи и СДЭК
                  </span>
                  <a
                    href={`tel:${siteConfig.office.phoneRaw}`}
                    className="selectable-text font-heading text-2xl font-bold text-white hover:text-cyan-300 transition-colors tabular-nums"
                  >
                    {siteConfig.office.phone}
                  </a>
                </div>
                <span className={`typography-mono text-[11px] ${statusTextClass}`}>{statusShortLabel}</span>
              </div>

              <div className="py-5 space-y-3">
                <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block">
                  Прямые каналы склада РЦ 67
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  <a
                    href={siteConfig.office.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.09] text-xs font-medium text-slate-200 transition-colors"
                  >
                    <Icons.WhatsApp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={siteConfig.office.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.09] text-xs font-medium text-slate-200 transition-colors"
                  >
                    <Icons.Telegram className="w-3.5 h-3.5 text-sky-400" />
                    <span>Telegram</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => void handleCopy(siteConfig.office.phone, "rc67-max")}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.09] text-xs font-medium text-slate-200 transition-colors cursor-pointer active:scale-95"
                  >
                    <Icons.Max className="w-3.5 h-3.5 text-indigo-300" />
                    <span>{copiedKey === "rc67-max" ? "Скопирован" : "MAX"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Delivery FAQ */}
          <div className="lg:col-span-7 space-y-6">
            <span className="typography-label text-slate-400 block">Вопросы по доставке и оплате</span>
            <div className="space-y-4">
              {DELIVERY_FAQ.map((item, idx) => (
                <FAQItem
                  key={item.question}
                  question={item.question}
                  answer={item.answer}
                  index={idx}
                  isOpen={openFaq === idx}
                  onToggle={handleFaqToggle}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(HowToBuyPage);