import { gsap } from "gsap";
import { forwardRef, useImperativeHandle, useRef } from "react";

// Тип для ref-объекта
export interface TransitionHandle {
  play: (direction: "in" | "out") => Promise<void>;
}

export const WaveTransition = forwardRef<TransitionHandle>((_, ref) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const play = (direction: "in" | "out"): Promise<void> => {
    return new Promise((resolve) => {
      const overlay = overlayRef.current;
      const path = pathRef.current;
      if (!overlay || !path) {
        resolve();
        return;
      }

      // Создаем timeline каждый раз для чистоты
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (direction === "out") {
            gsap.set(overlay, { pointerEvents: "none" });
          }
          resolve();
        },
      });

      gsap.set(overlay, { pointerEvents: "auto" });

      if (direction === "in") {
        tl.set(path, { attr: { d: "M 0 100 V 100 Q 50 100 100 100 V 100 z" } })
          .to(path, {
            duration: 0.8,
            ease: "power4.in",
            attr: { d: "M 0 100 V 50 Q 50 0 100 50 V 100 z" },
          })
          .to(path, {
            duration: 0.3,
            ease: "power2",
            attr: { d: "M 0 100 V 0 Q 50 0 100 0 V 100 z" },
          });
      } else {
        // direction 'out'
        tl.set(path, { attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" } })
          .to(path, {
            duration: 0.3,
            ease: "power2.in",
            attr: { d: "M 0 0 V 50 Q 50 0 100 50 V 0 z" },
          })
          .to(path, {
            duration: 0.8,
            ease: "power4",
            attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" },
          });
      }
    });
  };

  useImperativeHandle(ref, () => ({
    play,
  }));

  return (
    <div
      ref={overlayRef}
      className="theodore-menu-container"
      style={{ pointerEvents: "none" }}
    >
      <svg
        className="overlay"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          className="overlay__path"
          vectorEffect="non-scaling-stroke"
          d="M 0 0 V 0 Q 50 0 100 0 V 0 z"
        />
      </svg>
    </div>
  );
});

WaveTransition.displayName = "WaveTransition";
