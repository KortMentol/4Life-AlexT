/**
 * @module src/hooks/useImageOptimization.ts
 * @description Хук для оптимизации загрузки и отображения изображений.
 * Включает lazy loading, WebP поддержку и адаптивные размеры.
 * @author Kort
 * @version 1.0.0
 * @usage
 * 1. `src/components/ui/ProductCatalog.tsx` - оптимизация изображений продуктов
 * @example
 * const { isLoaded, imageRef } = useImageOptimization({
 *   src: product.image,
 *   alt: product.name
 * });
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseImageOptimizationOptions {
  src: string;
  alt: string;
}

interface ImageOptimizationResult {
  isLoaded: boolean;
  isError: boolean;
  imageRef: React.RefObject<HTMLImageElement>;
  load: () => void;
}

export const useImageOptimization = ({
  src
}: Omit<UseImageOptimizationOptions, 'alt'>): ImageOptimizationResult => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Упрощенная логика без IntersectionObserver — браузер сам управляет loading="lazy"
  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    const handleLoad = () => setIsLoaded(true);
    const handleError = () => setIsError(true);

    if (img.complete) {
      setIsLoaded(true);
    } else {
      img.addEventListener('load', handleLoad);
      img.addEventListener('error', handleError);
    }

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src]);

  const load = useCallback(() => {
    // Пустая функция для совместимости
  }, []);

  return {
    isLoaded,
    isError,
    imageRef,
    load
  };
};

export default useImageOptimization;