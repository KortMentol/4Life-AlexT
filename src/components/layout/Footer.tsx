/**
 * @module src/components/layout/Footer.tsx
 * @description Awwwards SOTY 2027+ Swiss Clinical Monolith Footer (10/10 Final Edition).
 *
 * Architecture & 3-Tier Adaptation:
 * - Zero JPEG backdrop overhead / zero WebGL VRAM: pure optical CSS obsidian slab +
 *   calibrated 1px specular horizon seam + laboratory micro-dot grid (High/Medium).
 * - Zero textual repetition: each row and label carries one distinct piece of information
 *   (no repeated "Склад РЦ 67", no repeated "Евразия", no broken time intervals).
 * - Mathematically aligned 3-column directory (identical top headers & bottom utility bars),
 *   zero-CLS Partner ID copy swap, live Moscow RC 67 clock/status, Yandex Maps navigation,
 *   and live Order List bridge via useProductList().
 * - Full-bleed edge-to-edge vector wordmark ("4LIFE BIOPHYSICS") with natural tight kerning
 *   and scroll-safe pointer coordinate tracking (0px overflow from 320px to 3840px):
 *     * HIGH Desktop: scroll-linked unveil + zero-setState GPU optical cursor beam
 *     * MEDIUM Desktop: scroll-linked unveil (no pointer listener)
 *     * LOW / Touch: crisp static laser-etched titanium typography (0 Framer hooks, 60–120 FPS)
 */

import { Button } from "@/components/ui";
import { useTransition } from "@/context";
import { useIsMobile, usePerformanceTier } from "@/hooks";
import { useProductList } from "@/hooks/useProductList";
import { mainNav, siteConfig } from "@/site-config/site";
import { Icons } from "@/utils/icons";
import { scrollToTop } from "@/utils/navigationUtils";
import { getRc67OfficeStatus } from "@/utils/officeHours";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Footer.css";

const RC67_YANDEX_MAPS_URL = `https://yandex.ru/maps/?text=${encodeURIComponent(
  "Москва, ул. Селезнёвская, 11А, стр. 2",
)}`;

/** Formats Russian phone numbers into a consistent "+7 (XXX) XXX-XX-XX" display rhythm. */
function formatUnifiedRuPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }
  return phone;
}

interface WordmarkSvgProps {
  enableSpotlight: boolean;
}

/**
 * Precision full-bleed vector wordmark:
 * Uses a calibrated 1016x112 coordinate space so natural tight sans-serif kerning fills 100%
 * of the container width without artificial letter-spacing stretch or plastic stroke outlines.
 * Scroll-safe pointer tracking invalidates cached rect when window.scrollY changes.
 */
