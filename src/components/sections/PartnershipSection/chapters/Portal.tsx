/**
 * @module PartnershipSection/chapters/Portal.tsx
 * Глава 0 — входной экран.
 * ИСПРАВЛЕНИЯ (Awwwards 2026):
 * 1. [Firefox Flicker Annihilation]: Использован clip-path: inset() через useMotionTemplate
 *    вместо transform. Это на 100% устраняет баг субпиксельного моргания в движке Gecko.
 * 2. [Mobile Smoothness Lock]: Эффект масштабирования (scale) полностью отключен на тач-устройствах (!IS_TOUCH).
 *    Это убирает тяжелый пересчет векторных шрифтов на CPU телефона, гарантируя 60/120 FPS при скролле.
 * @author Geminis AI & Kort
 * @version 4.3.0
 */

import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import { motion, useInView, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { forwardRef, memo, useEffect, useRef } from "react";
import type { Palette } from "../constants";
import { useScramble } from "../hooks";

interface PortalProps {
  tier: PerformanceTier;
  palette: Palette;
  onChapter: (n: number) => void;
}

const IS_TOUCH = typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;

const Portal = memo(
  forwardRef<HTMLDivElement, PortalProps>(({ tier, palette, onChapter }, forwardedRef) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const wordRef = useRef<HTMLDivElement>(null);

    const inView = useInView(innerRef, { margin: "-40%" });
    const wordInView = useInView(wordRef, { once: true, margin: "-10%" });

    const scrambled = useScramble("ПАРТНЁРСТВО", wordInView, tier);

    const { scrollYProgress } = useScroll({
      target: innerRef,
      offset: ["start start", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.45], inView ? [1, 0] : [1, 1]);
    const y = useTransform(scrollYProgress, [0, 0.45], inView ? ["0%", tier !== "low" ? "-18%" : "0%"] : ["0%", "0%"]);

    // ФИКС: scale применяется ИСКЛЮЧИТЕЛЬНО на ПК (!IS_TOUCH) для экономии ресурсов мобильного процессора
    const scale = useTransform(scrollYProgress, [0, 0.45], inView && !IS_TOUCH ? [1, 0.88] : [1, 1]);

    // ФИКС FIREFOX: Линия открывается через clip-path без субпиксельного дрожания
    const clipRight = useTransform(scrollYProgress, [0, 0.6], inView ? [100, 0] : [100, 100]);
    const clipPath = useMotionTemplate`inset(0 ${clipRight}% 0 0)`;

    useEffect(() => {
      if (inView) onChapter(0);
    }, [inView, onChapter]);

    return (
      <div ref={forwardedRef}>
        <motion.section
          ref={innerRef}
          className="relative flex flex-col items-center justify-center overflow-hidden"
          style={{ minHeight: "100vh", background: palette.bg }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background: `radial-gradient(circle at center, ${palette.dotColor} 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, ${palette.bg} 100%)`,
            }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center text-center px-6"
            style={{ opacity, y, scale }}
          >
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3 mb-14"
            >
              <div className="w-6 h-px" style={{ background: palette.gold }} />
              <span className="text-[10px] uppercase tracking-[0.45em] font-medium" style={{ color: palette.gold }}>
                4Life Network
              </span>
              <div className="w-6 h-px" style={{ background: palette.gold }} />
            </motion.div>

            {/* Giant word */}
            <div ref={wordRef}>
              <motion.h1
                initial={tier !== "low" ? { opacity: 0, scale: 1.05 } : { opacity: 1 }}
                animate={wordInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="typography-display text-center w-full"
                style={{
                  color: palette.cream,
                  willChange: "transform, opacity",
                }}
              >
                {scrambled}
              </motion.h1>
            </div>

            {/* FIREFOX FLICKER FIX: Линия открывается через clip-path маску */}
            <div className="mt-8 relative h-px w-full max-w-[60vw]" style={{ background: palette.overlay10 }}>
              <motion.div
                className="absolute inset-0 h-full w-full"
                style={{
                  background: palette.gold,
                  clipPath,
                  WebkitClipPath: clipPath,
                  willChange: "clip-path",
                }}
              />
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 1, delay: 0.4 }}
              className="typography-lead mt-10 font-light text-center max-w-md"
              style={{
                color: palette.overlay40,
              }}
            >
              Модель, которая работает. Доход, который растёт.
              <br />
              Пространство для тех, кто хочет большего.{" "}
            </motion.p>

            {/* Scroll cue */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ delay: 0.8 }}
              className="mt-20 flex flex-col items-center gap-3"
              style={{ color: palette.overlay20 }}
              aria-hidden="true"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-px h-14"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${palette.overlay40}, transparent)`,
                  willChange: "transform",
                }}
              />
              <span className="text-[9px] uppercase tracking-[0.5em]">Скролл</span>
            </motion.div>
          </motion.div>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 50% 40% at 50% 60%, ${palette.blueDim}, transparent 80%)`,
            }}
          />
        </motion.section>
      </div>
    );
  }),
);

Portal.displayName = "Portal";

export default Portal;
