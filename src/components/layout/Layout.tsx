import type Lenis from "lenis";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import FluidEffect from "../effects/FluidEffect";
import ScrollToTopButton from "../utils/ScrollToTopButton";
import Footer from "./Footer";
import Header from "./Header";
import SVGFilters from "./SVGFilters";

// Расширяем глобальный интерфейс Window для типизации lenis
declare global {
  interface Window {
    lenis: Lenis | null;
  }
}

const Layout: React.FC = () => {
  // Инициализация плавной прокрутки Lenis
  useEffect(() => {
    const initLenis = async () => {
      try {
        const { default: Lenis } = await import("lenis");

        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: "vertical",
          gestureDirection: "vertical",
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
        });

        // Сохраняем экземпляр Lenis в window для доступа из других компонентов
        window.lenis = lenis;

        // Функция для обновления Lenis на каждом кадре анимации
        const raf = (time: number) => {
          lenis.raf(time);
          requestAnimationFrame(raf);
        };

        // Запускаем цикл анимации
        requestAnimationFrame(raf);

        // Обработчик изменения размера окна
        const handleResize = () => {
          if (lenis) {
            lenis.resize();
          }
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          lenis.destroy();
          window.lenis = null;
        };
      } catch (error) {
        console.error("Failed to initialize Lenis:", error);
        // Показываем уведомление пользователю о проблеме с плавной прокруткой
        const notifyUser = () => {
          const notification = document.createElement("div");
          notification.className =
            "fixed bottom-4 left-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-4 py-2 rounded-lg shadow-lg";
          notification.textContent =
            "Не удалось инициализировать плавную прокрутку. Используется стандартная прокрутка.";
          document.body.appendChild(notification);
          setTimeout(() => notification.remove(), 5000);
        };

        // Выполняем в следующем цикле, чтобы DOM был готов
        setTimeout(notifyUser, 1000);

        // Возвращаем пустую функцию очистки для случая ошибки
        return () => {};
      }
    };

    initLenis();
  }, []);

  return (
    <>
      <FluidEffect />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <ScrollToTopButton />
        <SVGFilters />
      </div>
    </>
  );
};

export default Layout;
