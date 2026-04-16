/**
 * @module PartnershipSection/chapters/Model.tsx
 * Глава 2 — три факта о модели.
 * Каждый шаг анимируется при входе в viewport.
 */

import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import { motion, useInView } from "framer-motion";
import { forwardRef, memo, useEffect, useRef } from "react";
import type { Palette } from "../constants";
import { MODEL_STEPS } from "../constants";
import ClipLine from "../ui/ClipLine";

interface ModelProps {
  tier: PerformanceTier;
  palette: Palette;
  onChapter: (n: number) => void;
}

const ModelStep = memo(
  ({
    step,
    index,
    tier,
    palette,
  }: {
    step: (typeof MODEL_STEPS)[number];
    index: number;
    tier: PerformanceTier;
    palette: Palette;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-15%" });

    const accentColor =
      step.accentKey === "blue" ? palette.blue : step.accentKey === "gold" ? palette.gold : palette.cream;

    return (
      <motion.div
        ref={ref}
        initial={tier !== "low" ? { opacity: 0, y: 50 } : { opacity: 1 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="relative py-12 md:py-16"
        style={{ borderTop: `1px solid ${palette.overlay10}` }}
      >
        <div className="grid md:grid-cols-[120px_1fr_1fr] gap-8 md:gap-12 items-start">
          {/* Number */}
          <span
            className="font-extralight"
            style={{
              fontSize: "clamp(3rem, 5vw, 4.5rem)",
              color: palette.overlay10,
              letterSpacing: "-0.03em",
            }}
          >
            {step.n}
          </span>

          {/* Title */}
          <h3
            className="font-light leading-tight"
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
              color: accentColor,
              letterSpacing: "-0.02em",
            }}
          >
            {step.title}
          </h3>

          {/* Body */}
          <p
            className="font-light leading-relaxed"
            style={{
              fontSize: "clamp(0.88rem, 1.1vw, 1rem)",
              color: palette.overlay40,
            }}
          >
            {step.body}
          </p>
        </div>

        {/* Animated accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-px"
          initial={{ width: "0%" }}
          animate={inView ? { width: "100%" } : { width: "0%" }}
          transition={{ duration: 1.1, delay: index * 0.12 + 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: `linear-gradient(90deg, ${accentColor}60, transparent)` }}
        />
      </motion.div>
    );
  },
);
ModelStep.displayName = "ModelStep";

const Model = memo(
  forwardRef<HTMLElement, ModelProps>(({ tier, palette, onChapter }, forwardedRef) => {
    const ref = useRef<HTMLElement>(null);
    const activeRef = (forwardedRef as React.RefObject<HTMLElement>) ?? ref;
    const inView = useInView(activeRef, { margin: "-35%" });

    useEffect(() => {
      if (inView) onChapter(2);
    }, [inView, onChapter]);

    return (
      <section
        ref={activeRef}
        className="relative px-6 md:px-16 lg:px-24 py-28 md:py-40"
        style={{ background: palette.bg }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-20 flex-wrap gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-[9px] uppercase tracking-[0.5em]" style={{ color: palette.gold }}>
                02 — Модель
              </span>
            </motion.div>

            <ClipLine tier={tier} className="max-w-lg">
              <p
                className="font-extralight text-right"
                style={{
                  fontSize: "clamp(1.5rem, 3.5vw, 2.8rem)",
                  color: palette.cream,
                  letterSpacing: "-0.02em",
                }}
              >
                Три факта о том, <br />
                как это устроено.
              </p>
            </ClipLine>
          </div>

          {MODEL_STEPS.map((step, i) => (
            <ModelStep key={step.n} step={step} index={i} tier={tier} palette={palette} />
          ))}
        </div>
      </section>
    );
  }),
);

Model.displayName = "Model";

export default Model;
