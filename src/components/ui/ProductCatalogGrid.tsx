/**
 * @module src/components/ui/ProductCatalogGrid.tsx
 * @description E-commerce Pro: Максимальный FPS с CSS-only анимациями
 * @author Kort
 * @version 4.0.0 - Performance Optimized
 */

import { DetailedProduct } from "@/data/productsData";
import { useImageOptimization } from "@/hooks/useImageOptimization";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Icons } from "@/utils/icons";
import { motion } from "framer-motion";
import React, { forwardRef, memo, useEffect, useRef } from "react";

type ProductCatalogGridProps = {
  products: DetailedProduct[];
  onProductClick: (product: DetailedProduct) => void;
  onAddToCart: (product: DetailedProduct) => void;
  loading?: boolean;
  dimmedCardId?: string | null;
  isAnimating: boolean;
};

type ProductCardProps = {
  product: DetailedProduct;
  isDimmed: boolean;
  isAnimating: boolean;
  onProductClick: (product: DetailedProduct) => void;
  onAddToCart: (product: DetailedProduct) => void;
};

const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, isDimmed, isAnimating, onProductClick, onAddToCart }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseDownOnCardRef = useRef(false);
    const { optimizedSrc, isLoaded, imageRef } = useImageOptimization({
      src: product.image,
      lazy: false,
    });

    useEffect(() => {
      if (typeof ref === "function") ref(cardRef.current);
      else if (ref) ref.current = cardRef.current;
    }, [ref]);

    const handleCardClick = (e: React.MouseEvent) => {
      // Проверяем что курсор всё ещё на карточке
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      const isInsideCard =
        e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      if (!isAnimating && mouseDownOnCardRef.current && isInsideCard) {
        onProductClick(product);
      }
      mouseDownOnCardRef.current = false;
    };

    const handleAddToCart = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isAnimating) {
        onAddToCart(product);
      }
    };

    const cardClasses = `product-card group relative cursor-pointer ${isDimmed ? "product-card-dimmed" : ""} ${isAnimating ? "pointer-events-none" : ""}`;

    // Firefox оптимизация
    const cardStyle = {
      transform: "translateZ(0)",
      backfaceVisibility: "hidden" as const,
      WebkitBackfaceVisibility: "hidden" as const,
    };

    return (
      <div
        ref={cardRef}
        className={cardClasses}
        style={cardStyle}
        onMouseDown={() => {
          mouseDownOnCardRef.current = true;
        }}
        onMouseLeave={() => {
          mouseDownOnCardRef.current = false;
        }}
        onMouseUp={(e) => {
          // Дополнительная проверка для Firefox
          const target = e.currentTarget;
          const rect = target.getBoundingClientRect();
          const isInsideCard =
            e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

          if (!isInsideCard) {
            mouseDownOnCardRef.current = false;
          }
        }}
        onClick={handleCardClick}
        data-product-id={product.id}
      >
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-900 border border-white/10 transition-transform duration-200"
          style={{ contain: "layout style paint" }}
          onMouseEnter={(e) => (e.currentTarget.style.willChange = "transform")}
          onMouseLeave={(e) => (e.currentTarget.style.willChange = "auto")}
        >
          <motion.div layoutId={`card-image-${product.id}`} className="absolute inset-0">
            <img
              ref={imageRef}
              src={optimizedSrc}
              alt={product.name}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
              style={{ transform: "translateZ(0)", aspectRatio: "3/4" }}
              data-img-main
            />
          </motion.div>

          {!isLoaded && <div className="absolute inset-0 bg-gray-800" />}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
            <div>
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
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
                >
                  <Icons.ShoppingCart className="w-4 h-4" />
                  <span>В корзину</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
ProductCard.displayName = "ProductCard";
const MemoizedProductCard = memo(ProductCard);

const ProductCatalogGrid = forwardRef<HTMLDivElement, ProductCatalogGridProps>(
  ({ products, onProductClick, onAddToCart, loading = false, dimmedCardId, isAnimating }, ref) => {
    const isMobile = useIsMobile();
    const gridCols = isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))";
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (typeof ref === "function") ref(containerRef.current);
      else if (ref) ref.current = containerRef.current;
    }, [ref]);

    if (loading) {
      return (
        <div className="grid gap-6 md:gap-8" style={{ gridTemplateColumns: gridCols }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="text-center fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Каталог продуктов</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Откройте для себя инновационные продукты 4Life с Трансфер Факторами
          </p>
        </div>

        <div ref={containerRef} className="grid gap-6 md:gap-8 product-grid" style={{ gridTemplateColumns: gridCols }}>
          {products.map((product) => (
            <MemoizedProductCard
              key={product.id}
              product={product}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
              isDimmed={!!dimmedCardId && dimmedCardId !== product.id}
              isAnimating={isAnimating}
            />
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-16 fade-in">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
              <Icons.Search className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Продукты не найдены</h3>
            <p className="text-gray-400">Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        )}
      </div>
    );
  }
);

ProductCatalogGrid.displayName = "ProductCatalogGrid";
export default ProductCatalogGrid;
