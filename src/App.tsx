// === Файл: src/App.tsx (ФИНАЛЬНАЯ ВЕРСИЯ С УЛУЧШЕННОЙ ЛОГИКОЙ СКРОЛЛА) ===

import { ProductListProvider } from "@/context/ProductListProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import React, { Suspense, useState, useEffect, useRef } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import PerformanceDebug from "./components/debug/PerformanceDebug";
import PerformanceDebugMobile from "./components/debug/PerformanceDebugMobile";
import Header from "./components/layout/Header";
import Layout from "./components/layout/Layout";
import TheodoreMenu from "./components/layout/TheodoreMenu";
import RouteChangeHandler from "./components/utils/RouteChangeHandler";
import { FluidProvider } from "./context/FluidProvider";

import useScrollRestoration from "./hooks/useScrollRestoration";
import { lenis, updateScroll } from "./lib/lenis";
import { scrollLockState } from "./lib/scrollLockState"; // <-- ИМПОРТ

const HomePage = React.lazy(() => import("./pages/HomePage"));
const ProductsPage = React.lazy(() => import("./pages/ProductsPage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const AboutMePage = React.lazy(() => import("./pages/AboutMePage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const PartnershipPage = React.lazy(() => import("./pages/PartnershipPage"));
const HowToBuyPage = React.lazy(() => import("./pages/HowToBuyPage"));

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrollingLocked, setIsScrollingLocked] = useState(false);
  const isScrollingLockedRef = useRef(isScrollingLocked);
  isScrollingLockedRef.current = isScrollingLocked;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("app-mounted"));
  }, []);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useScrollRestoration();

  useEffect(() => {
    if (location.key !== "default") {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname]);



  // ▼▼▼ НАЧАЛО ОБНОВЛЕННОГО БЛОКА ЛОГИКИ СКРОЛЛА ▼▼▼
  useEffect(() => {
    if (isMenuOpen) {
      lenis.stop();
      return;
    } else {
      lenis.start();
    }

    let touchStartX = 0;
    let touchStartY = 0;
    let scrollDirectionDetermined = false;

    // --- НАСТРОЙКИ ЧУВСТВИТЕЛЬНОСТИ ---
    // Порог, после которого начинаем определять свайп (в пикселях)
    const SENSITIVITY_THRESHOLD = 5;
    // Коэффициент смещения в пользу вертикального скролла.
    // 1.0 = строгие 45°.
    // 1.7 = скролл заблокируется, только если горизонтальный свайп в 1.7 раза длиннее вертикального.
    const HORIZONTAL_SWIPE_BIAS = 1.7;

    const handleTouchStart = (e: TouchEvent) => {
      if (isMenuOpen) return;
      const touch = e.touches[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      scrollDirectionDetermined = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isMenuOpen) return;
      const touch = e.touches[0];
      if (!touch || scrollDirectionDetermined) return;

      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);

      if (deltaX > SENSITIVITY_THRESHOLD || deltaY > SENSITIVITY_THRESHOLD) {
        // УЛУЧШЕННОЕ УСЛОВИЕ:
        // Блокируем вертикальный скролл, только если горизонтальное движение
        // ЗНАЧИТЕЛЬНО превышает вертикальное.
        if (deltaX > deltaY * HORIZONTAL_SWIPE_BIAS) {
          // Это точно горизонтальный свайп
                    if (!isScrollingLockedRef.current) {
            lenis.stop();
            scrollLockState.isLocked = true; // <-- МГНОВЕННАЯ БЛОКИРОВКА
            setIsScrollingLocked(true);
          }
        } else {
          // Это вертикальный скролл (или диагональный, но ближе к вертикальному)
                    if (isScrollingLockedRef.current) {
            lenis.start();
            scrollLockState.isLocked = false; // <-- МГНОВЕННАЯ РАЗБЛОКИРОВКА
            setIsScrollingLocked(false);
          }
        }
        scrollDirectionDetermined = true;
      }
    };

    const handleTouchEnd = () => {
      if (isMenuOpen) return;

            if (isScrollingLockedRef.current) {
        setTimeout(() => {
          lenis.start();
          scrollLockState.isLocked = false; // <-- МГНОВЕННАЯ РАЗБЛОКИРОВКА
          setIsScrollingLocked(false);
        }, 50); // Небольшая задержка для завершения свайпа
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
  }, [isMenuOpen]);
  // ▲▲▲ КОНЕЦ ОБНОВЛЕННОГО БЛОКА ЛОГИКИ СКРОЛЛА ▲▲▲

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
        <RouteChangeHandler />
        <Suspense fallback={null}>
          <Header
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            isScrollingLocked={isScrollingLocked}
          />
          <TheodoreMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            navigate={navigate} // Передаем функцию navigate напрямую
          />
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
