import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const SmoothScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Прокручиваем только при смене пути, а не при каждом рендере
    if (pathname !== prevPathname.current) {
      const scrollToTop = () => {
        const start = window.pageYOffset;
        const startTime = performance.now();
        const duration = 300; // Длительность анимации в мс

        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Кубическая функция для плавного ускорения и замедления
          const easeInOutCubic = (t: number) => 
            t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
          
          window.scrollTo(0, start - start * easeInOutCubic(progress));
          
          if (elapsed < duration) {
            requestAnimationFrame(animateScroll);
          } else {
            // На всякий случай финальная прокрутка
            window.scrollTo(0, 0);
          }
        };

        requestAnimationFrame(animateScroll);
      };
      
      // Обновляем предыдущий путь
      prevPathname.current = pathname;
      
      // Небольшая задержка для начала анимации
      const timer = setTimeout(scrollToTop, 10);
      
      // Очистка таймера при размонтировании
      return () => clearTimeout(timer);
    }
    
    // Возвращаем функцию очистки, если условие не выполнилось
    return () => {};
  }, [pathname]);

  return null;
};

export default SmoothScrollToTop;
