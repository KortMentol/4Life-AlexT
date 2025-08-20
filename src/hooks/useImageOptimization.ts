/**
 * @module src/hooks/useImageOptimization.ts
 * @description Хук для оптимизации загрузки и отображения изображений.
 * Включает lazy loading, WebP поддержку и адаптивные размеры.
 * @author Kort
 * @version 1.0.0
 * @usage
 * 1. `src/components/ui/ProductCatalogGrid.tsx` - оптимизация изображений продуктов
 * @example
 * const { optimizedSrc, isLoaded, imageRef } = useImageOptimization({
 *   src: product.image,
 *   alt: product.name,
 *   lazy: true
 * });
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseImageOptimizationOptions {
  src: string;
  alt: string;
  lazy?: boolean;
  webpSupport?: boolean;
  sizes?: string;
  quality?: number;
}

interface ImageOptimizationResult {
  optimizedSrc: string;
  isLoaded: boolean;
  isError: boolean;
  imageRef: React.RefObject<HTMLImageElement>;
  load: () => void;
}

// Проверка поддержки WebP
const checkWebPSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Кеш для проверки WebP поддержки
let webpSupportCache: boolean | null = null;

export const useImageOptimization = ({
  src,
  lazy = true,
  webpSupport = true,
  sizes,
  quality = 80
}: Omit<UseImageOptimizationOptions, 'alt'>): ImageOptimizationResult => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState(src);
  const [shouldLoad, setShouldLoad] = useState(!lazy);
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Оптимизация URL изображения
  const optimizeImageUrl = useCallback(async (originalSrc: string) => {
    let optimized = originalSrc;

    // Проверяем поддержку WebP
    if (webpSupport) {
      if (webpSupportCache === null) {
        webpSupportCache = await checkWebPSupport();
      }
      
      if (webpSupportCache && !originalSrc.includes('.webp')) {
        // Если это внешний URL, можем попробовать добавить параметры оптимизации
        if (originalSrc.startsWith('http')) {
          const url = new URL(originalSrc);
          url.searchParams.set('format', 'webp');
          url.searchParams.set('quality', quality.toString());
          if (sizes) {
            url.searchParams.set('w', sizes);
          }
          optimized = url.toString();
        }
      }
    }

    return optimized;
  }, [webpSupport, quality, sizes]);

  // Intersection Observer для lazy loading
  useEffect(() => {
    if (!lazy || shouldLoad) return;

    const currentImageRef = imageRef.current;
    if (!currentImageRef) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    observerRef.current.observe(currentImageRef);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, shouldLoad]);

  // Загрузка и оптимизация изображения
  useEffect(() => {
    if (!shouldLoad) return;

    const loadImage = async () => {
      try {
        setIsError(false);
        const optimized = await optimizeImageUrl(src);
        setOptimizedSrc(optimized);

        // Предзагрузка изображения
        const img = new Image();
        img.onload = () => {
          setIsLoaded(true);
        };
        img.onerror = () => {
          setIsError(true);
          // Fallback к оригинальному изображению
          if (optimized !== src) {
            setOptimizedSrc(src);
            const fallbackImg = new Image();
            fallbackImg.onload = () => setIsLoaded(true);
            fallbackImg.onerror = () => setIsError(true);
            fallbackImg.src = src;
          }
        };
        img.src = optimized;
      } catch (error) {
        console.warn('Image optimization failed:', error);
        setOptimizedSrc(src);
        setIsError(true);
      }
    };

    loadImage();
  }, [shouldLoad, src, optimizeImageUrl]);

  // Функция для принудительной загрузки
  const load = useCallback(() => {
    setShouldLoad(true);
  }, []);

  return {
    optimizedSrc,
    isLoaded,
    isError,
    imageRef,
    load
  };
};

export default useImageOptimization;