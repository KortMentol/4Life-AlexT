// Кэш для отслеживания уже предзагруженных URL, чтобы не делать лишнюю работу.
const preloadedUrls = new Set<string>();

/**
 * Асинхронно предзагружает изображение в кэш браузера.
 * @param src URL изображения для предзагрузки.
 */
export const preloadImage = (src: string): void => {
  // Если URL уже в кэше или не является строкой, ничего не делаем.
  if (!src || preloadedUrls.has(src)) {
    return;
  }

  // Создаем новый объект Image, чтобы инициировать загрузку.
  const img = new Image();
  img.src = src;

  // Как только изображение загружено (успешно или с ошибкой), добавляем URL в кэш.
  // Это гарантирует, что мы не будем пытаться загрузить одно и то же изображение несколько раз.
  const markAsPreloaded = () => preloadedUrls.add(src);
  img.onload = markAsPreloaded;
  img.onerror = markAsPreloaded;
};
