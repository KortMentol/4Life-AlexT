/**
 * @module src/pages/ContactPage.tsx
 * @description Zero-cringe Swiss Editorial Concierge communication page:
 *  - AtmosphericBackdrop for deep Clinical Obsidian luminosity.
 *  - Zone 01: Direct Personal Line — Alexander Toshchev (+7 915 256-11-77, ID 12299550)
 *    with 1-Click Topic Constructor prefilling WhatsApp & Telegram messages.
 *  - Zone 02: Official Warehouse Desk — RC 67 Moscow with live MSK status (Mon–Fri 10–20, Sat 10–17, Sun online intake),
 *    1-click address copy, and 4-minute step-by-step walking route guide from м. Новослободская.
 */

import moscowConciergeImg from "@/assets/images/moscow_rc67_concierge_1795234146619.jpg";
import { PageEntrance } from "@/components/transitions/PageEntrance";
import { AtmosphericBackdrop, Button, OpticalSurface, ParallaxImage } from "@/components/ui";
import { SEO } from "@/seo/SEO";
import { siteConfig } from "@/site-config/site";
import { Icons } from "@/utils/icons";
import { getRc67OfficeStatus } from "@/utils/officeHours";
import React, { useCallback, useEffect, useState } from "react";

const CONTACT_TOPICS = [
  {
    id: "health-course",
    label: "Подобрать курс по здоровью",
    message:
      "Здравствуйте, Александр! Подскажите, пожалуйста, оптимальную стартовую связку формул 4Life под мою задачу.",
  },
  {
    id: "order-discount",
    label: "Как заказать со скидкой 25% в мой город",
    message: `Здравствуйте, Александр! Хочу оформить заказ оригинальных формул 4Life со скидкой −25% по вашему ID ${siteConfig.distributor.fourLifeId} с доставкой в мой город.`,
  },
  {
    id: "partnership-start",
    label: "Разобрать партнёрство и старт в команде",
    message:
      "Здравствуйте, Александр! Интересует партнёрская модель 4Life Life Rewards в РФ — давайте спокойно обсудим цифры и формат старта.",
  },
] as const;

const WALKING_ROUTE_STEPS = [
  {
    step: "01",
    title: "Метро «Новослободская» (Кольцевая линия)",
    detail: "Выход №1 из метро — сразу поверните направо на улицу Селезнёвскую.",
  },
  {
    step: "02",
    title: "350 метров прямо по ул. Селезнёвская (~4 минуты)",
    detail: "Идите спокойно прямо по правой стороне улицы до делового квартала «Селезнёвская, 11А».",
  },
  {
    step: "03",
    title: "Дом 11А, строение 2 — вход в бизнес-центр",
    detail: "Поднимитесь на 2-й этаж — прямо по коридору расположен офис 220А (Региональный Центр 4Life РЦ 67).",
  },
  {
    step: "04",
    title: "На стойке выдачи назовите ID 12299550",
    detail: `Укажите ID ${siteConfig.distributor.fourLifeId} (${siteConfig.distributor.shortName}), чтобы сразу получить оптовый прайс −25% с первой баночки.`,
  },
] as const;

