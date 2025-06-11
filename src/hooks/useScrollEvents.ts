import { useEffect } from "react";
import { lenis } from "@/lib/lenis";

type ScrollEventCallback = (scrollInfo: {
  scroll: number;
  limit: number;
  velocity: number;
  direction: number;
  progress: number;
}) => void;

/**
 * Хук для добавления обработчиков событий скролла с использованием Lenis
 * @param onScroll - Функция обратного вызова, вызываемая при скролле
 */
export function useScrollEvents(onScroll?: ScrollEventCallback) {
  useEffect(() => {
    if (!onScroll || !lenis) return;

    // Добавляем обработчик события скролла
    lenis.on("scroll", onScroll);

    return () => {
      // Удаляем обработчик при размонтировании
      lenis.off("scroll", onScroll);
    };
  }, [onScroll]);
}

export default useScrollEvents;
