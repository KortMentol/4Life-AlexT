import PerformanceDebug from "@/components/debug/PerformanceDebug";
import PerformanceDebugMobile from "@/components/debug/PerformanceDebugMobile";
import Header from "@/components/layout/Header";
import Layout from "@/components/layout/Layout";
import TheodoreMenu from "@/components/layout/TheodoreMenu";
import RouteChangeHandler from "@/components/RouteChangeHandler";
import { FluidProvider } from "@/context/FluidProvider";
import { ProductListProvider } from "@/context/ProductListProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import useScrollRestoration from "@/hooks/useScrollRestoration";
import { lenis, updateScroll } from "@/lib/lenis";
import { scrollLockState } from "@/lib/scrollLockState";
import { AnimatePresence, motion } from "framer-motion"; // <-- ВАЖНО: Импорты для анимации
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";

// Lazy-loaded компоненты страниц (без изменений)
const HomePage = React.lazy(() => import("@/pages/HomePage"));
const ProductsPage = React.lazy(() => import("@/pages/ProductsPage"));
const AboutPage = React.lazy(() => import("@/pages/AboutPage"));
const AboutMePage = React.lazy(() => import("@/pages/AboutMePage"));
const ContactPage = React.lazy(() => import("@/pages/ContactPage"));
const PartnershipPage = React.lazy(() => import("@/pages/PartnershipPage"));
const HowToBuyPage = React.lazy(() => import("@/pages/HowToBuyPage"));

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrollingLocked, setIsScrollingLocked] = useState(false);
  const isScrollingLockedRef = useRef(isScrollingLocked);
  isScrollingLockedRef.current = isScrollingLocked;
  const navigate = useNavigate();

  // ▼▼▼ НОВОЕ: Состояние для управления "занавесом" перехода ▼▼▼
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("app-mounted"));
  }, []);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useScrollRestoration();

  // Логика блокировки скролла для свайпов (остается без изменений)
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
    const SENSITIVITY_THRESHOLD = 5;
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
        if (deltaX > deltaY * HORIZONTAL_SWIPE_BIAS) {
          if (!isScrollingLockedRef.current) {
            lenis.stop();
            scrollLockState.isLocked = true;
            setIsScrollingLocked(true);
          }
        } else {
          if (isScrollingLockedRef.current) {
            lenis.start();
            scrollLockState.isLocked = false;
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
          scrollLockState.isLocked = false;
          setIsScrollingLocked(false);
        }, 50);
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
        {/* ▼▼▼ КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Вызываем RouteChangeHandler С НУЖНЫМИ PROPS ▼▼▼ */}
        <RouteChangeHandler
          onTransitionStart={() => setIsTransitioning(true)}
          onTransitionEnd={() => setIsTransitioning(false)}
        />
        <Suspense fallback={null}>
          <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} isScrollingLocked={isScrollingLocked} />
          <TheodoreMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navigate={navigate} />
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

        {/* ▼▼▼ НОВОЕ: Анимированный "занавес" для бесшовных переходов ▼▼▼ */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              key="transition-overlay"
              className="fixed inset-0 bg-gray-900 z-[99999]" // Очень высокий z-index
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }} // Плавное появление и исчезновение
            />
          )}
        </AnimatePresence>
      </ProductListProvider>
    </ThemeProvider>
  );
}

export default App;
