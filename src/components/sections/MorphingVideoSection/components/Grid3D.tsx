/**
 * @module Grid3D
 * @description High-performance 3D CSS flying image field powered by npm GSAP + ScrollTrigger.
 * Matches sandbox choreography 1-to-1 (identical near-field scale, depth planes, and vertical
 * CSS feather masking with zero razor-edge clipping) while sourcing the 20 local images in
 * /images/backgrounds/HomePage/img/1.jpg..20.jpg.
 */

import { usePerformanceTier } from "@/hooks";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useMemo, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface Grid3DProps {
  type: 1 | 2 | 3;
  triggerRef: React.RefObject<HTMLElement | null>;
}

function seededRange(seed: number, min: number, max: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  const frac = x - Math.floor(x);
  return min + frac * (max - min);
}

const VERTICAL_FEATHER_MASK: React.CSSProperties = {
  maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
};

export const Grid3D: React.FC<Grid3DProps> = ({ type, triggerRef }) => {
  const tier = usePerformanceTier();
  const gridRef = useRef<HTMLDivElement>(null);
  const cardCount = tier === "high" ? 16 : tier === "medium" ? 12 : 0;

  useEffect(() => {
    if (tier === "low" || cardCount === 0) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || window.innerWidth < 1024) return;

    const grid = gridRef.current;
    const triggerEl = triggerRef.current;
    if (!grid || !triggerEl) return;

    const gridWrap = grid.querySelector<HTMLElement>(".grid-wrap");
    const gridItems = Array.from(grid.querySelectorAll<HTMLElement>(".grid__item"));
    if (!gridWrap || gridItems.length === 0) return;

    let ctx: gsap.Context | null = null;

    const initGSAP = () => {
      ctx = gsap.context(() => {
        const scrollTriggerConfig: ScrollTrigger.Vars = {
          trigger: triggerEl,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.85,
          invalidateOnRefresh: true,
        };

        switch (type) {
          case 1:
            grid.style.setProperty("--perspective", "1150px");
            gsap
              .timeline({ scrollTrigger: scrollTriggerConfig })
              .set(gridWrap, { rotationY: 18, force3D: true })
              .set(gridItems, {
                z: (i: number) => seededRange(i + 11, -680, 140),
                opacity: (i: number) => seededRange(i + 37, 0.7, 0.96),
                force3D: true,
              })
              .fromTo(
                gridItems,
                { xPercent: (i: number) => seededRange(i + 5, -340, -130) },
                {
                  xPercent: (i: number) => seededRange(i + 91, 130, 340),
                  ease: "none",
                },
              );
            break;

          case 2:
            grid.style.setProperty("--perspective", "1550px");
            gsap
              .timeline({ defaults: { ease: "none" }, scrollTrigger: scrollTriggerConfig })
              .set(gridWrap, { rotationX: 14, force3D: true })
              .set(gridItems, {
                z: (i: number) => seededRange(i + 201, -920, -120),
                opacity: 0.68,
                force3D: true,
              })
              .fromTo(
                gridItems,
                {
                  yPercent: (i: number) => seededRange(i + 101, 110, 360),
                  rotationY: -26,
                  opacity: 0.65,
                },
                {
                  yPercent: (i: number) => seededRange(i + 307, -360, -110),
                  rotationY: 26,
                  opacity: 0.96,
                  ease: "power1.inOut",
                },
                0,
              )
              .fromTo(
                gridWrap,
                { rotationZ: -4, scale: 0.98 },
                { rotationX: -12, rotationZ: 6, scale: 1.12 },
                0,
              );
            break;

          case 3:
            grid.style.setProperty("--perspective", "1300px");
            gsap
              .timeline({ scrollTrigger: scrollTriggerConfig })
              .set(gridItems, {
                transformOrigin: "50% 0%",
                z: (i: number) => seededRange(i + 409, -1450, -320),
                rotationX: (i: number) => seededRange(i + 503, -38, -12),
                opacity: 0.45,
                force3D: true,
              })
              .to(gridItems, {
                xPercent: (i: number) => seededRange(i + 613, -110, 110),
                yPercent: (i: number) => seededRange(i + 709, -160, 160),
                rotationX: 0,
                opacity: 0.95,
                ease: "none",
              })
              .to(gridWrap, { z: 1400, ease: "none" }, 0);
            break;
        }
      }, gridRef);

      ScrollTrigger.refresh();
    };

    const onTransitionComplete = () => {
      initGSAP();
      window.removeEventListener("menu-transition-complete", onTransitionComplete);
    };

    if (window.__menuTransitionInProgress) {
      window.addEventListener("menu-transition-complete", onTransitionComplete);
    } else {
      initGSAP();
    }

    return () => {
      window.removeEventListener("menu-transition-complete", onTransitionComplete);
      ctx?.revert();
    };
  }, [type, triggerRef, tier, cardCount]);

  const images = useMemo(
    () =>
      Array.from(
        { length: cardCount },
        (_, i) => `/images/backgrounds/HomePage/img/${((i + (type - 1) * 5) % 20) + 1}.jpg`,
      ),
    [type, cardCount],
  );

  if (tier === "low" || cardCount === 0) {
    return null;
  }

  const gridColsClass =
    type === 1 ? "grid-cols-4 gap-10" : type === 2 ? "grid-cols-4 gap-12" : "grid-cols-4 gap-8";

  return (
    <div
      ref={gridRef}
      className="absolute -top-[18vh] -bottom-[14vh] inset-x-0 z-10 hidden lg:block overflow-hidden pointer-events-none"
      style={{
        perspective: "var(--perspective, 1200px)",
        ...VERTICAL_FEATHER_MASK,
      }}
      aria-hidden="true"
    >
      <div
        className={`grid-wrap grid ${gridColsClass} h-full w-full px-8 py-20 items-center`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {images.map((src, i) => (
          <div
            key={`${type}-${i}`}
            className="grid__item aspect-[1.45] overflow-hidden rounded-xl border border-cyan-300/25 shadow-[0_24px_60px_rgba(0,0,0,0.7)] bg-[#060b16]"
            style={{
              outline: "1px solid transparent",
              transformStyle: "preserve-3d",
              transform: "translate3d(0,0,0)",
            }}
          >
            <img
              src={src}
              alt=""
              loading={tier === "high" ? "eager" : "lazy"}
              decoding="async"
              className="w-full h-full object-cover rounded-xl brightness-105 contrast-105"
              style={{
                transform: "translate3d(0,0,0) scale(1.03)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};