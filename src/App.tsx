import { ProductListProvider } from "@/context/ProductListProvider";
import { FluidProvider } from "./context/FluidProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import { lazy, Suspense, useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import RouteChangeHandler from "./components/utils/RouteChangeHandler";
import { useMobileMenuState } from "./hooks/useMobileMenuState";
import useResetScrollOnNavigation from "./hooks/useResetScrollOnNavigation";
import useScrollRestoration from "./hooks/useScrollRestoration";
import { lenis, updateScroll } from "./lib/lenis";
import PerformanceDebug from "./components/debug/PerformanceDebug";
import PerformanceDebugMobile from "./components/debug/PerformanceDebugMobile";

// Ленивая загрузка страниц
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AboutMePage = lazy(() => import("./pages/AboutMePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PartnershipPage = lazy(() => import("./pages/PartnershipPage"));
const HowToBuyPage = lazy(() => import("./pages/HowToBuyPage"));

// Компонент загрузки для других страниц
const LoadingScreen = () => (
  <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <img
          src="/src/assets/images/brand/4life-logo.svg"
          alt="4Life Logo"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8"
        />
      </div>
      <p className="mt-4 text-lg font-medium animate-pulse">
        Загрузка сайта 4Life...
      </p>
    </div>
  </div>
);

function App() {
  const { closeMobileMenu } = useMobileMenuState();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Хуки для скролла
  useScrollRestoration();
  useResetScrollOnNavigation();
  
  // Логика для скрытия статического прелоадера
  useEffect(() => {
    const isMobileDevice = window.innerWidth < 768;
    const heroImage = isMobileDevice
      ? "/src/assets/images/backgrounds/bg-hero-Mobile.webp"
      : "/src/assets/images/backgrounds/bg-hero-PC.webp";
    
    const imagesToPreload = [heroImage]; 
    let loadedCount = 0;

    const onAssetsLoaded = () => {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => {
          preloader.remove();
        }, 500); // Совпадает с transition в CSS
      }
    };

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount === imagesToPreload.length) {
          setTimeout(onAssetsLoaded, 300);
        }
      };
    });
    
    if (imagesToPreload.length === 0) {
      onAssetsLoaded();
    }
  }, []);

  // Глобальное решение для блокировки скролла
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let scrollDirectionDetermined = false;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      scrollDirectionDetermined = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch || scrollDirectionDetermined) return;
      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);
      const sensitivityThreshold = 5;

      if (deltaX > sensitivityThreshold || deltaY > sensitivityThreshold) {
        if (deltaX > deltaY) {
          lenis.stop();
        } else {
          lenis.start();
        }
        scrollDirectionDetermined = true;
      }
    };

    const handleTouchEnd = () => {
      lenis.start();
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  // Обновление Lenis
  useEffect(() => {
    window.addEventListener("load", updateScroll);
    window.addEventListener("resize", updateScroll);
    updateScroll();
    return () => {
      window.removeEventListener("load", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  return (
    <ThemeProvider>
      <ProductListProvider>
        <RouteChangeHandler onRouteChange={closeMobileMenu} />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={
                  <FluidProvider>
                    <HomePage />
                  </FluidProvider>
                }
              />
              <Route path="products" element={<ProductsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="about-me" element={<AboutMePage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="partnership" element={<PartnershipPage />} />
              <Route path="how-to-buy" element={<HowToBuyPage />} />
            </Route>
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
                  <div className="card-modern p-12 text-center max-w-lg">
                    <h1 className="text-8xl font-bold mb-4 gradient-heading">
                      404
                    </h1>
                    <p className="text-xl mb-8">
                      Страница не найдена. Возможно, вы ошиблись адресом.
                    </p>
                    <Link
                      to="/"
                      className="btn-modern btn-primary-modern px-8 py-4 rounded-lg inline-flex items-center gap-2"
                    >
                      <span>Вернуться на главную</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              }
            />
          </Routes>
        </Suspense>
        {isMobile ? <PerformanceDebugMobile /> : <PerformanceDebug />}
      </ProductListProvider>
    </ThemeProvider>
  );
}

export default App;
