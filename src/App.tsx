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
import { lenis, updateScroll } from "@/lib/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Link, Route, Routes } from "react-router-dom";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// КРИТИЧНО: Добавь эту глобальную конфигурацию!
if (typeof window !== "undefined") {
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (isTouch) {
    ScrollTrigger.config({
      ignoreMobileResize: true, // Не пересчитывать позиции при появлении/скрытии URL-бара
      autoRefreshEvents: "DOMContentLoaded,load,visibilitychange", // Убираем 'resize' из событий для мобильных
    });
  }
}

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

const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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

  const { isMenuOpen, toggleMenu, closeMenu, isMenuActionRef, wasMenuOpenRef } =
    useTheodoreMenu();

  const scrollYBeforeMenuRef = useRef(0);

  // Скролл-лок при открытом меню с fail-safe cleanup
  useEffect(() => {
    const html = document.documentElement;
    if (isMenuOpen) {
      const scrollY = window.scrollY;
      scrollYBeforeMenuRef.current = scrollY;
      html.style.overflow = "hidden";
      html.style.position = "fixed";
      html.style.top = `-${scrollY}px`;
      html.style.width = "100%";
      lenis?.stop();
    } else {
      html.style.overflow = "";
      html.style.position = "";
      html.style.top = "";
      html.style.width = "";
      window.scrollTo(0, scrollYBeforeMenuRef.current);
      lenis?.start();
    }

    // Fail-safe cleanup: ensure scroll is restored even if component unmounts
    return () => {
      if (isMenuOpen) {
        html.style.overflow = "";
        html.style.position = "";
        html.style.top = "";
        html.style.width = "";
        lenis?.start();
      }
    };
  }, [isMenuOpen]);

  useEffect(() => {
    window.addEventListener("load", updateScroll);
    window.addEventListener("resize", updateScroll);
    return () => {
      window.removeEventListener("load", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  // --- ENGINE SYNCHRONIZATION (Lenis + GSAP, только десктоп) ---
  useEffect(() => {
    if (!lenis) return; // На мобильных lenis === null — пропускаем

    const l = lenis;
    l.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      l.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <NavigationProvider>
      <ProductListProvider>
        <RouteChangeHandler
          isMenuActionRef={isMenuActionRef}
          wasMenuOpenRef={wasMenuOpenRef}
        />
        <Suspense fallback={null}>
          <Header isMenuOpen={isMenuOpen} setIsMenuOpen={toggleMenu} />
          <TheodoreMenu isOpen={isMenuOpen} onClose={closeMenu} />
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
        {import.meta.env.DEV &&
          (isMobile
            ? createPortal(<PerformanceDebugMobile />, document.body)
            : createPortal(<PerformanceDebug />, document.body))}
        {import.meta.env.DEV &&
          !isMobile &&
          createPortal(<EffectsDebugPanel />, document.body)}
      </ProductListProvider>
    </NavigationProvider>
  );
}

export default App;
