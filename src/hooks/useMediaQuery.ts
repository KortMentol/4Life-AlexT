/**
 * @module src/hooks/useMediaQuery.ts
 * @description Набор хуков для работы с CSS медиа-запросами в React-компонентах. Основной хук useMediaQuery позволяет отслеживать соответствие заданному медиа-запросу, а дополнительные хуки предоставляют готовые решения для распространенных сценариев: определение типа устройства, ориентации экрана, предпочтений пользователя по доступности. Все хуки реактивно обновляют компоненты при изменении условий.
 * @author Kort
 * @version 2.0.0 - Singleton listeners (one matchMedia per unique query)
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries - Документация по CSS медиа-запросам
 * @usage
 * 1. `src/components/layout/Header.tsx`: Для адаптации хедера под разные размеры экрана и отображения мобильного меню.
 * 2. `src/components/layout/Layout.tsx`: Для изменения структуры макета в зависимости от размера экрана.
 * 3. `src/components/ui/Button.tsx`: Для изменения размеров и поведения кнопок на разных устройствах.
 * 4. `src/components/animations/Motion.tsx`: Для отключения анимаций при предпочтении уменьшенного движения.
 * 5. `src/hooks/useTheme.ts`: Для определения предпочтений пользователя по цветовой схеме.
 * @example
 * // Использование базового хука
 * const isMobile = useMediaQuery('(max-width: 768px)');
 *
 * // Использование предопределенных хуков
 * const isMobile = useIsMobile();
 * const isDesktop = useIsDesktop();
 * const prefersReducedMotion = useReducedMotion();
 *
 * // Применение в компоненте
 * return (
 *   <div className={isMobile ? "mobile-layout" : "desktop-layout"}>
 *     {isMobile ? <MobileMenu /> : <DesktopNavigation />}
 *     {!prefersReducedMotion && <AnimatedBackground />}
 *   </div>
 * );
 */
import { useEffect, useState } from "react";

// ─── Singleton Map ────────────────────────────────────────────────────────────
// Один matchMedia listener на каждый уникальный query-строку.
// Все компоненты подписываются через Set callbacks — нет дублирующих listeners.
interface QueryEntry {
  mql: MediaQueryList;
  callbacks: Set<(matches: boolean) => void>;
  handler: (e: MediaQueryListEvent) => void;
}

const queryMap = new Map<string, QueryEntry>();

function getOrCreateEntry(query: string): QueryEntry {
  let entry = queryMap.get(query);
  if (!entry) {
    const mql = window.matchMedia(query);
    const callbacks = new Set<(matches: boolean) => void>();
    const handler = (e: MediaQueryListEvent) => {
      callbacks.forEach((cb) => cb(e.matches));
    };
    mql.addEventListener("change", handler);
    entry = { mql, callbacks, handler };
    queryMap.set(query, entry);
  }
  return entry;
}

function subscribe(query: string, cb: (matches: boolean) => void): () => void {
  const entry = getOrCreateEntry(query);
  entry.callbacks.add(cb);
  return () => {
    entry.callbacks.delete(cb);
    // Если подписчиков не осталось — убираем listener и запись из Map
    if (entry.callbacks.size === 0) {
      entry.mql.removeEventListener("change", entry.handler);
      queryMap.delete(query);
    }
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Основной хук для работы с медиа-запросами.
 * Использует синглтон-паттерн: один matchMedia listener на уникальный query.
 * @param query CSS медиа-запрос (например, '(max-width: 768px)')
 * @returns Булево значение, указывающее соответствует ли текущее состояние медиа-запросу
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Синхронизируем начальное значение (на случай SSR-гидрации)
    setMatches(window.matchMedia(query).matches);

    // Подписываемся через синглтон — один listener на весь query
    const unsubscribe = subscribe(query, setMatches);
    return unsubscribe;
  }, [query]);

  return matches;
};

/**
 * Хук для определения мобильных устройств (ширина экрана до 767px)
 * @returns true для мобильных устройств, иначе false
 */
export const useIsMobile = (): boolean => useMediaQuery("(max-width: 767px)");

/**
 * Хук для определения планшетов (ширина экрана от 768px до 1023px)
 * @returns true для планшетов, иначе false
 */
export const useIsTablet = (): boolean =>
  useMediaQuery("(min-width: 768px) and (max-width: 1023px)");

/**
 * Хук для определения десктопных устройств (ширина экрана от 1024px)
 * @returns true для десктопных устройств, иначе false
 */
export const useIsDesktop = (): boolean => useMediaQuery("(min-width: 1024px)");

/**
 * Хук для определения больших десктопных экранов (ширина от 1280px)
 * @returns true для больших десктопных экранов, иначе false
 */
export const useIsLargeDesktop = (): boolean =>
  useMediaQuery("(min-width: 1280px)");

/**
 * Хук для определения очень больших десктопных экранов (ширина от 1536px)
 * @returns true для очень больших десктопных экранов, иначе false
 */
export const useIsXLargeDesktop = (): boolean =>
  useMediaQuery("(min-width: 1536px)");

/**
 * Хук для определения ориентации устройства
 * @returns 'portrait' для вертикальной ориентации, 'landscape' для горизонтальной
 */
export const useOrientation = (): "portrait" | "landscape" => {
  const isPortrait = useMediaQuery("(orientation: portrait)");
  return isPortrait ? "portrait" : "landscape";
};

/**
 * Хук для определения поддержки hover (наведения указателя)
 * @returns true, если устройство поддерживает hover (обычно десктопы), иначе false (обычно тачскрины)
 */
export const useHoverSupport = (): boolean => {
  return useMediaQuery("(hover: hover)");
};

/**
 * Хук для определения предпочтений пользователя по уменьшению движения
 * Полезно для пользователей с вестибулярными расстройствами или для экономии энергии
 * @returns true, если пользователь предпочитает уменьшенное движение, иначе false
 */
export const useReducedMotion = (): boolean => {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
};

/**
 * Хук для определения предпочтений пользователя по контрастности
 * Полезно для пользователей с нарушениями зрения
 * @returns true, если пользователь предпочитает высокую контрастность, иначе false
 */
export const useHighContrast = (): boolean => {
  return useMediaQuery("(prefers-contrast: more)");
};

/**
 * Хук для определения предпочтений пользователя по прозрачности
 * Полезно для пользователей с когнитивными нарушениями
 * @returns true, если пользователь предпочитает уменьшенную прозрачность, иначе false
 */
export const useReducedTransparency = (): boolean => {
  return useMediaQuery("(prefers-reduced-transparency: reduce)");
};
