/**
 * @module src/components/ui/ProductCatalogGrid.tsx
 * @description Каталог продуктов, готовый для Awwwards-анимаций.
 * Каждая карточка содержит data-атрибуты для настройки эффекта RepeatingImageTransition.
 * @author Kort
 * @version 3.0.0
 */

import { DetailedProduct } from "@/data/productsData";
import { useImageOptimization } from "@/hooks/useImageOptimization";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useVirtualization } from "@/hooks/useVirtualization";
import { Icons } from "@/utils/icons";
import { AnimatePresence, motion } from "framer-motion";
import React, { forwardRef, useEffect, useRef } from "react";

type ProductCatalogGridProps = {
  products: DetailedProduct[];
  onProductClick: (product: DetailedProduct, element: HTMLDivElement) => void;
  onAddToCart: (product: DetailedProduct, element: HTMLElement) => void;
  loading?: boolean;
  dimmedCardId?: string | null;
  isAnimating: boolean; // Новый пропс для блокировки взаимодействий
};

type ProductCardProps = {
  product: DetailedProduct;
  index: number;
  isDimmed: boolean;
  isAnimating: boolean;
  onProductClick: (product: DetailedProduct, element: HTMLDivElement) => void;
  onAddToCart: (product: DetailedProduct, element: HTMLElement) => void;
};

const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, index, isDimmed, isAnimating, onProductClick, onAddToCart }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { optimizedSrc, isLoaded, imageRef } = useImageOptimization({
      src: product.image,
      lazy: true,
    });

    useEffect(() => {
      if (typeof ref === "function") ref(cardRef.current);
      else if (ref) ref.current = cardRef.current;
    }, [ref]);

    const handleCardClick = () => {
      if (cardRef.current && !isAnimating) {
        onProductClick(product, cardRef.current);
      }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (cardRef.current && !isAnimating) {
        onAddToCart(product, cardRef.current);
      }
    };

    const cardClasses = `group relative cursor-pointer product-card ${isDimmed ? "product-card-dimmed" : ""} ${isAnimating ? "pointer-events-none" : ""}`;

    return (
      <motion.div
        ref={cardRef}
        layout
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          duration: 0.6,
          delay: index * 0.05,
          layout: { duration: 0.4, ease: "easeOut" },
        }}
        className={cardClasses}
        onClick={handleCardClick}
        data-product-id={product.id}
        // --- НОВОЕ: Data-атрибуты для анимации в стиле Codrops ---
        data-steps="8"
        data-step-duration="0.3"
        data-path-motion="sine"
        data-sine-amplitude="40"
        data-step-interval="0.04"
        data-mover-enter-ease="power2.in"
        data-mover-exit-ease="power3.out"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-900 border border-white/10 transition-all duration-500 group-hover:border-cyan-400/50 group-hover:shadow-2xl group-hover:shadow-cyan-500/20">
          <img
            ref={imageRef}
            src={optimizedSrc}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${isLoaded ? "opacity-100" : "opacity-0"}`}
            data-img-main // Маркер для GSAP
          />

          {!isLoaded && <div className="absolute inset-0 bg-gray-800 animate-pulse" />}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_70%)]" />

          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
            <motion.div className="transform transition-transform duration-300 group-hover:-translate-y-2">
              <h3 className="text-xl font-bold mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-300 mb-4 line-clamp-3">{product.shortDescription}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {product.categories.slice(0, 2).map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-cyan-400">{product.lp} LP</div>
                <button
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  <Icons.ShoppingCart className="w-4 h-4" />В корзину
                </button>
              </div>
            </motion.div>
          </div>

          <div className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
            <Icons.Eye className="w-5 h-5 text-white" />
          </div>
        </div>
      </motion.div>
    );
  }
);
ProductCard.displayName = "ProductCard";

const ProductCatalogGrid = forwardRef<HTMLDivElement, ProductCatalogGridProps>(
  ({ products, onProductClick, onAddToCart, loading = false, dimmedCardId, isAnimating }, ref) => {
    const isMobile = useIsMobile();
    const gridCols = isMobile ? 1 : "repeat(auto-fill, minmax(300px, 1fr))";

    const { visibleItems, containerRef: virtualContainerRef } = useVirtualization({
      items: products,
      itemHeight: isMobile ? 500 : 400,
      containerHeight: 800,
      overscan: 3,
      enabled: products.length > 20,
    });

    useEffect(() => {
      if (typeof ref === "function") ref(virtualContainerRef.current);
      else if (ref) ref.current = virtualContainerRef.current;
    }, [ref, virtualContainerRef]);

    if (loading) {
      return (
        <div className="grid gap-8" style={{ gridTemplateColumns: gridCols }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      );
    }

    const itemsToRender = products.length > 20 ? visibleItems : products.map((p, index) => ({ data: p, index }));

    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Каталог продуктов</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Откройте для себя инновационные продукты 4Life с Трансфер Факторами
          </p>
        </motion.div>

        <motion.div
          ref={virtualContainerRef}
          layout
          className="grid gap-8 product-grid"
          style={{ gridTemplateColumns: gridCols }}
        >
          <AnimatePresence>
            {itemsToRender.map((item) => {
              const product = ("data" in item ? item.data : item) as DetailedProduct;
              const index = "index" in item ? item.index : products.indexOf(product);

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onProductClick={onProductClick}
                  onAddToCart={onAddToCart}
                  isDimmed={!!dimmedCardId && dimmedCardId !== product.id}
                  isAnimating={isAnimating}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>

        {products.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
              <Icons.Search className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Продукты не найдены</h3>
            <p className="text-gray-400">Попробуйте изменить фильтры или поисковый запрос</p>
          </motion.div>
        )}
      </div>
    );
  }
);

ProductCatalogGrid.displayName = "ProductCatalogGrid";
export default ProductCatalogGrid;
