// src/components/transitions/PopTransitionOverlay.tsx
// AWWWARDS 2026 — ETHEREAL TRANSITION VEIL
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface PopTransitionOverlayProps {
  isActive: boolean;
}

/**
 * Immersive Garden 2026 inspired transition overlay
 * Features: Adaptive performance tiers, ethereal gradients, buttery smooth 120fps
 * Color analysis: Futuristic health supplement site with cyan/blue accents
 */
const PopTransitionOverlay: React.FC<PopTransitionOverlayProps> = ({ isActive }) => {
  const performanceTier = usePerformanceTier();

  // Производительность по тирам
  const getVeilConfig = () => {
    switch (performanceTier) {
      case "high":
        return {
          // HIGH: Полная красота - комплексные градиенты + backdrop-filter
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, 
              rgba(0, 212, 255, 0.15) 0%, 
              rgba(59, 130, 246, 0.12) 25%,
              rgba(147, 51, 234, 0.08) 50%,
              rgba(30, 41, 59, 0.95) 75%,
              rgba(15, 23, 42, 0.98) 100%
            ),
            linear-gradient(135deg,
              rgba(0, 212, 255, 0.05) 0%,
              transparent 30%,
              rgba(59, 130, 246, 0.03) 70%,
              transparent 100%
            )
          `,
          backdropFilter: "blur(12px) saturate(1.2) brightness(0.95)",
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1] // Organic Immersive Garden easing
        };
      
      case "medium":
        return {
          // MEDIUM: Баланс - простой градиент + легкий blur
          background: `
            radial-gradient(ellipse 70% 40% at 50% 0%, 
              rgba(59, 130, 246, 0.08) 0%,
              rgba(30, 41, 59, 0.92) 60%,
              rgba(15, 23, 42, 0.96) 100%
            )
          `,
          backdropFilter: "blur(6px) saturate(1.1)",
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94] // Smooth but faster
        };
      
      case "low":
      default:
        return {
          // LOW: Минимально - только сплошной цвет
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "none",
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1] // Fast and efficient
        };
    }
  };

  const config = getVeilConfig();

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[99999] pointer-events-none"
          style={{
            background: config.background,
            backdropFilter: config.backdropFilter,
            WebkitBackdropFilter: config.backdropFilter,
            willChange: "opacity",
            contain: "layout style paint",
            // Оптимизация GPU слоев
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            isolation: "isolate"
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: config.duration,
              ease: config.ease
            }
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default PopTransitionOverlay;