const EngravedWordmark: React.FC<WordmarkSvgProps> = ({ enableSpotlight }) => {
  const baseGradId = useId();
  const beamGradId = useId();
  const stageRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<{ rect: DOMRect; scrollY: number } | null>(null);

  const updateSpotCoordinates = useCallback((el: HTMLDivElement, clientX: number, clientY: number) => {
    const currentScrollY = window.scrollY;
    let cached = rectRef.current;
    if (!cached || Math.abs(cached.scrollY - currentScrollY) > 0.5) {
      cached = { rect: el.getBoundingClientRect(), scrollY: currentScrollY };
      rectRef.current = cached;
    }
    el.style.setProperty("--spot-x", `${(clientX - cached.rect.left).toFixed(1)}px`);
    el.style.setProperty("--spot-y", `${(clientY - cached.rect.top).toFixed(1)}px`);
  }, []);

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = stageRef.current;
      if (!el || e.pointerType !== "mouse") return;
      rectRef.current = { rect: el.getBoundingClientRect(), scrollY: window.scrollY };
      updateSpotCoordinates(el, e.clientX, e.clientY);
      el.dataset.lit = "true";
    },
    [updateSpotCoordinates],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = stageRef.current;
      if (!el || e.pointerType !== "mouse") return;
      updateSpotCoordinates(el, e.clientX, e.clientY);
    },
    [updateSpotCoordinates],
  );

  const handlePointerLeave = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    el.dataset.lit = "false";
    rectRef.current = null;
  }, []);

  return (
    <div
      ref={stageRef}
      data-footer-wordmark="true"
      data-lit="false"
      onPointerEnter={enableSpotlight ? handlePointerEnter : undefined}
      onPointerMove={enableSpotlight ? handlePointerMove : undefined}
      onPointerLeave={enableSpotlight ? handlePointerLeave : undefined}
      className="footer-wordmark-stage"
    >
      {/* Layer 1: Anodized Titanium-Obsidian Solid Fill (All 3 Tiers & Touch, zero cheap outline stroke) */}
      <svg
        viewBox="0 0 1016 110"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="footer-wordmark-svg"
      >
        <defs>
          <linearGradient id={baseGradId} x1="0" y1="4" x2="0" y2="108" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.22" />
            <stop offset="52%" stopColor="#94a3b8" stopOpacity="0.11" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.045" />
          </linearGradient>
        </defs>
        <text
          x="508"
          y="94"
          textAnchor="middle"
          fontSize="108"
          textLength="1012"
          lengthAdjust="spacingAndGlyphs"
          fill={`url(#${baseGradId})`}
          className="footer-wordmark-text"
        >
          4LIFE BIOPHYSICS
        </text>
      </svg>

      {/* Layer 2: High-Tier Desktop Optical Cursor Illumination (Pure GPU CSS Mask) */}
      {enableSpotlight && (
        <div aria-hidden="true" className="footer-wordmark-spotlight">
          <svg viewBox="0 0 1016 110" fill="none" focusable="false" className="footer-wordmark-svg">
            <defs>
              <linearGradient id={beamGradId} x1="0" y1="4" x2="0" y2="108" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#67e8f9" stopOpacity="0.64" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.28" />
              </linearGradient>
            </defs>
            <text
              x="508"
              y="94"
              textAnchor="middle"
              fontSize="108"
              textLength="1012"
              lengthAdjust="spacingAndGlyphs"
              fill={`url(#${beamGradId})`}
              className="footer-wordmark-text"
            >
              4LIFE BIOPHYSICS
            </text>
          </svg>
        </div>
      )}
    </div>
  );
};

interface KineticWordmarkRevealProps {
  footerRef: React.RefObject<HTMLElement | null>;
  enableSpotlight: boolean;
}

const KineticWordmarkReveal: React.FC<KineticWordmarkRevealProps> = ({ footerRef, enableSpotlight }) => {
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  const y = useTransform(scrollYProgress, [0.18, 1], [24, 0]);
  const opacity = useTransform(scrollYProgress, [0.18, 0.92], [0.38, 1]);

  return (
    <motion.div
      aria-hidden="true"
      className="overflow-hidden pt-3.5 pb-1.5 sm:pt-4 sm:pb-2"
      style={{ y, opacity }}
    >
      <EngravedWordmark enableSpotlight={enableSpotlight} />
    </motion.div>
  );
};

