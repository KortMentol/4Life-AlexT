import React, { useMemo } from "react";
import { IS_TOUCH, type PerformanceTier } from "./types";

interface Props {
  tier: PerformanceTier;
  isDark: boolean;
}

// Pure CSS particles — 0 JS on main thread, compositor-only
// Framer Motion animate убран — заменён на CSS @keyframes
const FloatingParticles: React.FC<Props> = ({ tier, isDark }) => {
  const particles = useMemo(() => {
    if (tier !== "high" || IS_TOUCH) return [];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 25,
      delay: -(Math.random() * 8), // negative delay = already mid-animation on mount
    }));
  }, [tier]);

  if (particles.length === 0) return null;

  const color = isDark ? "rgba(6, 182, 212, 0.2)" : "rgba(6, 182, 212, 0.3)";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: color,
            // Pure CSS animation — compositor-only, 0 JS
            animation: `particle-float ${p.duration}s ${p.delay}s ease-in-out infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* Keyframes injected once via style tag */}
      <style>{`
        @keyframes particle-float {
          0%, 100% { transform: translateY(0px); opacity: 0.15; }
          50% { transform: translateY(-25px); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default React.memo(FloatingParticles);
