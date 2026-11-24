/**
 * @module src/components/sections/HowToBuy/InteractiveRouteStage.tsx
 * @description Studio-grade interactive logistics stage for /how-to-buy:
 *  - Moscow RC 67 Tab: Architectural Moscow Pickup Passport wrapped in OpticalSurface
 *    with live MSK status (Mon-Fri 10-20, Sat 10-17, Sun online intake), 1-click address copy,
 *    and 3 switchable pickup/courier/desk modes.
 *  - All-Russia CDEK Tab: Strict validated Russian city/region lookup (90+ cities, zero fake
 *    "г. Фывапрол" ETAs) + 19 quick city chips + 4-Node Supply Chain Optical Radar SVG
 *    starting at 4Life's NSF/cGMP manufacturing plant in Vineyard, Utah.
 */

import moscowConciergeImg from "@/assets/images/moscow_rc67_concierge_1795234146619.jpg";
import { OpticalSurface } from "@/components/ui";
import { usePerformanceTier } from "@/hooks";
import { siteConfig } from "@/site-config/site";
import { POPULAR_RUSSIAN_CITIES, resolveRussianCityEta } from "@/utils/catalogHelpers";
import { Icons } from "@/utils/icons";
import { OfficeStatus } from "@/utils/officeHours";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useMemo, useState } from "react";

export type FulfillmentMode = "moscow" | "russia";

interface SupplyChainNode {
  id: string;
  index: string;
  shortLabel: string;
  subLabel: string;
  title: string;
  passportDetail: string;
  telemetryTag: string;
}

const MOSCOW_MODES = [
  {
    id: "pickup",
    tabLabel: "Самовывоз из РЦ 67 сегодня",
    eyebrow: "4 минуты пешком от м. Новослободская",
    title: "Личное получение в Региональном Центре 67",
    description:
      "Официальный склад-офис на ул. Селезнёвская, 11А, стр. 2, офис 220А (2-й этаж). Спокойная выдача свежих партий напрямую с полки — проверка целостности мембран, маркировки «Честный ЗНАК» и сроков годности на месте.",
    bullet: "Пн–Пт 10:00–20:00 • Сб 10:00–17:00 • Вс — онлайн-заявки МСК",
  },
  {
    id: "courier",
    tabLabel: "Курьерская доставка по Москве и МО",
    eyebrow: "Отправка в день подтверждения",
    title: "Курьером до двери по Москве и области",
    description:
      "После отправки списка в WhatsApp, Telegram или MAX менеджер склада резервирует свежую партию, присылает точный расчёт со скидкой −25% и согласовывает удобное окно доставки курьером.",
    bullet: "Оплата в рублях после подтверждения наличия на складе",
  },
  {
    id: "desk",
    tabLabel: "Памятка для кассы РЦ 67",
    eyebrow: "Мгновенная скидка −25% без регистрации",
    title: "Что назвать на стойке выдачи или по телефону",
    description: `Достаточно показать список с экрана телефона и назвать оптовый ID ${siteConfig.distributor.fourLifeId} (${siteConfig.distributor.shortName}). Оптовая цена применяется сразу с первой баночки без анкет и взносов.`,
    bullet: `Телефон склада: ${siteConfig.office.phone}`,
  },
] as const;

const ROUTE_CONTENT: Record<
  FulfillmentMode,
  {
    eyebrow: string;
    title: string;
    eta: string;
    steps: readonly { num: string; heading: string; detail: string }[];
  }
