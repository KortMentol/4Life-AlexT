/**
 * @module ImmersiveProductShowcase
 * @description Awwwards 2026 — Immersive featured product showcase.
 * Scroll-driven: боковые карточки разлетаются по X, сходятся при центрировании.
 * Apple 2026 image style: продукт парит без квадратного контейнера.
 * Magnetic hover medium+high desktop.
 * @version 3.0.0
 */

import { useTransition } from "@/context";
import { usePerformanceTier, useTheme } from "@/hooks";
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import React, { lazy, memo, Suspense, useCallback, useRef } from "react";

const KineticProductCarousel = lazy(() => import("./KineticProductCarousel"));

interface ShowcaseProduct {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface ImmersiveProductShowcaseProps {
  products: ShowcaseProduct[];
}

const IS_TOUCH = typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;

const MAGNETIC = { stiffness: 100, damping: 18, mass: 0.5, restDelta: 0.001 };

// X-offset per card when "разлетелись": левая влево, центр на месте, правая вправо
// 0 = центральная карточка (не двигается)
const SPREAD_X = [-120, 0, 120]; // px

// Spring: пружинистый, реагирует на смену направления
const ALIGN_SPRING = { stiffness: 55, damping: 16, mass: 0.9 };

// ─── Single card ─────────────────────────────────────────────────────────────

const ShowcaseCard: React.FC<{
  product: ShowcaseProduct;
  index: number;
  isInView: boolean;
  tier: "low" | "medium" | "high";
  isDark: boolean;
  // 0 = разлетелись, 1 = на своих позициях
  gatherProgress: ReturnType<typeof useSpring>;
}> = ({ product, index, isInView, tier, isDark, gatherProgress }) => {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { transitionTo } = useTransition();

  // Magnetic hover для карточки
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, MAGNETIC);
  const springY = useSpring(rawY, MAGNETIC);
  const mx = tier === "high" ? springX : rawX;
  const my = tier === "high" ? springY : rawY;

  // 3D tilt для изображения — отдельные motion values
  // Прямое обновление DOM через style — 0 ре-рендеров React
  const tiltEnabled = tier !== "low" && !IS_TOUCH;
  const magnetEnabled = tier !== "low" && !IS_TOUCH;

  // Scroll-driven X: от spreadOffset → 0 (сходятся на свои позиции)
  const spreadOffset = SPREAD_X[index] ?? 0;
  // gatherProgress: 0 = разлетелись (spreadOffset), 1 = на месте (0)
  const cardScrollX = useTransform(gatherProgress, [0, 1], [spreadOffset, 0]);

