/**
 * @module src/components/sections/ProductsCatalog/SynergyAtelier.tsx
 * @description Awwwards SOTY 2027+ Optical Shutter Wipe Synergy Showcase.
 *
 * Desktop (High/Medium):
 * - Mathematically locked vertical Y-centering (ΔY = 0px across 01, 02, 03):
 *   left sticky h-[100svh] flex-center stage paired with right py-[18svh] + 3×64svh chapters.
 * - Zero alpha-crossfade "mush": 3 fully opaque studio chambers stacked in z-order (z-10, z-20, z-30)
 *   revealed bottom-to-top via compositor-only `clip-path: inset(Y% 0% 0% 0%)` synchronized 1:1 with
 *   a razor-sharp 1px glowing cyan optical shutter blade riding the exact wipe edge.
 * - Zero setState on scroll, pure Framer Motion MotionValues + spring inertia, bi-directional.
 *
 * Mobile / Touch / Low Tier:
 * - Clean inline luminous dual-bottle cards with zero scroll hijacking and 60–120 FPS native scroll.
 */

import synergyAtelierImg from "@/assets/images/synergy_molecular_atelier_1795409513088.jpg";
import { DetailedProduct } from "@/data/productsData";
import { useIsMobile, usePerformanceTier } from "@/hooks";
import { lenis } from "@/lib/lenis";
import { formatRub, SYNERGY_PROGRAMS, SynergyProgram } from "@/utils/catalogHelpers";
import { Icons } from "@/utils/icons";
import { motion, MotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import React, { useCallback, useMemo, useRef } from "react";

interface SynergyAtelierProps {
  products: readonly DetailedProduct[];
  addedProgramId: string | null;
  onAddProgram: (programId: string, productIds: readonly [string, string]) => void;
  onProductClick: (product: DetailedProduct) => void;
}

interface ResolvedProgram {
  program: SynergyProgram;
  pair: readonly DetailedProduct[];
}

// Synchronized scroll transition windows matching symmetric 18svh + 3×64svh + 18svh chapter centers:
// Chapter 01 center: p = 0.00 | Wipe 01 -> 02: p ∈ [0.14, 0.44]
// Chapter 02 center: p = 0.50 | Wipe 02 -> 03: p ∈ [0.62, 0.92]
// Chapter 03 center: p = 1.00
const WIPE_12_START = 0.14;
const WIPE_12_END = 0.44;
const WIPE_23_START = 0.62;
const WIPE_23_END = 0.92;

interface OpticalChamberLayerProps {
  item: ResolvedProgram;
  index: number;
  progress: MotionValue<number>;
}

const OpticalChamberLayer: React.FC<OpticalChamberLayerProps> = ({ item, index, progress }) => {
  // Opaque vertical shutter reveal via compositor clip-path (100% -> 0% top inset = bottom-to-top wipe)
  const revealPercent = useTransform(
    progress,
    index === 0
      ? [0, 1]
      : index === 1
        ? [0, WIPE_12_START, WIPE_12_END, 1]
        : [0, WIPE_23_START, WIPE_23_END, 1],
    index === 0 ? [0, 0] : [100, 100, 0, 0],
  );

  const clipPath = useTransform(revealPercent, (v) => `inset(${v.toFixed(2)}% 0% 0% 0%)`);

  // Subtle internal optical parallax & depth recession as each chamber enters or gets wiped over
  const innerY = useTransform(
    progress,
    index === 0
      ? [0, WIPE_12_START, WIPE_12_END, 1]
      : index === 1
        ? [0, WIPE_12_START, WIPE_12_END, WIPE_23_START, WIPE_23_END, 1]
        : [0, WIPE_23_START, WIPE_23_END, 1],
    index === 0 ? [0, 0, -24, -24] : index === 1 ? [24, 24, 0, 0, -24, -24] : [24, 24, 0, 0],
  );

  const innerScale = useTransform(
    progress,
    index === 0
      ? [0, WIPE_12_START, WIPE_12_END, 1]
      : index === 1
        ? [0, WIPE_12_START, WIPE_12_END, WIPE_23_START, WIPE_23_END, 1]
        : [0, WIPE_23_START, WIPE_23_END, 1],
    index === 0 ? [1, 1, 0.96, 0.96] : index === 1 ? [0.97, 0.97, 1, 1, 0.96, 0.96] : [0.97, 0.97, 1, 1],
  );

  const innerOpacity = useTransform(
    progress,
    index === 0
      ? [0, WIPE_12_START, WIPE_12_END, 1]
      : index === 1
        ? [0, WIPE_12_START, WIPE_12_END, WIPE_23_START, WIPE_23_END, 1]
        : [0, WIPE_23_START, WIPE_23_END, 1],
    index === 0 ? [1, 1, 0.55, 0.55] : index === 1 ? [0.85, 0.85, 1, 1, 0.55, 0.55] : [0.85, 0.85, 1, 1],
  );

  const [first, second] = item.pair;
  const zIndexClass = index === 0 ? "z-10" : index === 1 ? "z-20" : "z-30";

  return (
    <motion.div
      data-synergy-stage-layer={item.program.index}
      style={{
        clipPath: index === 0 ? undefined : clipPath,
        willChange: index === 0 ? undefined : "clip-path",
      }}
      className={`pointer-events-none absolute inset-0 ${zIndexClass} bg-[#060d1b]`}
    >
      {/* Fully opaque monochrome architectural chamber backing (zero bleed-through, zero RGB wash) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 78% 60% at 50% 26%, rgba(186, 230, 253, 0.09) 0%, rgba(14, 165, 233, 0.035) 48%, rgba(6, 11, 22, 0.98) 84%), linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(6,11,22,0) 28%)",
        }}
      />

      {/* Precision laboratory dot matrix inside chamber */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage: "radial-gradient(rgba(148, 163, 184, 0.16) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Inner Content Composition with GPU Parallax */}
      <motion.div
        style={{ y: innerY, scale: innerScale, opacity: innerOpacity, willChange: "transform, opacity" }}
        className="relative z-10 h-full flex flex-col justify-between p-7 xl:p-9"
      >
        {/* Top Protocol Header */}
        <div className="flex items-baseline justify-between pb-4 border-b border-white/[0.1]">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="typography-mono text-xs text-cyan-300 uppercase tracking-[0.18em]">
              Протокол {item.program.index} / 03
            </span>
          </div>
          <span className="typography-mono text-xs text-slate-200 tabular-nums">
            ≈ {formatRub(item.program.totalRub)} · {item.program.totalLp} LP
          </span>
        </div>

        {/* Illuminated Dual-Bottle Studio Stage (clean monochrome chamber, zero reticle clutter) */}
        <div className="relative flex-1 flex items-center justify-center py-5">
          <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4 w-full">
            {first && (
              <div className="text-center space-y-3">
                <div className="relative h-44 xl:h-48 flex items-center justify-center">
                  <div
                    aria-hidden="true"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[58%] h-4 rounded-full pointer-events-none"
                    style={{
                      backgroundImage: "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.85) 0%, transparent 72%)",
                    }}
                  />
                  <img
                    src={first.image}
                    alt={first.name}
                    className="relative z-10 max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white leading-snug">{first.name}</p>
                  <p className="typography-mono text-xs text-slate-400 mt-0.5 tabular-nums">
                    ≈ {formatRub(first.priceRub)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col items-center gap-2 text-cyan-300">
              <span className="w-px h-9 bg-gradient-to-b from-transparent via-cyan-300/35 to-cyan-300/20" aria-hidden="true" />
              <span className="w-7 h-7 rounded-full border border-cyan-300/30 bg-cyan-400/[0.08] flex items-center justify-center font-heading text-base font-light">
                +
              </span>
              <span className="w-px h-9 bg-gradient-to-t from-transparent via-cyan-300/35 to-cyan-300/20" aria-hidden="true" />
            </div>

            {second && (
              <div className="text-center space-y-3">
                <div className="relative h-44 xl:h-48 flex items-center justify-center">
                  <div
                    aria-hidden="true"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[58%] h-4 rounded-full pointer-events-none"
                    style={{
                      backgroundImage: "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.85) 0%, transparent 72%)",
                    }}
                  />
                  <img
                    src={second.image}
                    alt={second.name}
                    className="relative z-10 max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white leading-snug">{second.name}</p>
                  <p className="typography-mono text-xs text-slate-400 mt-0.5 tabular-nums">
                    ≈ {formatRub(second.priceRub)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Concise Mechanism Takeaway */}
        <div className="pt-4 border-t border-white/[0.1] space-y-1.5">
          <p className="text-sm font-medium text-white leading-relaxed text-pretty">
            <span className="typography-mono text-cyan-300 mr-2">=</span>
            {item.program.synergyEffect}
          </p>
          <p className="text-xs text-slate-400">{item.program.systemsCovered.join("  ·  ")}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface ShutterBladeProps {
  progress: MotionValue<number>;
  start: number;
  end: number;
}

const STAGE_HEIGHT_PX = 485;

/** Razor-sharp 1px glowing specular scanline riding the exact clip-path wipe seam via GPU translateY */
const OpticalShutterBlade: React.FC<ShutterBladeProps> = ({ progress, start, end }) => {
  const bladeY = useTransform(progress, [start, end], [STAGE_HEIGHT_PX, 0]);
  const bladeOpacity = useTransform(
    progress,
    [start, start + 0.03, end - 0.03, end],
    [0, 1, 1, 0],
  );

  return (
    <motion.div
      aria-hidden="true"
      data-synergy-shutter-blade="true"
      style={{ y: bladeY, opacity: bladeOpacity, willChange: "transform, opacity" }}
      className="pointer-events-none absolute top-0 inset-x-0 z-40 -mt-px"
    >
      {/* Crisp 1px optical line */}
      <div className="w-full h-px bg-gradient-to-r from-cyan-400/10 via-cyan-200 to-cyan-400/10 shadow-[0_0_14px_rgba(34,211,238,0.85)]" />
      {/* Subtle ambient cyan bloom around the moving seam */}
      <div
        className="w-full h-5 -mt-2.5"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(34,211,238,0) 0%, rgba(34,211,238,0.22) 50%, rgba(34,211,238,0) 100%)",
        }}
      />
    </motion.div>
  );
};

// Segmented Split-Flow Bifurcation SVG Circuit Geometry (viewBox="0 0 44 332")
// Circles centered at cx=22, R=17; vertical stems connect STRICTLY pole-to-pole outside circles.
const CIRCUIT_CX = 22;
const CIRCUIT_R = 17;
const CIRCUIT_CENTERS = [22, 166, 310] as const;

function buildSplitArcs(cy: number): { left: string; right: string } {
  const topY = cy - CIRCUIT_R;
  const botY = cy + CIRCUIT_R;
  return {
    left: `M ${CIRCUIT_CX} ${topY} A ${CIRCUIT_R} ${CIRCUIT_R} 0 0 0 ${CIRCUIT_CX} ${botY}`,
    right: `M ${CIRCUIT_CX} ${topY} A ${CIRCUIT_R} ${CIRCUIT_R} 0 0 1 ${CIRCUIT_CX} ${botY}`,
  };
}

const ARC_1 = buildSplitArcs(CIRCUIT_CENTERS[0]);
const ARC_2 = buildSplitArcs(CIRCUIT_CENTERS[1]);
const ARC_3 = buildSplitArcs(CIRCUIT_CENTERS[2]);
const STEM_12 = `M ${CIRCUIT_CX} ${CIRCUIT_CENTERS[0] + CIRCUIT_R} L ${CIRCUIT_CX} ${CIRCUIT_CENTERS[1] - CIRCUIT_R}`;
const STEM_23 = `M ${CIRCUIT_CX} ${CIRCUIT_CENTERS[1] + CIRCUIT_R} L ${CIRCUIT_CX} ${CIRCUIT_CENTERS[2] - CIRCUIT_R}`;

interface SplitFlowNodeButtonProps {
  index: number;
  cy: number;
  label: string;
  title: string;
  progress: MotionValue<number>;
  onSelect: (index: number) => void;
}

const SplitFlowNodeButton: React.FC<SplitFlowNodeButtonProps> = ({
  index,
  cy,
  label,
  title,
  progress,
  onSelect,
}) => {
  const activeRange: number[] =
    index === 0
      ? [0, WIPE_12_START, WIPE_12_END, 1]
      : index === 1
        ? [0, WIPE_12_START, WIPE_12_END, WIPE_23_START, WIPE_23_END, 1]
        : [0, WIPE_23_START, WIPE_23_END, 1];

  const textOpacityOut: number[] =
    index === 0 ? [1, 1, 0.52, 0.52] : index === 1 ? [0.52, 0.52, 1, 1, 0.52, 0.52] : [0.52, 0.52, 1, 1];

  const glowOpacityOut: number[] =
    index === 0 ? [0.32, 0.32, 0, 0] : index === 1 ? [0, 0, 0.32, 0.32, 0, 0] : [0, 0, 0.32, 0.32];

  const textOpacity = useTransform(progress, activeRange, textOpacityOut);
  const glowOpacity = useTransform(progress, activeRange, glowOpacityOut);

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-label={`Перейти к протоколу ${label}: ${title}`}
      data-synergy-rail-btn={label}
      style={{ top: `${cy - 17}px`, left: "5px" }}
      className="group absolute w-[34px] h-[34px] rounded-full flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
    >
      {/* Subtle radial cyan core glow inside opaque circle only when active */}
      <motion.span
        aria-hidden="true"
        style={{
          opacity: glowOpacity,
          backgroundImage: "radial-gradient(circle, rgba(34,211,238,0.45) 0%, rgba(34,211,238,0) 72%)",
        }}
        className="pointer-events-none absolute inset-0 rounded-full"
      />
      <motion.span
        style={{ opacity: textOpacity }}
        className="relative z-10 typography-mono text-xs font-semibold text-cyan-200 group-hover:text-white transition-colors"
      >
        {label}
      </motion.span>
    </button>
  );
};

interface SplitFlowOpticalRailProps {
  resolvedPrograms: readonly ResolvedProgram[];
  progress: MotionValue<number>;
  onSelect: (index: number) => void;
}

/**
 * Awwwards Split-Flow Bifurcation SVG Rail:
 * - Zero line cutting through circles: opaque #060d1b nodes sit cleanly inside dual semi-circle arcs.
 * - As scroll progresses, the cyan beam pours out of 01's bottom pole down Stem 1→2, hits 02's top pole,
 *   splits left & right simultaneously around 02's perimeter to fuse at its bottom pole, then repeats into 03.
 */
const SplitFlowOpticalRail: React.FC<SplitFlowOpticalRailProps> = ({
  resolvedPrograms,
  progress,
  onSelect,
}) => {
  // Circle 01 starts fully enveloped; Stem 1→2 fills [0.02..0.24], Circle 02 twin arcs envelop [0.24..0.44],
  // Stem 2→3 fills [0.52..0.72], Circle 03 twin arcs envelop [0.72..0.92].
  const stem12Length = useTransform(progress, [0.02, 0.24], [0, 1]);
  const arc2Length = useTransform(progress, [0.24, WIPE_12_END], [0, 1]);
  const stem23Length = useTransform(progress, [0.52, 0.72], [0, 1]);
  const arc3Length = useTransform(progress, [0.72, WIPE_23_END], [0, 1]);

  // Strictly hide zero-length segments (opacity 0 when pathLength === 0) so no browser
  // ever paints phantom endpoint dots at poles of inactive nodes 02 and 03.
  const stem12Opacity = useTransform(stem12Length, (v) => (v > 0.002 ? 1 : 0));
  const arc2Opacity = useTransform(arc2Length, (v) => (v > 0.002 ? 1 : 0));
  const stem23Opacity = useTransform(stem23Length, (v) => (v > 0.002 ? 1 : 0));
  const arc3Opacity = useTransform(arc3Length, (v) => (v > 0.002 ? 1 : 0));

  return (
    <nav
      aria-label="Навигация по протоколам синергии"
      className="relative w-[44px] h-[332px] flex-shrink-0 select-none"
    >
      <svg
        width="44"
        height="332"
        viewBox="0 0 44 332"
        fill="none"
        aria-hidden="true"
        data-synergy-circuit-svg="true"
        className="pointer-events-none block overflow-visible"
      >
        <defs>
          <linearGradient id="synergySplitGrad" x1="22" y1="5" x2="22" y2="327" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="52%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>

        {/* Opaque Mineral-Obsidian Node Discs (guarantee zero line bleed inside circles) */}
        {CIRCUIT_CENTERS.map((cy) => (
          <circle key={`disc-${cy}`} cx={CIRCUIT_CX} cy={cy} r={CIRCUIT_R - 0.8} fill="#060d1b" />
        ))}

        {/* Resting Architectural Hairline Circuit (stems stop strictly at circle poles) */}
        <g stroke="rgba(255,255,255,0.13)" strokeWidth="1.25" strokeLinecap="butt">
          <path d={STEM_12} vectorEffect="non-scaling-stroke" />
          <path d={STEM_23} vectorEffect="non-scaling-stroke" />
          {CIRCUIT_CENTERS.map((cy) => (
            <circle key={`ring-${cy}`} cx={CIRCUIT_CX} cy={cy} r={CIRCUIT_R} />
          ))}
        </g>

        {/* Active Luminous Split-Flow Beam (compositor-driven pathLength, strokeLinecap="butt" + strict zero-length opacity gate) */}
        <g
          stroke="url(#synergySplitGrad)"
          strokeWidth="1.75"
          strokeLinecap="butt"
        >
          {/* Node 01: Twin arcs always illuminated from 12 o'clock to 6 o'clock */}
          <path d={ARC_1.left} vectorEffect="non-scaling-stroke" data-synergy-arc="01-left" />
          <path d={ARC_1.right} vectorEffect="non-scaling-stroke" data-synergy-arc="01-right" />

          {/* Stem 01 -> 02 (strictly outside circles) */}
          <motion.path
            d={STEM_12}
            vectorEffect="non-scaling-stroke"
            data-synergy-stem="1-2"
            style={{ pathLength: stem12Length, opacity: stem12Opacity }}
          />

          {/* Node 02: Beam splits left & right from top pole and fuses at bottom pole */}
          <motion.path
            d={ARC_2.left}
            vectorEffect="non-scaling-stroke"
            data-synergy-arc="02-left"
            style={{ pathLength: arc2Length, opacity: arc2Opacity }}
          />
          <motion.path
            d={ARC_2.right}
            vectorEffect="non-scaling-stroke"
            data-synergy-arc="02-right"
            style={{ pathLength: arc2Length, opacity: arc2Opacity }}
          />

          {/* Stem 02 -> 03 (strictly outside circles) */}
          <motion.path
            d={STEM_23}
            vectorEffect="non-scaling-stroke"
            data-synergy-stem="2-3"
            style={{ pathLength: stem23Length, opacity: stem23Opacity }}
          />

          {/* Node 03: Beam splits left & right from top pole down to bottom pole */}
          <motion.path
            d={ARC_3.left}
            vectorEffect="non-scaling-stroke"
            data-synergy-arc="03-left"
            style={{ pathLength: arc3Length, opacity: arc3Opacity }}
          />
          <motion.path
            d={ARC_3.right}
            vectorEffect="non-scaling-stroke"
            data-synergy-arc="03-right"
            style={{ pathLength: arc3Length, opacity: arc3Opacity }}
          />
        </g>
      </svg>

      {/* Interactive Accessible Node Hit-Targets layered exactly over each opaque disc */}
      {resolvedPrograms.map((item, idx) => (
        <SplitFlowNodeButton
          key={item.program.id}
          index={idx}
          cy={CIRCUIT_CENTERS[idx] ?? CIRCUIT_CENTERS[0]}
          label={item.program.index}
          title={item.program.title}
          progress={progress}
          onSelect={onSelect}
        />
      ))}
    </nav>
  );
};

interface ScrollChapterBeatProps {
  item: ResolvedProgram;
  index: number;
  progress: MotionValue<number>;
  isJustAdded: boolean;
  onAddProgram: (programId: string, productIds: readonly [string, string]) => void;
  onProductClick: (product: DetailedProduct) => void;
}

const ScrollChapterBeat: React.FC<ScrollChapterBeatProps> = ({
  item,
  index,
  progress,
  isJustAdded,
  onAddProgram,
  onProductClick,
}) => {
  // Exact 1:1 synchronization with optical shutter wipe windows
  const focusRange: number[] =
    index === 0
      ? [0, WIPE_12_START, WIPE_12_END, 1]
      : index === 1
        ? [0, WIPE_12_START, WIPE_12_END, WIPE_23_START, WIPE_23_END, 1]
        : [0, WIPE_23_START, WIPE_23_END, 1];

  const focusOutput: number[] =
    index === 0 ? [1, 1, 0.3, 0.3] : index === 1 ? [0.3, 0.3, 1, 1, 0.3, 0.3] : [0.3, 0.3, 1, 1];

  const accentScaleOutput: number[] =
    index === 0 ? [1, 1, 0.18, 0.18] : index === 1 ? [0.18, 0.18, 1, 1, 0.18, 0.18] : [0.18, 0.18, 1, 1];

  const opacity = useTransform(progress, focusRange, focusOutput);
  const accentScaleY = useTransform(progress, focusRange, accentScaleOutput);

  return (
    <motion.article
      data-synergy-chapter={item.program.index}
      style={{ opacity, willChange: "opacity" }}
      className="relative min-h-[64svh] flex flex-col justify-center py-8 pl-6"
    >
      {/* Synchronized active chapter accent filament */}
      <motion.div
        aria-hidden="true"
        style={{ scaleY: accentScaleY, willChange: "transform" }}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-40 origin-center rounded-full bg-gradient-to-b from-cyan-400/20 via-cyan-300 to-cyan-400/20"
      />

      <div className="space-y-5 max-w-xl">
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-4">
            <span className="typography-mono text-lg text-cyan-300">{item.program.index}</span>
            <div>
              <h3 className="typography-h3 text-white">{item.program.title}</h3>
              <p className="text-xs text-cyan-300/85 mt-1">{item.program.subtitle}</p>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="font-heading text-xl font-semibold text-white tabular-nums block">
              ≈ {formatRub(item.program.totalRub)}
            </span>
            <span className="typography-mono text-xs text-slate-400">{item.program.totalLp} LP</span>
          </div>
        </div>

        <p className="typography-body text-slate-300 pl-9">{item.program.description}</p>

        <div className="pl-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {item.pair.map((prod) => (
            <button
              key={prod.id}
              type="button"
              onClick={() => onProductClick(prod)}
              className="group inline-flex items-center gap-2 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer py-1"
            >
              <span className="font-medium underline decoration-white/20 underline-offset-4 group-hover:decoration-cyan-400">
                {prod.name}
              </span>
              <span className="typography-mono text-xs text-slate-400 tabular-nums">≈ {formatRub(prod.priceRub)}</span>
            </button>
          ))}
        </div>

        <div className="pl-9 pt-2">
          <button
            type="button"
            onClick={() => onAddProgram(item.program.id, item.program.productIds)}
            data-add-program={item.program.id}
            className={`h-11 px-6 rounded-full inline-flex items-center gap-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
              isJustAdded
                ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/65"
                : "border border-white/[0.18] hover:border-cyan-400/65 bg-white/[0.04] hover:bg-cyan-500/12 text-white"
            }`}
          >
            {isJustAdded ? (
              <>
                <Icons.Check className="w-4 h-4 text-cyan-300" />
                <span>Пара добавлена в список</span>
              </>
            ) : (
              <>
                <Icons.Plus className="w-4 h-4 text-cyan-300" />
                <span>
                  Добавить пару · ≈ {formatRub(item.program.totalRub)} ({item.program.totalLp} LP)
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
};

interface DesktopScrollTrackProps {
  resolvedPrograms: readonly ResolvedProgram[];
  addedProgramId: string | null;
  onAddProgram: (programId: string, productIds: readonly [string, string]) => void;
  onProductClick: (product: DetailedProduct) => void;
}

const DesktopScrollTrack: React.FC<DesktopScrollTrackProps> = ({
  resolvedPrograms,
  addedProgramId,
  onAddProgram,
  onProductClick,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Responsive precision spring so mouse wheel & trackpad scrubbing follow 1:1 without sluggish lag
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 170,
    damping: 30,
    mass: 0.28,
  });

  const scrollToStep = useCallback((stepIndex: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const trackTop = rect.top + window.scrollY;
    const scrollableDistance = Math.max(0, track.offsetHeight - window.innerHeight);
    const targetProgress = stepIndex === 0 ? 0 : stepIndex === 1 ? 0.5 : 1;
    const targetY = Math.max(0, trackTop + scrollableDistance * targetProgress);

    if (lenis) {
      lenis.scrollTo(targetY, { duration: 0.9 });
    } else {
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  }, []);

  return (
    <div ref={trackRef} data-synergy-scroll-track="true" className="hidden lg:grid lg:grid-cols-12 gap-12 xl:gap-16">
      {/* Left 6 Columns: Sticky Full-Viewport Centering Rail (ALWAYS locked at exact 50svh) */}
      <div className="lg:col-span-6">
        <div className="sticky top-0 h-[100svh] flex items-center">
          <div className="relative w-full flex items-center gap-5">
            {/* Interactive Split-Flow 01 · 02 · 03 Bifurcation SVG Rail */}
            <SplitFlowOpticalRail
              resolvedPrograms={resolvedPrograms}
              progress={smoothProgress}
              onSelect={scrollToStep}
            />

            {/* Opaque Multi-Chamber Optical Stage (height 485px, centered at exact 50svh) */}
            <div
              data-synergy-stage="true"
              className="relative flex-1 h-[485px] rounded-3xl border border-white/[0.12] bg-[#060d1b] overflow-hidden shadow-[0_36px_96px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.14)]"
            >
              {resolvedPrograms.map((item, idx) => (
                <OpticalChamberLayer key={item.program.id} item={item} index={idx} progress={smoothProgress} />
              ))}

              {/* Razor-sharp glowing 1px optical shutter blades tracking each clip-path wipe seam */}
              <OpticalShutterBlade progress={smoothProgress} start={WIPE_12_START} end={WIPE_12_END} />
              <OpticalShutterBlade progress={smoothProgress} start={WIPE_23_START} end={WIPE_23_END} />
            </div>
          </div>
        </div>
      </div>

      {/* Right 6 Columns: Symmetrically Padded Chapters (18svh + 3×64svh + 18svh -> centers hit 50svh at p = 0, 0.5, 1) */}
      <div className="lg:col-span-6 py-[18svh]">
        {resolvedPrograms.map((item, idx) => (
          <ScrollChapterBeat
            key={item.program.id}
            item={item}
            index={idx}
            progress={smoothProgress}
            isJustAdded={addedProgramId === item.program.id}
            onAddProgram={onAddProgram}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
};

const SynergyAtelier: React.FC<SynergyAtelierProps> = ({
  products,
  addedProgramId,
  onAddProgram,
  onProductClick,
}) => {
  const tier = usePerformanceTier();
  const isMobile = useIsMobile();
  const useDesktopScrollStage = tier !== "low" && !isMobile;

  const resolvedPrograms = useMemo<ResolvedProgram[]>(
    () =>
      SYNERGY_PROGRAMS.map((program) => ({
        program,
        pair: program.productIds
          .map((id) => products.find((p) => p.id === id))
          .filter((p): p is DetailedProduct => Boolean(p)),
      })),
    [products],
  );

  return (
    <section
      data-synergy-atelier="true"
      className="relative w-full bg-[#03050a] overflow-x-clip"
    >
      {/* Seamless Luminous Transition Divider */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent z-20"
      />

      {/* Living Atmospheric Backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src={synergyAtelierImg}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center opacity-45"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(68% 54% at 28% 50%, rgba(14, 165, 233, 0.16) 0%, rgba(3, 5, 10, 0) 72%), radial-gradient(50% 42% at 80% 45%, rgba(30, 64, 175, 0.14) 0%, rgba(3, 5, 10, 0) 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #03050a 0%, rgba(3,5,10,0.56) 16%, rgba(3,5,10,0.62) 84%, #03050a 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-20 sm:pt-24 lg:pt-28 pb-16 lg:pb-12">
        {/* Clean Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 lg:pb-12 border-b border-white/[0.1]">
          <div className="space-y-3">
            <span className="typography-label text-cyan-400/90 block">Синергия формул · Проверенные пары</span>
            <h2 className="typography-h2 text-white">
              Когда две формулы работают{" "}
              <span className="font-light text-cyan-300">как один механизм</span>
            </h2>
          </div>
          <p className="typography-body text-slate-300 max-w-md">
            Готовые связки под три ключевые задачи — листайте вниз, чтобы рассмотреть каждый протокол в деталях.
          </p>
        </div>

        {/* Desktop (High/Med): Exact Y-Centered Optical Shutter Wipe */}
        {useDesktopScrollStage && (
          <DesktopScrollTrack
            resolvedPrograms={resolvedPrograms}
            addedProgramId={addedProgramId}
            onAddProgram={onAddProgram}
            onProductClick={onProductClick}
          />
        )}

        {/* Mobile / Touch / Low Tier: Clean Inline Luminous Dual-Bottle Cards */}
        <div className={`${useDesktopScrollStage ? "lg:hidden" : ""} grid grid-cols-1 gap-8 pt-10`}>
          {resolvedPrograms.map(({ program, pair }) => {
            const isJustAdded = addedProgramId === program.id;
            return (
              <article
                key={program.id}
                className="rounded-3xl border border-white/[0.11] bg-[#070f1f]/95 p-6 sm:p-8 space-y-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <span className="typography-mono text-xs text-cyan-300">Протокол {program.index}</span>
                    <h3 className="typography-h3 text-white mt-1">{program.title}</h3>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-heading text-lg font-semibold text-white tabular-nums block">
                      ≈ {formatRub(program.totalRub)}
                    </span>
                    <span className="typography-mono text-xs text-slate-400">{program.totalLp} LP</span>
                  </div>
                </div>

                {/* Inline Illuminated Bottle Pair (unified monochrome studio light) */}
                <div
                  className="rounded-2xl py-6 px-4 border border-white/[0.08] bg-[#060b15]"
                  style={{
                    backgroundImage:
                      "radial-gradient(ellipse 76% 62% at 50% 24%, rgba(186, 230, 253, 0.08) 0%, rgba(6, 11, 21, 0) 76%)",
                  }}
                >
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    {pair[0] && (
                      <button
                        type="button"
                        onClick={() => onProductClick(pair[0]!)}
                        className="text-center space-y-2 cursor-pointer"
                      >
                        <div className="relative h-28 flex items-center justify-center">
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-3 rounded-full"
                            style={{
                              backgroundImage:
                                "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.85) 0%, transparent 72%)",
                            }}
                          />
                          <img
                            src={pair[0].image}
                            alt={pair[0].name}
                            loading="lazy"
                            decoding="async"
                            className="relative z-10 max-h-full max-w-full object-contain"
                          />
                        </div>
                        <p className="text-xs font-medium text-white leading-snug">{pair[0].name}</p>
                      </button>
                    )}
                    <span className="font-heading text-xl font-light text-cyan-300">+</span>
                    {pair[1] && (
                      <button
                        type="button"
                        onClick={() => onProductClick(pair[1]!)}
                        className="text-center space-y-2 cursor-pointer"
                      >
                        <div className="relative h-28 flex items-center justify-center">
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-3 rounded-full"
                            style={{
                              backgroundImage:
                                "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.85) 0%, transparent 72%)",
                            }}
                          />
                          <img
                            src={pair[1].image}
                            alt={pair[1].name}
                            loading="lazy"
                            decoding="async"
                            className="relative z-10 max-h-full max-w-full object-contain"
                          />
                        </div>
                        <p className="text-xs font-medium text-white leading-snug">{pair[1].name}</p>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed text-pretty">{program.description}</p>

                <button
                  type="button"
                  onClick={() => onAddProgram(program.id, program.productIds)}
                  data-add-program={program.id}
                  className={`w-full sm:w-auto h-11 px-6 rounded-full inline-flex items-center justify-center gap-2 text-sm font-semibold transition-colors active:scale-95 cursor-pointer ${
                    isJustAdded
                      ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/65"
                      : "border border-white/[0.18] hover:border-cyan-400/65 bg-white/[0.04] text-white"
                  }`}
                >
                  {isJustAdded ? (
                    <>
                      <Icons.Check className="w-4 h-4 text-cyan-300" />
                      <span>Пара добавлена в список</span>
                    </>
                  ) : (
                    <>
                      <Icons.Plus className="w-4 h-4 text-cyan-300" />
                      <span>Добавить пару · ≈ {formatRub(program.totalRub)}</span>
                    </>
                  )}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default React.memo(SynergyAtelier);