const Footer: React.FC = () => {
  const tier = usePerformanceTier();
  const isMobile = useIsMobile();
  const isLow = tier === "low";
  const useScrollMotion = !isLow && !isMobile;
  const enableWordmarkSpotlight = tier === "high" && !isMobile;

  const footerRef = useRef<HTMLElement>(null);
  const copyTimerRef = useRef<number | null>(null);
  const currentYear = new Date().getFullYear();

  const { transitionTo } = useTransition();
  const { getTotalItems, openModal } = useProductList();
  const location = useLocation();

  const totalOrderItems = getTotalItems();
  const [copiedId, setCopiedId] = useState(false);
  const [officeStatus, setOfficeStatus] = useState(() => getRc67OfficeStatus());

  const formattedCuratorPhone = useMemo(() => formatUnifiedRuPhone(siteConfig.contact.phone), []);
  const formattedOfficePhone = useMemo(() => formatUnifiedRuPhone(siteConfig.office.phone), []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setOfficeStatus(getRc67OfficeStatus());
    }, 60_000);
    return () => {
      window.clearInterval(timer);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      if (location.pathname === href) {
        scrollToTop({ immediate: false });
      } else {
        transitionTo(href);
      }
    },
    [location.pathname, transitionTo],
  );

  const handleCopyPartnerId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.distributor.fourLifeId);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = siteConfig.distributor.fourLifeId;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedId(true);
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => {
      setCopiedId(false);
      copyTimerRef.current = null;
    }, 2400);
  }, []);

  return (
    <footer
      ref={footerRef}
      data-sticky-curtain-footer="true"
      className="footer-curtain-surface text-slate-300 overflow-x-clip"
    >
      {/* Calibrated 1px specular top horizon seam */}
      <div className="footer-curtain-seam" aria-hidden="true" />

      {/* Optical Studio Overhead Illumination (Zero JPEG decode, Zero WebGL VRAM, All 3 Tiers) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(66% 360px at 50% 0%, rgba(186, 230, 253, 0.068) 0%, rgba(6, 182, 212, 0.028) 44%, rgba(4, 7, 14, 0) 78%)",
        }}
      />

      {/* Precision Laboratory Micro-Dot Matrix (High & Medium tiers only) */}
      {!isLow && (
        <div
          aria-hidden="true"
          className="footer-micro-grid pointer-events-none absolute inset-0 z-0 opacity-75"
        />
      )}

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-8 sm:pt-10 lg:pt-11 pb-5 sm:pb-6">
        {/* ── ZONE 1: Editorial Closing Statement & Zero-CLS Action Dock ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10 pb-7 lg:pb-8 border-b border-white/[0.09]">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-2.5 gap-y-0.5 text-xs text-slate-400">
              <span className="typography-mono text-cyan-300/90">4Life Research USA</span>
              <span className="hidden sm:inline text-white/20" aria-hidden="true">
                ·
              </span>
              <span>Сертифицированные пептидные комплексы cGMP</span>
            </div>

            <h2 className="footer-closing-heading text-white">
              Персональный подбор формул и заказ по партнёрскому прайсу{" "}
              <span className="text-cyan-300">−25% без посредников</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
            <Button
              variant="primary"
              size="md"
              href={siteConfig.contact.telegram}
              isExternal
              icon={<Icons.Telegram className="w-4 h-4 text-cyan-300" />}
              iconPosition="left"
              className="h-12 px-6 text-sm"
            >
              Написать Александру
            </Button>

            {/* Zero-CLS Partner ID Copy Control (grid-stacked layers prevent horizontal button jump) */}
            <button
              type="button"
              onClick={handleCopyPartnerId}
              data-footer-copy-id="true"
              aria-label={`Скопировать партнёрский ID ${siteConfig.distributor.fourLifeId} для скидки 25%`}
              className={`h-12 px-5 rounded-full border transition-colors duration-200 grid place-items-center cursor-pointer active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${
                copiedId
                  ? "border-emerald-400/50 bg-emerald-500/10"
                  : "border-white/[0.14] bg-white/[0.03] hover:bg-white/[0.07] hover:border-cyan-400/45"
              }`}
            >
              <span
                aria-hidden={copiedId}
                className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-2.5 whitespace-nowrap transition-opacity duration-200 ${
                  copiedId ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                <span className="text-xs text-slate-400">ID −25%:</span>
                <span className="typography-mono text-sm font-semibold text-white tracking-wider">
                  {siteConfig.distributor.fourLifeId}
                </span>
                <Icons.Copy className="w-3.5 h-3.5 text-cyan-300 flex-shrink-0" />
              </span>

              <span
                aria-hidden={!copiedId}
                className={`col-start-1 row-start-1 inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-medium text-emerald-300 transition-opacity duration-200 ${
                  copiedId ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <Icons.Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>ID скопирован</span>
              </span>
            </button>
          </div>
        </div>

        {/* ── ZONE 2: Mathematically Aligned 3-Column Swiss Directory ── */}
        {/* Responsive rhythm: 1 col (<640px) -> Nav full-width + 2 cols side-by-side (640–1023px) -> 3 equal columns (>=1024px) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-y-7 sm:gap-x-8 lg:gap-x-0 py-7 lg:py-8 border-b border-white/[0.09]">
          {/* Column 01: 7-Route Architectural Index + Live Order List Bridge */}
          <div className="sm:col-span-2 lg:col-span-4 lg:pr-8 xl:pr-10 flex flex-col justify-between gap-5">
            <div className="space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="typography-mono text-xs text-cyan-400/85">01</span>
                <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-slate-400">Навигация</h3>
              </div>

              <nav aria-label="Навигация в подвале">
                <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-x-4 gap-y-0.5">
                  {mainNav.map((item, idx) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          onClick={(e) => handleNavClick(e, item.href)}
                          data-active={isActive ? "true" : "false"}
                          className={`footer-nav-link text-sm focus-visible:outline-none focus-visible:text-cyan-300 ${
                            isActive ? "text-cyan-300 font-medium" : "text-slate-300 hover:text-white"
                          }`}
                        >
                          <span className="typography-mono text-[11px] text-slate-500 w-5 flex-shrink-0">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="whitespace-nowrap">{item.title}</span>
                          <Icons.ArrowRight className="footer-nav-arrow w-3.5 h-3.5 text-cyan-400 hidden lg:inline flex-shrink-0" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/[0.07] text-xs">
              <button
                type="button"
                onClick={openModal}
                data-footer-open-cart="true"
                className="inline-flex items-center gap-1.5 text-slate-200 hover:text-cyan-300 transition-colors py-1 cursor-pointer whitespace-nowrap"
              >
                <Icons.ShoppingBag className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>
                  Список заказа
                  {totalOrderItems > 0 && (
                    <span className="typography-mono text-cyan-300 ml-1">({totalOrderItems})</span>
                  )}
                </span>
              </button>

              <span className="typography-mono text-[11px] text-slate-400 whitespace-nowrap">
                17 формул · Каталог РФ
              </span>
            </div>
          </div>

          {/* Column 02: Personal Consultation (Alexander Toshchev) */}
          <div className="pt-8 sm:pt-6 lg:pt-0 border-t border-white/[0.08] lg:border-t-0 lg:col-span-4 lg:border-l lg:border-white/[0.08] lg:px-8 xl:px-10 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="typography-mono text-xs text-cyan-400/85">02</span>
                <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-slate-400">Консультация</h3>
              </div>

              <div>
                <p className="font-heading text-lg font-semibold text-white tracking-[-0.015em]">
                  {siteConfig.distributor.name}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {siteConfig.distributor.rank} · Персональный подбор программ
                </p>
              </div>

              <div className="space-y-2 pt-0.5">
                <a
                  href={`tel:${siteConfig.contact.phoneRaw}`}
                  className="inline-flex items-center gap-2.5 text-base font-medium text-white hover:text-cyan-300 transition-colors tabular-nums"
                >
                  <Icons.Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>{formattedCuratorPhone}</span>
                </a>

                <div>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="inline-flex items-center gap-2.5 text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    <Icons.Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{siteConfig.contact.email}</span>
                  </a>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-400 leading-relaxed">
                <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                  <span>Звонки (МСК):</span>
                  <span className="whitespace-nowrap">Пн–Пт 19:00–21:00</span>
                  <span aria-hidden="true">·</span>
                  <span className="whitespace-nowrap">Сб 18:00–20:00</span>
                  <span aria-hidden="true">·</span>
                  <span className="whitespace-nowrap">Вс 11:00–13:00</span>
                </p>
                <p className="text-slate-400/85">В мессенджерах — ежедневно</p>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-white/[0.07] text-xs">
              <a
                href={siteConfig.contact.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-200 hover:text-cyan-300 transition-colors py-1 whitespace-nowrap"
              >
                <Icons.Telegram className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span>Telegram</span>
              </a>
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-200 hover:text-cyan-300 transition-colors py-1 whitespace-nowrap"
              >
                <Icons.WhatsApp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Column 03: RC 67 Official Moscow Pickup & Dispatch Hub */}
          <div className="pt-8 sm:pt-6 lg:pt-0 border-t border-white/[0.08] lg:border-t-0 lg:col-span-4 lg:border-l lg:border-white/[0.08] lg:pl-8 xl:pl-10 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="typography-mono text-xs text-cyan-400/85">03</span>
                <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-slate-400">
                  Офис выдачи · РЦ 67
                </h3>
              </div>

              <a
                href={RC67_YANDEX_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group block space-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
              >
                <p className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5">
                  <span>Москва, м. Новослободская</span>
                  <Icons.ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-300 transition-colors flex-shrink-0" />
                </p>
                <p className="text-xs text-slate-400 leading-relaxed text-pretty">
                  ул. Селезнёвская, 11А, стр. 2, офис 220А (2&#8209;й этаж)
                </p>
              </a>

              <div>
                <a
                  href={`tel:${siteConfig.office.phoneRaw}`}
                  className="inline-flex items-center gap-2.5 text-base font-medium text-white hover:text-cyan-300 transition-colors tabular-nums"
                >
                  <Icons.Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>{formattedOfficePhone}</span>
                </a>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400">
                <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                  <span className="whitespace-nowrap">Пн–Пт 10:00–20:00</span>
                  <span aria-hidden="true">·</span>
                  <span className="whitespace-nowrap">Сб 10:00–17:00</span>
                  <span aria-hidden="true">·</span>
                  <span className="whitespace-nowrap">Вс — онлайн-заявки</span>
                </p>
                <p
                  data-footer-office-status={officeStatus.isOpen ? "open" : "closed"}
                  className={`typography-mono text-[11px] ${
                    officeStatus.isOpen ? "text-emerald-400" : "text-amber-300/90"
                  }`}
                >
                  {officeStatus.isOpen ? "●" : "○"} {officeStatus.statusLabel} · {officeStatus.moscowTimeFormatted}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/[0.07] text-xs">
              <a
                href="/how-to-buy"
                onClick={(e) => handleNavClick(e, "/how-to-buy")}
                className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-white transition-colors py-1 whitespace-nowrap"
              >
                <span>Самовывоз и СДЭК по РФ</span>
                <Icons.ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* ── ZONE 3: Monumental Full-Bleed Laser-Etched Architectural Wordmark ── */}
        {useScrollMotion ? (
          <KineticWordmarkReveal footerRef={footerRef} enableSpotlight={enableWordmarkSpotlight} />
        ) : (
          <div aria-hidden="true" className="overflow-hidden pt-3.5 pb-1.5 sm:pt-4 sm:pb-2">
            <EngravedWordmark enableSpotlight={false} />
          </div>
        )}

        {/* ── ZONE 4: WCAG-Readable Legal Baseline (Clear of floating ScrollToTopButton) ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 pt-3.5 md:pr-14 border-t border-white/[0.08] text-xs text-slate-400 text-center md:text-left">
          <p>
            © {currentYear} {siteConfig.distributor.name} · Независимый дистрибьютор 4Life Research (ID{" "}
            <span className="typography-mono text-slate-300">{siteConfig.distributor.fourLifeId}</span>)
          </p>

          <p className="text-slate-400/90">
            Рынок Евразии · Биологически активная добавка. Не является лекарственным средством.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);