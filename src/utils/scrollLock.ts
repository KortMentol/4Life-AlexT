/**
 * @module src/utils/scrollLock.ts
 * @description Ref-counted, zero-jitter global scroll lock shared across all modals
 * (ProductDetailModal, ProductListModal, etc.).
 *
 * Guarantees:
 * - Switching from one modal to another (count 1 -> 2 -> 1) NEVER unlocks background scroll prematurely.
 * - Stops global Lenis on desktop AND locks both <html> and <body> overflow with scrollbar-gutter
 *   paddingRight compensation (zero horizontal layout shift).
 * - Sets `#root` inert and dispatches `modal-state-change` cleanly on 0 -> 1 and 1 -> 0 transitions.
 * - Each `acquireScrollLock()` returns a strictly idempotent one-shot `release()` cleanup closure.
 */

import { lenis } from "@/lib/lenis";

export interface ScrollLockHooks {
  onLock: () => void;
  onUnlock: () => void;
}

export interface ScrollLockController {
  acquire: () => () => void;
  getCount: () => number;
  reset: () => void;
}

/**
 * Pure ref-counted controller factory (decoupled from DOM for deterministic node:test verification).
 */
export function createScrollLockController(hooks: ScrollLockHooks): ScrollLockController {
  let activeCount = 0;

  return {
    acquire() {
      let released = false;
      activeCount += 1;
      if (activeCount === 1) {
        hooks.onLock();
      }

      return () => {
        if (released) return;
        released = true;
        if (activeCount <= 0) return;
        activeCount -= 1;
        if (activeCount === 0) {
          hooks.onUnlock();
        }
      };
    },
    getCount() {
      return activeCount;
    },
    reset() {
      if (activeCount > 0) {
        activeCount = 0;
        hooks.onUnlock();
      }
    },
  };
}

interface SavedDomScrollState {
  htmlOverflow: string;
  bodyOverflow: string;
  bodyPaddingRight: string;
}

let savedState: SavedDomScrollState | null = null;

function lockDomScroll(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const html = document.documentElement;
  const body = document.body;
  const root = document.getElementById("root");

  savedState = {
    htmlOverflow: html.style.overflow,
    bodyOverflow: body.style.overflow,
    bodyPaddingRight: body.style.paddingRight,
  };

  const scrollbarWidth = Math.max(0, window.innerWidth - html.clientWidth);

  lenis?.stop();

  html.classList.add("modal-open");
  body.classList.add("modal-open");
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";

  if (scrollbarWidth > 0) {
    const computedPad = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${computedPad + scrollbarWidth}px`;
  }

  if (root) {
    root.inert = true;
  }

  window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen: true } }));
}

function unlockDomScroll(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const html = document.documentElement;
  const body = document.body;
  const root = document.getElementById("root");

  html.classList.remove("modal-open");
  body.classList.remove("modal-open");

  if (savedState) {
    html.style.overflow = savedState.htmlOverflow;
    body.style.overflow = savedState.bodyOverflow;
    body.style.paddingRight = savedState.bodyPaddingRight;
    savedState = null;
  } else {
    html.style.overflow = "";
    body.style.overflow = "";
    body.style.paddingRight = "";
  }

  if (root) {
    root.inert = false;
  }

  lenis?.start();
  lenis?.resize();

  window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen: false } }));
}

const globalController = createScrollLockController({
  onLock: lockDomScroll,
  onUnlock: unlockDomScroll,
});

/**
 * Acquires a reference-counted background scroll lock.
 * Always invoke the returned one-shot `release()` function inside effect cleanup.
 */
export function acquireScrollLock(): () => void {
  return globalController.acquire();
}

export function getActiveScrollLockCount(): number {
  return globalController.getCount();
}
