/**
 * @module PageEntrance
 * @description Global staged hero entrance orchestrator (Awwwards Pro 2026+).
 * Fixes closure race condition where PageEntrance could remain at opacity: 0 if preloader-outro-start
 * fired before mount or while #preloader was being removed.
 */

import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { gsap } from "gsap";
import React, { useEffect, useRef, useState } from "react";

const PRELOADER_DELAY = 320;
const PC_ROUTE_DELAY = 140;
const POP_DELAY = 1;
const MOBILE_MENU_SYNC_DELAY = 0;

interface PageEntranceProps {
  children: React.ReactNode;
  className?: string;
}

type WindowWithPreloaderFlag = Window & {
  __preloaderFinished?: boolean;
};

export const PageEntrance: React.FC<PageEntranceProps> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = usePerformanceTier();
  const [isActive, setIsActive] = useState(false);
  const eventTriggeredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const win = window as WindowWithPreloaderFlag;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const triggerStart = (type: "preload" | "route" | "pop" | "mobile-menu") => {
      if (eventTriggeredRef.current) return;
      eventTriggeredRef.current = true;
      if (timerId) clearTimeout(timerId);

      let delay = PC_ROUTE_DELAY;
      if (type === "preload") delay = PRELOADER_DELAY;
      if (type === "pop") delay = POP_DELAY;
      if (type === "mobile-menu") delay = MOBILE_MENU_SYNC_DELAY;

      timerId = setTimeout(() => {
        setIsActive(true);
      }, delay);
    };

    const handlePreloaderStart = () => triggerStart("preload");
    const handlePopTransition = () => triggerStart("pop");
    const handleRouteTransition = (e: Event) => {
      const customEvent = e as CustomEvent<{ fromMobileMenu?: boolean }>;
      if (customEvent.detail?.fromMobileMenu) {
        triggerStart("mobile-menu");
      } else {
        triggerStart("route");
      }
    };

    window.addEventListener("preloader-outro-start", handlePreloaderStart);
    window.addEventListener("menu-transition-complete", handleRouteTransition);
    window.addEventListener("pop-transition-complete", handlePopTransition);

    // Dynamic check: re-queries #preloader and __preloaderFinished every tick so it can never freeze at opacity: 0
    const checkReady = () => {
      const preloaderEl = document.getElementById("preloader");
      const preloaderGoneOrDone = !preloaderEl || Boolean(win.__preloaderFinished);
      const isTransitionActive = Boolean(window.__menuTransitionInProgress || window.__popTransitionInProgress);
      if (preloaderGoneOrDone && !isTransitionActive && !eventTriggeredRef.current) {
        triggerStart("route");
        return true;
      }
      return false;
    };

    const immediate = checkReady();
    const pollingInterval = immediate
      ? null
      : setInterval(() => {
          if (checkReady() && pollingInterval) {
            clearInterval(pollingInterval);
          }
        }, 60);

    return () => {
      if (timerId) clearTimeout(timerId);
      if (pollingInterval) clearInterval(pollingInterval);
      window.removeEventListener("preloader-outro-start", handlePreloaderStart);
      window.removeEventListener("menu-transition-complete", handleRouteTransition);
      window.removeEventListener("pop-transition-complete", handlePopTransition);
    };
  }, []);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    const container = containerRef.current;

    const badge = container.querySelector('[data-entrance="badge"]');
    const title = container.querySelector('[data-entrance="title"]');
    const lead = container.querySelector('[data-entrance="lead"]');
    const buttonsContainer = container.querySelector('[data-entrance="buttons"]');

    const targets = [badge, title, lead, buttonsContainer].filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    if (tier === "low") {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: tier === "high" ? 1.35 : 1.05,
          stagger: 0.12,
          ease: "power3.out",
          force3D: true,
          onComplete: () => {
            gsap.set(targets, { clearProps: "all" });
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, tier]);

  const initialStyle = !isActive && tier !== "low" ? { opacity: 0 } : undefined;

  return (
    <div ref={containerRef} className={className} style={initialStyle}>
      {children}
    </div>
  );
};

export default PageEntrance;
