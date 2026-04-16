/**
 * @module PartnershipSection/chapters/Portal.tsx
 * Глава 0 — входной экран.
 * Scramble text (high), параллакс при скролле, dot grid, scroll cue.
 */

import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { forwardRef, memo, useEffect, useRef } from "react";
import type { Palette } from "../constants";
import { useScramble } from "../hooks";

interface PortalProps {
  tier: PerformanceTier;
  palette: Palette;
  onChapter: (n: number) => void;
}

const Portal = memo(
  forwardRef<HTMLDivElement, PortalProps>(({ tier, palette, onChapter }, forwardedRef) => {
    // Внутренний ref для анимаций — всегда существует
    const innerRef = useRef<HTMLDivElement>(null);
    const wordRef = useRef<HTMLDivElement>(null);

    const inView = useInView(innerRef, { margin: "-40%" });
    const wordInView = useInView(wordRef, { once: true, margin: "-10%" });

    const scrambled = useScramble("ПАРТНЁРСТВО", wordInView, tier);

    const { scrollYProgress } = useScroll({
      target: innerRef,
      offset: ["start start", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.45], ["0%", tier !== "low" ? "-18%" : "0%"]);
    const scale = useTransform(scrollYProgress, [0, 0.45], [1, tier !== "low" ? 0.88 : 1]);
    const lineW = useTransform(scrollYProgress, [0, 0.6], ["0%", "100%"]);

    useEffect(() => {
      if (inView) onChapter(0);
    }, [inView, onChapter]);

    return (
      // Внешний div получает forwardedRef для скролла из ChapterNav
      // Внутренний ref используется для анимаций — независимо
      <div ref={forwardedRef}>
        <motion.section
          ref={innerRef}
          className="relative flex flex-col items-center justify-center overflow-hidden"
          style={{ minHeight: "100vh", background: palette.bg }}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${palette.dotColor} 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
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
                className="font-extralight tracking-[-0.03em] select-none"
                style={{
                  fontSize: "clamp(3.5rem, 14vw, 13rem)",
                  color: palette.cream,
                  lineHeight: 0.9,
                }}
              >
                {scrambled}
              </motion.h1>
            </div>

            {/* Animated underline */}
            <div className="mt-8 h-px w-full max-w-[60vw] overflow-hidden" style={{ background: palette.overlay10 }}>
              <motion.div className="h-full" style={{ width: lineW, background: palette.gold }} />
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-10 font-light text-center max-w-sm"
              style={{
                fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
                color: palette.overlay40,
                lineHeight: 1.75,
              }}
            >
              Не продажа. Не схема. <br />
              Архитектура доверия, выстроенная за 25 лет.
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
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-px h-14"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${palette.overlay40}, transparent)`,
                  willChange: "transform",
                }}
              />
              <span className="text-[9px] uppercase tracking-[0.5em]">Скролл</span>
            </motion.div>
          </motion.div>

          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 50% 40% at 50% 60%, ${palette.blueDim}, transparent)`,
            }}
          />
        </motion.section>
      </div>
    );
  }),
);

Portal.displayName = "Portal";

export default Portal;
