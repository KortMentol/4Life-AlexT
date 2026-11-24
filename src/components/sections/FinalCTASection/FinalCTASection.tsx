/**
 * @module FinalCTASection
 * @description Awwwards SOTY 2027+ Architectural Closing Horizon for HomePage.
 * Features:
 * - Seamless 280px top & 180px bottom #03050a mist dissolves (zero seam line with PartnershipSection or Footer).
 * - Asymmetric Swiss editorial broadsheet layout replacing generic centered SaaS CTA blocks.
 * - Distinct high-trust facts (zero stat duplication with Section 4) and direct warehouse/Telegram actions.
 * - Full 3-tier hardware adaptation (High: scroll parallax horizon; Medium: triggered reveal; Low: crisp static).
 */

import ctaHorizonImg from "@/assets/images/cta_horizon_light_1795221773224.jpg";
import { Button } from "@/components/ui";
import { usePerformanceTier } from "@/hooks";
import { siteConfig } from "@/site-config/site";
import { Icons } from "@/utils/icons";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface ClosingFact {
  value: string;
  detail: string;
}

const CLOSING_FACTS: readonly ClosingFact[] = [
  {
    value: "15 мин",
    detail: "Спокойный разбор цели в Telegram или по телефону",
  },
  {
    value: "−25%",
    detail: `Складская цена от 1 упаковки по ID ${siteConfig.distributor.fourLifeId}`,
  },
  {
    value: "РЦ 67",
    detail: "Официальная отгрузка из Москвы с маркировкой cGMP",
  },
] as const;

const FinalCTASection: React.FC = () => {
  const tier = usePerformanceTier();
  const isLow = tier === "low";
  const isHigh = tier === "high";

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: "-12%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], isHigh ? ["-7%", "7%"] : ["0%", "0%"]);

  return (
    <section
      ref={sectionRef}
      aria-label="Персональная консультация и подбор формул"
      className="relative overflow-hidden bg-[#03050a]"
    >
      {/* Full-bleed architectural horizon photography with compositor-only parallax on High Tier */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.img
          src={ctaHorizonImg}
          alt=""
          loading="lazy"
          decoding="async"
          style={{ y: bgY }}
          className="relative -top-[8%] h-[116%] w-full object-cover object-center brightness-[0.68] contrast-[1.06]"
        />

        {/* Editorial optical vignette keeping architectural pavilion visible on right while protecting left typography */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(3,5,10,0.88) 0%, rgba(3,5,10,0.64) 48%, rgba(3,5,10,0.46) 100%), radial-gradient(ellipse 75% 65% at 72% 46%, rgba(6,182,212,0.08) 0%, rgba(3,5,10,0.74) 82%)",
          }}
        />

        {/* Seamless 280px top mist dissolve — eliminates any horizontal seam with PartnershipSection */}
        <div
          className="absolute top-0 inset-x-0 h-[280px]"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, #03050a 0%, rgba(3,5,10,0.92) 26%, rgba(3,5,10,0.48) 62%, rgba(3,5,10,0) 100%)",
          }}
        />

        {/* Seamless 180px bottom mist dissolve into pure #03050a before Sticky-Reveal Footer curtain */}
        <div
          className="absolute bottom-0 inset-x-0 h-[180px]"
          style={{
            backgroundImage:
              "linear-gradient(to top, #03050a 0%, rgba(3,5,10,0.86) 35%, rgba(3,5,10,0) 100%)",
          }}
        />
      </div>

      {/* Main Architectural Broadsheet */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-28 md:pt-44 md:pb-36"
      >
        {/* Top quiet mono metadata line (zero pills) */}
        <motion.div
          initial={isLow ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-8 md:mb-10"
        >
          <span className="w-8 h-px bg-cyan-400/80" aria-hidden="true" />
          <span className="typography-label text-cyan-300/90">Персональный подбор</span>
          <span className="text-white/20 text-xs" aria-hidden="true">
            ·
          </span>
          <span className="typography-mono text-xs text-slate-400 tabular-nums">
            ID {siteConfig.distributor.fourLifeId}
          </span>
          <span className="text-white/20 text-xs" aria-hidden="true">
            ·
          </span>
          <span className="typography-mono text-xs text-slate-400">Москва, РЦ 67</span>
        </motion.div>

        {/* 12-Column Asymmetric Split: Monumental Headline (Left 7) + Precision Facts (Right 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end pb-14 md:pb-16 border-b border-white/[0.1]">
          <motion.div
            initial={isLow ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.75, delay: isLow ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <h2 className="typography-display text-white leading-[1.02]">
              Подберём систему формул
              <span className="block typography-editorial-italic text-cyan-300 font-normal mt-1.5">
                под ваш ритм и задачу
              </span>
            </h2>

            <p className="typography-lead text-slate-300/95 max-w-xl text-pretty">
              Разберём запрос, составим спокойную связку из 1–2 базовых комплексов без лишних позиций и покажем, как
              оформить заказ напрямую со склада 4Life.
            </p>
          </motion.div>

          {/* Right 5 cols: 3 Unboxed Swiss Hairline Facts (zero repetition of Section 4 metrics) */}
          <motion.div
            initial={isLow ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.75, delay: isLow ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 divide-y divide-white/[0.09] border-y border-white/[0.09]"
          >
            {CLOSING_FACTS.map((fact) => (
              <div key={fact.value} className="py-4 md:py-5 flex items-baseline gap-5">
                <span className="font-sans text-xl md:text-2xl font-semibold text-white tabular-nums tracking-tight w-24 flex-shrink-0">
                  {fact.value}
                </span>
                <span className="text-sm text-slate-200/95 leading-snug text-pretty">{fact.detail}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Architectural Action Bar */}
        <motion.div
          initial={isLow ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, delay: isLow ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="pt-10 md:pt-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button
              to="/contact"
              variant="primary"
              size="lg"
              className="justify-center rounded-full px-8"
              icon={<Icons.MessageCircle className="w-5 h-5" />}
            >
              Получить консультацию
            </Button>

            <Button
              to="/products"
              variant="secondary"
              size="lg"
              className="justify-center rounded-full px-8"
              icon={<Icons.ArrowRight className="w-5 h-5" />}
            >
              Открыть каталог
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <a
              href={siteConfig.contact.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cyan-300 hover:text-white transition-colors font-medium"
            >
              <Icons.Telegram className="w-4 h-4" />
              <span>Написать в Telegram</span>
              <Icons.ExternalLink className="w-3.5 h-3.5 opacity-75" />
            </a>
            <span className="text-white/15 hidden sm:inline" aria-hidden="true">
              |
            </span>
            <span className="text-xs text-slate-400">Без давления, скриптов и обязательных закупок</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(FinalCTASection);