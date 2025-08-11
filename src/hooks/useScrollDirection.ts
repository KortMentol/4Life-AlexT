/**
 * @module src/hooks/useScrollDirection.ts
 * @description Хук для отслеживания направления и состояния прокрутки страницы. Предоставляет информацию о текущем направлении скролла (вверх/вниз), позиции скролла, нахождении в начале или конце страницы, а также о прогрессе прокрутки. Используется для создания интерактивных элементов интерфейса, реагирующих на скролл пользователя.
 * @author Kort
 * @version 1.0.0
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY - Документация по Window.scrollY
 * @usage
 * 1. `src/components/layout/Header.tsx`: Для создания хедера, который скрывается при скролле вниз и появляется при скролле вверх.
 * 2. `src/components/navigation/ScrollProgressBar.tsx`: Для отображения индикатора прогресса прокрутки страницы.
 * 3. `src/components/ui/BackToTopButton.tsx`: Для показа кнопки "Наверх" при скролле вниз.
 * 4. `src/components/sections/InfiniteScroll.tsx`: Для реализации бесконечной прокрутки контента.
 * 5. `src/hooks/useParallax.ts`: Для создания эффекта параллакса, зависящего от направления скролла.
 * @example
 * // Базовое использование
 * const { scrollDirection, isScrolled } = useScrollDirection();
 *
 * // Использование с настройками
 * const { scrollDirection, scrollY, isAtBottom, scrollProgress } = useScrollDirection({
 *   threshold: 20,
 *   initialDirection: 'down'
 * });
 *
 * // Применение в компоненте
 * return (
 *   <header className={`sticky-header ${scrollDirection === 'down' && !isAtTop ? 'hidden' : ''}`}>
 *     { Содержимое хедера }
 *   </header>
 * );
 */
import { useState, useEffect } from "react";
import { lenis } from "../lib/lenis"; // Импортируем экземпляр lenis
import type { LenisScrollCallback } from "../lib/lenis.types";

/**
 * Результат работы хука useScrollDirection
 * @interface UseScrollDirectionReturn
 */
interface UseScrollDirectionReturn {
  /** Текущее направление скролла: 'up' (вверх), 'down' (вниз) или null (не определено) */
  scrollDirection: "up" | "down" | null;
  /** Текущая позиция скролла в пикселях от верха страницы */
  scrollY: number;
  /** Флаг, указывающий, прокручена ли страница ниже порогового значения (50px) */
  isScrolled: boolean;
  /** Флаг, указывающий, находится ли страница в самом верху (scrollY = 0) */
  isAtTop: boolean;
  /** Флаг, указывающий, достигнут ли конец страницы */
  isAtBottom: boolean;
  /** Прогресс прокрутки страницы от 0 (верх) до 1 (низ) */
  scrollProgress: number;
}

/**
 * Хук для отслеживания направления и состояния прокрутки страницы
 * @param options - Объект с настройками
 * @returns Объект с информацией о текущем состоянии прокрутки
 */
export const useScrollDirection = (): UseScrollDirectionReturn => {
  // Состояния для хранения информации о скролле
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    "down",
  );
  const [scrollY, setScrollY] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    if (!lenis) return;

    // Функция-обработчик, которую будет вызывать lenis
    type ScrollInfo = Parameters<LenisScrollCallback>[0];
    const handleScroll = (e: ScrollInfo) => {
      const currentScrollY = e.scroll;

      // Обновляем направление скролла
      setScrollDirection(e.direction === 1 ? "down" : "up");
      // Обновляем текущую позицию скролла
      setScrollY(currentScrollY);
      // Определяем, прокручена ли страница ниже порога
      setIsScrolled(currentScrollY > 50);
      // Определяем, находимся ли мы в самом верху страницы
      setIsAtTop(currentScrollY <= 1); // Небольшой допуск для lenis

      // Определяем, находимся ли мы внизу страницы, используя данные lenis
      const isBottom = currentScrollY >= e.limit - 1; // e.limit - максимальная позиция скролла
      setIsAtBottom(isBottom);

      // Используем прогресс напрямую из lenis
      setScrollProgress(e.progress);
    };

    // Подписываемся на событие 'scroll' от lenis
    lenis.on("scroll", handleScroll);

    // Инициализируем состояние без обращения к приватным свойствам lenis
    const initialY = typeof window !== "undefined" ? window.scrollY : 0;
    const limit =
      typeof document !== "undefined"
        ? Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight,
          )
        : 0;
    setScrollY(initialY);
    setIsScrolled(initialY > 50);
    setIsAtTop(initialY <= 1);
    setIsAtBottom(initialY >= Math.max(0, limit - 1));
    setScrollProgress(limit > 0 ? initialY / limit : 0);

    // Отписываемся от события при размонтировании компонента
    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, []); // Пустой массив зависимостей, т.к. lenis - синглтон

  return {
    scrollDirection,
    scrollY,
    isScrolled,
    isAtTop,
    isAtBottom,
    scrollProgress,
  };
};
