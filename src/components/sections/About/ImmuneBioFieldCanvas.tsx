/**
 * @module src/components/sections/About/ImmuneBioFieldCanvas.tsx
 * @description Tier-aware 270px Canvas 2D Cellular Bio-Field visualizing the 3 Transfer Factor immune phases:
 *  - Phase 0 (01 — Распознавание): expanding circular cyan sonar pulses + perimeter detection nodes.
 *  - Phase 1 (02 — Точный отклик): rapid convergence around 3 luminous target clusters with bright filaments (+437% NK).
 *  - Phase 2 (03 — Баланс и память): calm breathing hexagonal homeostasis lattice.
 *
 * Tier Discipline:
 *  - High desktop: 40 nodes, dpr <= 2, cursor attraction/repulsion physics.
 *  - Medium desktop & High/Medium touch: 20 nodes, dpr = 1, touch skips pointer repulsion.
 *  - Low tier or prefers-reduced-motion: returns ZERO canvas (renders crisp luminous static SVG).
 *  - Strict IntersectionObserver pause when off-screen + full RAF cleanup on unmount.
 */

import { usePerformanceTier } from "@/hooks";
import React, { useEffect, useRef } from "react";

interface ImmuneBioFieldCanvasProps {
  activePhase: number;
}

interface BioNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phaseOffset: number;
  clusterIndex: number;
}

const PHASE_META = [
  { code: "PHASE 01 • SONAR RECOGNITION", label: "Индукторный импульс распознавания" },
  { code: "PHASE 02 • TARGETED NK FOCUS", label: "Фокусировка отклика (до +437% активности NK-клеток)" },
  { code: "PHASE 03 • HEX HOMEOSTASIS", label: "Гексагональное равновесие и клеточная память" },
] as const;

const StaticLowTierDiagram: React.FC<{ activePhase: number }> = ({ activePhase }) => {
  const meta = PHASE_META[activePhase] ?? PHASE_META[0]!;
  return (
    <div
      data-biofield-mode="static-svg"
      className="relative w-full h-[240px] sm:h-[270px] rounded-[1.5rem] bg-[#040812] border border-cyan-400/20 overflow-hidden flex items-center justify-center"
    >
      <svg viewBox="0 0 900 270" className="w-full h-full" role="img" aria-label={meta.label}>
        <defs>
          <radialGradient id="bioStaticGlow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.26)" />
            <stop offset="60%" stopColor="rgba(6,182,212,0.08)" />
            <stop offset="100%" stopColor="rgba(3,5,10,0)" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="900" height="270" fill="url(#bioStaticGlow)" />
        {activePhase === 0 && (
          <g stroke="rgba(103,232,249,0.52)" fill="none" strokeWidth="1.4">
            <circle cx="450" cy="135" r="42" />
            <circle cx="450" cy="135" r="88" strokeDasharray="5 7" />
            <circle cx="450" cy="135" r="126" strokeOpacity="0.34" />
            <circle cx="450" cy="135" r="6.5" fill="#67e8f9" stroke="none" />
          </g>
        )}
        {activePhase === 1 && (
          <g>
            {[230, 450, 670].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy="135" r="44" fill="rgba(34,211,238,0.12)" stroke="rgba(103,232,249,0.62)" strokeWidth="1.4" />
                <circle cx={cx} cy="135" r="7" fill="#a5f3fc" />
              </g>
            ))}
            <line x1="230" y1="135" x2="670" y2="135" stroke="rgba(103,232,249,0.55)" strokeWidth="1.6" />
          </g>
        )}
        {activePhase === 2 && (
          <g stroke="rgba(103,232,249,0.58)" fill="none" strokeWidth="1.4">
            <polygon points="450,60 515,97 515,173 450,210 385,173 385,97" fill="rgba(34,211,238,0.1)" />
            <polygon points="320,97 385,135 385,173 320,210 255,173 255,135" strokeOpacity="0.4" />
            <polygon points="580,97 645,135 645,173 580,210 515,173 515,135" strokeOpacity="0.4" />
            <circle cx="450" cy="135" r="5.5" fill="#67e8f9" stroke="none" />
          </g>
        )}
      </svg>
      <div className="absolute top-4 left-5 right-5 flex items-center justify-between pointer-events-none">
        <span className="typography-mono text-[10px] tracking-[0.2em] text-cyan-300">{meta.code}</span>
        <span className="typography-mono text-[10px] text-slate-300 hidden sm:inline">{meta.label}</span>
      </div>
    </div>
  );
};

