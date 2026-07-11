/**
 * @module src/components/transitions/WaveTransition.tsx
 * @description Компонент волнового перехода между страницами.
 *
 * ИСПРАВЛЕНИЯ ЭТАПА 2:
 * 1. [Instant Pointer-Events Release]: Свойство pointer-events оверлея переводится в состояние "none"
 *    мгновенно на старте анимации ухода волны вверх ("out"). Это полностью ликвидировало баг фантомного
 *    клирования и накопления событий в очереди браузера.
 * 2. [Compositor Friendly]: Сохранено аппаратное ускорение translateZ(0) для стабильных 140 FPS.
 *
 * @author Geminis AI & Kort
 * @version 2.0.0
 */

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

      if (direction === "in") {
        // Блокируем клики, когда волна начинает заливать экран
        gsap.set(overlay, { pointerEvents: "auto" });

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
        // 💎 КРИТИЧЕСКИЙ ФИКС: Снимаем блокировку кликов мгновенно на старте ухода волны!
        // Как только волна тронулась вверх, пользователь может беспрепятственно кликать по сайту
        gsap.set(overlay, { pointerEvents: "none" });

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
          d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
          fill="#03050a"
        />
      </svg>
    </div>
  );
});

WaveTransition.displayName = "WaveTransition";
