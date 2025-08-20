/**
 * @module src/hooks/useVirtualization.ts
 * @description Хук для виртуализации больших списков продуктов.
 * Оптимизирует производительность при отображении множества элементов.
 * @author Kort
 * @version 1.0.0
 * @usage
 * 1. `src/components/ui/ProductCatalogGrid.tsx` - виртуализация каталога продуктов
 * @example
 * const { visibleItems, containerRef } = useVirtualization({
 *   items: products,
 *   itemHeight: 400,
 *   containerHeight: 800
 * });
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UseVirtualizationOptions<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  enabled?: boolean;
}

interface VirtualItem<T> {
  item: T;
  index: number;
  offsetTop: number;
}

export const useVirtualization = <T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
  enabled = true
}: UseVirtualizationOptions<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Если виртуализация отключена, возвращаем все элементы
  if (!enabled) {
    return {
      visibleItems: items.map((item, index) => ({
        item,
        index,
        offsetTop: index * itemHeight
      })),
      containerRef,
      totalHeight: items.length * itemHeight,
      scrollToIndex: () => {}
    };
  }

  // Вычисляем видимые элементы
  const visibleItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visible: VirtualItem<T>[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const item = items[i];
      if (item !== undefined) {
        visible.push({
          item,
          index: i,
          offsetTop: i * itemHeight
        });
      }
    }

    return visible;
  }, [items, itemHeight, scrollTop, containerHeight, overscan]);

  // Общая высота контейнера
  const totalHeight = items.length * itemHeight;

  // Обработчик скролла
  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  // Функция для скролла к определенному индексу
  const scrollToIndex = useCallback((index: number) => {
    if (containerRef.current) {
      const offsetTop = index * itemHeight;
      containerRef.current.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }, [itemHeight]);

  // Подписка на события скролла
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    visibleItems,
    containerRef,
    totalHeight,
    scrollToIndex
  };
};

export default useVirtualization;