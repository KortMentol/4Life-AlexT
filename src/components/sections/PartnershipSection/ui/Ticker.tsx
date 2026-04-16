/**
 * @module PartnershipSection/ui/Ticker.tsx
 * Бегущая строка со статистикой.
 * На low tier — статичная, без анимации.
 */

import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import { motion } from "framer-motion";
import { memo, useMemo } from "react";
import type { Palette } from "../constants";
import { TICKER_ITEMS } from "../constants";

interface TickerProps {
  tier: PerformanceTier;
  palette: Palette;
}

const Ticker = memo(({ tier, palette }: TickerProps) => {
  // Дублируем массив для бесшовного loop
  const items = useMemo(() => [...TICKER_ITEMS, ...TICKER_ITEMS], []);

  return (
    <div
      className="overflow-hidden w-full py-5"
      style={{
        borderTop: `1px solid ${palette.overlay10}`,
        borderBottom: `1px solid ${palette.overlay10}`,
      }}
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={tier !== "low" ? { x: [0, "-50%"] } : {}}
        transition={{
          x: {
            duration: tier === "high" ? 22 : 28,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center text-xs font-medium uppercase tracking-[0.22em] px-10"
            style={{ color: i % 2 === 0 ? palette.overlay40 : palette.gold }}
          >
            {item}
            <span className="ml-10 w-1 h-1 rounded-full inline-block" style={{ background: palette.overlay20 }} />
          </span>
        ))}
      </motion.div>
    </div>
  );
});

Ticker.displayName = "Ticker";

export default Ticker;
