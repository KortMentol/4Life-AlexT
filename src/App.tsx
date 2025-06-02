import { lazy, Suspense } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/utils/ScrollToTop';

// Ленивая загрузка страниц
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PartnershipPage = lazy(() => import('./pages/PartnershipPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const PurchasePage = lazy(() => import('./pages/PurchasePage'));

function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 text-xl animate-pulse">
          Загрузка сайта 4Life...
        </div>
      }>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/partnership" element={<PartnershipPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/purchase" element={<PurchasePage />} />
          {/* Маршрут для 404 страницы */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
              <h1 className="text-6xl font-bold mb-4">404</h1>
              <p className="text-xl mb-8">Страница не найдена. Возможно, вы ошиблись адресом.</p>
              <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">Вернуться на главную</Link>
            </div>
          } />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
