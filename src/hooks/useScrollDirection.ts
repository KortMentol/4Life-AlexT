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
import { useState, useEffect, useRef } from 'react';

/**
 * Параметры для настройки хука useScrollDirection
 * @interface UseScrollDirectionOptions
 */
interface UseScrollDirectionOptions {
  /** 
   * Минимальное изменение позиции скролла (в пикселях) для определения направления
   * Помогает избежать ложных срабатываний при небольших колебаниях скролла
   * @default 10
   */
  threshold?: number;
  /** 
   * Начальное направление скролла
   * @default null
   */
  initialDirection?: 'up' | 'down' | null;
}

/**
 * Результат работы хука useScrollDirection
 * @interface UseScrollDirectionReturn
 */
interface UseScrollDirectionReturn {
  /** Текущее направление скролла: 'up' (вверх), 'down' (вниз) или null (не определено) */
  scrollDirection: 'up' | 'down' | null;
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
export const useScrollDirection = ({
  threshold = 10,
  initialDirection = null
}: UseScrollDirectionOptions = {}): UseScrollDirectionReturn => {
  // Состояния для хранения информации о скролле
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(initialDirection);
  const [scrollY, setScrollY] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  
  // Сохраняем предыдущую позицию скролла для определения направления
  const lastScrollY = useRef<number>(0);
  
  useEffect(() => {
    /**
     * Обновляет информацию о скролле при прокрутке страницы
     */
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      
      // Проверяем, превышает ли изменение скролла пороговое значение
      if (Math.abs(currentScrollY - lastScrollY.current) < threshold) {
        return;
      }
      
      // Обновляем направление скролла
      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
      // Обновляем текущую позицию скролла
      setScrollY(currentScrollY);
      // Определяем, прокручена ли страница ниже порога
      setIsScrolled(currentScrollY > 50);
      // Определяем, находимся ли мы в самом верху страницы
      setIsAtTop(currentScrollY <= 0);
      
      // Определяем, находимся ли мы внизу страницы
      // Добавляем небольшой запас (5px) для компенсации погрешностей округления
      const isBottom = 
        window.innerHeight + currentScrollY >= 
        document.documentElement.scrollHeight - 5;
      
      setIsAtBottom(isBottom);
      
      // Вычисляем прогресс скролла (0 - верх, 1 - низ)
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? currentScrollY / scrollHeight : 0;
      setScrollProgress(progress);
      
      // Сохраняем текущую позицию для следующего вызова
      lastScrollY.current = currentScrollY;
    };
    
    // Добавляем слушатель события скролла
    window.addEventListener('scroll', updateScrollDirection, { passive: true });
    
    // Вызываем функцию один раз для инициализации
    updateScrollDirection();
    
    // Удаляем слушатель при размонтировании
    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, [threshold]);
  
  return { 
    scrollDirection, 
    scrollY, 
    isScrolled, 
    isAtTop, 
    isAtBottom, 
    scrollProgress 
  };
};