/**
 * @module src/components/ui/SmoothModalScroll.tsx
 * @description Awwwards / Immersive Garden smooth inertial modal scroller with GPU overlay scrollbar.
 *
 * Architecture:
 * - Desktop (High / Medium, non-touch): mounts a dedicated scoped `new Lenis({ wrapper, content })`
 *   driven by the app's singleton `rafLoop` (zero rogue requestAnimationFrame loops) with automatic
 *   `ResizeObserver` height syncing whenever accordions, QR bridges, or cart rows expand/collapse.
 * - Low Tier / Coarse Touch: pure native browser scrolling (`overscroll-behavior: contain`) with
 *   zero Lenis overhead.
 * - Custom GPU Overlay Scrollbar (Desktop only): hides native WebKit/Firefox scrollbars completely
 *   and renders a razor-thin 3px overlay thumb driven by `translate3d` (zero `setState` during scroll)
 *   with smooth 280ms expo-out opacity/color transitions and full pointer-drag scrubbing.
 */

import { usePerformanceTier } from "@/hooks";
import { rafLoop } from "@/lib/rafLoop";
import { useIsPresent } from "framer-motion";
import Lenis from "lenis";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface SmoothModalScrollProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  /** Changing this key resets scroll immediately to top (e.g. switching products via Prev/Next). */
  resetKey?: string | number;
  /** Optional subtle top fade-out mask that appears ONLY when scrolled down (`scrollTop > 8`). */
  showTopFade?: boolean;
  /** Optional subtle bottom fade-out mask that dissolves automatically when reaching scroll bottom. */
  showBottomFade?: boolean;
  /** Base surface hex color for the top/bottom fade gradients. */
  fadeColor?: string;
  /** Optional data attribute name attached to the scrollable viewport for automated verification. */
  dataScrollAttr?: string;
}

const MIN_THUMB_HEIGHT_PX = 36;
const TRACK_INSET_PX = 12;

function isCoarseTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
    (window.innerWidth <= 767 && "ontouchstart" in window)
  );
}

