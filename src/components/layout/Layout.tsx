import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTopButton from '../utils/ScrollToTopButton';
import SVGFilters from './SVGFilters';

const Layout: React.FC = () => {
  // Инициализация плавной прокрутки Lenis
  useEffect(() => {
    const initLenis = async () => {
      try {
        const { default: Lenis } = await import('lenis');
        
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
        });
        
        // Сохраняем экземпляр Lenis в window для доступа из других компонентов
        (window as any).lenis = lenis;
        
        // Функция для обновления Lenis на каждом кадре анимации
        function raf(time: number) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        
        // Запускаем цикл анимации
        requestAnimationFrame(raf);
        
        // Обработчик изменения размера окна
        const handleResize = () => {
          if (lenis) {
            // Используем метод из экземпляра lenis
            (lenis as any).resize();
          }
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
          lenis.destroy();
          (window as any).lenis = null;
        };
      } catch (error) {
        console.error('Failed to initialize Lenis:', error);
        return undefined;
      }
    };
    
    initLenis();
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 md:pt-20">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
      <SVGFilters />
    </div>
  );
};

export default Layout;