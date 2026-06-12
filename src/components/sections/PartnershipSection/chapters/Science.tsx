/**
 * @module PartnershipSection/chapters/Science.tsx
 * Глава 1 — партнёрство: тезисы и философия.
 * MolecularNet (ambient SVG) — только high/medium.
 */

import { useEffectsDebug } from "@/hooks/useEffectsDebug";
import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import { motion, useInView } from "framer-motion";
import { forwardRef, memo, useEffect, useMemo, useRef } from "react";
import type { Palette } from "../constants";
import ClipLine from "../ui/ClipLine";

// ─── MolecularNet — ambient декор, остаётся ──────────────────────────────────
const MolecularNet = memo(
  ({ tier, palette, highNodes = true }: { tier: PerformanceTier; palette: Palette; highNodes?: boolean }) => {
    if (tier === "low") return null;
    const count = tier === "high" && highNodes ? 12 : 7;

    const nodes = useMemo(
      () =>
        Array.from({ length: count }, (_, i) => ({
          id: i,
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80,
          r: 2 + Math.random() * 3,
          dur: 8 + Math.random() * 10,
          dx: (Math.random() - 0.5) * 12,
          dy: (Math.random() - 0.5) * 12,
        })),
      [count],
    );

    const edges = useMemo(() => {
      const pairs: [number, number][] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const ni = nodes[i]!;
          const nj = nodes[j]!;
          const dx = ni.x - nj.x;
          const dy = ni.y - nj.y;
          if (Math.sqrt(dx * dx + dy * dy) < 35) pairs.push([i, j]);
        }
      }
      return pairs;
    }, [nodes]);

    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <style>{`
          @keyframes molOrbit {
            0%, 100% { transform: translate(0, 0); }
            33%  { transform: translate(var(--dx), var(--dy)); }
            66%  { transform: translate(calc(var(--dx) * -0.5), calc(var(--dy) * 1.2)); }
          }
        `}</style>
        </defs>
        {edges.map(([a, b], i) => {
          const na = nodes[a as number];
          const nb = nodes[b as number];
          if (!na || !nb) return null;
          return (
            <line
              key={i}
              x1={`${na.x}%`}
              y1={`${na.y}%`}
              x2={`${nb.x}%`}
              y2={`${nb.y}%`}
              stroke={palette.gold}
              strokeWidth="0.15"
              opacity="0.15"
            />
          );
        })}
        {nodes.map((n) => (
          <circle
            key={n.id}
            cx={`${n.x}%`}
            cy={`${n.y}%`}
            r={n.r * 0.3}
            fill={palette.gold}
            opacity="0.4"
            style={
              {
                "--dx": `${n.dx}%`,
                "--dy": `${n.dy}%`,
                animation: `molOrbit ${n.dur}s ease-in-out infinite`,
              } as React.CSSProperties
            }
          />
        ))}
      </svg>
    );
  },
);
MolecularNet.displayName = "MolecularNet";

// ─── Science ──────────────────────────────────────────────────────────────────
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

const Science = memo(
  forwardRef<HTMLElement, ScienceProps>(({ tier, palette, onChapter }, forwardedRef) => {
    const ref = useRef<HTMLElement>(null);
    const activeRef = (forwardedRef as React.RefObject<HTMLElement>) ?? ref;
    const inView = useInView(activeRef, { margin: "-35%" });
    const efxFlags = useEffectsDebug();

    useEffect(() => {
      if (inView) onChapter(1);
    }, [inView, onChapter]);

    return (
      <section
        ref={activeRef}
        className="relative px-6 md:px-16 lg:px-24 py-28 md:py-40 overflow-hidden"
        style={{ background: palette.bg }}
      >
        <MolecularNet
          tier={tier}
          palette={palette}
          highNodes={import.meta.env.DEV ? efxFlags.molecularNetHighNodes : true}
        />

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
            </span>{" "}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
            {/* Left */}
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
                className="mt-10 font-light leading-relaxed max-w-xs"
                style={{
                  fontSize: "clamp(0.88rem, 1.2vw, 1rem)",
                  color: palette.overlay40,
                }}
              >
                Партнёрство 4Life — это рекомендации продуктов, в которые вы верите сами. Личный опыт убеждает
                естественно, а доверие людей превращается в доход.
              </motion.p>
            </div>

            {/* Right: три тезиса */}
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
                    className="font-light leading-relaxed"
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
