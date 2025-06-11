/**
 * Функция для ограничения частоты вызовов функции (throttle)
 * @param callback Функция, которую нужно ограничить
 * @param delay Задержка в миллисекундах
 * @returns Функция с ограниченной частотой вызовов
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: number | null = null;

  return function (...args: Parameters<T>) {
    const now = Date.now();
    const remaining = delay - (now - lastCall);

    if (remaining <= 0) {
      // Если прошло достаточно времени, вызываем функцию немедленно
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      lastCall = now;
      callback(...args);
    } else if (!timeoutId) {
      // Иначе планируем вызов в конце периода throttle
      timeoutId = window.setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        callback(...args);
      }, remaining);
    }
  };
}

/**
 * Функция для отложенного вызова функции (debounce)
 * @param callback Функция, вызов которой нужно отложить
 * @param delay Задержка в миллисекундах
 * @returns Функция с отложенным вызовом
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      callback(...args);
      timeoutId = null;
    }, delay);
  };
}
