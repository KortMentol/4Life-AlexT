import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Добавляем импорт для доступа к process.env
declare const process: {
  env: {
    NODE_ENV: string;
  };
};

/**
 * Компонент для прокрутки к секции по хэшу в URL
 */
const ScrollToSection: React.FC = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    // Функция для логирования только в режиме разработки
    const logDebug = (message: string, ...args: unknown[]) => {
      if (process.env.NODE_ENV === "development") {
        console.log(message, ...args);
      }
    };

    // Функция для прокрутки к элементу
    const scrollToElementById = (elementId: string, delay = 300) => {
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          logDebug(`Element found: `, element);

          if (window.lenis) {
            logDebug(`Using Lenis to scroll`);
            window.lenis.scrollTo(element, { offset: -100 });
          } else {
            logDebug(`Using native scrollIntoView`);
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            // Дополнительный отступ сверху
            window.scrollBy(0, -100);
          }
        } else {
          logDebug(`Element with id ${elementId} not found`);
        }
      }, delay);
    };

    // Проверяем, есть ли сохраненный элемент для прокрутки
    const scrollToElement = sessionStorage.getItem("scrollToElement");

    if (scrollToElement) {
      logDebug(`Found saved element to scroll to: ${scrollToElement}`);
      sessionStorage.removeItem("scrollToElement");

      // Прокручиваем к сохраненному элементу
      scrollToElementById(scrollToElement, 500);
      return;
    }

    // Если есть хэш в URL
    if (hash) {
      // Удаляем # из хэша
      const id = hash.replace("#", "");

      logDebug(`Trying to scroll to element with id: ${id}`);

      const element = document.getElementById(id);

      if (element) {
        // Проверяем, находится ли элемент уже в видимой области
        const rect = element.getBoundingClientRect();
        const isInView =
          rect.top >= 0 &&
          rect.top <= 150 && // Допустимое отклонение от верха экрана
          rect.left >= 0 &&
          rect.right <=
            (window.innerWidth || document.documentElement.clientWidth);

        logDebug(`Is element in view: ${isInView}, rect:`, rect);

        // Если элемент уже в видимой области, не прокручиваем
        if (isInView) {
          return;
        }

        // Прокручиваем к элементу
        scrollToElementById(id, 300);
      } else {
        logDebug(`Element with id ${id} not found`);
      }
    } else if (pathname === "/" && window.location.hash === "") {
      // Если нет хэша и мы на главной странице, прокручиваем в начало
      // Но только если мы перешли на главную без хэша
      window.scrollTo(0, 0);
    }
  }, [hash, pathname]);

  return null;
};

export default ScrollToSection;
