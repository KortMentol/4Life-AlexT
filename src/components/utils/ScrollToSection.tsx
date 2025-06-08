import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Компонент для прокрутки к секции по хэшу в URL
 */
const ScrollToSection: React.FC = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    // Проверяем, есть ли сохраненный элемент для прокрутки
    const scrollToElement = sessionStorage.getItem('scrollToElement');
    
    if (scrollToElement) {
      console.log(`Found saved element to scroll to: ${scrollToElement}`);
      sessionStorage.removeItem('scrollToElement');
      
      // Небольшая задержка для уверенности, что DOM полностью загружен
      setTimeout(() => {
        const element = document.getElementById(scrollToElement);
        if (element) {
          console.log(`Element found: `, element);
          const lenisInstance = (window as any).lenis;
          if (lenisInstance) {
            console.log(`Using Lenis to scroll`);
            lenisInstance.scrollTo(element, { offset: -100 });
          } else {
            console.log(`Using native scrollIntoView`);
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Дополнительный отступ сверху
            window.scrollBy(0, -100);
          }
        } else {
          console.log(`Element with id ${scrollToElement} not found`);
        }
      }, 500);
      
      return;
    }
    
    // Если есть хэш в URL
    if (hash) {
      // Удаляем # из хэша
      const id = hash.replace('#', '');
      
      // Добавляем логирование для отладки
      console.log(`Trying to scroll to element with id: ${id}`);
      
      const element = document.getElementById(id);
      
      if (element) {
        console.log(`Element found: `, element);
        
        // Проверяем, находится ли элемент уже в видимой области
        const rect = element.getBoundingClientRect();
        const isInView = (
          rect.top >= 0 &&
          rect.top <= 150 && // Допустимое отклонение от верха экрана
          rect.left >= 0 &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
        
        console.log(`Is element in view: ${isInView}, rect:`, rect);
        
        // Если элемент уже в видимой области, не прокручиваем
        if (isInView) {
          return;
        }
        
        // Небольшая задержка для уверенности, что DOM полностью загружен
        setTimeout(() => {
          const lenisInstance = (window as any).lenis;
          if (lenisInstance) {
            console.log(`Using Lenis to scroll`);
            lenisInstance.scrollTo(element, { offset: -100 });
          } else {
            console.log(`Using native scrollIntoView`);
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Дополнительный отступ сверху
            window.scrollBy(0, -100);
          }
        }, 300);
      } else {
        console.log(`Element with id ${id} not found`);
      }
    } else if (pathname === '/' && window.location.hash === '') {
      // Если нет хэша и мы на главной странице, прокручиваем в начало
      // Но только если мы перешли на главную без хэша
      window.scrollTo(0, 0);
    }
  }, [hash, pathname]);

  return null;
};

export default ScrollToSection;