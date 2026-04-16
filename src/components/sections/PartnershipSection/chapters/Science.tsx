/**
 * @module PartnershipSection/chapters/Science.tsx
 * Глава 1 — наука и статистика.
 * MolecularNet (inline SVG) — только high/medium.
 * StatCounter — анимированный на medium/high, статичный на low.
 */

import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import { motion, useInView } from "framer-motion";
import { forwardRef, memo, useEffect, useMemo, useRef } from "react";
import type { Palette } from "../constants";
import { SCIENCE_STATS } from "../constants";
import { useCountUp } from "../hooks";
import ClipLine from "../ui/ClipLine";

// ─── MolecularNet (inline — используется только здесь) ───────────────────────
// Ноды генерируются один раз через useMemo — tier не меняется после mount
const MolecularNet = memo(({ tier, palette }: { tier: PerformanceTier; palette: Palette }) => {
  if (tier === "low") return null;

  const count = tier === "high" ? 12 : 7;

  // useMemo с пустым deps [] — вычисляется один раз при mount компонента
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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
        const na = nodes[a];
        const nb = nodes[b];
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
});
MolecularNet.displayName = "MolecularNet";

// ─── StatCounter ──────────────────────────────────────────────────────────────
const StatCounter = memo(
  ({
    value,
    suffix,
    label,
    delay,
    tier,
    palette,
  }: {
    value: number;
    suffix: string;
    label: string;
    delay: number;
    tier: PerformanceTier;
    palette: Palette;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-10%" });
    const displayed = useCountUp(value, inView, tier, delay);

    return (
      <div ref={ref} className="flex flex-col items-start gap-2">
        <span
          className="font-extralight tabular-nums leading-none"
          style={{
            fontSize: "clamp(2.8rem, 4.5vw, 4rem)",
            color: palette.cream,
            letterSpacing: "-0.02em",
          }}
        >
          {displayed}
          {suffix}
        </span>
        <span className="text-xs uppercase tracking-[0.28em]" style={{ color: palette.overlay40 }}>
          {label}
        </span>
      </div>
    );
  },
);
StatCounter.displayName = "StatCounter";

// ─── Science ──────────────────────────────────────────────────────────────────
interface ScienceProps {
  tier: PerformanceTier;
  palette: Palette;
  onChapter: (n: number) => void;
}

const Science = memo(
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
        <MolecularNet tier={tier} palette={palette} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-16"
          >
            <span className="text-[9px] uppercase tracking-[0.5em]" style={{ color: palette.gold }}>
              01 — Доказательство
            </span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
            {/* Left: big claim */}
            <div>
              <ClipLine tier={tier} delay={0} className="mb-6">
                <p
                  className="font-extralight leading-[0.88]"
                  style={{
                    fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                    color: palette.cream,
                    letterSpacing: "-0.025em",
                  }}
                >
                  Наука,
                </p>
              </ClipLine>
              <ClipLine tier={tier} delay={0.1} className="mb-6">
                <p
                  className="font-extralight leading-[0.88]"
                  style={{
                    fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                    color: palette.cream,
                    letterSpacing: "-0.025em",
                  }}
                >
                  которая
                </p>
              </ClipLine>
              <ClipLine tier={tier} delay={0.2}>
                <p
                  className="font-extralight leading-[0.88]"
                  style={{
                    fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                    color: palette.gold,
                    letterSpacing: "-0.025em",
                  }}
                >
                  не продаётся.
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
                Transfer Factor — технология передачи иммунной памяти между организмами. Запатентована. Воспроизведена
                тысячами исследований. Продукт существует до тебя и работает без тебя. Твоя задача — знать об этом и
                рассказывать.
              </motion.p>
            </div>

            {/* Right: stats grid */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-14 pt-4">
              {SCIENCE_STATS.map((stat, i) => (
                <StatCounter
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  delay={i * 0.15}
                  tier={tier}
                  palette={palette}
                />
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
