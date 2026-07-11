import { gsap } from "gsap";
import { forwardRef, useImperativeHandle, useRef } from "react";

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

      if (timelineRef.current) timelineRef.current.kill();

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
        // Железобетонная математика: Волной снизу вверх, заливаем весь экран
        tl.set(path, { attr: { d: "M 0 100 V 100 Q 50 100 100 100 V 100 z" } })
          .to(path, {
            duration: 0.5,
            ease: "power4.in",
            attr: { d: "M 0 100 V 50 Q 50 0 100 50 V 100 z" },
          })
          .to(path, {
            duration: 0.4,
            ease: "power2.out",
            attr: { d: "M 0 100 V 0 Q 50 0 100 0 V 100 z" },
          });
      } else {
        // Поднимается в потолок, открывая чистую страницу
        tl.set(path, { attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" } })
          .to(path, {
            duration: 0.4,
            ease: "power2.in",
            attr: { d: "M 0 0 V 50 Q 50 0 100 50 V 0 z" },
          })
          .to(path, {
            duration: 0.6,
            ease: "power4.out",
            attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" },
          });
      }
    });
  };

  useImperativeHandle(ref, () => ({ play }));

  return (
    <div
      ref={overlayRef}
      // Строго ниже прелоадера (2147483647), но выше всего остального сайта
      className="fixed inset-0 w-full h-full pointer-events-none z-[2147483646]"
      style={{ transform: "translateZ(0)", willChange: "transform" }}
    >
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          vectorEffect="non-scaling-stroke"
          // Изначально сплющена на самом дне. Нет вызова play() при старте = нет бага с прелоадером
          d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
          fill="#03050a" // Идеальный цвет Clinical Obsidian
        />
      </svg>
    </div>
  );
});

WaveTransition.displayName = "WaveTransition";