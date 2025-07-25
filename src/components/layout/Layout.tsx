/**
 * @module src/components/layout/Layout.tsx
 * @description Основной компонент-макет приложения. Он определяет общую структуру страницы, включая Header, Footer и основную область контента, в которой отображаются дочерние маршруты через <Outlet>. Также интегрирует глобальные эффекты, такие как FluidEffect, и управляет обновлениями плавной прокрутки Lenis при смене URL.
 * @author Kort
 * @version 1.0.0
 * @see Header - Шапка сайта.
 * @see Footer - Подвал сайта.
 * @see FluidEffect - Компонент для фонового WebGL-эффекта.
 * @see ScrollToTopButton - Кнопка для прокрутки наверх.
 * @see FluidProvider - Контекст-провайдер для управления Fluid-эффектом.
 * @usage
 * 1. `src/App.tsx`: Используется как корневой элемент для всех маршрутов приложения, обеспечивая единый макет для всех страниц.
 * @example
 * <Routes>
 *   <Route path="/" element={<Layout />}>
 *     <Route index element={<HomePage />} />
 *     <Route path="products" element={<ProductsPage />} />
 *   </Route>
 * </Routes>
 */
import { FluidProvider } from "@/context/FluidProvider";
import { updateScroll } from "@/lib/lenis";
import { AnimatePresence } from "framer-motion"; // <-- ДОБАВЛЕН ИМПОРТ
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FluidEffect from "../effects/FluidEffect";
import ScrollToTopButton from "../ui/ScrollToTopButton";
import Footer from "./Footer";
import Header from "./Header";

const Layout: React.FC = () => {
  const location = useLocation();

  // Обновляем Lenis при изменении маршрута и после рендеринга контента

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
      <FluidProvider>
        <FluidEffect />
      </FluidProvider>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main id="main-content" className="flex-grow">
          <AnimatePresence mode="wait">
            {/* Ключ `location.pathname` необходим, чтобы AnimatePresence отслеживала смену страниц */}
            <Outlet key={location.pathname} />
          </AnimatePresence>
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default Layout;