const ContactPage: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [officeStatus, setOfficeStatus] = useState(() => getRc67OfficeStatus());
  const [selectedTopicId, setSelectedTopicId] = useState<(typeof CONTACT_TOPICS)[number]["id"]>(CONTACT_TOPICS[0].id);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setOfficeStatus(getRc67OfficeStatus());
    }, 60_000);
    return () => window.clearInterval(timer);
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

  const activeTopic = CONTACT_TOPICS.find((t) => t.id === selectedTopicId) ?? CONTACT_TOPICS[0];
  const whatsappUrl = `${siteConfig.contact.whatsapp}?text=${encodeURIComponent(activeTopic.message)}`;
  const telegramUrl = `${siteConfig.contact.telegram}?text=${encodeURIComponent(activeTopic.message)}`;

  const statusDotClass = officeStatus.isOpen
    ? "bg-emerald-400"
    : officeStatus.isSundayOnlineOnly
      ? "bg-cyan-400"
      : "bg-amber-400";

  return (
    <div className="relative min-h-screen bg-[#03050a] text-slate-300">
      <AtmosphericBackdrop variant="cyan" />

      <SEO
        title="Контакты — Александр Тощев и Региональный Центр РЦ 67 (Москва)"
        description="Прямая связь с Александром Тощевым по подбору формул и партнёрству (+7 915 256-11-77) и контакты официального склада выдачи РЦ 67 Москва (8 929 681-10-22), пеший маршрут от м. Новослободская."
        path="/contact"
      />

      {/* HERO */}
      <section className="relative z-10 pt-36 md:pt-44 pb-16 md:pb-24 overflow-x-clip">
        <PageEntrance className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
          <div data-entrance="badge" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="typography-label text-cyan-400">Прямой контакт • Москва и РФ</span>
            <span className="inline-flex items-center gap-2 typography-mono text-[11px] text-slate-300/85">
              <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${statusDotClass}`} />
              {officeStatus.statusLabel} ({officeStatus.moscowTimeFormatted})
            </span>
          </div>

          <div data-entrance="title" className="max-w-4xl">
            <h1 className="typography-h1 text-white leading-[1.04]">
              Личная линия и <span className="text-cyan-300">официальный склад РЦ 67</span>
            </h1>
          </div>

          <div data-entrance="lead" className="max-w-2xl">
            <p className="typography-lead text-slate-300">
              Два прямых канала без лишних форм: по подбору формул, курсу и партнёрству пишите лично Александру; готовые
              списки на самовывоз и доставку СДЭК оформляет менеджер склада РЦ 67.
            </p>
          </div>
        </PageEntrance>
      </section>

      {/* ZONE 01: DIRECT PERSONAL LINE — ALEXANDER TOSHCHEV + 1-CLICK TOPIC CONSTRUCTOR */}
      <section className="relative z-10 py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-5">
            <span className="typography-label text-cyan-400 block">Зона 01 — Консультации и наставничество</span>
            <h2 className="typography-h2 text-white">{siteConfig.distributor.name}</h2>
            <p className="typography-body text-slate-300">
              {siteConfig.distributor.rank} 4Life. Подбор синергичных формул под задачу, Программа Лояльности и
              партнёрская модель 4Life.
            </p>

            <div className="pt-5 border-t border-white/[0.08] space-y-2">
              <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block">
                Комфортный график звонков
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">
                Будни 19:00–21:00 МСК • Сб 18:00–20:00 • Вс 11:00–13:00
              </p>
              <p className="text-xs text-slate-400">В WhatsApp и Telegram можно написать в любое время.</p>
            </div>
          </div>

          <div className="lg:col-span-7 border-y border-white/[0.1] divide-y divide-white/[0.08]">
            {/* Row 1: 1-Click Topic Constructor + Direct Phone & Prefilled Messengers */}
            <div className="py-8 space-y-6" data-topic-constructor>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block">
                    Личный номер и быстрый старт диалога
                  </span>
                  <a
                    href={`tel:${siteConfig.contact.phoneRaw}`}
                    className="selectable-text font-heading text-3xl sm:text-4xl font-bold text-white hover:text-cyan-300 transition-colors tabular-nums tracking-tight block"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </div>
                <span className="typography-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400">
                  Выберите тему — текст подставится сам
                </span>
              </div>

              {/* 3 Interactive Topic Chips */}
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Тема обращения">
                {CONTACT_TOPICS.map((topic) => {
                  const isSelected = topic.id === selectedTopicId;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      data-contact-topic={topic.id}
                      onClick={() => setSelectedTopicId(topic.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-cyan-500/18 border-cyan-400/55 text-cyan-200"
                          : "bg-white/[0.03] border-white/[0.09] text-slate-400 hover:text-white hover:border-white/[0.2]"
                      }`}
                    >
                      {topic.label}
                    </button>
                  );
                })}
              </div>

              {/* Preview of Prepared Message + Prefilled Messenger Buttons */}
              <div className="p-4 rounded-2xl bg-[#050811] border border-white/[0.08] space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <p data-prepared-message className="selectable-text text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    «{activeTopic.message}»
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleCopy(activeTopic.message, "topic-msg")}
                    aria-label="Скопировать текст сообщения"
                    className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer flex-shrink-0 p-1"
                  >
                    {copiedKey === "topic-msg" ? (
                      <Icons.Check className="w-4 h-4 text-cyan-300" />
                    ) : (
                      <Icons.Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-contact-telegram-cta
                    onClick={() => void handleCopy(activeTopic.message, "tg-topic")}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500/14 hover:bg-sky-500/24 border border-sky-400/35 text-sky-200 text-sm font-semibold transition-colors active:scale-95"
                  >
                    <Icons.Telegram className="w-4 h-4 text-sky-400" />
                    <span>Открыть Telegram с темой</span>
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-contact-whatsapp-cta
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/14 hover:bg-emerald-500/24 border border-emerald-400/35 text-emerald-200 text-sm font-semibold transition-colors active:scale-95"
                  >
                    <Icons.WhatsApp className="w-4 h-4 text-emerald-400" />
                    <span>Открыть WhatsApp с темой</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Row 2: Partner ID for -25% Wholesale Discount */}
            <div className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400 block">
                  Партнёрский ID для оптовой скидки −25%
                </span>
                <p className="selectable-text typography-mono text-3xl font-bold text-white tracking-wider">
                  {siteConfig.distributor.fourLifeId}
                </p>
                <p className="text-xs text-slate-400">
                  Назовите этот ID на складе РЦ 67 или используйте при самостоятельной регистрации
                </p>
              </div>

              <button
                type="button"
                onClick={() => void handleCopy(siteConfig.distributor.fourLifeId, "partner-id")}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer active:scale-95 flex-shrink-0 ${
                  copiedKey === "partner-id"
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/60"
                    : "bg-white/[0.04] text-white border-white/[0.12] hover:border-cyan-400/50"
                }`}
              >
                {copiedKey === "partner-id" ? (
                  <>
                    <Icons.Check className="w-4 h-4 text-cyan-400" />
                    <span>ID скопирован</span>
                  </>
                ) : (
                  <>
                    <Icons.Copy className="w-4 h-4 text-cyan-400" />
                    <span>Скопировать ID</span>
                  </>
                )}
              </button>
            </div>

            {/* Row 3: Official Registration Handoff */}
            <div className="py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-sm text-slate-400 max-w-md text-pretty">
                Нужен собственный бесплатный кабинет Приоритетного Клиента с возвратом до 15% баллами (10→12→15%) и
                Продуктом Месяца от 125 LP?
              </p>
              <Button
                href={siteConfig.distributor.signupUrl}
                isExternal
                variant="secondary"
                size="md"
                icon={<Icons.ExternalLink className="w-4 h-4" />}
              >
                Официальная регистрация
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ZONE 02: OFFICIAL WAREHOUSE DESK — RC 67 MOSCOW + 4-MINUTE WALKING ROUTE */}
      <section className="relative z-10 py-20 md:py-32 border-t border-white/[0.08] overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Concierge Warehouse Visual + Live Status */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="typography-label text-cyan-400 block">Зона 02 — Выдача и отправка СДЭК</span>
                <h2 className="typography-h2 text-white">{siteConfig.office.name}</h2>
              </div>

              <ParallaxImage
                src={moscowConciergeImg}
                alt="Официальный Региональный Центр выдачи 4Life РЦ 67 Москва"
                caption={`РЦ 67 Москва • ${officeStatus.statusLabel}`}
                aspectClassName="aspect-[16/10]"
              />
            </div>

            {/* Right: Structured Warehouse Desk Ledger */}
            <div className="lg:col-span-7 border-y border-white/[0.1] divide-y divide-white/[0.08]">
              <div className="py-7 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block">
                    Статус склада сейчас
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span aria-hidden="true" className={`w-2 h-2 rounded-full ${statusDotClass}`} />
                    <span className="font-heading text-lg font-semibold text-white">{officeStatus.statusLabel}</span>
                  </div>
                  <p className="text-xs text-slate-400">{officeStatus.detailLabel}</p>
                </div>
                <span className="typography-mono text-sm text-cyan-300 flex-shrink-0">
                  {officeStatus.moscowTimeFormatted}
                </span>
              </div>

              <div className="py-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block">
                    Адрес самовывоза
                  </span>
                  <p className="selectable-text text-sm md:text-base text-white leading-relaxed">{siteConfig.office.address}</p>
                  <p className="typography-mono text-xs text-cyan-300/90 pt-0.5">
                    Пн–Пт 10:00–20:00 • Сб 10:00–17:00 • Вс — приём онлайн-заявок МСК
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleCopy(siteConfig.office.address, "office-addr")}
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white transition-colors cursor-pointer pt-1"
                  >
                    {copiedKey === "office-addr" ? (
                      <>
                        <Icons.Check className="w-3.5 h-3.5" />
                        <span>Адрес скопирован</span>
                      </>
                    ) : (
                      <>
                        <Icons.Copy className="w-3.5 h-3.5" />
                        <span>Скопировать адрес для навигатора</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block">
                    Телефон склада РЦ 67
                  </span>
                  <a
                    href={`tel:${siteConfig.office.phoneRaw}`}
                    className="selectable-text font-heading text-2xl font-bold text-white hover:text-cyan-300 transition-colors tabular-nums block"
                  >
                    {siteConfig.office.phone}
                  </a>
                  <p className="text-xs text-slate-400">
                    Укажите партнёрский ID {siteConfig.distributor.fourLifeId} ({siteConfig.distributor.shortName}) для
                    оптовой цены −25%
                  </p>
                </div>
              </div>

              <div className="py-7 space-y-3">
                <span className="typography-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block">
                  Мессенджеры для отправки списка заказа
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a
                    href={siteConfig.office.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-500/14 hover:bg-emerald-500/24 border border-emerald-400/35 text-emerald-200 text-sm font-semibold transition-colors active:scale-[0.98]"
                  >
                    <Icons.WhatsApp className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp РЦ 67</span>
                  </a>

                  <a
                    href={siteConfig.office.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-sky-500/14 hover:bg-sky-500/24 border border-sky-400/35 text-sky-200 text-sm font-semibold transition-colors active:scale-[0.98]"
                  >
                    <Icons.Telegram className="w-4 h-4 text-sky-400" />
                    <span>Telegram РЦ 67</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => void handleCopy(siteConfig.office.phone, "max-rc67")}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-indigo-500/14 hover:bg-indigo-500/24 border border-indigo-400/35 text-indigo-200 text-sm font-semibold transition-colors active:scale-[0.98] cursor-pointer"
                  >
                    <Icons.Max className="w-4 h-4 text-indigo-300" />
                    <span>{copiedKey === "max-rc67" ? "Номер скопирован" : "MAX РЦ 67"}</span>
                  </button>
                </div>
                {copiedKey === "max-rc67" && (
                  <p className="text-xs text-cyan-300 pt-1">
                    Номер склада {siteConfig.office.phone} скопирован — отправьте готовый список заказа в мессенджер MAX.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 4-Minute Step-by-Step Walking Route Guide from м. Новослободская */}
          <OpticalSurface accent="cyan" className="rounded-[1.75rem] p-6 sm:p-8" data-walking-route>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div className="space-y-1.5">
                <span className="typography-mono text-[10px] uppercase tracking-[0.22em] text-cyan-400 block">
                  Пеший ориентир • 4 минуты от метро
                </span>
                <h3 className="typography-h3 text-white">Как дойти до РЦ 67 от м. Новослободская</h3>
              </div>
              <span className="selectable-text typography-mono text-xs text-slate-400">
                350 м • ул. Селезнёвская, 11А, стр. 2, оф. 220А
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              {WALKING_ROUTE_STEPS.map((item) => (
                <div key={item.step} className="space-y-2">
                  <span className="typography-mono text-xl font-light text-cyan-400 block">{item.step}</span>
                  <h4 className="font-heading text-sm font-semibold text-white leading-snug">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed text-pretty">{item.detail}</p>
                </div>
              ))}
            </div>
          </OpticalSurface>
        </div>
      </section>
    </div>
  );
};

export default React.memo(ContactPage);