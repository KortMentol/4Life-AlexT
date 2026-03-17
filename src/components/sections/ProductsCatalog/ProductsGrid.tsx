import { DetailedProduct } from "@/data/productsData";
import { usePerformanceTier, useTheme } from "@/hooks";
import { Icons } from "@/utils/icons";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface ProductsGridProps {
  products: DetailedProduct[];
  gridMode: 2 | 3 | 4;
  setGridMode: (mode: 2 | 3 | 4) => void;
  selectedCategory: string | null;
  onClearFilters: () => void;
  onProductClick: (product: DetailedProduct) => void;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  gridMode,
  setGridMode,
  selectedCategory,
  onClearFilters,
  onProductClick,
}) => {
  const tier = usePerformanceTier();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Apple/Awwwards 2026: Масляная физика анимаций
  const timings = {
    low: { layout: 0, fade: 0.3, scale: 0.3, stagger: 0 },
    medium: { layout: 0.65, fade: 0.4, scale: 0.4, stagger: 0.04 },
    high: { layout: 0.75, fade: 0.45, scale: 0.45, stagger: 0.05 },
  }[tier];

  // Apple's signature easing curves
  const layoutEasing = [0.43, 0.13, 0.23, 0.96]; // Плавное перемещение (Magic Move)
  const fadeEasing = [0.25, 0.46, 0.45, 0.94]; // Мягкое появление/исчезновение
  const shouldAnimateLayout = tier === 'high';

  const getGridConfig = () => {
    // Awwwards-style: фиксированные колонки, карточки НЕ растягиваются
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024;
    
    if (isMobile) return { columns: 1, maxWidth: '100%' };
    
    if (gridMode === 2) {
      return { columns: 2, maxWidth: isTablet ? '100%' : '600px' };
    }
    if (gridMode === 3) {
      return { columns: isTablet ? 2 : 3, maxWidth: '420px' };
    }
    return { columns: isTablet ? 3 : 4, maxWidth: '350px' };
  };

  const gridConfig = getGridConfig();

  return (
    <>
      {/* МИНИМАЛИСТИЧНЫЙ APPLE-HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 relative z-20">
        <div className="flex items-center gap-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Коллекция
          </h2>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
            {products.length} {products.length === 1 ? "продукт" : products.length < 5 ? "продукта" : "продуктов"}
          </span>
          <AnimatePresence>
            {selectedCategory && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={onClearFilters}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors mt-2 ${
                  isDark
                    ? "bg-white/10 text-gray-300 hover:bg-white/20"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                <Icons.X className="w-3 h-3" /> Сбросить
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Правая часть: Переключатель сетки */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* Grid Switcher (2/3/4) */}
          <div
            className={`hidden md:flex items-center gap-1 p-1 rounded-xl ${isDark ? "bg-gray-900/80 border border-gray-800" : "bg-gray-200/50"}`}
          >
            {[2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => setGridMode(num as 2 | 3 | 4)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  gridMode === num
                    ? isDark
                      ? "bg-gray-800 text-cyan-400 shadow-sm"
                      : "bg-white text-blue-600 shadow-sm"
                    : isDark
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-800"
                }`}
                aria-label={`Сетка ${num}`}
              >
                {/* Иконки сетки */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  {num === 2 && (
                    <>
                      <rect x="3" y="3" width="8" height="18" rx="1" />
                      <rect x="13" y="3" width="8" height="18" rx="1" />
                    </>
                  )}
                  {num === 3 && (
                    <>
                      <rect x="3" y="3" width="5" height="18" rx="1" />
                      <rect x="10" y="3" width="4" height="18" rx="1" />
                      <rect x="16" y="3" width="5" height="18" rx="1" />
                    </>
                  )}
                  {num === 4 && (
                    <>
                      <rect x="3" y="3" width="4" height="18" rx="0.5" />
                      <rect x="8.5" y="3" width="3" height="18" rx="0.5" />
                      <rect x="13" y="3" width="3" height="18" rx="0.5" />
                      <rect x="17.5" y="3" width="3.5" height="18" rx="0.5" />
                    </>
                  )}
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* СЕТКА КАРТОЧЕК */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridConfig.columns}, minmax(0, ${gridConfig.maxWidth}))`,
          gap: "clamp(1.5rem, 3vw, 2rem)",
          justifyContent: products.length < gridConfig.columns ? "start" : "center",
          alignItems: "start",
          minHeight: gridMode === 2 ? "auto" : "60vh"
        }}
        className="relative z-20"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product, idx) => {
            const layoutDelay = idx * timings.stagger;

            return (
              // 1. ВНЕШНИЙ СЛОЙ: Только Framer Motion (Layout + Opacity/Scale при появлении)
              <motion.div
                layout={shouldAnimateLayout}
                layoutId={shouldAnimateLayout ? `product-${product.id}` : undefined}
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    opacity: { duration: timings.fade, ease: fadeEasing, delay: layoutDelay },
                    scale: { duration: timings.scale, ease: fadeEasing, delay: layoutDelay },
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  transition: {
                    opacity: { duration: timings.fade * 0.6, ease: fadeEasing },
                    scale: { duration: timings.scale * 0.6, ease: fadeEasing },
                  },
                }}
                transition={{
                  layout: { duration: timings.layout, ease: layoutEasing },
                }}
                className="product-card-wrapper"
                style={{
                  maxWidth: gridMode === 2 ? '100%' : 'none',
                  width: gridMode === 2 ? '100%' : 'auto',
                }}
              >
                {/* 2. ВНУТРЕННИЙ СЛОЙ: Только CSS (Ховеры, тени, клики). Никакого JS! */}
                <div
                  onClick={() => onProductClick(product)}
                  className={`product-card-inner cursor-pointer ${
                    isDark ? "bg-gray-900/50" : "bg-white"
                  } ${gridMode === 2 ? "md:flex-row" : ""}`}
                >
                  {/* APPLE-STYLE IMAGE CONTAINER */}
                  <div
                    className={`product-image-container ${gridMode === 2 ? "md:w-2/5" : "w-full"} aspect-[4/5] bg-white ${
                      gridMode === 2 ? "md:rounded-l-2xl md:rounded-tr-none" : ""
                    }`}
                    style={{ flexShrink: 0 }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="product-image-primary w-full h-full object-contain"
                    />
                    <img
                      src={product.image}
                      alt={`${product.name} hover`}
                      loading="lazy"
                      decoding="async"
                      className="product-image-secondary w-full h-full object-contain"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide z-10 bg-gray-900/90 text-white border border-white/10 shadow-lg">
                      {product.lp} LP
                    </div>
                  </div>

                  {/* КОНТЕНТ */}
                  <div className={`p-6 flex flex-col flex-grow ${gridMode === 2 ? "md:w-3/5 justify-center" : ""}`}>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {product.categories.slice(0, 2).map((cat) => (
                        <span
                          key={cat}
                          className={`text-[10px] uppercase tracking-wider font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                    <h3
                      className={`font-bold ${gridMode === 2 ? "text-2xl" : "text-xl"} mb-2 leading-snug line-clamp-2 ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {product.name}
                    </h3>
                    <p className={`text-sm line-clamp-2 mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {product.shortDescription}
                    </p>
                    <div
                      className={`mt-auto flex items-center font-bold text-sm transition-colors ${isDark ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-800"}`}
                    >
                      Подробнее <Icons.ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
};

export default React.memo(ProductsGrid);
