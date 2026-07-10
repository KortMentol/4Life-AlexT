/**
 * @module src/components/ui/CustomCursor.tsx
 * @description Глобальный фиксированный премиум-курсор.
 *
 * @author Senior Staff Frontend Engineer
 * @version 2.1.1
 */

import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { rafLoop } from "@/lib/rafLoop";
import { motion, useMotionValue, useSpring } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const CustomCursor: React.FC = () => {
  const [active, setActive] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const tier = usePerformanceTier();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 800, damping: 35, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 800, damping: 35, mass: 0.5 });

  const activeRef = useRef(false);
  const lastMousePos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    let isMouseMoving = false;
    let isPageScrolling = false;
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;

    const onMove = (e: MouseEvent) => {
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      isMouseMoving = true;
    };

    const onDown = () => setIsClicked(true);
    const onUp = () => setIsClicked(false);

    const checkHitTarget = () => {
      const { x, y } = lastMousePos.current;
      if (x < 0 || y < 0) return;

      const el = document.elementFromPoint(x, y);
      const isOverVideo = !!el?.closest(".video-cursor-target");

      if (activeRef.current !== isOverVideo) {
        activeRef.current = isOverVideo;
        setActive(isOverVideo);
      }
    };

    let frameCount = 0;
    const onTick = () => {
      // Исполняем лучевое сканирование только при наличии физического изменения координат (0% CPU в простое)
      if (isMouseMoving || isPageScrolling) {
        frameCount++;
        if (frameCount % 3 === 0) {
          checkHitTarget();
          isMouseMoving = false;
          isPageScrolling = false;
        }
      }
    };

    const unsubRaf = rafLoop.subscribe((currentScrollY) => {
      if (currentScrollY !== lastScrollY) {
        isPageScrolling = true;
        lastScrollY = currentScrollY;
      }
      onTick();
    });

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      unsubRaf();
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
        willChange: active ? "transform" : "auto",
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: cursorScale, opacity: active ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
        className={[
          "w-24 h-24 rounded-full flex items-center justify-center border shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
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
