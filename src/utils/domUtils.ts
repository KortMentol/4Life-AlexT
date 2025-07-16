/**
 * @module src/utils/domUtils.ts
 * @description Набор утилит для работы с DOM-элементами и управления их поведением. Предоставляет функции для блокировки скролла, плавной прокрутки к элементам, определения видимости элементов в области просмотра, добавления классов при скролле и получения размеров и позиций элементов. Все функции оптимизированы для работы с современными браузерами и учитывают особенности различных устройств.
 * @author Kort
 * @version 1.0.0
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model - Документация по DOM
 * @usage
 * 1. `src/components/layout/Header.tsx`: Для добавления класса при скролле для изменения стилей хедера.
 * 2. `src/components/ui/Modal.tsx`: Для блокировки скролла при открытии модального окна.
 * 3. `src/hooks/useScrollAnimation.ts`: Для определения видимости элементов при скролле.
 * 4. `src/components/sections/Hero.tsx`: Для плавного скролла к следующей секции.
 * 5. `src/components/layout/Navigation.tsx`: Для плавного скролла к разделам страницы.
 * @example
 * // Блокировка скролла при открытии модального окна
 * const unlockScroll = lockScroll();
 * 
 * // Разблокировка скролла при закрытии модального окна
 * unlockScroll();
 * 
 * // Плавный скролл к элементу
 * scrollToElement('section-id', 80); // 80px отступ от верха
 * 
 * // Проверка видимости элемента
 * if (isElementInViewport(element)) {
 *   // Элемент виден в области просмотра
 * }
 */

/**
 * Функция для блокировки скролла на странице
 * @returns Функция для разблокировки скролла
 */
export const lockScroll = (): () => void => {
  // Сохраняем текущую позицию скролла
  const scrollY = window.scrollY;
  
  // Добавляем стили для блокировки скролла
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
  document.body.style.overflowY = 'scroll';
  
  // Добавляем класс для блокировки скролла
  document.body.classList.add('scroll-locked');
  
  // Возвращаем функцию для разблокировки скролла
  return () => {
    // Удаляем стили для блокировки скролла
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflowY = '';
    
    // Удаляем класс для блокировки скролла
    document.body.classList.remove('scroll-locked');
    
    // Восстанавливаем позицию скролла
    window.scrollTo(0, scrollY);
  };
};

/**
 * Функция для плавного скролла к элементу
 * @param elementId ID элемента, к которому нужно проскроллить
 * @param offset Отступ от верха элемента
 * @param duration Длительность анимации
 */
export const scrollToElement = (elementId: string, offset: number = 0): void => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

/**
 * Функция для определения, виден ли элемент в области просмотра
 * @param element Элемент, видимость которого нужно проверить
 * @param partiallyVisible Флаг, определяющий, должен ли элемент быть полностью виден или частично
 * @returns true, если элемент виден, иначе false
 */
export const isElementInViewport = (element: HTMLElement, partiallyVisible: boolean = false): boolean => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const vertInView = partiallyVisible
    ? rect.top <= windowHeight && rect.bottom >= 0
    : rect.top >= 0 && rect.bottom <= windowHeight;
    
  const horInView = partiallyVisible
    ? rect.left <= windowWidth && rect.right >= 0
    : rect.left >= 0 && rect.right <= windowWidth;
    
  return vertInView && horInView;
};

/**
 * Функция для добавления класса к элементу при скролле
 * @param elementId ID элемента, к которому нужно добавить класс
 * @param className Класс, который нужно добавить
 * @param threshold Порог скролла, при котором нужно добавить класс
 */
export const addClassOnScroll = (elementId: string, className: string, threshold: number = 100): void => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const handleScroll = () => {
    if (window.scrollY > threshold) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  
  // Вызываем функцию один раз для инициализации
  handleScroll();
};

/**
 * Функция для получения размеров элемента
 * @param element Элемент, размеры которого нужно получить
 * @returns Объект с размерами элемента
 */
export const getElementDimensions = (element: HTMLElement): { width: number; height: number } => {
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height
  };
};

/**
 * Функция для получения позиции элемента относительно документа
 * @param element Элемент, позицию которого нужно получить
 * @returns Объект с позицией элемента
 */
export const getElementPosition = (element: HTMLElement): { top: number; left: number } => {
  const rect = element.getBoundingClientRect();
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
};