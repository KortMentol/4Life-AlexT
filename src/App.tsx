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

// Ленивая загрузка страниц с оптимизированным синтаксисом
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AboutMePage = lazy(() => import("./pages/AboutMePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PartnershipPage = lazy(() => import("./pages/PartnershipPage"));
const HowToBuyPage = lazy(() => import("./pages/HowToBuyPage"));

// Интерфейс для пропсов компонента предварительной загрузки
interface PreloadImagesProps {
  onComplete: () => void;
}

// Компонент предварительной загрузки изображений
const PreloadImages = ({ onComplete }: PreloadImagesProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    // Пути к изображениям для предварительной загрузки
    const heroImage = isMobile
      ? "/src/assets/images/backgrounds/bg-hero-Mobile.webp"
      : "/src/assets/images/backgrounds/bg-hero-PC.webp";
    const productsBgImage = "/src/assets/images/backgrounds/2.jpg";

    // Список изображений для предварительной загрузки
    const imagesToPreload = [heroImage, productsBgImage];

    let loadedCount = 0;

    // Загружаем все изображения
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        setProgress(Math.floor((loadedCount / imagesToPreload.length) * 100));
        if (loadedCount === imagesToPreload.length) {
          // Небольшая задержка для плавности
          setTimeout(() => {
            onComplete();
          }, 300);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === imagesToPreload.length) {
          onComplete();
        }
      };
    });
  }, [onComplete]);

  return (
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
        <p className="mt-4 text-lg font-medium">
          Загрузка сайта 4Life... {progress}%
        </p>
      </div>
    </div>
  );
};

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
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const { closeMobileMenu } = useMobileMenuState();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Используем хук для восстановления позиции скролла
  useScrollRestoration();

  // Используем хук для принудительного сброса скролла при навигации
  useResetScrollOnNavigation();

  // --- НАЧАЛО ГЛОБАЛЬНОГО РЕШЕНИЯ ДЛЯ БЛОКИРОВКИ СКРОЛЛА ---
  useEffect(() => {
    // Сохраняем начальные координаты касания
    let touchStartX = 0;
    let touchStartY = 0;
    // Флаг, который показывает, определили ли мы уже доминирующую ось скролла для текущего жеста
    let scrollDirectionDetermined = false;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      // Запоминаем точку начала жеста
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      // Сбрасываем флаг для нового жеста
      scrollDirectionDetermined = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      // Если мы уже определили направление для этого жеста, ничего не делаем
      if (scrollDirectionDetermined) return;

      const currentX = touch.clientX;
      const currentY = touch.clientY;

      // Вычисляем смещение от начальной точки
      const deltaX = Math.abs(currentX - touchStartX);
      const deltaY = Math.abs(currentY - touchStartY);

      // Устанавливаем порог, чтобы избежать случайного срабатывания при мелких дрожаниях
      const sensitivityThreshold = 5; // 5 пикселей

      if (deltaX > sensitivityThreshold || deltaY > sensitivityThreshold) {
        // Если горизонтальное движение преобладает, останавливаем Lenis
        if (deltaX > deltaY) {
          lenis.stop();
        }
        // Если вертикальное — убеждаемся, что Lenis работает (на случай, если был остановлен ранее)
        else {
          lenis.start();
        }
        // Мы определили направление, больше не будем проверять для этого жеста
        scrollDirectionDetermined = true;
      }
    };

    const handleTouchEnd = () => {
      // Когда жест заканчивается, всегда запускаем Lenis снова
      lenis.start();
    };

    // Добавляем глобальные слушатели на весь документ
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    // Очистка при размонтировании компонента
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []); // Пустой массив зависимостей для выполнения один раз
  // --- КОНЕЦ ГЛОБАЛЬНОГО РЕШЕНИЯ ---

  // Обновляем Lenis при монтировании компонента и при изменении размера окна
  useEffect(() => {
    // Обновляем Lenis после полной загрузки страницы
    window.addEventListener("load", updateScroll);

    // Обновляем Lenis при изменении размера окна
    window.addEventListener("resize", updateScroll);

    // Обновляем Lenis сразу после монтирования
    updateScroll();

    return () => {
      window.removeEventListener("load", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  // Если мы на главной странице и изображения еще не загружены, показываем экран предварительной загрузки
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  if (pathname === "/" && !imagesPreloaded) {
    return <PreloadImages onComplete={() => setImagesPreloaded(true)} />;
  }

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
