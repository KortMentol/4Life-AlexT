/**
 * @module src/components/ui/OpticalSurface.tsx
 * @description 2026+ GPU-only specular anodized obsidian glass surface.
 * Pointer-tracked hairline rim light & caustic sheen driven strictly via CSS custom properties
 * (--mx, --my) on direct DOM mutation — zero React setState on pointermove.
 * Adapts cleanly across High / Medium / Low tiers and fine-pointer vs touch devices.
 */

import { usePerformanceTier } from "@/hooks";
import React, { useCallback, useEffect, useRef } from "react";

export type OpticalAccent = "cyan" | "gold" | "blue";

interface OpticalSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: OpticalAccent;
  /** Enables subtle ±2deg magnetic optical plane tilt on High-tier desktop only */
  tilt?: boolean;
  /** Optional inner padding/layout classes */
  className?: string;
  children: React.ReactNode;
}

const ACCENT_MAP: Record<OpticalAccent, { border: string; sheen: string; topEdge: string }> = {
  cyan: {
    border: "rgba(34, 211, 238, 0.55)",
    sheen: "rgba(6, 182, 212, 0.13)",
    topEdge: "rgba(34, 211, 238, 0.28)",
  },
  gold: {
    border: "rgba(185, 151, 74, 0.62)",
    sheen: "rgba(185, 151, 74, 0.14)",
    topEdge: "rgba(185, 151, 74, 0.32)",
  },
  blue: {
    border: "rgba(59, 130, 246, 0.58)",
    sheen: "rgba(22, 68, 248, 0.16)",
    topEdge: "rgba(96, 165, 250, 0.28)",
  },
};

export const OpticalSurface: React.FC<OpticalSurfaceProps> = ({
  accent = "cyan",
  tilt = false,
  className = "",
  children,
  style,
  ...rest
}) => {
  const tier = usePerformanceTier();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const canTrackPointerRef = useRef(false);
  const prefersReducedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    canTrackPointerRef.current = finePointer && !reduced && tier !== "low";
    prefersReducedRef.current = reduced;
  }, [tier]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!canTrackPointerRef.current) return;
      const el = surfaceRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      el.style.setProperty("--mx", `${x.toFixed(1)}px`);
      el.style.setProperty("--my", `${y.toFixed(1)}px`);
      el.style.setProperty("--m-alpha", "1");

      if (tilt && tier === "high" && !prefersReducedRef.current && rect.width > 0 && rect.height > 0) {
        const nx = (x / rect.width - 0.5) * 2;
        const ny = (y / rect.height - 0.5) * 2;
        const rotY = nx * 2.2;
        const rotX = -ny * 2.2;
        el.style.transform = `perspective(1100px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translate3d(0, -2px, 0)`;
      }
    },
    [tilt, tier],
  );

  const handlePointerLeave = useCallback(() => {
    const el = surfaceRef.current;
    if (!el) return;
    el.style.setProperty("--m-alpha", "0");
    if (tilt) {
      el.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)";
    }
  }, [tilt]);

  const palette = ACCENT_MAP[accent];
  const isLow = tier === "low";

  return (
    <div
      ref={surfaceRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative overflow-hidden bg-[#050811] border border-white/[0.08] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.985] ${className}`}
      style={
        {
          "--mx": "50%",
          "--my": "0%",
          "--m-alpha": "0",
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      {/* Static top optical hairline edge (present on ALL tiers including Low Tier for Swiss luxury depth) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px z-10"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent 8%, ${palette.topEdge} 50%, transparent 92%)`,
        }}
      />

      {/* Pointer-tracked internal optical sheen (medium & high desktop only, zero repaint via opacity) */}
      {!isLow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            opacity: "var(--m-alpha)",
            backgroundImage: `radial-gradient(360px circle at var(--mx) var(--my), ${palette.sheen}, transparent 68%)`,
          }}
        />
      )}

      {/* Pointer-tracked razor specular border rim (medium & high desktop only) */}
      {!isLow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: "var(--m-alpha)",
            padding: "1px",
            backgroundImage: `radial-gradient(240px circle at var(--mx) var(--my), ${palette.border}, transparent 65%)`,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      )}

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

export default React.memo(OpticalSurface);
