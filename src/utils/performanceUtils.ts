/**
 * @module src/utils/performanceUtils.ts
 * @description Набор утилит для оптимизации производительности и управления выполнением функций. Предоставляет функции для дебаунса (отложенное выполнение), тротлинга (ограничение частоты вызовов), кеширования результатов и измерения производительности. Также включает утилиты для работы с асинхронными операциями и оптимизации анимаций.
 * @author Kort
 * @version 1.0.0
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Performance - Документация по API Performance
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame - Документация по requestAnimationFrame
 * @usage
 * 1. `src/hooks/useScroll.ts`: Для тротлинга обработчика события скролла.
 * 2. `src/components/ui/SearchInput.tsx`: Для дебаунса поисковых запросов.
 * 3. `src/hooks/useWindowSize.ts`: Для тротлинга обработчика изменения размера окна.
 * 4. `src/utils/apiUtils.ts`: Для кеширования результатов API-запросов.
 * 5. `src/components/effects/ParallaxSection.tsx`: Для оптимизации анимаций параллакс-эффекта.
 * @example
 * // Использование дебаунса для поисковых запросов
 * const handleSearch = (query: string) => {
 *   // Выполнение поиска
 * };
 * 
 * const debouncedSearch = debounce(handleSearch, 300);
 * 
 * // Использование тротлинга для обработки скролла
 * const handleScroll = () => {
 *   // Обработка события скролла
 * };
 * 
 * const throttledScroll = throttle(handleScroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 * 
 * // Измерение производительности функции
 * const measuredFunction = measurePerformance(expensiveFunction, 'ExpensiveOperation');
 * measuredFunction(); // Выведет время выполнения в консоль
 */

/**
 * Функция для дебаунса
 * @param func Функция для дебаунса
 * @param wait Время ожидания в миллисекундах
 * @param immediate Флаг для немедленного вызова функции
 * @returns Функция с дебаунсом
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

/**
 * Функция для тротлинга
 * @param func Функция для тротлинга
 * @param limit Лимит времени в миллисекундах
 * @returns Функция с тротлингом
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    } else {
      clearTimeout(lastFunc);
      
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Функция для измерения времени выполнения функции
 * @param func Функция для измерения времени выполнения
 * @param name Название функции
 * @returns Функция с измерением времени выполнения
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  name: string = 'Function'
): (...args: Parameters<T>) => ReturnType<T> {
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const start = performance.now();
    const result = func.apply(this, args);
    const end = performance.now();
    
    console.log(`${name} took ${end - start} ms`);
    
    return result;
  };
}

/**
 * Функция для кеширования результатов функции
 * @param func Функция для кеширования результатов
 * @param resolver Функция для получения ключа кеша
 * @returns Функция с кешированием результатов
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();
  
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = func.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
}

/**
 * Функция для отложенного выполнения функции
 * @param func Функция для отложенного выполнения
 * @param ms Время задержки в миллисекундах
 * @returns Promise с результатом функции
 */
export function delay<T>(func: () => T, ms: number): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(func());
    }, ms);
  });
}

/**
 * Функция для выполнения функции в следующем кадре анимации
 * @param func Функция для выполнения
 * @returns Promise с результатом функции
 */
export function nextFrame<T>(func: () => T): Promise<T> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve(func());
    });
  });
}

/**
 * Функция для выполнения функции в режиме idle
 * @param func Функция для выполнения
 * @param timeout Таймаут в миллисекундах
 * @returns Promise с результатом функции
 */
export function idle<T>(func: () => T, timeout: number = 1000): Promise<T> {
  return new Promise((resolve) => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(
        () => {
          resolve(func());
        },
        { timeout }
      );
    } else {
      setTimeout(() => {
        resolve(func());
      }, 0);
    }
  });
}

/**
 * Функция для выполнения функции в режиме микрозадачи
 * @param func Функция для выполнения
 * @returns Promise с результатом функции
 */
export function microtask<T>(func: () => T): Promise<T> {
  return Promise.resolve().then(func);
}

/**
 * Функция для выполнения функции в режиме макрозадачи
 * @param func Функция для выполнения
 * @returns Promise с результатом функции
 */
export function macrotask<T>(func: () => T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(func());
    }, 0);
  });
}