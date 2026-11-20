import { PageEntrance } from "@/components/transitions/PageEntrance";
import { Button, ParallaxImage } from "@/components/ui";
import { siteConfig } from "@/site-config/site";
import { SEO } from "@/seo/SEO";
import { Icons } from "@/utils/icons";
import logisticsImage from "@/assets/images/backgrounds/editorial-logistics.png";
import React, { useState } from "react";

const ContactPage: React.FC = () => {
  const [copyState, setCopyState] = useState("Скопировать ID");

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.distributor.fourLifeId);
      setCopyState("ID скопирован");
    } catch {
      setCopyState("Скопируйте ID вручную: " + siteConfig.distributor.fourLifeId);
    }
  };

  return (
    <main className="bg-[#03050a] text-white">
      <SEO
        title="Контакты Александра и РЦ 67 | 4Life"
        description="Личные контакты Александра Тощева и адрес регионального центра РЦ 67 в Москве."
        path="/contact"
        type="website"
      />

      <section className="relative overflow-hidden px-4 pb-20 pt-32 md:px-8 md:pb-28 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_68%_12%,rgba(6,182,212,0.1),transparent_45%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <PageEntrance className="flex flex-col items-start">
              <span data-entrance="badge" className="typography-label mb-6 text-cyan-300">Личная связь · заказ · офис</span>
              <div data-entrance="title">
                <h1 className="typography-display max-w-4xl text-white">Говорите с <span className="text-cyan-300">человеком</span></h1>
              </div>
              <p data-entrance="lead" className="typography-lead mt-7 max-w-2xl text-slate-300">
                Личные вопросы — Александру. Готовый заказ и получение — в РЦ 67. Выберите нужный контакт.
              </p>
            </PageEntrance>
          </div>
          <div className="lg:col-span-5">
            <ParallaxImage src={logisticsImage} alt="Нейтральный интерьер пункта подготовки отправлений" caption="РЦ 67 · Москва" ratio="landscape" priority />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 border-t border-white/[0.08] px-4 py-24 md:px-8 md:py-36 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-6 lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
          <span className="typography-label block text-cyan-400">01 — Личная связь</span>
          <h2 className="typography-h2 text-white">Александр Тощев</h2>
          <p className="typography-body text-slate-400">Вопросы о каталоге, порядке оформления и партнёрстве. Я не медицинский специалист и не даю назначения или схемы лечения.</p>
          <p className="text-sm leading-relaxed text-slate-500">Звонки: {siteConfig.contact.callSchedule.replace("Звонки: ", "")}</p>
          <ParallaxImage src={logisticsImage} alt="Деталь блокнота на рабочем столе" caption="Ответы в мессенджерах — по мере возможности" ratio="landscape" />
        </div>
        <div className="divide-y divide-white/[0.08] lg:col-span-7">
          <a className="group flex flex-col gap-3 py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:flex-row md:items-center md:justify-between" href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">
            <div>
              <span className="typography-label text-slate-500">Мессенджер</span>
              <h3 className="typography-h3 mt-2 text-white">WhatsApp</h3>
              <p className="mt-2 text-sm text-slate-400">{siteConfig.contact.phone}</p>
            </div>
            <span className="flex items-center gap-2 text-sm text-cyan-300 transition-transform group-hover:translate-x-1">Написать <Icons.ArrowRight className="h-4 w-4" /></span>
          </a>
          <a className="group flex flex-col gap-3 py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:flex-row md:items-center md:justify-between" href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer">
            <div>
              <span className="typography-label text-slate-500">Мессенджер</span>
              <h3 className="typography-h3 mt-2 text-white">Telegram</h3>
              <p className="mt-2 text-sm text-slate-400">{siteConfig.contact.phone}</p>
            </div>
            <span className="flex items-center gap-2 text-sm text-cyan-300 transition-transform group-hover:translate-x-1">Написать <Icons.ArrowRight className="h-4 w-4" /></span>
          </a>
          <a className="group flex flex-col gap-3 py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:flex-row md:items-center md:justify-between" href={`tel:${siteConfig.contact.phoneRaw}`}>
            <div>
              <span className="typography-label text-slate-500">Телефон</span>
              <h3 className="typography-h3 mt-2 text-white">{siteConfig.contact.phone}</h3>
            </div>
            <span className="flex items-center gap-2 text-sm text-cyan-300 transition-transform group-hover:translate-x-1">Позвонить <Icons.ArrowRight className="h-4 w-4" /></span>
          </a>
          <div className="flex flex-col gap-4 py-7 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="typography-label text-slate-500">Партнёрский ID</span>
              <p className="mt-2 font-mono text-2xl tabular-nums text-white">{siteConfig.distributor.fourLifeId}</p>
              <p className="mt-1 text-sm text-slate-500">Условия скидки подтверждаются при заказе.</p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <Button onClick={handleCopyId} variant="secondary" size="sm" icon={<Icons.Copy className="h-4 w-4" />}>
                {copyState}
              </Button>
              <Button href={siteConfig.distributor.signupUrl} isExternal variant="secondary" size="sm" icon={<Icons.ExternalLink className="h-4 w-4" />}>
                Регистрация 4Life
              </Button>
              <span className="sr-only" aria-live="polite">{copyState}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-[#050811] px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-start">
          <div className="space-y-6 lg:col-span-5">
            <span className="typography-label text-cyan-400">02 — Оформление и получение</span>
            <h2 className="typography-h2 text-white">Региональный центр РЦ 67</h2>
            <p className="typography-body text-slate-400">Центр принимает вопросы по готовому заказу и его получению. При обращении назовите ID {siteConfig.distributor.fourLifeId}; текущую цену и возможность самовывоза или доставки подтвердите у сотрудника.</p>
            <address className="not-italic text-base leading-relaxed text-slate-300">{siteConfig.office.address}</address>
            <a className="inline-flex items-center gap-2 text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400" href={`tel:${siteConfig.office.phoneRaw}`}>
              <Icons.Phone className="h-4 w-4" /> {siteConfig.office.phone}
            </a>
          </div>
          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08] lg:col-span-7">
            <a className="group flex items-center justify-between gap-4 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400" href={siteConfig.office.whatsapp} target="_blank" rel="noopener noreferrer">
              <span><span className="typography-label text-slate-500">Мессенджер склада</span><span className="typography-h3 mt-2 block text-white">WhatsApp РЦ 67</span></span>
              <Icons.ArrowRight className="h-5 w-5 text-cyan-300 transition-transform group-hover:translate-x-1" />
            </a>
            <a className="group flex items-center justify-between gap-4 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400" href={siteConfig.office.telegram} target="_blank" rel="noopener noreferrer">
              <span><span className="typography-label text-slate-500">Мессенджер склада</span><span className="typography-h3 mt-2 block text-white">Telegram РЦ 67</span></span>
              <Icons.ArrowRight className="h-5 w-5 text-cyan-300 transition-transform group-hover:translate-x-1" />
            </a>
            <a className="group flex items-center justify-between gap-4 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400" href={siteConfig.office.max} target="_blank" rel="noopener noreferrer">
              <span><span className="typography-label text-slate-500">Мессенджер склада</span><span className="typography-h3 mt-2 block text-white">MAX РЦ 67</span></span>
              <Icons.Max className="h-5 w-5 text-cyan-300" />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
        <p className="max-w-4xl text-sm leading-relaxed text-slate-500">Контакты и адрес приведены по данным сайта. Перед поездкой или оплатой уточните актуальный режим работы, наличие и условия доставки у самого центра.</p>
      </section>
    </main>
  );
};

export default React.memo(ContactPage);
