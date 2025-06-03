import { lazy, Suspense } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/utils/ScrollToTop';

// Ленивая загрузка страниц
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AboutMePage = lazy(() => import('./pages/AboutMePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PartnershipPage = lazy(() => import('./pages/PartnershipPage'));
const HowToBuyPage = lazy(() => import('./pages/HowToBuyPage'));

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 text-xl animate-pulse">
          Загрузка сайта 4Life...
        </div>
      }>
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
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
              <h1 className="text-6xl font-bold mb-4">404</h1>
              <p className="text-xl mb-8">Страница не найдена. Возможно, вы ошиблись адресом.</p>
              <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">Вернуться на главную</Link>
            </div>
          } />
        </Routes>
      </Suspense>
    </>
  );
}


export default App;
