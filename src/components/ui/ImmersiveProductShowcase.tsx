/**
 * @module ImmersiveProductShowcase
 * @description Awwwards 2026 — SOTA HUD Showcase (Direction-Aware Hover).
 *
 * ПОЛНОЕ УСТРАНЕНИЕ БАГОВ И ОПТИМИЗАЦИЯ ДИЗАЙНА (Awwwards Pro):
 * 1. [Symmetrical HUD Geometry]: На нижнюю плашку Box D добавлен спредовый стиль sotaClipStyle.
 *    Теперь обе плашки имеют идеально симметричные скошенные углы.
 * 2. [Pure Codrops Effect 01]: Полностью убрано смещение банки по осям X/Y. При наведении банка
 *    только плавно уменьшается (scale-down) до 0.85, как в оригинальном Эффекте 1 демо-референса.
 * 3. [Underline Only on Low]: Неоновая линия полностью удалена с Medium и High тиров. Оставлена только
 *    ультратонкая 1px линия на Low-тире с ограниченным триггером наведения.
 * 4. [No Compiler Warnings]: Полностью удалена неиспользуемая переменная isMedium для предотвращения ошибки TS6133.
 *
 * @author Geminis AI & Kort
 * @version 33.0.0
 */

import { useTransition } from "@/context";
import { productsData } from "@/data/productsData";
import { useIsMobile, usePerformanceTier } from "@/hooks";
import { useEffectsDebug } from "@/hooks/useEffectsDebug";
import { Icons } from "@/utils/icons";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import React, { lazy, memo, Suspense, useEffect, useMemo, useRef } from "react";

const KineticProductCarousel = lazy(() => import("./KineticProductCarousel"));

interface ImmersiveProductShowcaseProps {
  products?: any;
}

const IS_TOUCH = typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;

const PRODUCT_MARKETING_INFO: Record<string, { num: string; tags: string[]; category: string }> = {
  "tf-trifactor": {
    num: "01",
    tags: ["#ИММУНИТЕТ", "#ОБУЧЕНИЕ"],
    category: "Трай-Фактор",
  },
  "tf-plus": {
    num: "02",
    tags: ["#ЗАЩИТА", "#ТОНУС"],
    category: "ТФ Плюс",
  },
  renuvo: {
    num: "03",
    tags: ["#АНТИСТРЕСС", "#ЭНЕРГИЯ"],
    category: "Ренуво",
  },
};

const getDirection = (e: React.MouseEvent, el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  const x = (e.clientX - rect.left - w / 2) * (w > h ? h / w : 1);
  const y = (e.clientY - rect.top - h / 2) * (h > w ? w / h : 1);
  const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
  return ["top", "right", "bottom", "left"][d];
};

