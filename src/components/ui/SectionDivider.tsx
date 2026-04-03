/**
 * @module SectionDivider
 * @description Gradient bridge between adjacent sections.
 * Compositor-only — pure CSS, 0 JS, 0 FPS cost.
 * direction='up'   → transparent → color (наплывает снизу вверх, marginTop: -height)
 * direction='down' → color → transparent (наплывает сверху вниз, marginBottom: -height)
 */

import React from "react";

interface SectionDividerProps {
  /** Color at the solid end of the fade */
  toColor?: string;
  /** Color at the solid end in dark mode */
  toColorDark?: string;
  height?: number;
  /** 'up' = fade from transparent to color (default). 'down' = fade from color to transparent. */
  direction?: "up" | "down";
  className?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({
  toColor = "#f9fafb",
  toColorDark = "#030712",
  height = 120,
  direction = "up",
  className = "",
}) => {
  const isUp = direction === "up";

  return (
    <div
      className={`relative pointer-events-none ${className}`}
      style={{
        height,
        marginTop: isUp ? -height : 0,
        marginBottom: isUp ? 0 : -height,
        zIndex: 10,
      }}
      aria-hidden="true"
    >
      {/* Light theme */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background: isUp
            ? `linear-gradient(to bottom, transparent, ${toColor})`
            : `linear-gradient(to bottom, ${toColor}, transparent)`,
        }}
      />
      {/* Dark theme */}
      <div
        className="absolute inset-0 hidden dark:block"
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
