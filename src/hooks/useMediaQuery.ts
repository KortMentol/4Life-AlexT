/**
 * @module src/hooks/useMediaQuery.ts
 * @description Набор хуков для работы с CSS медиа-запросами в React-компонентах. Основной хук useMediaQuery позволяет отслеживать соответствие заданному медиа-запросу, а дополнительные хуки предоставляют готовые решения для распространенных сценариев: определение типа устройства, ориентации экрана, предпочтений пользователя по доступности. Все хуки реактивно обновляют компоненты при изменении условий.
 * @author Kort
 * @version 1.0.0
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
import { useEffect, useState } from 'react';
import { debounce } from '../utils/performanceUtils';

/**
 * Основной хук для работы с медиа-запросами
 * @param query CSS медиа-запрос (например, '(max-width: 768px)')
 * @returns Булево значение, указывающее соответствует ли текущее состояние медиа-запросу
 */
export const useMediaQuery = (query: string): boolean => {
  // Проверяем, доступно ли window (для SSR)
  const getMatches = (): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches());

  useEffect(() => {
    // Функция для обновления состояния
    const handleChange = () => {
      setMatches(getMatches());
    };

    // Дебаунсим функцию для оптимизации производительности
    const debouncedHandleChange = debounce(handleChange, 100);

    // Создаем медиа-запрос
    const matchMedia = window.matchMedia(query);

    // Добавляем слушатель событий с учетом кроссбраузерности
    if (matchMedia.addEventListener) {
      matchMedia.addEventListener('change', debouncedHandleChange);
    } else {
      // Для старых браузеров
      matchMedia.addListener(debouncedHandleChange);
    }

    // Вызываем функцию один раз для инициализации
    handleChange();

    // Удаляем слушатель событий при размонтировании
    return () => {
      if (matchMedia.removeEventListener) {
        matchMedia.removeEventListener('change', debouncedHandleChange);
      } else {
        // Для старых браузеров
        matchMedia.removeListener(debouncedHandleChange);
      }
    };
  }, [query]);

  return matches;
};

/**
 * Хук для определения мобильных устройств (ширина экрана до 767px)
 * @returns true для мобильных устройств, иначе false
 */
export const useIsMobile = (): boolean => useMediaQuery('(max-width: 767px)');

/**
 * Хук для определения планшетов (ширина экрана от 768px до 1023px)
 * @returns true для планшетов, иначе false
 */
export const useIsTablet = (): boolean => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

/**
 * Хук для определения десктопных устройств (ширина экрана от 1024px)
 * @returns true для десктопных устройств, иначе false
 */
export const useIsDesktop = (): boolean => useMediaQuery('(min-width: 1024px)');

/**
 * Хук для определения больших десктопных экранов (ширина от 1280px)
 * @returns true для больших десктопных экранов, иначе false
 */
export const useIsLargeDesktop = (): boolean => useMediaQuery('(min-width: 1280px)');

/**
 * Хук для определения очень больших десктопных экранов (ширина от 1536px)
 * @returns true для очень больших десктопных экранов, иначе false
 */
export const useIsXLargeDesktop = (): boolean => useMediaQuery('(min-width: 1536px)');

/**
 * Хук для определения ориентации устройства
 * @returns 'portrait' для вертикальной ориентации, 'landscape' для горизонтальной
 */
export const useOrientation = (): 'portrait' | 'landscape' => {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  return isPortrait ? 'portrait' : 'landscape';
};

/**
 * Хук для определения поддержки hover (наведения указателя)
 * @returns true, если устройство поддерживает hover (обычно десктопы), иначе false (обычно тачскрины)
 */
export const useHoverSupport = (): boolean => {
  return useMediaQuery('(hover: hover)');
};

/**
 * Хук для определения предпочтений пользователя по уменьшению движения
 * Полезно для пользователей с вестибулярными расстройствами или для экономии энергии
 * @returns true, если пользователь предпочитает уменьшенное движение, иначе false
 */
export const useReducedMotion = (): boolean => {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
};

/**
 * Хук для определения предпочтений пользователя по контрастности
 * Полезно для пользователей с нарушениями зрения
 * @returns true, если пользователь предпочитает высокую контрастность, иначе false
 */
export const useHighContrast = (): boolean => {
  return useMediaQuery('(prefers-contrast: more)');
};

/**
 * Хук для определения предпочтений пользователя по прозрачности
 * Полезно для пользователей с когнитивными нарушениями
 * @returns true, если пользователь предпочитает уменьшенную прозрачность, иначе false
 */
export const useReducedTransparency = (): boolean => {
  return useMediaQuery('(prefers-reduced-transparency: reduce)');
};