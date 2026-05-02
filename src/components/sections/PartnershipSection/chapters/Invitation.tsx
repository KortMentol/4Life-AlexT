/**
 * @module PartnershipSection/chapters/Invitation.tsx
 * Глава 4 — приглашение и CTA.
 */

import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import { motion, useInView } from "framer-motion";
import { forwardRef, memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Palette } from "../constants";
import { IS_TOUCH } from "../constants";
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
const Invitation = memo(
  forwardRef<HTMLElement, InvitationProps>(
    ({ tier, palette, onChapter }, forwardedRef) => {
      const ref = useRef<HTMLElement>(null);
      const activeRef = (forwardedRef as React.RefObject<HTMLElement>) ?? ref;
      const inView = useInView(activeRef, { margin: "-35%" });
      const contentInView = useInView(activeRef, {
        once: true,
        margin: "-15%",
      });
      const [hovering, setHovering] = useState(false);

      useEffect(() => {
        if (inView) onChapter(4);
      }, [inView, onChapter]);

      return (
        <section
          ref={activeRef}
          className="relative px-6 md:px-16 lg:px-24 py-28 md:py-48 overflow-hidden flex flex-col items-center justify-center"
          style={{ background: palette.bg, minHeight: "90vh" }}
        >
          {/* Ambient pulse — только medium/high */}
          {tier !== "low" && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={
                contentInView ? { opacity: [0, 0.07, 0.04] } : { opacity: 0 }
              }
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
            {/* Chapter label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={contentInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-16 flex items-center gap-3"
            >
              <span
                className="text-[9px] uppercase tracking-[0.5em]"
                style={{ color: palette.gold }}
              >
                04 — Приглашение
              </span>
            </motion.div>

            {/* Big lines */}
            <div className="mb-16">
              {LINES.map((line) => (
                <ClipLine key={line.text} tier={tier} delay={line.delay}>
                  <p
                    className="font-extralight"
                    style={{
                      fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                      color: line.isAccent ? palette.gold : palette.cream,
                      letterSpacing: "-0.03em",
                      lineHeight: 0.9,
                      marginBottom: "0.15em",
                    }}
                  >
                    {line.text}
                  </p>
                </ClipLine>
              ))}
            </div>

            {/* Description */}
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
              Партнёрство 4Life — это понятная модель, реальный доход и
              комфортная среда для роста.
            </motion.p>

            {/* CTA button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="inline-block relative"
              onMouseEnter={() => !IS_TOUCH && setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              {/* Glow */}
              {tier !== "low" && (
                <motion.div
                  className="absolute -inset-6 rounded-full pointer-events-none"
                  animate={{ opacity: hovering ? 0.4 : 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    background: `radial-gradient(ellipse, ${palette.gold}80, transparent 70%)`,
                    filter: "blur(16px)",
                  }}
                />
              )}

              <Link
                to="/partnership"
                className="relative inline-flex items-center gap-4 group"
                aria-label="Узнать о партнёрстве подробнее"
              >
                <div
                  className="relative px-10 py-5 rounded-full overflow-hidden"
                  style={{ border: `1px solid ${palette.overlay20}` }}
                >
                  {tier !== "low" && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      initial={{ x: "-110%" }}
                      animate={hovering ? { x: "0%" } : { x: "-110%" }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        background: `linear-gradient(135deg, ${palette.gold}, ${palette.blue})`,
                      }}
                    />
                  )}
                  <span
                    className="relative font-medium text-sm uppercase tracking-[0.2em] transition-colors duration-300"
                    style={{ color: palette.cream }}
                  >
                    Узнать подробнее
                  </span>
                </div>

                <motion.div
                  animate={{ x: hovering && !IS_TOUCH ? 6 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ color: palette.gold }}
                  aria-hidden="true"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M3 10h14M11 4l6 6-6 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              </Link>
            </motion.div>

            {/* Disclaimer */}
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
    },
  ),
);

Invitation.displayName = "Invitation";

export default Invitation;
