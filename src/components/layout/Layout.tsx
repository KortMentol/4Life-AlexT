import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTopButton from '../utils/ScrollToTopButton';

const Layout: React.FC = () => {
  // Обработка клика вне мобильного меню для закрытия
  useEffect(() => {
    const handleRouteChange = () => {
      // Прокрутка вверх при изменении маршрута
      window.scrollTo(0, 0);
      
      // Закрытие мобильного меню при навигации
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) {
        mobileMenu.classList.add('hidden');
      }
    };

    // Очистка при размонтировании
    return () => {
      handleRouteChange();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Layout;