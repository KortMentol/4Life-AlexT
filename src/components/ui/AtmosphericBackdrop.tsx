/**
 * @module src/components/ui/AtmosphericBackdrop.tsx
 * @description Tier-safe luminous deep-space / biotech obsidian backdrop for internal pages (Pages 2–7).
 * Replaces flat dead #03050a voids with calibrated multi-stop radial caustics and hairline Swiss coordinates.
 * Zero CSS filter: blur(), zero WebGL/Canvas — guaranteed 60–240 FPS across Low / Medium / High tiers.
 */

import React from "react";

interface AtmosphericBackdropProps {
  variant?: "cyan" | "gold";
}

export const AtmosphericBackdrop: React.FC<AtmosphericBackdropProps> = ({ variant = "cyan" }) => {
  const isGold = variant === "gold";

  return (
    <div
      aria-hidden="true"
      data-atmospheric-backdrop={variant}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      style={{
        backgroundColor: "#03050a",
        backgroundImage: isGold
          ? [
              "radial-gradient(ellipse 72% 48% at 18% 12%, rgba(201, 166, 89, 0.11) 0%, rgba(201, 166, 89, 0.03) 44%, transparent 72%)",
              "radial-gradient(ellipse 68% 52% at 84% 38%, rgba(22, 68, 248, 0.085) 0%, rgba(12, 32, 88, 0.03) 48%, transparent 74%)",
              "radial-gradient(ellipse 75% 50% at 32% 86%, rgba(185, 151, 74, 0.085) 0%, transparent 70%)",
              "linear-gradient(180deg, #04070e 0%, #050a14 52%, #03050a 100%)",
            ].join(", ")
          : [
              "radial-gradient(ellipse 78% 52% at 16% 10%, rgba(6, 182, 212, 0.12) 0%, rgba(6, 78, 108, 0.045) 45%, transparent 72%)",
              "radial-gradient(ellipse 64% 48% at 86% 36%, rgba(14, 116, 144, 0.11) 0%, rgba(4, 27, 43, 0.05) 48%, transparent 74%)",
              "radial-gradient(ellipse 72% 48% at 45% 88%, rgba(6, 182, 212, 0.075) 0%, transparent 68%)",
              "linear-gradient(180deg, #04070d 0%, #05111b 48%, #03050a 100%)",
            ].join(", "),
      }}
    >
      {/* Subtle Swiss Architectural Coordinate Hairlines */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          maskImage: "radial-gradient(ellipse 85% 75% at 50% 35%, #000 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 35%, #000 0%, transparent 80%)",
        }}
      />
    </div>
  );
};

export default React.memo(AtmosphericBackdrop);
