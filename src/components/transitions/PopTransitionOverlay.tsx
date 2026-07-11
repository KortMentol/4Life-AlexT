import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface PopTransitionOverlayProps {
  isActive: boolean;
}

const PopTransitionOverlay: React.FC<PopTransitionOverlayProps> = ({ isActive }) => {
  const tier = usePerformanceTier();
  const isLow = tier === "low";

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[2147483647] pointer-events-none"
          style={{
            background: isLow ? "#03050a" : "rgba(3, 5, 10, 0.98)",
            backdropFilter: isLow ? "none" : "blur(24px) saturate(1.2)",
            WebkitBackdropFilter: isLow ? "none" : "blur(24px) saturate(1.2)",
            willChange: "opacity",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
          // Экран мгновенно становится черным/матовым
          initial={{ opacity: 1 }}
          animate={{ opacity: 1, transition: { duration: 0 } }}
          // Дорогое, плавное растворение
          exit={{
            opacity: 0,
            transition: {
              duration: 0.85,
              ease: [0.32, 0.72, 0, 1],
            },
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default PopTransitionOverlay;
