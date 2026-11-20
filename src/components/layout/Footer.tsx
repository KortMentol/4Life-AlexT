import CssVeilBackground from "@/components/effects/CssVeilBackground";
import DarkVeil from "@/components/effects/DarkVeil";
import { Button, DynamicLogo } from "@/components/ui";
import { useTransition } from "@/context";
import { useIsMobile, usePerformanceTier } from "@/hooks";
import { footerNav, siteConfig } from "@/site-config/site";
import { Icons } from "@/utils/icons";
import { scrollToTop } from "@/utils/navigationUtils";
import { motion } from "framer-motion";
import React from "react";
import { useLocation } from "react-router-dom";
import "./Footer.css";

const Footer: React.FC = () => {
  const tier = usePerformanceTier();
  const isMobile = useIsMobile();
  const reduceMotion = tier === "low" || isMobile;
  const currentYear = new Date().getFullYear();
  const { transitionTo } = useTransition();
  const location = useLocation();

  const handleInternalLink = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    if (location.pathname === href) scrollToTop({ immediate: false });
    else transitionTo(href);
  };

  const reveal = reduceMotion
    ? { initial: false as const }
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-48px" },
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
      };

  return (
    <footer className="relative isolate overflow-hidden border-t border-white/[0.08] bg-[#03050a] pb-8 pt-14 md:pt-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {tier === "high" && !isMobile ? (
          <DarkVeil speed={0.8} hueShift={180} noiseIntensity={0} scanlineFrequency={0} scanlineIntensity={0} warpAmount={2} resolutionScale={0.8} isMobile={isMobile} />
        ) : (
          <CssVeilBackground />
        )}
      </div>
      <div className="footer-top-line pointer-events-none absolute inset-x-0 top-0 h-px" aria-hidden="true" />

      <div className="footer-container mx-auto grid max-w-[1440px] grid-cols-1 gap-x-10 gap-y-12 px-5 md:grid-cols-12 md:px-8">
        <motion.section {...reveal} className="md:col-span-4">
          <a href="/" onClick={(event) => handleInternalLink(event, "/")} className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400" aria-label="На главную">
            <DynamicLogo alt="4Life Biophysics" className="mb-5" size="lg" />
          </a>
          <p className="max-w-sm text-sm leading-7 text-slate-400">
            Александр Тощев — независимый дистрибьютор. Сайт помогает изучить ассортимент и оформить запрос; он не является сайтом производителя 4Life Research.
          </p>
          <p className="mt-4 typography-label text-slate-500">Партнёрский ID · {siteConfig.distributor.fourLifeId}</p>
          <div className="mt-6 flex items-center gap-2" aria-label="Мессенджеры Александра">
            <a href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Открыть Telegram Александра">
              <Icons.Telegram aria-hidden="true" className="size-5" />
            </a>
            <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Открыть WhatsApp Александра">
              <Icons.WhatsApp aria-hidden="true" className="size-5" />
            </a>
            <a href={`tel:${siteConfig.contact.phoneRaw}`} className="footer-social-icon" aria-label="Позвонить Александру">
              <Icons.Phone aria-hidden="true" className="size-5" />
            </a>
          </div>
        </motion.section>

        <motion.nav {...reveal} aria-label="Навигация в подвале" className="md:col-span-2">
          <h2 className="footer-heading mb-5 typography-label text-white">Разделы</h2>
          <ul className="flex flex-col gap-3">
            {footerNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={(event) => handleInternalLink(event, item.href)} className="footer-link text-sm text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>

        <motion.section {...reveal} aria-labelledby="footer-consult-title" className="md:col-span-3">
          <h2 id="footer-consult-title" className="footer-heading mb-5 typography-label text-white">Личная связь</h2>
          <ul className="flex flex-col gap-4 text-sm text-slate-400">
            <li className="flex items-start gap-3"><Icons.Phone aria-hidden="true" className="footer-icon mt-0.5 size-4 shrink-0" /><a href={`tel:${siteConfig.contact.phoneRaw}`} className="footer-link">{siteConfig.contact.phone}</a></li>
            <li className="flex items-start gap-3"><Icons.Mail aria-hidden="true" className="footer-icon mt-0.5 size-4 shrink-0" /><a href={`mailto:${siteConfig.contact.email}`} className="footer-link break-all">{siteConfig.contact.email}</a></li>
            <li className="flex items-start gap-3"><Icons.Clock aria-hidden="true" className="footer-icon mt-0.5 size-4 shrink-0" /><span className="leading-6">{siteConfig.contact.callSchedule}</span></li>
          </ul>
          <Button to="/contact" variant="secondary" size="sm" className="mt-6" icon={<Icons.ArrowRight aria-hidden="true" className="size-4" />}>
            Все контакты
          </Button>
        </motion.section>

        <motion.section {...reveal} aria-labelledby="footer-office-title" className="md:col-span-3">
          <h2 id="footer-office-title" className="footer-heading mb-5 typography-label text-white">РЦ 67 · Москва</h2>
          <address className="not-italic">
            <p className="flex items-start gap-3 text-sm leading-6 text-slate-400"><Icons.MapPin aria-hidden="true" className="footer-icon mt-1 size-4 shrink-0" />{siteConfig.office.address}</p>
            <a href={`tel:${siteConfig.office.phoneRaw}`} className="footer-link mt-4 inline-flex items-center gap-3 text-sm text-slate-300">
              <Icons.Phone aria-hidden="true" className="footer-icon size-4 shrink-0" />{siteConfig.office.phone}
            </a>
          </address>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <a href={siteConfig.office.whatsapp} target="_blank" rel="noopener noreferrer" className="footer-link">WhatsApp</a>
            <a href={siteConfig.office.telegram} target="_blank" rel="noopener noreferrer" className="footer-link">Telegram</a>
            <a href={siteConfig.office.max} target="_blank" rel="noopener noreferrer" className="footer-link inline-flex items-center gap-1"><Icons.Max aria-hidden="true" className="size-4" />MAX</a>
          </div>
          <a
            href={`https://yandex.ru/maps/?text=${encodeURIComponent(siteConfig.office.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-xs text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <Icons.MapPin aria-hidden="true" className="size-4" />Маршрут в Яндекс Картах
          </a>
        </motion.section>

        <div className="border-t border-white/[0.08] pt-6 md:col-span-12 md:flex md:items-start md:justify-between md:gap-8">
          <p className="text-xs leading-6 text-slate-500">© {currentYear} {siteConfig.distributor.name}. Независимая дистрибьюторская деятельность.</p>
          <p className="mt-3 max-w-3xl text-xs leading-6 text-slate-500 md:mt-0 md:text-right">
            Информация о продуктах не является медицинской рекомендацией. Биологически активные добавки не предназначены для диагностики, лечения или профилактики заболеваний и не заменяют назначение врача. Цены, скидки, наличие и правила программ уточняйте перед заказом.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
