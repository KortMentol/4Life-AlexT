import { gsap } from "gsap";
import { forwardRef, useImperativeHandle, useRef } from "react";

const ROWS = 8;
const COLUMNS = 14;

// Вспомогательный компонент для ячейки
const Cell = forwardRef<HTMLDivElement>((_, ref) => <div className="pixel-cell" ref={ref}></div>);
Cell.displayName = "Cell";

// Тип для ref, чтобы TypeScript понимал, какие методы мы передаем
export interface TransitionHandle {
  play: (direction: "in" | "out") => Promise<void>;
}

// Основной компонент оверлея
export const PixelTransition = forwardRef<TransitionHandle>((_, ref) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Функция для запуска анимации
  const play = (direction: "in" | "out"): Promise<void> => {
    return new Promise((resolve) => {
      const cells = cellRefs.current.filter((c) => c !== null);
      gsap.killTweensOf(cells); // Останавливаем любые текущие анимации на ячейках

      const transformOrigin = direction === "in" ? "50% 0%" : "50% 100%";
      const ease = direction === "in" ? "power3.inOut" : "power2";

      const fromVars = {
        scale: direction === "in" ? 0 : 1,
        opacity: direction === "in" ? 0 : 1,
      };

      const toVars = {
        scale: direction === "in" ? 1.01 : 0, // Небольшое увеличение для "сочности"
        opacity: direction === "in" ? 1 : 0,
      };

      if (overlayRef.current) {
        gsap.set(overlayRef.current, { opacity: 1, pointerEvents: "auto" });
      }

      gsap.fromTo(
        cells,
        {
          ...fromVars,
          transformOrigin: transformOrigin,
        },
        {
          ...toVars,
          duration: 0.4,
          ease: ease,
          stagger: (index) => {
            const row = Math.floor(index / COLUMNS);
            // Stagger-эффект, как в Codrops Demo 1
            return 0.03 * (row + gsap.utils.random(0, 5));
          },
          onComplete: () => {
            if (direction === "out" && overlayRef.current) {
              gsap.set(overlayRef.current, { pointerEvents: "none" });
            }
            resolve();
          },
        }
      );
    });
  };

  // Передаем функцию play родительскому компоненту
  useImperativeHandle(ref, () => ({
    play,
  }));

  return (
    <div ref={overlayRef} className="pixel-overlay">
      {Array.from({ length: ROWS * COLUMNS }).map((_, i) => (
        <Cell key={i} ref={(el) => (cellRefs.current[i] = el)} />
      ))}
    </div>
  );
});

PixelTransition.displayName = "PixelTransition";
