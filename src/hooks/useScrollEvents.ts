import { lenis } from "@/lib/lenis";
import { LenisScrollCallback } from "@/lib/lenis.types";
import { useEffect } from "react";

/**
 * Хук для добавления обработчиков событий скролла с использованием Lenis
 * @param onScroll - Функция обратного вызова, вызываемая при скролле
 */
export function useScrollEvents(onScroll?: LenisScrollCallback) {
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
