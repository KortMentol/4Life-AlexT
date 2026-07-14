/**
 * @module PartnershipSection/ui/Ticker.tsx
 * Бесшовная бегущая строка рангов.
 * ИСПРАВЛЕНИЯ (Awwwards 2026):
 * 1. [Mobile Scale]: Добавлена сверхкомпактная адаптивная типографика (text-[8px] md:text-xs),
 *    что позволяет тикеру уйти в глубину фона на телефонах.
 * 2. [Group Hover Pause]: Триггер паузы перенесен на весь контейнер (group).
 * 3. [Premium Speed]: Длительность анимации увеличена до 60 секунд для дорогого восприятия.
 * @author Geminis AI & Kort
 * @version 3.0.0
 */

import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import React, { memo, useMemo } from "react";
import type { Palette } from "../constants";
import { TICKER_ITEMS } from "../constants";

interface TickerProps {
  tier: PerformanceTier;
  palette: Palette;
}

const Diamond = ({ color }: { color: string }) => (
  <svg
    viewBox="0 0 6 6"
    fill={color}
    aria-hidden="true"
    className="flex-shrink-0 w-1.5 h-1.5 md:w-2 md:h-2"
    style={{ opacity: 0.45 }}
  >
    <path d="M3 0L6 3L3 6L0 3Z" />
  </svg>
);

const TickerItem = memo(({ text, isGold, palette }: { text: string; isGold: boolean; palette: Palette }) => (
  <React.Fragment>
    <span
      className="flex-shrink-0 whitespace-nowrap text-[8px] sm:text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] px-4 sm:px-6 md:px-10"
      style={{
        color: isGold ? palette.gold : palette.overlay40,
      }}
    >
      {text}
    </span>
    <span className="flex-shrink-0 flex items-center" aria-hidden="true">
      <Diamond color={palette.overlay20} />
    </span>
  </React.Fragment>
));
TickerItem.displayName = "TickerItem";

export const Ticker = memo(({ palette }: TickerProps) => {
  const items = useMemo(() => [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS], []);

  return (
    <div
      className="group overflow-hidden w-full py-5 cursor-default select-none relative"
      style={{
        borderTop: `1px solid ${palette.overlay10}`,
        borderBottom: `1px solid ${palette.overlay10}`,
        transform: "translateZ(0)",
      }}
    >
      <style>{`
        @keyframes customTickerScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .custom-css-ticker-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: customTickerScroll 60s linear infinite;
          will-change: transform;
          transform: translateZ(0);
        }
        @media (hover: hover) and (pointer: fine) {
          .group:hover .custom-css-ticker-track {
            animation-play-state: paused;
          }
        }
      `}</style>

      <div className="custom-css-ticker-track">
        {items.map((item, i) => (
          <TickerItem key={i} text={item} isGold={i % 2 !== 0} palette={palette} />
        ))}
      </div>
    </div>
  );
});

Ticker.displayName = "Ticker";
export default Ticker;
