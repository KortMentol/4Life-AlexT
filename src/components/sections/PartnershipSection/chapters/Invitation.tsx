/**
 * @module PartnershipSection/chapters/Invitation.tsx
 * Глава 4 — приглашение и CTA.
 * ИСПРАВЛЕНИЕ: Интеграция класса .btn-special-fill для эксклюзивной заливки,
 * изолированной от глобального минималистичного дизайна кнопок.
 * @author Geminis AI & Kort
 * @version 15.0.0
 */

import { Button } from "@/components/ui";
import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import { Icons } from "@/utils/icons";
import { motion, useInView } from "framer-motion";
import React, { forwardRef, memo, useEffect, useRef } from "react";
import type { Palette } from "../constants";
import ClipLine from "../ui/ClipLine";

interface InvitationProps {
  tier: PerformanceTier;
  palette: Palette;
  onChapter: (n: number) => void;
}

const LINES = [
  { text: "Страница партнёрства —", delay: 0, isAccent: false },
  { text: "с деталями.", delay: 0.1, isAccent: true },
] as const;

export const Invitation = memo(
  forwardRef<HTMLElement, InvitationProps>(({ tier, palette, onChapter }, forwardedRef) => {
    const ref = useRef<HTMLElement>(null);
    const activeRef = (forwardedRef as React.RefObject<HTMLElement>) ?? ref;
    const inView = useInView(activeRef, { margin: "-35%" });
    const contentInView = useInView(activeRef, {
      once: true,
      margin: "-15%",
    });

    useEffect(() => {
      if (inView) onChapter(4);
    }, [inView, onChapter]);

    const isHigh = tier === "high";

    return (
      <section
        ref={activeRef}
        className="relative px-6 md:px-16 lg:px-24 py-28 md:py-48 overflow-hidden flex flex-col items-center justify-center"
        style={{ background: palette.bg, minHeight: "90vh" }}
      >
        {tier !== "low" && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={contentInView ? { opacity: [0, 0.07, 0.04] } : { opacity: 0 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              background: `radial-gradient(ellipse 55% 45% at 50% 50%, ${palette.gold}, transparent)`,
            }}
          />
        )}

        <div className="relative z-10 max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={contentInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7 }}
            className="mb-16 flex items-center gap-3"
          >
            <span className="text-[9px] uppercase tracking-[0.5em]" style={{ color: palette.gold }}>
              04 — Приглашение
            </span>
          </motion.div>

          <div className="mb-16">
            {LINES.map((line) => (
              <ClipLine key={line.text} tier={tier} delay={line.delay}>
                <p
                  className="typography-h1"
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                    color: line.isAccent ? palette.gold : palette.cream,
                    marginBottom: "0.15em",
                  }}
                >
                  {line.text}
                </p>
              </ClipLine>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-light leading-relaxed mb-16 max-w-md"
            style={{
              fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)",
              color: palette.overlay40,
            }}
          >
            Партнёрство 4Life — это понятная модель, реальный доход и комфортная среда для роста.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="inline-block relative group"
          >
            {isHigh && (
              <div
                className="absolute -inset-6 rounded-full pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(ellipse, ${palette.gold}40, transparent 70%)`,
                  filter: "blur(16px)",
                }}
              />
            )}

            <Button
              to="/partnership"
              variant="primary"
              size="lg"
              className="rounded-full shadow-2xl btn-special-fill"
              style={
                {
                  "--btn-fill-1": palette.gold,
                  "--btn-fill-2": palette.blue,
                } as React.CSSProperties
              }
              icon={<Icons.ArrowRight className="w-5 h-5 transition-transform duration-300" />}
            >
              Узнать подробнее
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={contentInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="mt-10 text-xs font-light"
            style={{ color: palette.overlay20 }}
          >
            Реальный доход зависит от ваших усилий и объёмов.
          </motion.p>
        </div>
      </section>
    );
  }),
);

Invitation.displayName = "Invitation";
export default Invitation;
