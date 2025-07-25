import { ProductListProvider } from "@/context/ProductListProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import PerformanceDebug from "./components/debug/PerformanceDebug";
import PerformanceDebugMobile from "./components/debug/PerformanceDebugMobile";
import Layout from "./components/layout/Layout";
import RouteChangeHandler from "./components/utils/RouteChangeHandler";
import { FluidProvider } from "./context/FluidProvider";
import { useMobileMenuState } from "./hooks/useMobileMenuState";
import useResetScrollOnNavigation from "./hooks/useResetScrollOnNavigation";
import useScrollRestoration from "./hooks/useScrollRestoration";
import { lenis, updateScroll } from "./lib/lenis";

// Ленивая загрузка страниц, но управление предзагрузкой происходит в компонентах
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AboutMePage = lazy(() => import("./pages/AboutMePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PartnershipPage = lazy(() => import("./pages/PartnershipPage"));
const HowToBuyPage = lazy(() => import("./pages/HowToBuyPage"));

function App() {
  const { closeMobileMenu } = useMobileMenuState();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useScrollRestoration();
  useResetScrollOnNavigation();

  useEffect(() => {
    const isMobileDevice = window.innerWidth < 768;
    const heroImage = isMobileDevice
      ? "/src/assets/images/backgrounds/bg-hero-Mobile.webp"
      : "/src/assets/images/backgrounds/bg-hero-PC.webp";

    const imagesToPreload = [heroImage];
    let loadedCount = 0;

    const onAssetsLoaded = () => {
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.classList.add("hidden");
        setTimeout(() => {
          preloader.remove();
        }, 500);
      }
    };

    if (imagesToPreload.length > 0) {
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
    } else {
      onAssetsLoaded();
    }
  }, []);

  const wasHorizontalSwipe = useRef(false);

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
      wasHorizontalSwipe.current = false; // Сбрасываем флаг в начале каждого касания
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch || scrollDirectionDetermined) return;

      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);
      const sensitivityThreshold = 5;

      if (deltaX > sensitivityThreshold || deltaY > sensitivityThreshold) {
        if (deltaX > deltaY) {
          // Это горизонтальный свайп
          lenis.stop();
          wasHorizontalSwipe.current = true; // Устанавливаем флаг
        } else {
          // Это вертикальный скролл
          lenis.start();
        }
        scrollDirectionDetermined = true;
      }
    };

    const handleTouchEnd = () => {
      // Если предыдущий свайп был горизонтальным, мы даем микро-задержку
      // перед тем, как снова включить скролл. Этого достаточно, чтобы
      // "погасить" остаточный импульс по оси Y.
      if (wasHorizontalSwipe.current) {
        setTimeout(() => {
          lenis.start();
        }, 50); // 50мс - небольшая, но эффективная задержка
      } else {
        // Для обычного вертикального скролла включаем сразу
        lenis.start();
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);
  // --- КОНЕЦ ИЗМЕНЕНИЯ 2 ---

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
        <Suspense fallback={null}>
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
                    <h1 className="text-8xl font-bold mb-4 gradient-heading">404</h1>
                    <p className="text-xl mb-8">Страница не найдена. Возможно, вы ошиблись адресом.</p>
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
