/**
 * @module src/components/ui/LpInfoPopover.tsx
 * @description Restrained Clinical Obsidian micro-popover explaining 4Life LP (Life Points)
 * at the exact point of user curiosity (Product Detail Passport & Cart Totals) without visual clutter.
 * Renders via React Portal (`document.body`) with viewport clamping & vertical auto-flip so it can
 * never be clipped by modal scroll containers (`SmoothModalScroll`) or narrow viewports.
 */

import { Icons } from "@/utils/icons";
import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

interface LpInfoPopoverProps {
  /** Preferred horizontal alignment of the popover relative to the `?` trigger. */
  align?: "left" | "right";
  /** Preferred vertical placement relative to the `?` trigger (auto-flips if near viewport edge). */
  placement?: "top" | "bottom";
  /** Optional callback run before navigating (e.g. close parent modal cleanly). */
  onNavigateBefore?: () => void;
  /** Optional test hook attribute value. */
  context?: "modal" | "cart";
}

interface PopoverCoords {
  top: number;
  left: number;
  width: number;
}

const VIEWPORT_MARGIN = 12;
const TRIGGER_GAP = 10;
const ESTIMATED_HEIGHT = 235;

export const LpInfoPopover: React.FC<LpInfoPopoverProps> = ({
  align = "right",
  placement = "bottom",
  onNavigateBefore,
  context = "cart",
}) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<PopoverCoords | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();
  const navigate = useNavigate();

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(312, vw - VIEWPORT_MARGIN * 2);
    const measuredHeight = popoverRef.current?.offsetHeight || ESTIMATED_HEIGHT;

    const spaceAbove = rect.top - VIEWPORT_MARGIN;
    const spaceBelow = vh - rect.bottom - VIEWPORT_MARGIN;

    let resolvedPlacement = placement;
    if (placement === "top" && spaceAbove < measuredHeight + TRIGGER_GAP && spaceBelow > spaceAbove) {
      resolvedPlacement = "bottom";
    } else if (placement === "bottom" && spaceBelow < measuredHeight + TRIGGER_GAP && spaceAbove > spaceBelow) {
      resolvedPlacement = "top";
    }

    let top =
      resolvedPlacement === "top"
        ? rect.top - measuredHeight - TRIGGER_GAP
        : rect.bottom + TRIGGER_GAP;

    top = Math.max(VIEWPORT_MARGIN, Math.min(top, vh - measuredHeight - VIEWPORT_MARGIN));

    let left = align === "left" ? rect.left : rect.right - width;
    left = Math.max(VIEWPORT_MARGIN, Math.min(left, vw - width - VIEWPORT_MARGIN));

    setCoords({ top, left, width });
  }, [align, placement]);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    updatePosition();
    // Re-measure one frame later once the portal node has painted its exact height
    const rafId = window.requestAnimationFrame(updatePosition);
    return () => window.cancelAnimationFrame(rafId);
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };

    const handleViewportShift = () => {
      updatePosition();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, { passive: true });
    document.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("resize", handleViewportShift, { passive: true });
    // Capture scroll on any ancestor (including SmoothModalScroll) to keep popover anchored
    window.addEventListener("scroll", handleViewportShift, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("resize", handleViewportShift);
      window.removeEventListener("scroll", handleViewportShift, true);
    };
  }, [open, updatePosition]);

  const handleLearnMore = () => {
    setOpen(false);
    onNavigateBefore?.();
    navigate("/how-to-buy");
  };

  return (
    <span className="relative inline-flex items-center align-middle">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Что такое LP (Life Points)?"
        aria-expanded={open}
        aria-controls={popoverId}
        data-lp-popover-trigger={context}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className={`w-[18px] h-[18px] rounded-full inline-flex items-center justify-center text-[11px] font-mono leading-none border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/75 ${
          open
            ? "bg-white/[0.12] border-cyan-400/60 text-white"
            : "bg-white/[0.04] border-white/[0.16] text-slate-400 hover:text-white hover:border-white/35"
        }`}
      >
        ?
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popoverRef}
            id={popoverId}
            role="dialog"
            aria-label="Что такое баллы LP"
            data-lp-popover-content={context}
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: coords ? `${coords.top}px` : "-9999px",
              left: coords ? `${coords.left}px` : "-9999px",
              width: coords ? `${coords.width}px` : "300px",
              zIndex: 10050,
              visibility: coords ? "visible" : "hidden",
            }}
            className="p-4 rounded-2xl bg-[#070e1c] border border-white/[0.15] shadow-[0_24px_60px_rgba(0,0,0,0.88)] text-left font-sans normal-case tracking-normal"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-white leading-snug">
                LP (Life Points) — баллы 4Life
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть подсказку"
                className="text-slate-400 hover:text-white transition-colors cursor-pointer -mt-0.5 p-0.5"
              >
                <Icons.X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed text-pretty">
              Международный балльный вес формулы. При разовом заказе по нашему ID считать LP не нужно — оплата идёт в
              рублях со скидкой −25%.
            </p>

            <p className="text-xs text-slate-400 leading-relaxed text-pretty mt-2">
              В статусе Привилегированного клиента (ПК) заказы от{" "}
              <span className="text-slate-200 tabular-nums">50 LP/мес</span> дают 10–15% кэшбэка бонусными баллами на
              бесплатную продукцию в РЦ 67, а от <span className="text-slate-200 tabular-nums">125 LP/мес</span> —
              «Продукт месяца» в подарок.
            </p>

            <button
              type="button"
              onClick={handleLearnMore}
              data-lp-popover-link={context}
              className="mt-3 pt-2.5 border-t border-white/[0.08] w-full inline-flex items-center justify-between text-xs font-medium text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
            >
              <span>Подробнее о статусе ПК и бонусах</span>
              <Icons.ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
            </button>
          </div>,
          document.body
        )}
    </span>
  );
};

export default LpInfoPopover;
