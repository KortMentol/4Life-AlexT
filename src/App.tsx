// src/App.tsx

import PerformanceDebug from "@/components/debug/PerformanceDebug";
import PerformanceDebugMobile from "@/components/debug/PerformanceDebugMobile";
import Header from "@/components/layout/Header";
import Layout from "@/components/layout/Layout";
import TheodoreMenu from "@/components/layout/TheodoreMenu";
import RouteChangeHandler from "@/components/RouteChangeHandler";
import { ProductListProvider } from "@/context/ProductListProvider";
import { lenis, updateScroll } from "@/lib/lenis";
import { scrollLockState } from "@/lib/scrollLockState";
import { scrollToTop } from "@/utils/navigationUtils";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";

// Lazy-loaded компоненты страниц
import HomePage from "@/pages/HomePage";
const ProductsPage = React.lazy(() => import("@/pages/ProductsPage"));
const AboutPage = React.lazy(() => import("@/pages/AboutPage"));
const AboutMePage = React.lazy(() => import("@/pages/AboutMePage"));
const ContactPage = React.lazy(() => import("@/pages/ContactPage"));
const PartnershipPage = React.lazy(() => import("@/pages/PartnershipPage"));
const HowToBuyPage = React.lazy(() => import("@/pages/HowToBuyPage"));

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // --- НАДЕЖНАЯ ЛОГИКА УПРАВЛЕНИЯ МЕНЮ ---
  const closeMenu = useCallback(() => {
    if (location.hash === "#menu") {
      navigate(-1);
    } else {
      setIsMenuOpen(false);
    }
  }, [navigate, location.hash]);

  useEffect(() => {
    const isMenuInUrl = location.hash === "#menu";
    if (isMenuInUrl !== isMenuOpen) {
      setIsMenuOpen(isMenuInUrl);
    }
  }, [location.hash, isMenuOpen]);

  const toggleMenu = useCallback(() => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      setIsMenuOpen(true);
      if (location.hash !== "#menu") {
        navigate(`${location.pathname}${location.search}#menu`);
      }
    }
  }, [isMenuOpen, closeMenu, navigate, location.pathname, location.search, location.hash]);

  const navigateFromMenu = (href: string, isSame: boolean) => {
    if (isMenuOpen) {
      navigate(-1);
    }

    if (isSame) {
      scrollToTop({ immediate: false });
    } else {
      setTimeout(() => navigate(href), 50);
    }
  };
  // --- КОНЕЦ ЛОГИКИ МЕНЮ ---

  useEffect(() => {
    if (isMenuOpen) {
      lenis.stop();
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
      if (isMenuOpen || scrollDirectionDetermined) return;
      const touch = e.touches[0];
      if (!touch) return;
      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);

      if (deltaX > SENSITIVITY_THRESHOLD || deltaY > SENSITIVITY_THRESHOLD) {
        if (deltaX > deltaY * HORIZONTAL_SWIPE_BIAS) {
          if (!scrollLockState.isLocked) {
            lenis.stop();
            scrollLockState.isLocked = true;
          }
        } else {
          if (scrollLockState.isLocked) {
            lenis.start();
            scrollLockState.isLocked = false;
          }
        }
        scrollDirectionDetermined = true;
      }
    };

    const handleTouchEnd = () => {
      if (isMenuOpen) return;
      if (scrollLockState.isLocked) {
        setTimeout(() => {
          lenis.start();
          scrollLockState.isLocked = false;
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
    <ProductListProvider>
      <RouteChangeHandler />
      <Suspense fallback={null}>
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={toggleMenu} />
        <TheodoreMenu isOpen={isMenuOpen} onClose={closeMenu} navigateFromMenu={navigateFromMenu} />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
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
  );
}

export default App;
