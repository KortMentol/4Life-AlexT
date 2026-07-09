/**
 * @module src/components/ui/CustomCursor.tsx
 * @description Global fixed premium cursor.
 * High/Medium Tier: Smoked Obsidian Glass (no backdrop-filter).
 * Low Tier: Solid color (Performance safe).
 * Tactile feedback: spring shrink (scale 0.85) on mousedown.
 *
 * FIX (Awwwards 2026): Реализован ручной Raycasting (elementFromPoint)
 * внутри RAF-цикла для преодоления бага браузеров, которые отключают
 * события hover/mouseenter во время скролла колесом.
 * @author Kort
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
    // На тач-устройствах курсор не нужен вообще (Hardware protection)
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    const onMove = (e: MouseEvent) => {
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      checkHitTarget(); // Мгновенная проверка при движении мыши
    };

    const onDown = () => setIsClicked(true);
    const onUp = () => setIsClicked(false);

    // Функция ручного определения цели под курсором
    const checkHitTarget = () => {
      const { x, y } = lastMousePos.current;
      if (x < 0 || y < 0) return;

      // Получаем элемент, над которым сейчас находится курсор
      const el = document.elementFromPoint(x, y);

      // Ищем класс-триггер вверх по дереву
      const isOverVideo = !!el?.closest(".video-cursor-target");

      if (activeRef.current !== isOverVideo) {
        activeRef.current = isOverVideo;
        setActive(isOverVideo);
      }
    };

    let frameCount = 0;
    // Подписываемся на скролл, чтобы отслеживать проплывающие под курсором элементы
    const onRaf = () => {
      frameCount++;
      // Троттлинг: проверяем только каждый 3-й кадр (~20 раз в секунду).
      // Этого достаточно для идеальной плавности, но экономит 66% времени CPU,
      // предотвращая layout thrashing во время скролла.
      if (frameCount % 3 === 0) {
        checkHitTarget();
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    const unsubRaf = rafLoop.subscribe(onRaf);

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
