import React from "react";
import { type SharedProps } from "./types";

// Орбы убраны — filter:blur() вызывал GPU paint каждый кадр при скролле.
// Заменены на статичный CSS gradient — 0 JS, 0 paint, compositor-only.
const GradientMeshBackground: React.FC<SharedProps> = ({ isDark }) => {
  return (
    <div className="absolute inset-0">
      {/* Статичный градиент — чистый CSS, 0 нагрузки */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(to bottom, #020617, #0f172a, #020617)"
            : "linear-gradient(to bottom, #e8f0fe, #f0f4ff, #e8f0fe)",
        }}
      />
      {/* Fade-out снизу */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent, ${isDark ? "#020617" : "#e8f0fe"})`,
        }}
      />
    </div>
  );
};

export default React.memo(GradientMeshBackground);
