/**
 * @module InteractiveProductCard
 * @description Awwwards 2026 — Premium product card for HomePage featured section.
 * Magnetic hover (medium+high desktop), tier-aware, 60fps.
 * @version 3.0.0
 */

import { usePerformanceTier } from "@/hooks";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React, { memo, useRef } from "react";
import { Link } from "react-router-dom";

interface ProductData {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface InteractiveProductCardProps {
  product: ProductData;
  opaque?: boolean;
  isHoverEffectDisabled?: boolean;
}

const IS_TOUCH = typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;

const MAGNETIC_SPRING = {
  stiffness: 120,
  damping: 20,
  mass: 0.6,
  restDelta: 0.001,
  restSpeed: 0.001,
};

const InteractiveProductCard: React.FC<InteractiveProductCardProps> = ({
  product,
  opaque = false,
  isHoverEffectDisabled = false,
}) => {
  const tier = usePerformanceTier();
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, MAGNETIC_SPRING);
  const y = useSpring(rawY, MAGNETIC_SPRING);

  const magnetEnabled = !isHoverEffectDisabled && !IS_TOUCH && tier !== "low";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!magnetEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - (rect.left + rect.width / 2)) * 0.08);
    rawY.set((e.clientY - (rect.top + rect.height / 2)) * 0.08);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: magnetEnabled ? x : 0,
        y: magnetEnabled ? y : 0,
        isolation: "isolate",
        // Убираем perspective на touch — уплощаем layer tree, экономим GPU
        perspective: IS_TOUCH ? "none" : undefined,
      }}
      className="h-full"
    >
      <Link
        to={product.link}
        className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-2xl"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <div
          className={`relative h-full rounded-2xl overflow-hidden transition-all duration-500 ${
            opaque ? "bg-white dark:bg-gray-900" : "bg-white/90 dark:bg-gray-900/80"
          } border border-gray-200/80 dark:border-white/[0.04] ${
            !IS_TOUCH ? "hover:border-cyan-400/30 dark:hover:border-cyan-400/20" : ""
          }`}
          style={{
            contain: "layout paint",
            boxShadow: "0 4px 24px -8px rgba(0,0,0,0.12)",
          }}
        >
          {/* Image container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-contain p-4 transition-transform duration-700 ease-out ${
                !IS_TOUCH ? "group-hover:scale-105" : ""
              }`}
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/[0.02] to-transparent pointer-events-none" />
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col gap-2">
            <h3 className="font-semibold text-base leading-snug text-gray-900 dark:text-white line-clamp-2">
              {product.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* CTA */}
            <div
              className={`mt-3 flex items-center gap-1.5 text-sm font-semibold text-cyan-600 dark:text-cyan-400 transition-all duration-200 ${
                !IS_TOUCH ? "group-hover:gap-2.5" : ""
              }`}
            >
              <span>Подробнее</span>
              <ArrowRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  !IS_TOUCH ? "group-hover:translate-x-0.5" : ""
                }`}
              />
            </div>
          </div>

          {/* High tier: subtle glow on hover */}
          {tier === "high" && !IS_TOUCH && (
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 50% 0%, rgba(6,182,212,0.06) 0%, transparent 60%)",
              }}
            />
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default memo(InteractiveProductCard);
