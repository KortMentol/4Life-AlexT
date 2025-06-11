import { lazy, Suspense } from "react";
import { Route, Routes, Link } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/utils/ScrollToTop";
import RouteChangeHandler from "./components/utils/RouteChangeHandler";
import ScrollToSection from "./components/utils/ScrollToSection";
import { useMobileMenuState } from "./hooks/useMobileMenuState";

// Ленивая загрузка страниц с оптимизированным синтаксисом
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AboutMePage = lazy(() => import("./pages/AboutMePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PartnershipPage = lazy(() => import("./pages/PartnershipPage"));
const HowToBuyPage = lazy(() => import("./pages/HowToBuyPage"));

// Компонент загрузки
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

  return (
    <>
      <ScrollToTop />
      <ScrollToSection />
      <RouteChangeHandler onRouteChange={closeMobileMenu} />
      <Suspense fallback={<LoadingScreen />}>
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
    </>
  );
}

export default App;
