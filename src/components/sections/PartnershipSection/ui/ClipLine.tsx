/**
 * @module PartnershipSection/ui/ClipLine.tsx
 * Clip-reveal анимация строки текста.
 * Используется в Portal, Science, Model, Economics, Invitation.
 *
 * once: false + margin "-20%" — анимация повторяется при возврате,
 * но сбрасывается только когда элемент полностью ушёл за экран.
 * Паттерн Awwwards: subtle reveal при каждом проходе.
 */

import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import { motion, useInView } from "framer-motion";
import { memo, useRef } from "react";

interface ClipLineProps {
  children: React.ReactNode;
  delay?: number;
  tier: PerformanceTier;
  className?: string;
}

const ClipLine = memo(
  ({ children, delay = 0, tier, className }: ClipLineProps) => {
    const ref = useRef<HTMLDivElement>(null);
    // once: false — анимация повторяется при каждом входе в viewport
    // margin — триггер чуть раньше появления, сброс когда ушёл за экран
    const inView = useInView(ref, { once: false, margin: "-15% 0px -15% 0px" });

    return (
      <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
        <motion.div
          initial={tier !== "low" ? { y: "105%", opacity: 0 } : { opacity: 1 }}
          animate={
            tier !== "low"
              ? inView
                ? { y: "0%", opacity: 1 }
                : { y: "105%", opacity: 0 }
              : { opacity: 1 }
          }
          transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </div>
    );
  },
);

ClipLine.displayName = "ClipLine";

export default ClipLine;