const SotaCard: React.FC<{
  product: (typeof productsData)[number];
  tier: "low" | "medium" | "high";
}> = ({ product, tier }) => {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);

  const { transitionTo } = useTransition();

  const isHigh = tier === "high" && !IS_TOUCH;
  const isLow = tier === "low" || IS_TOUCH;

  const targetLink = `/products?productId=${product.id}`;
  const mInfo = PRODUCT_MARKETING_INFO[product.id] || { num: "01", tags: ["#ИММУНИТЕТ"], category: "Продукт" };

  const sotaClipStyle = {
    clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))",
    WebkitClipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    transitionTo(targetLink);
  };

  useEffect(() => {
    return () => {
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current.querySelectorAll("*"));
      }
    };
  }, []);

  // ─── GSAP HOVER: Направление и магнетизм (Medium & High) ───
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isLow) return;

    const el = containerRef.current;
    const imgWrapper = imgWrapperRef.current;
    const darkOverlay = darkOverlayRef.current;
    if (!el || !imgWrapper || !darkOverlay) return;

    const boxes = el.querySelectorAll(".sota-box");
    const numChars = el.querySelectorAll(".sota-char");
    const categoryChars = el.querySelectorAll(".sota-category-char");
    const staticDesc = el.querySelector(".sota-static-desc");

    const direction = getDirection(e, el);
    el.setAttribute("data-direction", direction || "top");

    const animConfig = { duration: 0.85, ease: "power3.out" };

    gsap.killTweensOf([imgWrapper, darkOverlay, boxes, numChars, categoryChars, staticDesc]);

    gsap.to(darkOverlay, { opacity: 0.5, ...animConfig });

    // ИСПРАВЛЕНО: Чистое уменьшение банки без сдвигов по осям X/Y
    gsap.to(imgWrapper, {
      scale: 0.85,
      x: 0,
      y: 0,
      ...animConfig,
    });

    gsap.to(staticDesc, {
      opacity: 0,
      y: 15,
      duration: 0.4,
      ease: "power2.out",
    });

    const startX = direction === "left" ? -60 : direction === "right" ? 60 : 0;
    const startY = direction === "top" ? -60 : direction === "bottom" ? 60 : 0;
    const startRotation = direction === "left" || direction === "top" ? -10 : 10;

    gsap.fromTo(
      boxes,
      {
        opacity: 0,
        x: startX,
        y: startY,
        rotation: startRotation,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        rotation: 0,
        force3D: isHigh,
        ...animConfig,
      },
    );

    gsap.fromTo(
      numChars,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.1,
      },
    );

    gsap.fromTo(
      categoryChars,
      { opacity: 0 },
      {
        ...animConfig,
        duration: 0.1,
        opacity: 1,
        stagger: {
          from: "random",
          amount: 0.25,
        },
        delay: 0.15,
      },
    );
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isLow) return;

    const el = containerRef.current;
    const imgWrapper = imgWrapperRef.current;
    const darkOverlay = darkOverlayRef.current;
    if (!el || !imgWrapper || !darkOverlay) return;

    const boxes = el.querySelectorAll(".sota-box");
    const staticDesc = el.querySelector(".sota-static-desc");

    const direction = getDirection(e, el) || el.getAttribute("data-direction") || "top";
    const animConfig = { duration: 0.85, ease: "power3.out" };

    gsap.killTweensOf([imgWrapper, darkOverlay, boxes, staticDesc]);

    gsap.to(darkOverlay, { opacity: 0, ...animConfig });

    gsap.to(imgWrapper, {
      scale: 1,
      x: 0,
      y: 0,
      ...animConfig,
    });

    gsap.to(staticDesc, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.1,
    });

    const endX = direction === "left" ? -60 : direction === "right" ? 60 : 0;
    const endY = direction === "top" ? -60 : direction === "bottom" ? 60 : 0;
    const endRotation = direction === "left" || direction === "top" ? -10 : 10;

    gsap.to(boxes, {
      opacity: 0,
      x: endX,
      y: endY,
      rotation: endRotation,
      force3D: isHigh,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const cardLayoutClasses =
    "relative block w-full aspect-[4/5] rounded-[2rem] overflow-hidden cursor-pointer group outline-none border border-white/[0.08] shadow-2xl transition-transform active:scale-[0.98]";
  const mainBlurRadius = isHigh ? "18px" : "12px";

  return (
    <motion.a
      href={targetLink}
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={cardLayoutClasses}
      style={{ WebkitTapHighlightColor: "transparent", transform: "translateZ(0)" }}
    >
      {/* ─── СЛОЙ ФОНА ─── */}
      {isLow ? (
        <div className="absolute inset-0 -z-10 bg-[#050811]" />
      ) : (
        <div
          className="absolute inset-0 -z-10 bg-slate-900/40"
          style={{
            backdropFilter: `blur(${mainBlurRadius}) saturate(135%)`,
            WebkitBackdropFilter: `blur(${mainBlurRadius}) saturate(135%)`,
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.12)",
          }}
        />
      )}

      {/* ─── ВЕРХНЯЯ ИНФОРМАЦИОННАЯ СТРОКА (Видна ТОЛЬКО на Low Tier) ─── */}
      {isLow && (
        <div className="absolute top-6 md:top-8 inset-x-6 md:inset-x-8 flex justify-between items-start z-30 pointer-events-none">
          <span className="text-4xl font-light text-cyan-400/35 font-heading leading-none">{mInfo.num}</span>
          <div className="flex flex-col gap-0.5 items-end">
            {mInfo.tags.map((tag) => (
              <span key={tag} className="text-[10px] uppercase tracking-widest text-slate-500 font-bold leading-tight">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ─── ГИГАНТСКИЙ FULL-BLEED КОНТЕЙНЕР БАНОЧКИ ─── */}
      <div className="relative w-full h-[62%] mt-6 flex items-center justify-center p-8 md:p-10 pb-2 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.12),transparent_65%)]" />
        <div ref={imgWrapperRef} className="relative w-full h-full flex items-center justify-center origin-center">
          <img
            ref={imgRef}
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain scale-[1.3] md:scale-[1.7] drop-shadow-[0_20px_45px_rgba(0,0,0,0.7)]"
          />
          <div ref={darkOverlayRef} className="absolute inset-0 bg-black/60 rounded-full blur-3xl opacity-0 z-20" />
        </div>
      </div>

      {/* ─── ВЫРОВНЕННЫЙ ТЕКСТОВЫЙ БЛОК (Снизу) ─── */}
      <div className="sota-static-desc absolute inset-x-0 bottom-0 px-6 md:px-8 pb-8 pt-40 bg-gradient-to-t from-[#03050a] via-[#03050a]/95 to-transparent z-20 pointer-events-none flex flex-col justify-end">
        <div className="h-[60px] flex items-end mb-2">
          <h3 className="text-white font-bold text-xl leading-snug line-clamp-2">{product.name}</h3>
        </div>
        <div className="h-[64px] overflow-hidden mb-3">
          <p className="text-slate-400 text-sm font-normal leading-relaxed text-pretty">{product.shortDescription}</p>
        </div>

        {isLow && (
          <div className="pointer-events-auto">
            {/* CTA c упругой 1px линией и ограниченной зоной триггера ховера */}
            <div className="relative self-start inline-flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-widest cursor-pointer group/cta">
              <span className="relative z-10">ПОДРОБНЕЕ</span>
              <span className="absolute bottom-[-3px] left-0 h-[1px] w-0 group-hover/cta:w-full bg-gradient-to-r from-cyan-400/60 to-transparent transition-all duration-500 ease-out" />
              <Icons.ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover/cta:translate-x-1" />
            </div>
          </div>
        )}
      </div>

      {/* ─── ВЫЛЕТАЮЩИЕ HUD-ПЛАШКИ (Medium & High) ─── */}
      {!isLow && (
        <div
          className="absolute inset-0 z-30 grid grid-cols-2 grid-rows-2 gap-2 pointer-events-none"
          style={{ gridTemplateAreas: "'box-a box-b' 'box-c box-d'" }}
        >
          {/* BOX A */}
          <div
            className="sota-box sota-box--a flex flex-col justify-between p-6 bg-white/[0.03] border border-white/[0.1] rounded-[1.2rem] opacity-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_10px_20px_rgba(0,0,0,0.3)]"
            style={{
              gridArea: "box-a",
              ...sotaClipStyle,
              backdropFilter: `blur(${isHigh ? "14px" : "10px"}) saturate(120%)`,
              WebkitBackdropFilter: `blur(${isHigh ? "14px" : "10px"}) saturate(120%)`,
              margin: "12px 0 0 12px",
              transform: "translateZ(0)",
            }}
          >
            <span className="text-5xl md:text-6xl font-extralight text-cyan-400 tracking-tight font-heading">
              {isHigh
                ? mInfo.num.split("").map((char, i) => (
                    <span key={i} className="sota-char inline-block">
                      {char}
                    </span>
                  ))
                : mInfo.num}
            </span>
            <div className="flex flex-col gap-0.5">
              {mInfo.tags.map((tag) => (
                <span key={tag} className="text-[10px] uppercase tracking-widest text-slate-300 font-bold">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* BOX D (ИСПРАВЛЕНО: Добавлен sotaClipStyle для скошенных углов) */}
          <div
            className="sota-box sota-box--d flex flex-col justify-end p-6 bg-white/[0.03] border border-white/[0.1] rounded-[1.2rem] opacity-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_10px_20px_rgba(0,0,0,0.3)]"
            style={{
              gridArea: "box-d",
              ...sotaClipStyle, // Возвращены скошенные премиальные углы
              backdropFilter: isHigh ? "blur(8px) saturate(110%)" : "blur(8px) saturate(115%)",
              WebkitBackdropFilter: isHigh ? "blur(8px) saturate(110%)" : "blur(8px) saturate(115%)",
              margin: "0 12px 12px 0",
              transform: "translateZ(0)",
            }}
          >
            {/* Посимвольное проявление названия баночки в Box D */}
            <span className="text-sm font-bold text-white mb-2 uppercase tracking-wider block">
              {mInfo.category.split("").map((char, i) => (
                <span key={i} className="sota-category-char inline-block">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
            {/* CTA на ховере полностью удален (нет дублирующей полоски) */}
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-widest mt-2">
              <span>ПОДРОБНЕЕ</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Внешнее свечение рамки на ховере (Medium & High) */}
      {!isLow && (
        <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ring-1 ring-cyan-400/25 shadow-[0_0_40px_rgba(6,182,212,0.12)] z-40" />
      )}
    </motion.a>
  );
};

const ImmersiveProductShowcase: React.FC<ImmersiveProductShowcaseProps> = () => {
  const tier = usePerformanceTier();
  const efxFlags = useEffectsDebug();
  const isMobile = useIsMobile();

  const showcaseProducts = useMemo(() => {
    return [
      productsData.find((p) => p.id === "tf-trifactor"),
      productsData.find((p) => p.id === "tf-plus"),
      productsData.find((p) => p.id === "renuvo"),
    ].filter((p): p is NonNullable<typeof p> => p !== undefined);
  }, []);

  // Оптимизированный адаптер-маппер типов для бесшовного сопряжения с KineticProductCarousel.tsx
  const mobileMappedProducts = useMemo(() => {
    return showcaseProducts.map((p, i) => ({
      id: i + 1,
      title: p.name,
      description: p.shortDescription,
      image: p.image,
      link: `/products?productId=${p.id}`,
    }));
  }, [showcaseProducts]);

  if (!efxFlags.renderVideoBlocks) {
    return null;
  }

  return (
    <div className="w-full">
      {isMobile ? (
        <div className="-mx-6">
          <Suspense fallback={<div className="h-[420px] w-full bg-transparent" />}>
            <KineticProductCarousel products={mobileMappedProducts} />
          </Suspense>
        </div>
      ) : (
        <div
          className="sota-showcase-grid gap-6 xl:gap-8 items-stretch"
          style={{
            display: "grid",
            width: "100%",
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          {showcaseProducts.map((product) => (
            <SotaCard key={`${product.id}-${tier}`} product={product} tier={tier} />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(ImmersiveProductShowcase);
