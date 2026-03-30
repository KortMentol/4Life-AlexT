/**
 * @module src/utils/performanceUtils.ts
 * @description Утилиты для оптимизации производительности
 * @author Kort
 * @version 2.0.0 - Cleaned up (2026)
 * @usage
 * - src/hooks/useMediaQuery.ts - использует debounce
 */

/**
 * Debounce функция для оптимизации событий
 * Откладывает выполнение функции до тех пор, пока не пройдет указанное время с последнего вызова
 * @param func - Функция для debounce
 * @param wait - Время ожидания в миллисекундах
 * @returns Debounced функция
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
