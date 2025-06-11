import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FluidEffect from "../effects/FluidEffect";
import Footer from "./Footer";
import Header from "./Header";
import SVGFilters from "./SVGFilters";
import { updateScroll } from "@/lib/lenis";

const Layout: React.FC = () => {
  const location = useLocation();

  // Обновляем Lenis при изменении маршрута и после рендеринга контента
  useEffect(() => {
    // Используем requestAnimationFrame для обновления после рендеринга
    const updateScrollAfterRender = () => {
      requestAnimationFrame(() => {
        updateScroll();
      });
    };

    updateScrollAfterRender();

    // Также обновляем после полной загрузки всех ресурсов
    window.addEventListener("load", updateScrollAfterRender);

    return () => {
      window.removeEventListener("load", updateScrollAfterRender);
    };
  }, [location.pathname]);

  return (
    <>
      <FluidEffect />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main id="main-content" className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <SVGFilters />
      </div>
    </>
  );
};

export default Layout;
