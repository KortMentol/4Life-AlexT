// src/components/sections/PartnershipSection/chapters/Science.tsx
/**
 * @module PartnershipSection/chapters/Science.tsx
 * Глава 1 — партнёрство: тезисы и философия.
 * ИСПРАВЛЕНИЕ: Полностью вырезана молекулярная сетка (MolecularNet) из DOM и логики.
 * @author Geminis AI & Kort
 * @version 3.0.0
 */

import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import { motion, useInView } from "framer-motion";
import React, { forwardRef, memo, useEffect, useRef } from "react";
import type { Palette } from "../constants";
import ClipLine from "../ui/ClipLine";

interface ScienceProps {
  tier: PerformanceTier;
  palette: Palette;
  onChapter: (n: number) => void;
}

const PILLARS = [
  {
    title: "Вход без барьеров",
    body: "Нет обязательных закупок и стартовых взносов. Вы начинаете с того, что уже есть.",
  },
  {
    title: "Свой темп",
    body: "Работайте полный день или несколько часов в неделю — ритм и масштаб выбираете только вы.",
  },
  {
    title: "Среда, которая помогает",
    body: "Наставник, обучение и сообщество партнёров. С первого дня вы не один.",
  },
] as const;

export const Science = memo(
  forwardRef<HTMLElement, ScienceProps>(({ tier, palette, onChapter }, forwardedRef) => {
    const ref = useRef<HTMLElement>(null);
    const activeRef = (forwardedRef as React.RefObject<HTMLElement>) ?? ref;
    const inView = useInView(activeRef, { margin: "-35%" });

    useEffect(() => {
      if (inView) onChapter(1);
    }, [inView, onChapter]);

    return (
      <section
        ref={activeRef}
        className="relative px-6 md:px-16 lg:px-24 py-28 md:py-40 overflow-hidden"
        style={{ background: palette.bg }}
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-16"
          >
            <span className="text-[9px] uppercase tracking-[0.5em]" style={{ color: palette.gold }}>
              01 — Основа
            </span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
            <div>
              <ClipLine tier={tier} delay={0} className="mb-6">
                <p
                  className="typography-h1 font-extralight leading-tight"
                  style={{
                    fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                    color: palette.cream,
                    paddingBottom: "0.1em",
                  }}
                >
                  Знание
                </p>
              </ClipLine>
              <ClipLine tier={tier} delay={0.1} className="mb-6">
                <p
                  className="typography-h1 font-extralight leading-tight"
                  style={{
                    fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                    color: palette.cream,
                    paddingBottom: "0.1em",
                  }}
                >
                  становится
                </p>
              </ClipLine>
              <ClipLine tier={tier} delay={0.2}>
                <p
                  className="typography-h1 font-extralight leading-tight"
                  style={{
                    fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                    color: palette.gold,
                    paddingBottom: "0.1em",
                  }}
                >
                  доходом.
                </p>
              </ClipLine>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="mt-10 font-light leading-relaxed max-w-xs text-pretty"
                style={{
                  fontSize: "clamp(0.88rem, 1.2vw, 1rem)",
                  color: palette.overlay40,
                }}
              >
                Партнёрство 4Life — это рекомендации продуктов, в которые вы верите сами. Личный опыт убеждает
                естественно, а доверие людей превращается в доход.
              </motion.p>
            </div>

            <div className="flex flex-col gap-0 pt-4">
              {PILLARS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.7, delay: i * 0.12 }}
                  className="flex flex-col gap-2 py-8"
                  style={{ borderTop: `1px solid ${palette.overlay10}` }}
                >
                  <span
                    className="typography-body font-semibold"
                    style={{
                      fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
                      color: palette.cream,
                    }}
                  >
                    {item.title}
                  </span>
                  <span
                    className="font-light leading-relaxed text-pretty"
                    style={{
                      fontSize: "clamp(0.82rem, 1vw, 0.92rem)",
                      color: palette.overlay40,
                    }}
                  >
                    {item.body}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }),
);

Science.displayName = "Science";
export default Science;
  