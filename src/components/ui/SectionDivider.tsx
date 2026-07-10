/**
 * @module SectionDivider
 * @description Gradient bridge between adjacent sections.
 * Compositor-only — pure CSS, 0 JS, 0 FPS cost.
 * Height is fluid-ready and backward-compatible.
 */

import React from "react";

interface SectionDividerProps {
  /** Color at the solid end in dark mode */
  toColorDark?: string;
  /** Height of the divider. Can be a number (pixels) or a fluid CSS string (e.g., clamp()) */
  height?: number | string;
  /** 'up' = fade from transparent to color. 'down' = fade from color to transparent. */
  direction?: "up" | "down";
  className?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({
  toColorDark = "#030712",
  height = "clamp(60px, 8vw, 120px)", // Fluid by default: scales between 60px and 120px
  direction = "up",
  className = "",
}) => {
  const isUp = direction === "up";
  const finalHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`relative pointer-events-none ${className}`}
      style={{
        height: finalHeight,
        marginTop: isUp ? `calc(-1 * ${finalHeight})` : 0,
        marginBottom: isUp ? 0 : `calc(-1 * ${finalHeight})`,
        zIndex: 10,
      }}
      aria-hidden="true"
    >
      {/* Dark theme — Always active */}
      <div
        className="absolute inset-0"
        style={{
          background: isUp
            ? `linear-gradient(to bottom, transparent, ${toColorDark})`
            : `linear-gradient(to bottom, ${toColorDark}, transparent)`,
        }}
      />
    </div>
  );
};

export default React.memo(SectionDivider);