export const SmoothModalScroll: React.FC<SmoothModalScrollProps> = ({
  children,
  className = "",
  contentClassName = "",
  resetKey,
  showTopFade = false,
  showBottomFade = false,
  fadeColor = "#060b14",
  dataScrollAttr,
}) => {
  const tier = usePerformanceTier();
  const isPresent = useIsPresent();
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const localLenisRef = useRef<Lenis | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const dragStateRef = useRef<{
    active: boolean;
    startY: number;
    startScrollTop: number;
    maxScroll: number;
    maxThumbTravel: number;
  }>({
    active: false,
    startY: 0,
    startScrollTop: 0,
    maxScroll: 0,
    maxThumbTravel: 0,
  });
  const suppressTrackClickUntilRef = useRef<number>(0);

  const [isTouch] = useState<boolean>(() => isCoarseTouchDevice());
  const [canScrollUp, setCanScrollUp] = useState<boolean>(false);
  const canScrollUpRef = useRef<boolean>(false);
  const [canScrollDown, setCanScrollDown] = useState<boolean>(false);
  const canScrollDownRef = useRef<boolean>(false);

  const syncThumbAndFade = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!viewport) return;

    const scrollHeight = viewport.scrollHeight;
    const clientHeight = viewport.clientHeight;
    const scrollTop = viewport.scrollTop;
    const maxScroll = Math.max(0, scrollHeight - clientHeight);
    const hasOverflow = maxScroll > 2;

    if (showTopFade) {
      const nextCanScrollUp = scrollTop > 8;
      if (nextCanScrollUp !== canScrollUpRef.current) {
        canScrollUpRef.current = nextCanScrollUp;
        setCanScrollUp(nextCanScrollUp);
      }
    }

    if (showBottomFade) {
      const remaining = maxScroll - scrollTop;
      const nextCanScroll = remaining > 14;
      if (nextCanScroll !== canScrollDownRef.current) {
        canScrollDownRef.current = nextCanScroll;
        setCanScrollDown(nextCanScroll);
      }
    }

    if (isTouch || !track || !thumb) return;

    if (!hasOverflow) {
      track.dataset.overflow = "false";
      thumb.style.height = "0px";
      thumb.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    track.dataset.overflow = "true";
    const trackHeight = Math.max(0, clientHeight - TRACK_INSET_PX * 2);
    const ratio = clientHeight / scrollHeight;
    const thumbHeight = Math.max(MIN_THUMB_HEIGHT_PX, Math.min(trackHeight, Math.round(trackHeight * ratio)));
    const maxThumbTravel = Math.max(0, trackHeight - thumbHeight);
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
    const thumbOffset = maxThumbTravel * progress;

    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translate3d(0, ${thumbOffset.toFixed(2)}px, 0)`;
  }, [isTouch, showTopFade, showBottomFade]);

  const markScrollActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    track.dataset.active = "true";
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = window.setTimeout(() => {
      if (!dragStateRef.current.active && trackRef.current) {
        trackRef.current.dataset.active = "false";
      }
    }, 620);
  }, []);

  // Mount local scoped Lenis (desktop High/Medium) or native scroll observer (Low/Touch)
  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const enableLocalLenis = !isTouch && tier !== "low" && !prefersReduced;

    let unsubRaf: (() => void) | null = null;
    let localLenis: Lenis | null = null;

    if (enableLocalLenis) {
      localLenis = new Lenis({
        wrapper: viewport,
        content,
        lerp: 0.11,
        duration: 1.0,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1,
      });
      localLenisRef.current = localLenis;

      localLenis.on("scroll", () => {
        markScrollActive();
        syncThumbAndFade();
      });

      unsubRaf = rafLoop.subscribe(() => {
        localLenis?.raf(performance.now());
      });
    }

    const onNativeScroll = () => {
      markScrollActive();
      syncThumbAndFade();
    };

    viewport.addEventListener("scroll", onNativeScroll, { passive: true });

    const ro = new ResizeObserver(() => {
      localLenis?.resize();
      syncThumbAndFade();
    });
    ro.observe(viewport);
    ro.observe(content);

    // Initial measurement + post-entrance settle (after modal scale/fade finishes)
    const initTimer = window.setTimeout(() => {
      localLenis?.resize();
      syncThumbAndFade();
    }, 45);
    const settleTimer = window.setTimeout(() => {
      localLenis?.resize();
      syncThumbAndFade();
    }, 320);

    return () => {
      window.clearTimeout(initTimer);
      window.clearTimeout(settleTimer);
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      viewport.removeEventListener("scroll", onNativeScroll);
      ro.disconnect();
      unsubRaf?.();
      localLenis?.destroy();
      localLenisRef.current = null;
    };
  }, [isTouch, tier, markScrollActive, syncThumbAndFade]);

  // Reset scroll cleanly when switching items (e.g. Prev/Next in ProductDetailModal)
  useEffect(() => {
    if (resetKey === undefined) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    if (localLenisRef.current) {
      localLenisRef.current.scrollTo(0, { immediate: true });
      localLenisRef.current.resize();
    } else {
      viewport.scrollTop = 0;
    }

    const rafId = window.requestAnimationFrame(() => {
      localLenisRef.current?.resize();
      syncThumbAndFade();
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [resetKey, syncThumbAndFade]);

  // Pointer-drag scrubbing on the custom overlay scrollbar thumb
  const handleThumbPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const thumb = thumbRef.current;
    const track = trackRef.current;
    if (!viewport || !thumb || !track) return;

    e.preventDefault();
    e.stopPropagation();

    const maxScroll = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    const trackHeight = Math.max(0, viewport.clientHeight - TRACK_INSET_PX * 2);
    const thumbHeight = thumb.getBoundingClientRect().height;
    const maxThumbTravel = Math.max(1, trackHeight - thumbHeight);

    dragStateRef.current = {
      active: true,
      startY: e.clientY,
      startScrollTop: viewport.scrollTop,
      maxScroll,
      maxThumbTravel,
    };

    track.dataset.active = "true";
    track.dataset.dragging = "true";
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handleThumbPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragStateRef.current.active) return;
      const viewport = viewportRef.current;
      if (!viewport) return;

      const deltaY = e.clientY - dragStateRef.current.startY;
      const scrollRatio = deltaY / dragStateRef.current.maxThumbTravel;
      const targetScroll = Math.min(
        dragStateRef.current.maxScroll,
        Math.max(0, dragStateRef.current.startScrollTop + scrollRatio * dragStateRef.current.maxScroll),
      );

      if (localLenisRef.current) {
        localLenisRef.current.scrollTo(targetScroll, { immediate: true });
      } else {
        viewport.scrollTop = targetScroll;
      }
      syncThumbAndFade();
    },
    [syncThumbAndFade],
  );

  const handleThumbPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.active) return;
    dragStateRef.current.active = false;
    suppressTrackClickUntilRef.current = performance.now() + 140;
    if (trackRef.current) {
      trackRef.current.dataset.dragging = "false";
      trackRef.current.dataset.active = "false";
    }
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  // Track click-to-jump
  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (performance.now() < suppressTrackClickUntilRef.current) return;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (!viewport || !track || !thumb) return;
      if (e.target === thumb) return;

      const trackRect = track.getBoundingClientRect();
      const clickRatio = Math.min(1, Math.max(0, (e.clientY - trackRect.top) / Math.max(1, trackRect.height)));
      const maxScroll = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
      const targetScroll = clickRatio * maxScroll;

      if (localLenisRef.current) {
        localLenisRef.current.scrollTo(targetScroll, { duration: 0.45 });
      } else {
        viewport.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    },
    [],
  );

  const dynamicScrollAttr = dataScrollAttr ? { [dataScrollAttr]: "true" } : {};

  return (
    <div
      className={`relative flex flex-col min-h-0 overflow-hidden ${className}`}
      data-lenis-prevent={isPresent ? "" : undefined}
      onWheel={isPresent ? (e) => e.stopPropagation() : undefined}
    >
      <div
        ref={viewportRef}
        {...dynamicScrollAttr}
        className="smooth-modal-viewport flex-1 min-h-0 w-full overflow-y-auto"
        style={{ overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" }}
      >
        <div ref={contentRef} className={contentClassName}>
          {children}
        </div>
      </div>

      {/* Dynamic Top Fade-Out Mask (strictly hidden at scrollTop === 0) */}
      {showTopFade && (
        <div
          aria-hidden="true"
          data-modal-scroll-top-fade={canScrollUp ? "visible" : "hidden"}
          className={`pointer-events-none absolute inset-x-0 top-0 h-10 transition-opacity duration-250 ${
            canScrollUp ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `linear-gradient(to bottom, ${fadeColor} 0%, ${fadeColor}c8 45%, transparent 100%)`,
          }}
        />
      )}

      {/* Dynamic Bottom Fade-Out Mask */}
      {showBottomFade && (
        <div
          aria-hidden="true"
          data-modal-scroll-fade={canScrollDown ? "visible" : "hidden"}
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-14 transition-opacity duration-300 ${
            canScrollDown ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `linear-gradient(to top, ${fadeColor} 0%, ${fadeColor}d0 42%, transparent 100%)`,
          }}
        />
      )}

      {/* Custom GPU-Composited Overlay Scrollbar (Desktop only) */}
      {!isTouch && (
        <div
          ref={trackRef}
          aria-hidden="true"
          data-smooth-scrollbar-track="true"
          data-overflow="false"
          data-active="false"
          data-dragging="false"
          onClick={handleTrackClick}
          className="smooth-modal-track"
        >
          <div className="smooth-modal-rail" />
          <div
            ref={thumbRef}
            data-smooth-scrollbar-thumb="true"
            onPointerDown={handleThumbPointerDown}
            onPointerMove={handleThumbPointerMove}
            onPointerUp={handleThumbPointerUp}
            onPointerCancel={handleThumbPointerUp}
            className="smooth-modal-thumb"
          />
        </div>
      )}
    </div>
  );
};

export default SmoothModalScroll;
