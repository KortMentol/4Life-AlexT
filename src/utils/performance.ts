/**
 * @module src/utils/performance.ts
 * @description Утилиты для оптимизации производительности ProductsPage и других компонентов
 * @author Kort
 * @version 1.0.0
 * @usage
 * 1. **src/pages/ProductsPage.tsx**: Используется для оптимизации анимаций и предзагрузки ресурсов
 * @example
 * import { preloadImages, optimizeAnimations } from '@/utils/performance';
 * 
 * // Предзагрузка изображений
 * preloadImages(['/image1.jpg', '/image2.jpg']);
 * 
 * // Оптимизация анимаций
 * optimizeAnimations();
 */

// Предзагрузка изображений для улучшения производительности
export const preloadImages = (imageUrls: string[]): Promise<void[]> => {
  return Promise.all(
    imageUrls.map((url) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    })
  );
};

// Оптимизация анимаций для слабых устройств
export const optimizeAnimations = (): void => {
  // Проверяем производительность устройства
  const isLowEndDevice = () => {
    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const memory = (navigator as any).deviceMemory;
    const cores = navigator.hardwareConcurrency;

    // Определяем слабое устройство по нескольким критериям
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    const isLowMemory = memory && memory < 4;
    const isLowCores = cores && cores < 4;

    return isSlowConnection || isLowMemory || isLowCores;
  };

  if (isLowEndDevice()) {
    // Уменьшаем количество анимаций для слабых устройств
    document.documentElement.style.setProperty('--animation-duration', '0.2s');
    document.documentElement.style.setProperty('--animation-delay', '0.05s');
  }
};

// Debounce функция для оптимизации событий
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle функция для оптимизации скролла
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Intersection Observer для lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Проверка поддержки WebP
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Оптимизация изображений
export const getOptimizedImageUrl = (url: string, width?: number, quality?: number): string => {
  if (url.includes('unsplash.com')) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (quality) params.set('q', quality.toString());
    params.set('auto', 'format');
    params.set('fit', 'crop');
    
    return `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
  }
  
  return url;
};

// Предзагрузка критических ресурсов
export const preloadCriticalResources = (): void => {
  // Предзагружаем шрифты
  const fontUrls = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
  ];

  fontUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = url;
    document.head.appendChild(link);
  });

  // Предзагружаем критические изображения
  const criticalImages = [
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop'
  ];

  preloadImages(criticalImages).catch(console.warn);
};

// Оптимизация GSAP анимаций
export const optimizeGSAP = (): void => {
  // Включаем аппаратное ускорение для всех GSAP анимаций
  if (typeof window !== 'undefined' && window.gsap) {
    window.gsap.config({
      force3D: true,
      nullTargetWarn: false,
    });

    // Устанавливаем оптимальные настройки для производительности
    window.gsap.defaults({
      ease: 'power2.out',
      duration: 0.6,
    });
  }
};

// Мониторинг производительности
export const measurePerformance = (name: string, fn: () => void): void => {
  if (typeof window !== 'undefined' && window.performance) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  } else {
    fn();
  }
};

// Очистка ресурсов при размонтировании
export const cleanup = (): void => {
  // Очищаем все таймеры GSAP
  if (typeof window !== 'undefined' && window.gsap) {
    window.gsap.killTweensOf('*');
  }

  // Очищаем все intersection observers
  const observers = (window as any).__intersectionObservers || [];
  observers.forEach((observer: IntersectionObserver) => {
    observer.disconnect();
  });
  (window as any).__intersectionObservers = [];
};