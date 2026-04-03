/**
 * @module src/pages/ProductsPage.tsx
 * @description Immersive Garden 2026 - Apple-Level Masterpiece
 * @author KortMentol
 */

import { ProductDetailModal } from "@/components/ui";
import { DetailedProduct, productsData } from "@/data/productsData";
import { useTheme } from "@/hooks";
import { lenis } from "@/lib/lenis";
import { SEO } from "@/seo/SEO";
import { Icons } from "@/utils/icons";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Секции
import ProductsFAQ from "@/components/sections/ProductsCatalog/ProductsFAQ";
import ProductsFilters from "@/components/sections/ProductsCatalog/ProductsFilters";
import ProductsGrid from "@/components/sections/ProductsCatalog/ProductsGrid";
import ProductsHero from "@/components/sections/ProductsCatalog/ProductsHero";

import "@/styles/pages/products-page.css";

const ProductsPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchParams, setSearchParams] = useSearchParams();

  // --- STATE ---
  // Category synced with URL ?cat=... for browser back/forward support
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => searchParams.get("cat") ?? null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DetailedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFloatingFilter, setShowFloatingFilter] = useState(false);
  // Grid mode persisted in localStorage
  const [gridMode, setGridMode] = useState<2 | 3 | 4>(() => {
    try {
      const saved = localStorage.getItem("products-grid-mode");
      if (saved === "2" || saved === "3" || saved === "4") return Number(saved) as 2 | 3 | 4;
    } catch {}
    return 4;
  });

  // --- REFS ---
  const catalogRef = useRef<HTMLDivElement>(null);
  const gridAnchorRef = useRef<HTMLDivElement>(null);
  const lastClickedCardRef = useRef<string | null>(null);

  // --- DATA ---
  const categories = useMemo(() => {
    const cats = new Set<string>();
    productsData.forEach((p) => p.categories.forEach((c) => cats.add(c)));
    return Array.from(cats).sort();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return productsData;
    return productsData.filter((p) => p.categories.includes(selectedCategory));
  }, [selectedCategory]);

  // --- HANDLERS ---
  const handleCategoryChange = useCallback(
    (category: string | null) => {
      if (gridAnchorRef.current) {
        lenis.scrollTo(gridAnchorRef.current, {
          offset: -100,
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          force: true,
          lock: false,
        });
      }
      setTimeout(() => {
        setSelectedCategory(category);
        if (category) {
          setSearchParams({ cat: category }, { replace: true });
        } else {
          setSearchParams({}, { replace: true });
        }
      }, 150);
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const handleSetGridMode = useCallback((mode: 2 | 3 | 4) => {
    setGridMode(mode);
    try {
      localStorage.setItem("products-grid-mode", String(mode));
    } catch {}
  }, []);

  useEffect(() => {
    const catalogElement = catalogRef.current;
    if (!catalogElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setShowFloatingFilter(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "-20% 0px -20% 0px",
      },
    );

    observer.observe(catalogElement);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-black dark:bg-black bg-white">
      <SEO
        title="Коллекция 4Life - Каталог здоровья"
        description="Полный каталог инновационных продуктов 4Life с Трансфер Факторами."
        path="/products"
      />

      {/* 1. HERO СЕКЦИЯ */}
      <ProductsHero />

      {/* 2. КАТАЛОГ */}
      <div
        ref={catalogRef}
        className="relative z-10 w-full bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-black"
      >
        {/* Градиент-Ластик */}
        <div className="absolute left-0 right-0 h-[300px] md:h-[400px] -top-[300px] md:-top-[400px] bg-gradient-to-b from-transparent to-white dark:to-black pointer-events-none" />

        <div className="py-12 relative z-20">
          {/* ИДЕАЛЬНЫЙ ЯКОРЬ В НОРМАЛЬНОМ ПОТОКЕ */}
          <div ref={gridAnchorRef} className="w-full h-0 pointer-events-none" aria-hidden="true" />

          {/* Заголовок с отступами */}
          <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            <ProductsGrid
              products={filteredProducts}
              gridMode={gridMode}
              setGridMode={handleSetGridMode}
              selectedCategory={selectedCategory}
              onClearFilters={clearFilters}
              onProductClick={(p) => {
                lastClickedCardRef.current = p.id;
                setSelectedProduct(p);
                setIsModalOpen(true);
              }}
            />
          </div>
        </div>

        {/* 3. СЕКЦИЯ FAQ */}
        <ProductsFAQ />
      </div>

      {/* 4. ПЛАВАЮЩАЯ КНОПКА ФИЛЬТРА */}
      <AnimatePresence>
        {showFloatingFilter && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)} // TOGGLE ЛОГИКА
            className={`fixed bottom-6 left-6 z-[60] flex items-center justify-center w-14 h-14 rounded-2xl shadow-2xl floating-filter-btn ${
              isDark
                ? "bg-gray-800/90 text-cyan-400 border border-gray-700 hover:border-cyan-400/50"
                : "bg-white/90 text-blue-600 border border-gray-200 hover:border-blue-400"
            }`}
            aria-label="Фильтры"
          >
            {isFiltersOpen ? <Icons.X className="w-6 h-6" /> : <Icons.Filter className="w-6 h-6" />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* 5. КАПСУЛА ФИЛЬТРОВ */}
      <ProductsFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        productCount={filteredProducts.length}
      />

      {/* 6. МОДАЛКА ПРОДУКТА */}
      <ProductDetailModal
        product={selectedProduct}
        products={filteredProducts}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // Scroll back to the card that was clicked
          if (lastClickedCardRef.current) {
            const cardEl = document.querySelector(
              `[data-product-id="${lastClickedCardRef.current}"]`,
            ) as HTMLElement | null;
            if (cardEl) {
              setTimeout(() => {
                lenis.scrollTo(cardEl, { offset: -120, duration: 1.0 });
              }, 350); // wait for modal exit animation
            }
          }
        }}
      />
    </div>
  );
};

export default React.memo(ProductsPage);
