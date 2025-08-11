/**
 * @module src/hooks/useWindowSize.ts
 * @description Хук для отслеживания размеров окна браузера и определения типа устройства. Предоставляет актуальные данные о ширине и высоте окна, типе устройства (мобильное, планшет, десктоп) и ориентации экрана. Автоматически обновляется при изменении размеров окна и корректно работает с SSR (Server-Side Rendering).
 * @author Kort
 * @version 1.0.0
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth - Документация по Window.innerWidth
 * @usage
 * 1. `src/components/layout/Header.tsx`: Для адаптации хедера под разные размеры экрана и отображения соответствующей версии меню.
 * 2. `src/components/layout/Layout.tsx`: Для изменения структуры макета в зависимости от размера экрана.
 * 3. `src/components/ui/ResponsiveGrid.tsx`: Для динамического изменения количества колонок в сетке.
 * 4. `src/hooks/useResponsiveValue.ts`: Для выбора значений в зависимости от размера экрана.
 * 5. `src/components/sections/Hero.tsx`: Для адаптации размеров и расположения элементов hero секции.
 * @example
 * // Базовое использование
 * const { width, height, isMobile } = useWindowSize();
 *
 * // Использование для условного рендеринга
 * return (
 *   <div>
 *     {isMobile ? (
 *       <MobileComponent />
 *     ) : isTablet ? (
 *       <TabletComponent />
 *     ) : (
 *       <DesktopComponent />
 *     )}
 *
 *     <div style={{ maxWidth: width * 0.8 }}>
 *       Контент с адаптивной шириной
 *     </div>
 *   </div>
 * );
 */
import { useState, useEffect } from "react";

/**
 * Интерфейс для данных о размере окна и типе устройства
 * @interface WindowSize
 */
interface WindowSize {
  /** Ширина окна браузера в пикселях */
  width: number;
  /** Высота окна браузера в пикселях */
  height: number;
  /** Флаг, указывающий, что устройство мобильное (ширина < 768px) */
  isMobile: boolean;
  /** Флаг, указывающий, что устройство планшет (ширина >= 768px и < 1024px) */
  isTablet: boolean;
  /** Флаг, указывающий, что устройство десктопное (ширина >= 1024px) */
  isDesktop: boolean;
  /** Ориентация экрана: 'portrait' (вертикальная) или 'landscape' (горизонтальная) */
  orientation: "portrait" | "landscape";
}

/**
 * Хук для отслеживания размеров окна браузера и определения типа устройства
 * @returns Объект с информацией о размерах окна и типе устройства
 */
export const useWindowSize = (): WindowSize => {
  // Инициализируем с размерами окна или с нулями, если window не определен (для SSR)
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    orientation: "portrait",
  });

  useEffect(() => {
    /**
     * Обновляет состояние с текущими размерами окна и определяет тип устройства
     */
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Определяем тип устройства на основе ширины экрана
      // Эти пороговые значения соответствуют стандартным брейкпоинтам в CSS
      const isMobile = width < 768; // Мобильные устройства (до 767px)
      const isTablet = width >= 768 && width < 1024; // Планшеты (768px - 1023px)
      const isDesktop = width >= 1024; // Десктопы (от 1024px)

      // Определяем ориентацию экрана
      const orientation = width > height ? "landscape" : "portrait";

      setWindowSize({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
        orientation,
      });
    };

    // Добавляем обработчик события resize
    window.addEventListener("resize", handleResize);

    // Вызываем функцию один раз для инициализации
    handleResize();

    // Удаляем обработчик при размонтировании компонента
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};
