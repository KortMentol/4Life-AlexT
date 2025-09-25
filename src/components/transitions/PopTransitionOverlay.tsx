// src/components/transitions/PopTransitionOverlay.tsx
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface PopTransitionOverlayProps {
  isActive: boolean;
}

const PopTransitionOverlay: React.FC<PopTransitionOverlayProps> = ({ isActive }) => {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[99999] bg-[#0f172a] pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { 
              duration: 0.5, 
              ease: [0.16, 1, 0.3, 1] // Immersive Garden signature easing
            }
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default PopTransitionOverlay;
