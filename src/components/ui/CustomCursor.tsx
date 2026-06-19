/**
 * @module src/components/ui/CustomCursor.tsx
 * @description Global fixed premium cursor.
 * High/Medium Tier: Smoked Obsidian Glass (no backdrop-filter).
 * Low Tier: Solid color (Performance safe).
 * Tactile feedback: spring shrink (scale 0.85) on mousedown.
 * @author Kort
 */

import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { motion, useMotionValue, useSpring } from "framer-motion";
import React, { useEffect, useState } from "react";

export const CustomCursor: React.FC = () => {
  const [active, setActive] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const tier = usePerformanceTier();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 800, damping: 35, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 800, damping: 35, mass: 0.5 });

  useEffect(() => {
    // На тач-устройствах курсор не нужен вообще
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onDown = () => setIsClicked(true);
    const onUp = () => setIsClicked(false);

    const onEnter = () => setActive(true);
    const onLeave = () => setActive(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("video-cursor-enter", onEnter);
    window.addEventListener("video-cursor-leave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("video-cursor-enter", onEnter);
      window.removeEventListener("video-cursor-leave", onLeave);
    };
  }, [mouseX, mouseY]);

  const cursorScale = active ? (isClicked ? 0.85 : 1) : 0;

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 z-[150] pointer-events-none flex items-center justify-center"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: cursorScale, opacity: active ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
        className={[
          "w-24 h-24 rounded-full flex items-center justify-center border shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
          // Clean hardware-friendly Smoked Obsidian Glass (0% backdrop-filter overhead)
          tier === "low"
            ? "bg-[#0b0f19]/95 border-cyan-500/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
            : "bg-[#080d18]/90 border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]",
        ].join(" ")}
      >
        <span
          className="text-white text-[10px] font-bold uppercase tracking-[0.2em] select-none"
          style={{ textShadow: "0 2px 6px rgba(0,0,0,0.8)" }}
        >
          Смотреть
        </span>
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;
