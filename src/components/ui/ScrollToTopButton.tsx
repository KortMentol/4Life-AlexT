import { useIsMobile } from "@/hooks/useIsMobile";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { rafLoop } from "@/lib/rafLoop";
import { Icons } from "@/utils/icons";
import { scrollToTop } from "@/utils/navigationUtils";
import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const IS_TOUCH = typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;

const ScrollToTopButton: React.FC = () => {
  const isMobile = useIsMobile();
  const tier = usePerformanceTier();
  const location = useLocation();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const isRoutingLockRef = useRef(false);
  const stateRef = useRef({
    isVisible: false,
    lastScrollY: 0,
    isScrollingUp: false,
    lastDirection: "down",
    turnPoint: 0,
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const transitionShow =
      "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0s linear 0s";
    const transitionHide =
      "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0s linear 0.4s";

    const checkScroll = (scrollY: number) => {
      if (document.documentElement.style.position === "fixed" || isRoutingLockRef.current) return;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? scrollY / scrollHeight : 0;
      const isNearTop = scrollY < 80;

      const lastY = stateRef.current.lastScrollY;
      const diff = scrollY - lastY;

      if (diff !== 0) {
        const currentDirection = diff < 0 ? "up" : "down";

        if (currentDirection !== stateRef.current.lastDirection) {
          stateRef.current.lastDirection = currentDirection;
          stateRef.current.turnPoint = lastY;
        }

        if (currentDirection === "up") {
          const scrolledUpDistance = stateRef.current.turnPoint - scrollY;
          if (scrolledUpDistance > 50) {
            stateRef.current.isScrollingUp = true;
          }
        } else {
          stateRef.current.isScrollingUp = false;
          stateRef.current.turnPoint = scrollY;
        }
      }

      if (isNearTop) {
        stateRef.current.isScrollingUp = false;
        stateRef.current.turnPoint = scrollY;
      }

      const shouldShow = !isNearTop && progress > 0.15 && stateRef.current.isScrollingUp;

      if (shouldShow !== stateRef.current.isVisible) {
        stateRef.current.isVisible = shouldShow;

        if (shouldShow) {
          wrapper.style.setProperty("--btn-opacity", "0.75");
          wrapper.style.visibility = "visible";
          wrapper.style.pointerEvents = "auto";
          wrapper.style.transform = "translate3d(0, 0, 0)";
          wrapper.style.transition = transitionShow;
        } else {
          wrapper.style.setProperty("--btn-opacity", "0");
          wrapper.style.pointerEvents = "none";
          wrapper.style.transform = "translate3d(0, 16px, 0)";
          wrapper.style.transition = transitionHide;
        }
      }

      stateRef.current.lastScrollY = scrollY;
    };

    const unsub = rafLoop.subscribe(checkScroll);
    return unsub;
  }, [isMobile]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    isRoutingLockRef.current = true;
    stateRef.current.isVisible = false;

    wrapper.style.setProperty("--btn-opacity", "0");
    wrapper.style.pointerEvents = "none";
    wrapper.style.transform = "translate3d(0, 16px, 0)";
    wrapper.style.transition = "none";
    wrapper.style.visibility = "hidden";

    const timer = setTimeout(() => {
      isRoutingLockRef.current = false;
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleClick = () => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      stateRef.current.isVisible = false;
      stateRef.current.isScrollingUp = false;

      wrapper.style.setProperty("--btn-opacity", "0");
      wrapper.style.pointerEvents = "none";
      wrapper.style.transform = "translate3d(0, 16px, 0)";
      wrapper.style.transition = "opacity 0.2s ease, transform 0.2s ease, visibility 0s linear 0.2s";
      wrapper.style.visibility = "hidden";
    }
    scrollToTop();
  };

  const isLowTier = tier === "low";

  const buttonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    boxShadow: isLowTier
      ? "0 8px 24px rgba(0, 0, 0, 0.6)"
      : "inset 0 1.5px 2px rgba(255, 255, 255, 0.12), inset 0 -3px 6px rgba(0, 0, 0, 0.95), inset 1.5px 0 3px rgba(0, 212, 255, 0.06), inset -1.5px 0 3px rgba(0, 212, 255, 0.06), 0 0 5px rgba(0, 0, 0, 0.6), 0 20px 40px rgba(0, 0, 0, 0.6)",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    outline: "none",
  };

  const gradientStyle: React.CSSProperties = {
    background: `
      radial-gradient(ellipse 150% 60% at 50% -10%, rgba(0, 212, 255, 0.15) 0%, transparent 70%),
      linear-gradient(135deg, #050811 0%, #0a0f1d 15%, #131b2e 35%, #1d283d 50%, #131b2e 65%, #0a0f1d 85%, #050811 100%)
    `,
    boxShadow:
      "inset 0 1.5px 2px rgba(255, 255, 255, 0.12), inset 0 -3px 6px rgba(0, 0, 0, 0.95), inset 1.5px 0 3px rgba(0, 212, 255, 0.06), inset -1.5px 0 3px rgba(0, 212, 255, 0.06)",
  };

  return (
    <div
      ref={wrapperRef}
      className={`fixed z-50 ${!IS_TOUCH ? "hover:!opacity-100" : ""} ${isMobile ? "bottom-4 right-4" : "bottom-6 right-6"}`}
      style={{
        opacity: "var(--btn-opacity, 0)",
        visibility: "hidden",
        pointerEvents: "none",
        transform: "translate3d(0, 16px, 0)",
      }}
    >
      <button
        onClick={handleClick}
        className={`relative flex items-center justify-center rounded-[50%] group outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 transition-transform duration-200 ease-out active:scale-95 transform-gpu ${
          isMobile ? "w-12 h-12 active:scale-95" : "w-14 h-14"
        }`}
        style={buttonStyle}
        aria-label="Вернуться наверх"
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="49.5" fill="#050811" />
          <circle
            cx="50"
            cy="50"
            r="49.5"
            stroke="#06b6d4"
            className={`opacity-25 transition-opacity duration-300 ${!IS_TOUCH ? "group-hover:opacity-65" : ""}`}
            strokeWidth="1"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {!isLowTier && (
          <div className="absolute inset-[0.5px] rounded-[50%] pointer-events-none z-10" style={gradientStyle} />
        )}

        {!isLowTier && (
          <div
            className="absolute inset-[1.5px] rounded-[50%] pointer-events-none z-10"
            style={{ background: "linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, transparent 50%)" }}
          />
        )}

        {!IS_TOUCH && (
          <div
            className="absolute inset-[0.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[50%] z-10"
            style={{ background: "radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.12) 0%, transparent 70%)" }}
          />
        )}

        <Icons.ArrowUp
          size={isMobile ? 20 : 22}
          strokeWidth={2}
          className={`text-cyan-400 relative z-10 transition-transform duration-300 ease-out ${
            !IS_TOUCH ? "group-hover:-translate-y-1" : ""
          }`}
          style={{
            filter: "drop-shadow(0 2px 8px rgba(0, 212, 255, 0.5))",
          }}
        />
      </button>
    </div>
  );
};

export default ScrollToTopButton;
