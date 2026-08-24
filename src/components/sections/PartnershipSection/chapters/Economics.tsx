/**
 * @module PartnershipSection/chapters/Economics.tsx
 * Глава 3 — экономика партнёрства.
 *
 * ИСПРАВЛЕНИЕ (Firefox Flicker):
 * Полностью удален React State (useState) из анимации дуги.
 * Изменение state 60 раз в секунду вызывало "Layout Thrashing" и ломало рендеринг SVG
 * в движке Gecko (Firefox). Теперь используется нативное свойство `pathLength` от
 * framer-motion для обводки и прямой доступ к DOM (ref.current.textContent) для цифр.
 */

import type { PerformanceTier } from "@/hooks/usePerformanceTier";
import { animate, motion, useInView } from "framer-motion";
import { forwardRef, memo, useEffect, useRef } from "react";
import type { Palette } from "../constants";
import ClipLine from "../ui/ClipLine";

// ─── ArcCounter ─────────────────────────────────────────────────────────
const ArcCounter = memo(({ tier, palette }: { tier: PerformanceTier; palette: Palette }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const countRef = useRef<HTMLSpanElement>(null);

  const R = 120;
  const circ = 2 * Math.PI * R;

  useEffect(() => {
    if (!inView) return;
    if (tier === "low") {
      if (countRef.current) countRef.current.textContent = "64";
      return;
    }

    // Прямая мутация DOM-узла без React Re-renders (0 Layout Thrashing)
    const ctrl = animate(0, 64, {
      duration: 2.2,
      ease: "easeOut",
      onUpdate: (v) => {
        if (countRef.current) countRef.current.textContent = Math.round(v).toString();
      },
    });

    return ctrl.stop;
  }, [inView, tier]);

  return (
    <div ref={ref} className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
      <svg width="280" height="280" viewBox="0 0 280 280" className="-rotate-90" aria-hidden="true">
        <circle cx="140" cy="140" r={R} fill="none" stroke={palette.overlay10} strokeWidth="1.5" />
        {/* Аппаратная анимация обводки через pathLength */}
        <motion.circle
          cx="140"
          cy="140"
          r={R}
          fill="none"
          stroke={palette.gold}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: inView ? (tier === "low" ? 0.64 : 0.64) : 0 }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          style={{ willChange: "stroke-dashoffset" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="typography-h1 tabular-nums flex items-baseline"
          style={{
            fontSize: "clamp(4rem, 8vw, 6rem)",
            color: palette.cream,
          }}
        >
          <span ref={countRef}>0</span>%
        </span>
        <span className="mt-2 text-xs font-light" style={{ color: palette.gold }}>
          ваш доход с продажи
        </span>
      </div>
    </div>
  );
});
ArcCounter.displayName = "ArcCounter";

// ─── Economics ────────────────────────────────────────────────────────────────
interface EconomicsProps {
  tier: PerformanceTier;
  palette: Palette;
  onChapter: (n: number) => void;
}

const ECON_FACTS = [
  ["Личная наценка", "разница остаётся вам"],
  ["Командный доход", "процент с оборота команды"],
  ["Прозрачные правила", "без скрытых условий"],
  ["Вход бесплатный", "без обязательных платежей"],
] as const;

const Economics = memo(
  forwardRef<HTMLElement, EconomicsProps>(({ tier, palette, onChapter }, forwardedRef) => {
    const ref = useRef<HTMLElement>(null);
    const activeRef = (forwardedRef as React.RefObject<HTMLElement>) ?? ref;
    const inView = useInView(activeRef, { margin: "-35%" });

    useEffect(() => {
      if (inView) onChapter(3);
    }, [inView, onChapter]);

    return (
      <section
        ref={activeRef}
        className="relative px-6 md:px-16 lg:px-24 py-28 md:py-40 overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${palette.bg}, ${palette.bg}f0, ${palette.bg})`,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 55% at 30% 50%, ${palette.blueDim}, transparent)`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-20"
          >
            <span className="text-[9px] uppercase tracking-[0.5em]" style={{ color: palette.gold }}>
              03 — Экономика
            </span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="flex justify-center md:justify-start">
              <ArcCounter tier={tier} palette={palette} />
            </div>

            <div>
              <ClipLine tier={tier} delay={0}>
                <h2
                  className="typography-h1 font-extralight leading-tight mb-6"
                  style={{
                    fontSize: "clamp(2rem, 4.5vw, 4rem)",
                    color: palette.cream,
                  }}
                >
                  Рекомендуешь —<br />
                  <span style={{ color: palette.gold }}>зарабатываешь.</span>
                </h2>
              </ClipLine>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-light leading-relaxed mb-12"
                style={{
                  fontSize: "clamp(0.88rem, 1.2vw, 1rem)",
                  color: palette.overlay40,
                }}
              >
                Партнёр покупает продукцию по специальной цене и рекомендует её по розничной. Разница остаётся вам. Плюс
                вы получаете процент от покупок людей, которых пригласили в команду. Доход растёт вместе с развитием
                структуры.
              </motion.p>

              <div className="grid grid-cols-2 gap-6 pt-10" style={{ borderTop: `1px solid ${palette.overlay10}` }}>
                {ECON_FACTS.map(([v, l], i) => (
                  <motion.div
                    key={l}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ duration: 0.6, delay: 0.1 * i }}
                    className="flex flex-col gap-1"
                  >
                    <span
                      className="font-light"
                      style={{
                        fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)",
                        color: palette.cream,
                      }}
                    >
                      {v}
                    </span>
                    <span className="text-xs font-light" style={{ color: palette.overlay40 }}>
                      {l}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }),
);

Economics.displayName = "Economics";

export default Economics;