export const ImmuneBioFieldCanvas: React.FC<ImmuneBioFieldCanvasProps> = ({ activePhase }) => {
  const tier = usePerformanceTier();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activePhaseRef = useRef<number>(activePhase);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    activePhaseRef.current = activePhase;
  }, [activePhase]);

  const isTouchDevice =
    typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isLow = tier === "low" || prefersReduced;

  useEffect(() => {
    if (isLow) return;
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isHighDesktop = tier === "high" && !isTouchDevice;
    const nodeCount = isHighDesktop ? 40 : 20;
    const dpr = isHighDesktop ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    let width = wrapper.clientWidth || 900;
    let height = wrapper.clientHeight || 270;

    const resize = () => {
      width = Math.max(280, wrapper.clientWidth);
      height = Math.max(240, wrapper.clientHeight || 270);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };
    resize();

    const nodes: BioNode[] = Array.from({ length: nodeCount }, (_, idx) => ({
      x: (idx + 0.5) * (width / nodeCount),
      y: height * 0.22 + ((idx * 57) % Math.round(height * 0.56)),
      vx: Math.sin(idx * 1.9) * 0.45,
      vy: Math.cos(idx * 2.3) * 0.45,
      radius: isHighDesktop ? 2.5 + (idx % 3) * 0.85 : 2.5 + (idx % 2) * 0.7,
      phaseOffset: idx * 0.42,
      clusterIndex: idx % 3,
    }));

    let rafId: number | null = null;
    let isVisible = false;
    let time = 0;

    const drawFrame = () => {
      if (!isVisible) {
        rafId = null;
        return;
      }

      time += 0.016;
      const phase = activePhaseRef.current;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Luminous central optical glow against deep #040812 laboratory chamber
      const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.5, 12, width * 0.5, height * 0.5, width * 0.56);
      bgGrad.addColorStop(0, phase === 1 ? "rgba(34, 211, 238, 0.22)" : "rgba(6, 182, 212, 0.16)");
      bgGrad.addColorStop(0.6, "rgba(14, 116, 144, 0.06)");
      bgGrad.addColorStop(1, "rgba(3, 5, 10, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;

      // Subtle horizontal optical calibration hairline
      ctx.beginPath();
      ctx.moveTo(28, cy);
      ctx.lineTo(width - 28, cy);
      ctx.strokeStyle = "rgba(103, 232, 249, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Phase 0: Expanding circular cyan sonar pulse rings
      if (phase === 0) {
        for (let r = 0; r < 3; r++) {
          const p = (time * 0.38 + r / 3) % 1;
          const radius = 20 + p * Math.min(width * 0.36, 260);
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(103, 232, 249, ${(1 - p) * 0.52})`;
          ctx.lineWidth = 1.45;
          ctx.stroke();
        }
      }

      // Compute phase target positions and step physics
      const clusters = [
        { x: width * 0.24, y: cy },
        { x: width * 0.5, y: cy },
        { x: width * 0.76, y: cy },
      ] as const;

      const hexCols = Math.max(6, Math.round(Math.sqrt(nodeCount * 2.2)));
      const hexSpacingX = (width * 0.76) / Math.max(1, hexCols - 1);
      const hexStartX = width * 0.12;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]!;
        let tx = cx;
        let ty = cy;

        if (phase === 0) {
          const angle = (i / nodes.length) * Math.PI * 2 + time * 0.26;
          const ringR = 58 + (i % 3) * 38 + Math.sin(time * 1.4 + n.phaseOffset) * 10;
          tx = cx + Math.cos(angle) * ringR * (width > 640 ? 2.15 : 1.25);
          ty = cy + Math.sin(angle) * ringR * 0.78;
        } else if (phase === 1) {
          const cluster = clusters[n.clusterIndex] ?? clusters[1]!;
          const localAngle = time * 1.15 + n.phaseOffset * 2.1;
          const localR = 16 + (i % 5) * 10;
          tx = cluster.x + Math.cos(localAngle) * localR * 1.35;
          ty = cluster.y + Math.sin(localAngle) * localR * 1.1;
        } else {
          const col = i % hexCols;
          const row = Math.floor(i / hexCols);
          const totalRows = Math.ceil(nodes.length / hexCols);
          const breath = 1 + Math.sin(time * 1.1 + col * 0.35) * 0.06;
          const baseX = hexStartX + col * hexSpacingX + (row % 2 === 1 ? hexSpacingX * 0.45 : 0);
          const baseY = cy + (row - (totalRows - 1) / 2) * 52;
          tx = cx + (baseX - cx) * breath;
          ty = cy + (baseY - cy) * breath;
        }

        const stiffness = phase === 1 ? 0.085 : 0.045;
        n.vx = (n.vx + (tx - n.x) * stiffness) * 0.84;
        n.vy = (n.vy + (ty - n.y) * stiffness) * 0.84;

        // Desktop cursor physics (gentle repulsion / optical wake)
        if (isHighDesktop && pointerRef.current.active) {
          const dx = n.x - pointerRef.current.x;
          const dy = n.y - pointerRef.current.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 4 && distSq < 130 * 130) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 130) * 2.0;
            n.vx += (dx / dist) * force;
            n.vy += (dy / dist) * force;
          }
        }

        n.x += n.vx;
        n.y += n.vy;
      }

      // Draw dynamic connecting bio-filaments with crisp visibility
      const maxLinkDist = phase === 1 ? 128 : phase === 2 ? 142 : 132;
      const maxLinkDistSq = maxLinkDist * maxLinkDist;
      ctx.lineWidth = phase === 1 ? 1.35 : 1.1;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]!;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxLinkDistSq) {
            const alpha = (1 - Math.sqrt(distSq) / maxLinkDist) * (phase === 1 ? 0.64 : 0.46);
            ctx.strokeStyle =
              phase === 1 ? `rgba(165, 243, 252, ${alpha.toFixed(3)})` : `rgba(34, 211, 238, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Phase 1 cluster core halos
      if (phase === 1) {
        for (const c of clusters) {
          ctx.beginPath();
          ctx.arc(c.x, c.y, 20 + Math.sin(time * 3) * 4, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(165, 243, 252, 0.52)";
          ctx.lineWidth = 1.25;
          ctx.stroke();
        }
      }

      // Draw luminous bio-nodes + soft optical core
      for (const n of nodes) {
        const pulse = 0.72 + Math.sin(time * 2.2 + n.phaseOffset) * 0.28;
        const r = n.radius * (phase === 1 ? 1.2 : 1.05);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${(0.14 + pulse * 0.14).toFixed(2)})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(207, 250, 254, ${(0.72 + pulse * 0.28).toFixed(2)})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(drawFrame);
    };

    const startLoop = () => {
      if (rafId === null && isVisible) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = Boolean(entry?.isIntersecting);
        if (isVisible) {
          startLoop();
        } else if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(wrapper);
    window.addEventListener("resize", resize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isLow, tier, isTouchDevice]);

  if (isLow) {
    return <StaticLowTierDiagram activePhase={activePhase} />;
  }

  const meta = PHASE_META[activePhase] ?? PHASE_META[0]!;

  return (
    <div
      ref={wrapperRef}
      data-biofield-mode="canvas-2d"
      onPointerMove={(e) => {
        if (isTouchDevice) return;
        const rect = wrapperRef.current?.getBoundingClientRect();
        if (!rect) return;
        pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false;
      }}
      className="relative w-full h-[240px] sm:h-[270px] rounded-[1.5rem] bg-[#040812] border border-cyan-400/20 overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block" aria-label={meta.label} />
      <div className="absolute top-4 left-5 right-5 flex items-center justify-between pointer-events-none">
        <span className="typography-mono text-[10px] tracking-[0.2em] text-cyan-300">{meta.code}</span>
        <span className="typography-mono text-[10px] text-slate-300 hidden sm:inline">{meta.label}</span>
      </div>
    </div>
  );
};

export default React.memo(ImmuneBioFieldCanvas);
