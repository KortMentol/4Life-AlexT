/**
 * @module src/utils/navigationUtils.ts
 * @description Набор утилит для управления навигацией и скроллом в приложении. Предоставляет функции для плавного скролла к верху страницы, навигации между страницами и обработки кликов по ссылкам. Оптимизировано для работы с библиотекой Lenis для плавного скролла и адаптировано для различных типов устройств.
 * @author Kort
 * @version 1.0.0
 * @see https://github.com/studio-freight/lenis - Документация по библиотеке Lenis
 * @see https://reactrouter.com/en/main - Документация по React Router
 * @usage
 * 1. `src/components/layout/Header.tsx`: Для обработки кликов по ссылкам в навигации.
 * 2. `src/components/ui/Button.tsx`: Для создания кнопок с плавным скроллом к верху страницы.
 * 3. `src/components/layout/Footer.tsx`: Для обработки кликов по ссылкам в подвале сайта.
 * 4. `src/components/sections/Hero.tsx`: Для создания кнопки скролла к следующей секции.
 * 5. `src/components/layout/MobileMenu.tsx`: Для обработки кликов по ссылкам в мобильном меню.
 * @example
 * // Плавный скролл к верху страницы
 * scrollToTop({ duration: 1.5 });
 * 
 * // Навигация на другую страницу
 * navigateTo(navigate, '/about', { scrollToTop: true });
 * 
 * // Обработка клика по ссылке
 * <a 
 *   href="/contact" 
 *   onClick={(e) => handleLinkClick(e, navigate, '/contact', currentPath)}
 * >
 *   Контакты
 * </a>
 */

import { lenis } from "@/lib/lenis";
import { isMobileDevice } from "./deviceUtils";

/**
 * Функция для плавного скролла к верху страницы
 * @param options Опции для скролла
 */
export const scrollToTop = (options: {
  duration?: number;
  immediate?: boolean;
} = {}): void => {
  const { duration = 1.2, immediate = false } = options;
  
  // Проверяем, мобильное ли устройство
  const isMobile = isMobileDevice();
  
  if (isMobile) {
    // На мобильных используем нативный скролл
    window.scrollTo({
      top: 0,
      behavior: immediate ? "auto" : "smooth",
    });
  } else {
    // На десктопе используем Lenis
    if (immediate) {
      lenis.stop();
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        lenis.scrollTo(0, { immediate: true });
        setTimeout(() => lenis.start(), 50);
      });
    } else {
      lenis.scrollTo(0, {
        duration,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  }
};

/**
 * Функция для навигации на другую страницу
 * @param navigate Функция навигации из react-router-dom
 * @param path Путь для навигации
 * @param options Опции для навигации
 */
export const navigateTo = (
  navigate: (path: string) => void,
  path: string,
  options: {
    scrollToTop?: boolean;
    immediate?: boolean;
  } = {}
): void => {
  const { scrollToTop: shouldScrollToTop = true, immediate = false } = options;
  
  // Останавливаем Lenis перед навигацией
  lenis.stop();
  lenis.velocity = 0;
  
  // Выполняем навигацию
  navigate(path);
  
  // Скроллим к верху страницы, если нужно
  if (shouldScrollToTop) {
    scrollToTop({ immediate });
  }
  
  // Запускаем Lenis после навигации
  setTimeout(() => lenis.start(), 50);
};

/**
 * Функция для обработки клика по ссылке
 * @param e Событие клика
 * @param navigate Функция навигации из react-router-dom
 * @param path Путь для навигации
 * @param currentPath Текущий путь
 * @param options Опции для обработки клика
 */
export const handleLinkClick = (
  e: React.MouseEvent,
  navigate: (path: string) => void,
  path: string,
  currentPath: string,
  options: {
    scrollToTop?: boolean;
    immediate?: boolean;
    preventDefault?: boolean;
  } = {}
): void => {
  const { 
    scrollToTop: shouldScrollToTop = true, 
    immediate = false,
    preventDefault = true
  } = options;
  
  // Предотвращаем стандартное поведение, если нужно
  if (preventDefault) {
    e.preventDefault();
  }
  
  // Если мы уже на нужной странице, просто скроллим к верху
  if (currentPath === path) {
    scrollToTop({ immediate });
  } else {
    // Иначе выполняем навигацию
    navigateTo(navigate, path, { scrollToTop: shouldScrollToTop, immediate });
  }
};