> = {
  moscow: {
    eyebrow: "Самовывоз и курьер по Москве",
    title: "Региональный Центр РЦ 67 у м. Новослободская",
    eta: "В день обращения",
    steps: [
      {
        num: "01",
        heading: "Соберите список в каталоге",
        detail: "Добавьте нужные формулы — оптовая скидка −25%, ориентировочная сумма в ₽ и партнёрский ID подставляются автоматически.",
      },
      {
        num: "02",
        heading: "Отправьте список менеджеру РЦ 67",
        detail: "В WhatsApp, Telegram или MAX склад подтвердит наличие свежей партии и точную сумму в рублях.",
      },
      {
        num: "03",
        heading: "Заберите на Селезнёвской или курьером",
        detail: "На выдаче или в чате менеджер оформит заказ по оптовому прайсу. Оплата при получении или по реквизитам.",
      },
    ],
  },
  russia: {
    eyebrow: "Все 89 регионов РФ со склада РЦ 67",
    title: "Прямая доставка СДЭК и Почтой РФ по всей России",
    eta: "1–7 рабочих дней",
    steps: [
      {
        num: "01",
        heading: "Сформируйте чек в корзине сайта",
        detail: "Сразу виден точный объём в LP и ориентировочная сумма в ₽ со скидкой −25% с первой баночки без регистрации.",
      },
      {
        num: "02",
        heading: "Укажите ваш город и удобный ПВЗ СДЭК",
        detail: "Менеджер РЦ 67 рассчитает тариф доставки, соберёт заказ и пришлёт официальный расчёт в рублях до оплаты.",
      },
      {
        num: "03",
        heading: "Получите трек-номер в день отправки",
        detail: "Отгрузка идёт напрямую с официального склада Москвы — с кодами «Честный ЗНАК» и полным контролем партии.",
      },
    ],
  },
};

interface InteractiveRouteStageProps {
  officeStatus: OfficeStatus;
}

