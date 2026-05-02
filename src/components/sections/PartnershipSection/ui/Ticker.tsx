/**
 * @module PartnershipSection/ui/Ticker.tsx
 * Бесшовная бегущая строка — RAF + 4 копии контента.
 * Сброс на -1/4 трека = бесшовный loop на любом экране.
 * Пауза на hover/touch.
 */

import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import type { Palette } from "../constants";
import { TICKER_ITEMS } from "../constants";

interface TickerProps {
  tier: PerformanceTier;
  palette: Palette;
}

const Diamond = ({ color }: { color: string }) => (
  <svg
    width="6"
    height="6"
    viewBox="0 0 6 6"
    fill={color}
    aria-hidden="true"
    className="flex-shrink-0"
    style={{ opacity: 0.45 }}
  >
    <path d="M3 0L6 3L3 6L0 3Z" />
  </svg>
);

const TickerItem = memo(
  ({
    text,
    isGold,
    palette,
  }: {
    text: string;
    isGold: boolean;
    palette: Palette;
  }) => (
    <>
      <span
        className="flex-shrink-0 whitespace-nowrap text-xs font-medium uppercase tracking-[0.3em]"
        style={{
          color: isGold ? palette.gold : palette.overlay40,
          padding: "0 2.5rem",
        }}
      >
        {text}
      </span>
      <span className="flex-shrink-0 flex items-center" aria-hidden="true">
        <Diamond color={palette.overlay20} />
      </span>
    </>
  ),
);
TickerItem.displayName = "TickerItem";

const Ticker = memo(({ tier, palette }: TickerProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const xVal = useMotionValue(0);
  const isPaused = useRef(false);
  // Ширина одной копии контента (1/4 от полного трека)
  const unitWidthRef = useRef(0);

  const speed = tier === "high" ? 0.05 : 0.032;

  // ResizeObserver — пересчитываем unit при любом изменении размера
  useEffect(() => {
    if (tier === "low") return;
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const w = track.scrollWidth;
      if (w > 0) unitWidthRef.current = w / 4;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [tier]);

  useAnimationFrame((_, delta) => {
    if (tier === "low" || isPaused.current) return;
    const unit = unitWidthRef.current;
    if (!unit) return;

    // Ограничиваем delta — защита от большого прыжка после неактивной вкладки
    const safeDelta = Math.min(delta, 64);
    let next = xVal.get() - speed * safeDelta;

    // Когда сдвинулись на одну копию — сбрасываем в 0
    // Визуально незаметно: следующая копия идентична
    if (next <= -unit) next += unit;

    xVal.set(next);
  });

  const x = useTransform(xVal, (v) => `${v}px`);

  const handleMouseEnter = useCallback(() => {
    isPaused.current = true;
  }, []);
  const handleMouseLeave = useCallback(() => {
    isPaused.current = false;
  }, []);
  const handleTouchStart = useCallback(() => {
    isPaused.current = true;
  }, []);
  const handleTouchEnd = useCallback(() => {
    isPaused.current = false;
  }, []);

  // 4 копии — гарантируем заполнение любого экрана
  const items = useMemo(
    () => [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS],
    [],
  );

  if (tier === "low") {
    return (
      <div
        className="overflow-hidden w-full py-5"
        style={{
          borderTop: `1px solid ${palette.overlay10}`,
          borderBottom: `1px solid ${palette.overlay10}`,
        }}
      >
        <div className="flex items-center whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <TickerItem
              key={i}
              text={item}
              isGold={i % 2 !== 0}
              palette={palette}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden w-full py-5 cursor-default select-none"
      style={{
        borderTop: `1px solid ${palette.overlay10}`,
        borderBottom: `1px solid ${palette.overlay10}`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        ref={trackRef}
        className="flex items-center whitespace-nowrap"
        style={{ x }}
      >
        {items.map((item, i) => (
          <TickerItem
            key={i}
            text={item}
            isGold={i % 2 !== 0}
            palette={palette}
          />
        ))}
      </motion.div>
    </div>
  );
});

Ticker.displayName = "Ticker";

export default Ticker;