  // Opacity: карточки появляются по мере схождения
  const cardOpacity = useTransform(gatherProgress, [0, 0.4], [0.3, 1]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!magnetEnabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      rawX.set((e.clientX - cx) * 0.07);
      rawY.set((e.clientY - cy) * 0.07);

      // 3D tilt на изображении — прямой DOM, 0 ре-рендеров
      if (tiltEnabled && imgRef.current) {
        const rx = ((e.clientY - cy) / (rect.height / 2)) * -8; // rotateX
        const ry = ((e.clientX - cx) / (rect.width / 2)) * 8; // rotateY
        imgRef.current.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      }
    },
    [magnetEnabled, rawX, rawY, tiltEnabled],
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    // Плавный возврат tilt к нулю
    if (tiltEnabled && imgRef.current) {
      imgRef.current.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    }
  }, [rawX, rawY, tiltEnabled]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      transitionTo(product.link);
    },
    [product.link, transitionTo],
  );

  // Apple 2026 card style — no border, depth via shadow only
  const cardStyle = isDark
    ? {
        background: "rgba(10, 14, 26, 0.88)",
        boxShadow:
          tier === "high" && !IS_TOUCH
            ? "0 0 0 1px rgba(255,255,255,0.06), 0 24px 64px -12px rgba(0,0,0,0.75)"
            : "0 0 0 1px rgba(255,255,255,0.05), 0 12px 40px -8px rgba(0,0,0,0.65)",
      }
    : {
        background: "rgba(255,255,255,0.97)",
        boxShadow:
          tier === "high" && !IS_TOUCH
            ? "0 24px 64px -12px rgba(0,0,0,0.2), 0 4px 16px -4px rgba(0,0,0,0.08)"
            : "0 12px 40px -8px rgba(0,0,0,0.14), 0 2px 8px -2px rgba(0,0,0,0.06)",
      };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: tier === "low" ? 0.25 : 0.65,
        delay: tier === "low" ? 0 : index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        // Magnetic X + scroll-driven X combined
        x: magnetEnabled
          ? useTransform([mx, cardScrollX] as any, ([mxVal, csVal]: number[]) => (mxVal ?? 0) + (csVal ?? 0))
          : cardScrollX,
        y: magnetEnabled ? my : 0,
        opacity: cardOpacity,
        isolation: "isolate",
        zIndex: index === 1 ? 3 : 2, // центральная поверх
      }}
      className="group relative cursor-pointer"
      onClick={handleClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick(e as any)}
      aria-label={`Перейти к продукту: ${product.title}`}
    >
      <div className="relative rounded-2xl overflow-hidden" style={{ contain: "layout paint", ...cardStyle }}>
        {/* Apple inner top highlight */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none z-10"
          style={{
            background: isDark
              ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
          }}
        />

        {/* Hover glow — high tier only */}
        {tier === "high" && !IS_TOUCH && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: isDark
                ? "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.08) 0%, transparent 65%)"
                : "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.07) 0%, transparent 65%)",
              willChange: "opacity",
            }}
          />
        )}

        {/* Image — 2026: 3D tilt через прямой DOM, без GPU хаков = максимальная чёткость */}
        <div
          className="relative pt-6 pb-2 px-6 flex items-center justify-center min-h-[200px] lg:min-h-[280px]"
          style={{ perspective: "600px" }}
        >
          <img
            ref={imgRef}
            src={product.image}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="w-full max-h-[190px] lg:max-h-[266px] object-contain"
            style={{
              // Transition для плавного возврата при mouseLeave
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              // Без backfaceVisibility, без translateZ — чистый рендер = sharp текст
              transformStyle: "preserve-3d",
            }}
          />
        </div>

        {/* Тонкий разделитель */}
        <div
          className="mx-5 h-px"
          style={{
            background: isDark
              ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)"
              : "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)",
          }}
        />

        {/* Content */}
        <div className="p-5 md:p-6">
          <h3
            className={`font-semibold text-lg md:text-xl leading-snug mb-2 ${
              isDark ? "text-white/95" : "text-slate-900"
            }`}
          >
            {product.title}
          </h3>
          <p className={`text-sm leading-relaxed line-clamp-2 mb-4 ${isDark ? "text-slate-400/80" : "text-slate-500"}`}>
            {product.description}
          </p>

          {/* CTA */}
          <div
            className={`flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 ${
              isDark ? "text-cyan-400" : "text-cyan-600"
            } ${!IS_TOUCH ? "group-hover:gap-2.5" : ""}`}
          >
            <span>Подробнее</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${!IS_TOUCH ? "group-hover:translate-x-0.5" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const ImmersiveProductShowcase: React.FC<ImmersiveProductShowcaseProps> = ({ products }) => {
  const tier = usePerformanceTier();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  // Scroll-driven gather:
  // Карточки разлетелись → сходятся когда секция входит в viewport
  // Широкая зона "на месте" в центре
  // Разлетаются снова когда секция уходит вверх
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "end 10%"],
  });

  // 0..0.15 = разлетелись → сходятся
  // 0.15..0.85 = на своих позициях (широкая зона)
  // 0.85..1 = расходятся снова
  const rawGather = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  // Spring — пружинистая реакция при смене направления
  const gatherProgress = useSpring(rawGather, ALIGN_SPRING);

  return (
    <div ref={sectionRef} className="w-full">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div
          className="grid grid-cols-3 gap-6 xl:gap-8 items-start"
          style={{
            perspective: tier === "high" ? "1200px" : "none",
          }}
        >
          {products.slice(0, 3).map((product, i) => (
            <ShowcaseCard
              key={product.id}
              product={product}
              index={i}
              isInView={isInView}
              tier={tier}
              isDark={isDark}
              gatherProgress={gatherProgress}
            />
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="block lg:hidden -mx-6">
        <Suspense fallback={<div className="h-[420px] w-full" />}>
          <KineticProductCarousel products={products} />
        </Suspense>
      </div>
    </div>
  );
};

export default memo(ImmersiveProductShowcase);
