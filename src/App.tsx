import EffectsDebugPanel from "@/components/debug/EffectsDebugPanel";
import PerformanceDebug from "@/components/debug/PerformanceDebug";
import PerformanceDebugMobile from "@/components/debug/PerformanceDebugMobile";
import Header from "@/components/layout/Header";
import Layout from "@/components/layout/Layout";
import TheodoreMenu from "@/components/layout/TheodoreMenu";
import RouteChangeHandler from "@/components/RouteChangeHandler";
import PopTransitionOverlay from "@/components/transitions/PopTransitionOverlay";
import { ProductListProvider } from "@/context/ProductListProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTheodoreMenu } from "@/hooks/useTheodoreMenu";
import { useTouchScrollLock } from "@/hooks/useTouchScrollLock";
import { lenis, updateScroll } from "@/lib/lenis";
import { scrollLockState } from "@/lib/scrollLockState";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { createContext, Suspense, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, Route, Routes } from "react-router-dom";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Lazy-loaded pages
import HomePage from "@/pages/HomePage";
const ProductsPage = React.lazy(() => import("@/pages/ProductsPage"));
const AboutPage = React.lazy(() => import("@/pages/AboutPage"));
const AboutMePage = React.lazy(() => import("@/pages/AboutMePage"));
const ContactPage = React.lazy(() => import("@/pages/ContactPage"));
const PartnershipPage = React.lazy(() => import("@/pages/PartnershipPage"));
const HowToBuyPage = React.lazy(() => import("@/pages/HowToBuyPage"));

// Navigation Context
interface NavigationContextType {
  setIsPopping: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPopping, setIsPopping] = useState(false);

  return (
    <NavigationContext.Provider value={{ setIsPopping }}>
      {children}
      <PopTransitionOverlay isActive={isPopping} />
    </NavigationContext.Provider>
  );
};

function App() {
  const isMobile = useIsMobile();

  // Theodore Menu management with history API integration
  const { isMenuOpen, toggleMenu, closeMenu, navigateFromMenu, isMenuActionRef, wasMenuOpenRef } = useTheodoreMenu();

  // Блокируем скролл ТОЛЬКО когда меню ОТКРЫТО
  useTouchScrollLock(isMenuOpen);

  useEffect(() => {
    if (isMenuOpen) lenis.stop();
    else lenis.start();

    // Определение горизонтального свайпа для блокировки Lenis
    // Используем только touchstart + touchend — минимум обработчиков на main thread
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (isMenuOpen) return;
      const touch = e.touches[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isMenuOpen) return;

      // Разблокируем Lenis при завершении любого тача
      if (scrollLockState.isLocked) {
        lenis.start();
        scrollLockState.isLocked = false;
      }

      // Определяем был ли это горизонтальный свайп по changedTouches
      const touch = e.changedTouches[0];
      if (!touch) return;
      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);

      // Если был горизонтальный свайп — Lenis уже разблокирован выше
      // Если вертикальный — ничего не делаем, Lenis работает
      if (deltaX > deltaY * 1.7 && deltaX > 5) {
        // горизонтальный свайп завершён — Lenis уже запущен
      }
    };

    // Блокировка Lenis при горизонтальном свайпе — через один passive touchmove
    // Только первый move определяет направление, дальше флаг не меняется
    let directionLocked = false;
    let isTicking = false; // Добавлено

    const handleTouchMove = (e: TouchEvent) => {
      if (isMenuOpen || directionLocked || isTicking) return;
      isTicking = true;

      requestAnimationFrame(() => {
        const touch = e.touches[0];
        if (touch) {
          const deltaX = Math.abs(touch.clientX - touchStartX);
          const deltaY = Math.abs(touch.clientY - touchStartY);

          if (deltaX > 5 || deltaY > 5) {
            directionLocked = true;
            if (deltaX > deltaY * 1.7) {
              // горизонтальный — стопаем Lenis
              if (!scrollLockState.isLocked) {
                lenis.stop();
                scrollLockState.isLocked = true;
              }
            }
          }
        }
        isTicking = false;
      });
    };

    const handleTouchStartReset = (e: TouchEvent) => {
      directionLocked = false;
      handleTouchStart(e);
    };

    document.addEventListener("touchstart", handleTouchStartReset, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStartReset);
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

  // --- ENGINE SYNCHRONIZATION (Lenis + GSAP) ---
  // Unifies the animation pipelines to prevent layout jitter during smooth scrolling.
  useEffect(() => {
    if (typeof window === "undefined" || !lenis) return;

    // 1. Force ScrollTrigger to update strictly on Lenis scroll tick
    lenis.on("scroll", ScrollTrigger.update);

    // 2. Add Lenis RAF to GSAP's global ticker
    // GSAP's time is in seconds, Lenis expects milliseconds
    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);

    // 3. Disable GSAP's internal lag smoothing because Lenis manages the timeline
    gsap.ticker.lagSmoothing(0);

    // 4. Proper cleanup to prevent memory leaks on unmount
    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <NavigationProvider>
      <ProductListProvider>
        <RouteChangeHandler isMenuActionRef={isMenuActionRef} wasMenuOpenRef={wasMenuOpenRef} />
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
                  {" "}
                  <div className="card-modern p-12 text-center max-w-lg">
                    {" "}
                    <h1 className="text-8xl font-bold mb-4 gradient-heading">404</h1>{" "}
                    <p className="text-xl mb-8">Страница не найдена. Возможно, вы ошиблись адресом.</p>{" "}
                    <Link
                      to="/"
                      className="btn-modern btn-primary-modern px-8 py-4 rounded-lg inline-flex items-center gap-2"
                    >
                      {" "}
                      <span>Вернуться на главную</span>{" "}
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
                        {" "}
                        <path d="m15 18-6-6 6-6" />{" "}
                      </svg>{" "}
                    </Link>{" "}
                  </div>{" "}
                </div>
              }
            />
          </Routes>
        </Suspense>
        {import.meta.env.DEV &&
          (isMobile
            ? createPortal(<PerformanceDebugMobile />, document.body)
            : createPortal(<PerformanceDebug />, document.body))}
        {import.meta.env.DEV && !isMobile && createPortal(<EffectsDebugPanel />, document.body)}
      </ProductListProvider>
    </NavigationProvider>
  );
}

export default App;