export const InteractiveRouteStage: React.FC<InteractiveRouteStageProps> = ({ officeStatus }) => {
  const tier = usePerformanceTier();
  const isLow = tier === "low";
  const [mode, setMode] = useState<FulfillmentMode>("moscow");
  const [moscowModeId, setMoscowModeId] = useState<(typeof MOSCOW_MODES)[number]["id"]>("pickup");
  const [cityQuery, setCityQuery] = useState<string>("Омск");
  const [activeRadarStep, setActiveRadarStep] = useState<number>(3);
  const [copiedAddr, setCopiedAddr] = useState(false);

  const activeContent = ROUTE_CONTENT[mode];
  const activeMoscowMode = MOSCOW_MODES.find((m) => m.id === moscowModeId) ?? MOSCOW_MODES[0]!;
  const resolvedCity = useMemo(() => resolveRussianCityEta(cityQuery), [cityQuery]);

  const supplyNodes: readonly SupplyChainNode[] = useMemo(
    () => [
      {
        id: "utah",
        index: "01",
        shortLabel: "Завод NSF cGMP",
        subLabel: "Виньярд, Юта США",
        title: "Собственный завод NSF/cGMP • Виньярд, штат Юта (США)",
        passportDetail:
          "Разработка и R&D-лаборатория расположены в штаб-квартире в Сэнди (Sandy, UT), а серийный выпуск — на собственном заводе 4Life в Виньярде (Vineyard, UT) с хроматографическим контролем каждой партии.",
        telemetryTag: "VINEYARD PLANT • NSF cGMP",
      },
      {
        id: "rc67",
        index: "02",
        shortLabel: "Хаб РЦ 67",
        subLabel: "Москва • Оф. склад",
        title: "Официальный склад РЦ 67 • Москва, ул. Селезнёвская",
        passportDetail:
          "Официальный Региональный Центр в России. Все формулы сертифицированы (СГР ЕАЭС), промаркированы «Честный ЗНАК» и хранятся в климатическом режиме без сторонних маркетплейсов.",
        telemetryTag: "СГР ЕАЭС • ЧЕСТНЫЙ ЗНАК",
      },
      {
        id: "cdek",
        index: "03",
        shortLabel: "Магистраль СДЭК",
        subLabel: "Трек в день отправки",
        title: "Защищённая пересылка СДЭК или Почтой РФ по всей России",
        passportDetail:
          "Ударопрочная упаковка флаконов и моментальная передача трек-номера после подтверждения. Тариф рассчитывается менеджером склада до оплаты.",
        telemetryTag: resolvedCity.corridor.toUpperCase(),
      },
      {
        id: "destination",
        index: "04",
        shortLabel: resolvedCity.isRecognized ? `г. ${resolvedCity.city}` : "ПВЗ / Почта РФ",
        subLabel: resolvedCity.eta,
        title: resolvedCity.isRecognized
          ? `ПВЗ СДЭК или курьер • г. ${resolvedCity.city}`
          : "Индивидуальный расчёт маршрута по индексу",
        passportDetail: resolvedCity.isRecognized
          ? `Ориентировочный срок доставки в г. ${resolvedCity.city} (${resolvedCity.regionLabel}): ${resolvedCity.eta}. Получение в ближайшем пункте выдачи СДЭК или курьером до двери.`
          : resolvedCity.fallbackNotice ??
            "Город не найден в быстрой базе — менеджер РЦ 67 рассчитает доставку СДЭК/Почтой РФ индивидуально по вашему индексу.",
        telemetryTag: resolvedCity.isRecognized ? `ETA: ${resolvedCity.eta.toUpperCase()}` : "РАСЧЁТ ПО ИНДЕКСУ",
      },
    ],
    [resolvedCity],
  );

  const selectedNode = supplyNodes[activeRadarStep] ?? supplyNodes[3]!;

  const handleCopyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.office.address);
    } catch {
      // Clipboard fallback ignored silently
    }
    setCopiedAddr(true);
    window.setTimeout(() => setCopiedAddr(false), 2200);
  }, []);

  const filteredChips = useMemo(() => {
    const q = cityQuery.trim().toLowerCase();
    if (!q) return POPULAR_RUSSIAN_CITIES.slice(0, 10);
    const matching = POPULAR_RUSSIAN_CITIES.filter((c) => c.city.toLowerCase().includes(q));
    return matching.length > 0 ? matching.slice(0, 10) : POPULAR_RUSSIAN_CITIES.slice(0, 8);
  }, [cityQuery]);

  const statusDotClass = officeStatus.isOpen
    ? "bg-emerald-400"
    : officeStatus.isSundayOnlineOnly
      ? "bg-cyan-400"
      : "bg-amber-400";

  return (
    <div className="space-y-12">
      {/* Header + Spring Segmented Switch */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          <span className="typography-label text-cyan-400 block">01 — Маршрут получения</span>
          <h2 className="typography-h2 text-white">
            Выберите сценарий —{" "}
            <span className="text-cyan-300">Москва или любой город РФ</span>
          </h2>
        </div>

        {/* Architectural Underline Switch with Smooth Framer Spring */}
        <div
          role="tablist"
          aria-label="Способ получения заказа"
          className="inline-flex items-center border-b border-white/[0.12] self-start lg:self-auto"
        >
          {(
            [
              { id: "moscow" as const, label: "Москва • РЦ 67", sub: "Самовывоз и курьер" },
              { id: "russia" as const, label: "Вся Россия • СДЭК", sub: "Все 89 регионов РФ" },
            ] as const
          ).map((tab) => {
            const isActive = mode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-route-tab={tab.id}
                onClick={() => setMode(tab.id)}
                className="relative px-1 sm:px-2 mr-7 sm:mr-10 last:mr-0 pb-4 text-left cursor-pointer group focus-visible:outline-none"
              >
                <span
                  className={`block font-heading text-sm sm:text-base font-semibold transition-colors duration-200 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </span>
                <span className="block typography-mono text-[10px] tracking-[0.14em] text-slate-500 mt-0.5">
                  {tab.sub}
                </span>
                {isActive && (
                  <motion.span
                    layoutId={isLow ? undefined : "howtobuy-route-underline"}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-cyan-400"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Stage: Left = Editorial 3-Step Ledger, Right = Optical Passport / 4-Node Supply Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
        {/* LEFT COLUMN: 3-STEP LEDGER */}
        <div className="lg:col-span-5 flex flex-col justify-between border-y border-white/[0.1]">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={isLow ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={isLow ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col h-full justify-between"
            >
              <div className="py-7 border-b border-white/[0.08] flex items-baseline justify-between gap-4">
                <div>
                  <span className="typography-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400 block mb-1.5">
                    {activeContent.eyebrow}
                  </span>
                  <h3 className="typography-h3 text-white">{activeContent.title}</h3>
                </div>
                <span className="typography-mono text-xs text-cyan-300 flex-shrink-0">{activeContent.eta}</span>
              </div>

              <div className="divide-y divide-white/[0.08] flex-1">
                {activeContent.steps.map((step) => (
                  <div key={step.num} className="py-6 flex items-baseline gap-5">
                    <span className="typography-mono text-xl text-cyan-400/75 w-8 flex-shrink-0">{step.num}</span>
                    <div className="space-y-1.5">
                      <h4 className="font-heading text-base md:text-lg font-semibold text-white">{step.heading}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed text-pretty">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE VISUAL STAGE */}
        <div className="lg:col-span-7 flex flex-col">
          <AnimatePresence mode="wait">
            {mode === "moscow" ? (
              <motion.div
                key="canvas-moscow"
                data-route-canvas="moscow"
                initial={isLow ? { opacity: 1 } : { opacity: 0, scale: 1.015 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={isLow ? { opacity: 1 } : { opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 flex flex-col"
              >
                <OpticalSurface
                  accent="cyan"
                  tilt
                  className="rounded-[1.75rem] flex-1 min-h-[440px] flex flex-col"
                >
                  <div className="relative h-full flex flex-col justify-between">
                    {/* Top Architectural Photography Banner */}
                    <div className="relative h-48 sm:h-56 overflow-hidden border-b border-white/[0.08]">
                      <img
                        src={moscowConciergeImg}
                        alt="Региональный Центр 4Life РЦ 67 Москва — зона выдачи заказов"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center opacity-75"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          backgroundImage:
                            "linear-gradient(180deg, rgba(3,5,10,0.72) 0%, rgba(3,5,10,0.18) 45%, rgba(5,8,17,0.96) 100%)",
                        }}
                      />

                      {/* Live MSK status bar */}
                      <div className="absolute top-5 left-6 right-6 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span aria-hidden="true" className={`w-2 h-2 rounded-full ${statusDotClass}`} />
                          <span className="typography-mono text-xs text-white">{officeStatus.statusLabel}</span>
                        </div>
                        <span className="typography-mono text-[11px] text-slate-200/85">
                          {officeStatus.moscowTimeFormatted}
                        </span>
                      </div>

                      {/* Clean Address Anchor + 1-click Copy */}
                      <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                        <div>
                          <span className="typography-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300 block mb-0.5">
                            Московский паспорт выдачи • РЦ 67
                          </span>
                          <p className="text-sm sm:text-base text-white font-medium leading-snug">
                            {siteConfig.office.address}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleCopyAddress()}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.16] text-xs font-semibold text-white transition-colors cursor-pointer active:scale-95 flex-shrink-0 self-start sm:self-auto"
                        >
                          {copiedAddr ? (
                            <>
                              <Icons.Check className="w-3.5 h-3.5 text-cyan-300" />
                              <span>Скопирован</span>
                            </>
                          ) : (
                            <>
                              <Icons.Copy className="w-3.5 h-3.5 text-cyan-300" />
                              <span>Адрес</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* 3 Switchable Moscow Fulfillment Modes */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between gap-6">
                      <div
                        role="tablist"
                        aria-label="Сценарии получения в Москве"
                        className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                      >
                        {MOSCOW_MODES.map((m, idx) => {
                          const isSelected = m.id === moscowModeId;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              role="tab"
                              aria-selected={isSelected}
                              data-moscow-mode={m.id}
                              onClick={() => setMoscowModeId(m.id)}
                              className={`text-left px-3.5 py-3 rounded-xl border transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-cyan-500/12 border-cyan-400/45 text-white"
                                  : "bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.16]"
                              }`}
                            >
                              <span className="typography-mono text-[10px] text-cyan-400 block mb-1">0{idx + 1}</span>
                              <span className="text-xs font-semibold leading-snug block">{m.tabLabel}</span>
                            </button>
                          );
                        })}
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeMoscowMode.id}
                          initial={isLow ? { opacity: 1 } : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={isLow ? { opacity: 1 } : { opacity: 0, y: -4 }}
                          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                          className="space-y-3"
                        >
                          <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/90 block">
                            {activeMoscowMode.eyebrow}
                          </span>
                          <h4 className="font-heading text-lg sm:text-xl font-semibold text-white">
                            {activeMoscowMode.title}
                          </h4>
                          <p className="text-sm text-slate-300 leading-relaxed text-pretty">
                            {activeMoscowMode.description}
                          </p>
                          <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="typography-mono text-cyan-300">{activeMoscowMode.bullet}</span>
                            <span className="text-slate-500">{officeStatus.detailLabel}</span>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </OpticalSurface>
              </motion.div>
            ) : (
              <motion.div
                key="canvas-russia"
                data-route-canvas="russia"
                initial={isLow ? { opacity: 1 } : { opacity: 0, scale: 1.015 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={isLow ? { opacity: 1 } : { opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 flex flex-col"
              >
                <OpticalSurface
                  accent="cyan"
                  className="rounded-[1.75rem] flex-1 min-h-[440px] p-6 sm:p-8 flex flex-col justify-between gap-6"
                  style={{
                    backgroundImage:
                      "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(6,182,212,0.12), rgba(5,8,17,0.98) 72%)",
                  }}
                >
                  {/* Top Live Russian City Search + Validated Instant ETA */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="relative flex-1">
                        <Icons.Search className="w-4 h-4 text-cyan-400/80 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={cityQuery}
                          onChange={(e) => {
                            setCityQuery(e.target.value);
                            setActiveRadarStep(3);
                          }}
                          placeholder="Введите ваш город (например: Омск, Сочи, Мурманск...)"
                          aria-label="Поиск вашего города доставки СДЭК"
                          data-cdek-city-input
                          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#03050a] border border-white/[0.14] focus:border-cyan-400/70 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors"
                        />
                        {cityQuery && (
                          <button
                            type="button"
                            onClick={() => setCityQuery("")}
                            aria-label="Очистить город"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
                          >
                            <Icons.X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="sm:text-right flex sm:flex-col items-baseline sm:items-end justify-between gap-2 flex-shrink-0">
                        <span
                          data-cdek-eta
                          className={`typography-mono text-lg sm:text-xl font-semibold ${
                            resolvedCity.isRecognized ? "text-cyan-300" : "text-amber-300"
                          }`}
                        >
                          {resolvedCity.eta}
                        </span>
                        <span className="typography-mono text-[10px] text-slate-400">{resolvedCity.corridor}</span>
                      </div>
                    </div>

                    {/* Honest Unrecognized City Notice — zero fake ETAs for gibberish */}
                    {!resolvedCity.isRecognized && resolvedCity.fallbackNotice && (
                      <div
                        role="status"
                        data-cdek-unrecognized-notice
                        className="p-3.5 rounded-xl bg-amber-500/[0.08] border border-amber-400/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5 text-xs text-amber-100/95 leading-relaxed">
                          <Icons.Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>{resolvedCity.fallbackNotice}</span>
                        </div>
                        <a
                          href={`${siteConfig.office.whatsapp}?text=${encodeURIComponent(
                            `Здравствуйте! Подскажите срок и стоимость доставки СДЭК/Почтой РФ из РЦ 67 (ID ${siteConfig.distributor.fourLifeId}) в населённый пункт: ${cityQuery.trim()}`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-[11px] font-semibold text-amber-200 whitespace-nowrap self-start sm:self-auto transition-colors"
                        >
                          <span>Уточнить в РЦ 67</span>
                          <Icons.ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Quick Russian City Chips */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {filteredChips.map((item) => {
                        const isPicked =
                          resolvedCity.isRecognized && item.city.toLowerCase() === resolvedCity.city.toLowerCase();
                        return (
                          <button
                            key={item.city}
                            type="button"
                            onClick={() => {
                              setCityQuery(item.city);
                              setActiveRadarStep(3);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                              isPicked
                                ? "bg-cyan-500/18 border-cyan-400/55 text-cyan-200"
                                : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.18]"
                            }`}
                          >
                            {item.city}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interactive 4-Node Supply Chain Optical Radar SVG */}
                  <div className="py-2">
                    <svg
                      viewBox="0 0 680 126"
                      className="w-full h-auto overflow-visible"
                      role="img"
                      aria-label={
                        resolvedCity.isRecognized
                          ? `Оптический маршрут поставок от завода Виньярд (Юта) до г. ${resolvedCity.city}`
                          : "Оптический маршрут поставок от завода Виньярд (Юта) до вашего населённого пункта"
                      }
                    >
                      <defs>
                        <linearGradient id="supplyRailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
                          <stop offset="50%" stopColor="rgba(34,211,238,0.9)" />
                          <stop offset="100%" stopColor="#67e8f9" />
                        </linearGradient>
                      </defs>

                      {/* Background track rail */}
                      <line
                        x1="64"
                        y1="52"
                        x2="616"
                        y2="52"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1.5"
                        strokeDasharray="4 6"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* Active progress optical beam */}
                      <line
                        x1="64"
                        y1="52"
                        x2={64 + (activeRadarStep / 3) * 552}
                        y2="52"
                        stroke="url(#supplyRailGrad)"
                        strokeWidth="2.2"
                        vectorEffect="non-scaling-stroke"
                        style={{ transition: isLow ? "none" : "all 320ms cubic-bezier(0.16,1,0.3,1)" }}
                      />

                      {/* Traveling optical telemetry pulse (High & Medium tiers only) */}
                      {!isLow && (
                        <motion.circle
                          cx={64}
                          cy={52}
                          r={3.5}
                          fill="#a5f3fc"
                          animate={{ cx: [64, 616], opacity: [0, 1, 1, 0] }}
                          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}

                      {/* 4 Interactive Stage Nodes */}
                      {supplyNodes.map((node, idx) => {
                        const x = 64 + idx * 184;
                        const isSelected = idx === activeRadarStep;
                        const isPassed = idx <= activeRadarStep;
                        return (
                          <g
                            key={node.id}
                            className="cursor-pointer"
                            onClick={() => setActiveRadarStep(idx)}
                          >
                            <circle cx={x} cy={52} r="24" fill="transparent" />
                            {isSelected && (
                              <circle
                                cx={x}
                                cy={52}
                                r="17"
                                fill="rgba(34,211,238,0.14)"
                                stroke="rgba(34,211,238,0.55)"
                                strokeWidth="1"
                              />
                            )}
                            <circle
                              cx={x}
                              cy={52}
                              r={isSelected ? 7.5 : 5.5}
                              fill={isSelected ? "#22d3ee" : isPassed ? "#0891b2" : "#0b1222"}
                              stroke={isPassed ? "#67e8f9" : "rgba(148,163,184,0.45)"}
                              strokeWidth="1.5"
                            />
                            <text
                              x={x}
                              y={24}
                              textAnchor="middle"
                              fill={isSelected ? "#67e8f9" : "rgba(148,163,184,0.65)"}
                              fontSize="10"
                              fontFamily="JetBrains Mono Variable, monospace"
                              letterSpacing="0.14em"
                            >
                              {node.index}
                            </text>
                            <text
                              x={x}
                              y={90}
                              textAnchor="middle"
                              fill={isSelected ? "#ffffff" : "rgba(226,232,240,0.72)"}
                              fontSize="11"
                              fontWeight={isSelected ? "600" : "400"}
                              fontFamily="Manrope Variable, sans-serif"
                            >
                              {node.shortLabel.length > 18 ? `${node.shortLabel.slice(0, 17)}…` : node.shortLabel}
                            </text>
                            <text
                              x={x}
                              y={108}
                              textAnchor="middle"
                              fill={isSelected ? "#22d3ee" : "rgba(148,163,184,0.6)"}
                              fontSize="9.5"
                              fontFamily="JetBrains Mono Variable, monospace"
                            >
                              {node.subLabel}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Active Stage Verification Passport */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#03050a]/90 border border-white/[0.09] space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
                        Узел {selectedNode.index} / 04 • Нажмите любой этап выше
                      </span>
                      <span className="typography-mono text-[10px] text-slate-400">{selectedNode.telemetryTag}</span>
                    </div>
                    <h4 className="font-heading text-base sm:text-lg font-semibold text-white">
                      {selectedNode.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-pretty">
                      {selectedNode.passportDetail}
                    </p>
                  </div>
                </OpticalSurface>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default React.memo(InteractiveRouteStage);
