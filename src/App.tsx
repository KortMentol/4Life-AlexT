// src/App.tsx

import PerformanceDebug from "@/components/debug/PerformanceDebug";
import PerformanceDebugMobile from "@/components/debug/PerformanceDebugMobile";
import Header from "@/components/layout/Header";
import Layout from "@/components/layout/Layout";
import TheodoreMenu from "@/components/layout/TheodoreMenu";
import RouteChangeHandler from "@/components/RouteChangeHandler";
import { ProductListProvider } from "@/context/ProductListProvider";
import useScrollRestoration from "@/hooks/useScrollRestoration";
import { lenis, updateScroll } from "@/lib/lenis";
import { scrollLockState } from "@/lib/scrollLockState";
import { scrollToTop } from "@/utils/navigationUtils";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";

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
  const [isScrollingLocked, setIsScrollingLocked] = useState(false);
  const isScrollingLockedRef = useRef(isScrollingLocked);
  isScrollingLockedRef.current = isScrollingLocked;
  const navigate = useNavigate();
  const menuStateActiveRef = useRef(false);
  const ownPopRef = useRef(false);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useScrollRestoration();

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    try {
      if (isMenuOpen) {
        const st = window.history.state || {};
        if (!(st as any).__menuOpen) {
          window.history.pushState({ ...st, __menuOpen: true }, "");
        }
        menuStateActiveRef.current = true;
      } else {
        if (menuStateActiveRef.current) {
          ownPopRef.current = true;
          window.history.back();
        }
      }
    } catch {
      // ignore
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const st = (e.state as any) || {};

      if (ownPopRef.current) {
        ownPopRef.current = false;
        e.stopImmediatePropagation();
        menuStateActiveRef.current = false;
        return;
      }

      if (menuStateActiveRef.current && isMenuOpen) {
        e.stopImmediatePropagation();
        menuStateActiveRef.current = false;
        closeMenu();
        return;
      }

      if (st.__menuOpen === true && !isMenuOpen) {
        e.stopImmediatePropagation();
        menuStateActiveRef.current = true;
        setIsMenuOpen(true);
        return;
      }
    };

    window.addEventListener("popstate", onPop, { capture: true });
    return () => window.removeEventListener("popstate", onPop, true);
  }, [isMenuOpen, closeMenu]);

  const navigateFromMenu = (href: string, isSame: boolean) => {
    if (isSame) {
      scrollToTop({ immediate: false });
    } else {
      navigate(href);
    }
    closeMenu();
  };

  // --- НАЧАЛО ИСПРАВЛЕННОГО БЛОКА ---
  useEffect(() => {
    if (isMenuOpen) {
      lenis.stop();
      return;
    } else {
      lenis.start();
    }

    let touchStartX = 0;
    let touchStartY = 0;
    // Флаг, чтобы мы принимали решение о блокировке скролла только один раз за свайп
    let scrollDirectionDetermined = false;

    const SENSITIVITY_THRESHOLD = 5;
    const HORIZONTAL_SWIPE_BIAS = 1.7;

    const handleTouchStart = (e: TouchEvent) => {
      if (isMenuOpen) return;
      const touch = e.touches[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      // Сбрасываем флаг в начале каждого нового касания
      scrollDirectionDetermined = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isMenuOpen) return;
      const touch = e.touches[0];
      // Если направление уже определено, ничего не делаем. Это ключ к производительности!
      if (!touch || scrollDirectionDetermined) return;

      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);

      // Принимаем решение только после того, как палец сдвинулся на достаточное расстояние
      if (deltaX > SENSITIVITY_THRESHOLD || deltaY > SENSITIVITY_THRESHOLD) {
        if (deltaX > deltaY * HORIZONTAL_SWIPE_BIAS) {
          // Это горизонтальный свайп. Блокируем скролл.
          if (!isScrollingLockedRef.current) {
            lenis.stop();
            scrollLockState.isLocked = true;
            setIsScrollingLocked(true);
          }
        } else {
          // Это вертикальный свайп. Убеждаемся, что скролл разблокирован.
          if (isScrollingLockedRef.current) {
            lenis.start();
            scrollLockState.isLocked = false;
            setIsScrollingLocked(false);
          }
        }
        // Устанавливаем флаг, чтобы больше не входить в эту логику до следующего касания
        scrollDirectionDetermined = true;
      }
    };

    const handleTouchEnd = () => {
      if (isMenuOpen) return;
      // Если мы заканчиваем свайп и скролл был заблокирован (т.е. это был горизонтальный свайп),
      // то разблокируем его с небольшой задержкой.
      if (isScrollingLockedRef.current) {
        setTimeout(() => {
          lenis.start();
          scrollLockState.isLocked = false;
          setIsScrollingLocked(false);
        }, 50); // 50ms достаточно, чтобы карусель/свайпер успел обработать жест
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
  // --- КОНЕЦ ИСПРАВЛЕННОГО БЛОКА ---

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
      <RouteChangeHandler isMenuOpen={isMenuOpen} closeMenu={closeMenu} />
      <Suspense fallback={null}>
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} isScrollingLocked={isScrollingLocked} />
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
      {/* Старый оверлей для перехода удален */}
    </ProductListProvider>
  );
}

export default App;
