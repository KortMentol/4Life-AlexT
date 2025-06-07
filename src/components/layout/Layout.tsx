import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTopButton from '../utils/ScrollToTopButton';

const Layout: React.FC = () => {
  // Прокрутка вверх при изменении маршрута
  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
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