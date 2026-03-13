// src/components/ui/ProductDetailModal.tsx

/**
 * @module src/components/ui/ProductDetailModal.tsx
 * @description Awwwards 2025 - Premium Modal with Tier-Optimized Swiper
 * @author Kort
 * @version 13.0.0 - The Final Form
 */

import { DetailedProduct } from "@/data/productsData";
import { usePerformanceTier } from "@/hooks";
import { Icons } from "@/utils/icons";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import SciFiCloseButton from "./SciFiCloseButton";
import { useShoppingCart } from "./ShoppingCartAnimation";

interface ProductDetailModalProps {
  product: DetailedProduct | null;
  products: DetailedProduct[];
  isOpen: boolean;
  onClose: () => void;
  hideImageInitially?: boolean;
}

export interface ProductDetailModalHandle {
  getPanelImage: () => HTMLDivElement | null;
}

const ProductDetailModal = forwardRef<ProductDetailModalHandle, ProductDetailModalProps>(
  ({ product, products, isOpen, onClose }, ref) => {
    const { addToCart } = useShoppingCart();
    const tier = usePerformanceTier();
    const panelImageRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const mouseDownInsideRef = useRef(false);
    const dragStartX = useRef(0);
    const isDragging = useRef(false);
    const x = useMotionValue(0);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const currentProduct = products[currentIndex] || null;

    // Tier-based animation config
    const animConfig = {
      low: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1], dragThreshold: 80 },
      medium: { duration: 0.35, ease: [0.16, 1, 0.3, 1], dragThreshold: 60 },
      high: { duration: 0.45, ease: [0.16, 1, 0.3, 1], dragThreshold: 50 },
    }[tier];

    useImperativeHandle(ref, () => ({
      getPanelImage: () => panelImageRef.current,
    }));

    useEffect(() => {
      if (isOpen && product) {
        const index = products.findIndex((p) => p.id === product.id);
        if (index !== -1) setCurrentIndex(index);
      }
    }, [isOpen, product, products]);

    useEffect(() => {
      const mainContent = document.getElementById("root");
      const lenis = (window as any).lenis;

      if (isOpen) {
        document.body.classList.add("menu-open");
        document.documentElement.classList.add("menu-open");
        if (mainContent) mainContent.inert = true;
        if (lenis) lenis.stop();
        setTimeout(() => closeButtonRef.current?.focus(), 100);
      }

      return () => {
        document.body.classList.remove("menu-open");
        document.documentElement.classList.remove("menu-open");
        if (mainContent) mainContent.inert = false;
        if (lenis) {
          lenis.velocity = 0;
          lenis.start();
        }
      };
    }, [isOpen]);

    const handleAddToCart = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentProduct) {
          const buttonElement = (e.target as HTMLElement).closest("button");
          if (buttonElement) addToCart(currentProduct, buttonElement);
        }
      },
      [currentProduct, addToCart]
    );

    const handleCloseModal = useCallback(() => {
      onClose();
      setTimeout(() => setCurrentIndex(0), 300);
    }, [onClose]);

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) handleCloseModal();
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, handleCloseModal]);

    const goToPrev = useCallback(() => {
      if (products.length <= 1) return;
      setDirection(-1);
      setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    }, [products.length]);

    const goToNext = useCallback(() => {
      if (products.length <= 1) return;
      setDirection(1);
      setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    }, [products.length]);

    const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
      if (products.length <= 1) return;
      isDragging.current = true;
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      dragStartX.current = clientX || 0;
    }, [products.length]);

    const handleDragEnd = useCallback(() => {
      if (!isDragging.current) return;
      isDragging.current = false;

      const dragDistance = x.get();
      if (Math.abs(dragDistance) > animConfig.dragThreshold) {
        if (dragDistance > 0) {
          goToPrev();
        } else {
          goToNext();
        }
      }

      animate(x, 0, { type: "spring", stiffness: 400, damping: 40 });
    }, [x, animConfig.dragThreshold, goToPrev, goToNext]);

    const handleDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging.current || products.length <= 1) return;
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const delta = (clientX || 0) - dragStartX.current;
      x.set(delta * 0.5);
    }, [x, products.length]);

    const backdropBlur = isMobile ? 0 : tier === "high" ? 16 : tier === "medium" ? 10 : 0;



    if (!isOpen) return null;

    return createPortal(
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`fixed inset-0 z-[9999] flex items-center justify-center ${isMobile ? "p-0" : "p-4"}`}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseModal();
            }}
            data-lenis-prevent
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.94)",
              backdropFilter: backdropBlur > 0 ? `blur(${backdropBlur}px)` : "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              className={`relative w-full max-w-7xl ${isMobile ? "h-full" : "h-[95vh] rounded-3xl"} overflow-hidden`}
              onMouseDown={() => (mouseDownInsideRef.current = true)}
              style={{
                backgroundColor: "rgba(3, 7, 18, 0.98)",
                border: "1px solid rgba(6, 182, 212, 0.25)",
                boxShadow:
                  tier === "high"
                    ? "0 0 140px rgba(6, 182, 212, 0.25), 0 30px 120px -15px rgba(0, 0, 0, 0.95)"
                    : "0 30px 60px -15px rgba(0, 0, 0, 0.85)",
              }}
            >
              <div className={`absolute ${isMobile ? "top-4 right-4" : "top-6 right-6"} z-50`}>
                <SciFiCloseButton ref={closeButtonRef} onClick={handleCloseModal} />
              </div>

              {/* Slider Container */}
              <div
                className="relative w-full h-full overflow-hidden"
                onMouseDown={handleDragStart}
                onMouseMove={handleDrag}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDrag}
                onTouchEnd={handleDragEnd}
                style={{ cursor: products.length > 1 ? "grab" : "default", userSelect: "none", WebkitUserSelect: "none" }}
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    initial={{
                      x: direction > 0 ? "100%" : "-100%",
                      opacity: tier === "low" ? 1 : 0,
                      scale: tier === "high" ? 0.95 : 1,
                    }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      x: direction > 0 ? "-100%" : "100%",
                      opacity: tier === "low" ? 1 : 0,
                      scale: tier === "high" ? 0.95 : 1,
                    }}
                    transition={{
                      duration: animConfig.duration,
                      ease: animConfig.ease,
                    }}
                    style={{ x }}
                    className="absolute inset-0"
                  >
                    <ProductSlide
                      product={currentProduct}
                      panelImageRef={panelImageRef}
                      originalProduct={product}
                      tier={tier}
                      isMobile={isMobile}
                      onAddToCart={handleAddToCart}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Buttons */}
              {products.length > 1 && (
                <>
                  <button
                    onClick={goToPrev}
                    className={`absolute ${isMobile ? "left-2 w-9 h-9" : "left-4 w-12 h-12"} top-1/2 -translate-y-1/2 z-50 rounded-full flex items-center justify-center transition-transform duration-200 focus:outline-none hover:scale-110 active:scale-90`}
                    style={{
                      backgroundColor: "rgba(17, 24, 39, 0.95)",
                      border: "1px solid rgba(6, 182, 212, 0.5)",
                      boxShadow: tier === "high" ? "0 0 25px rgba(6, 182, 212, 0.4)" : "none",
                    }}
                    aria-label="Previous product"
                  >
                    <Icons.ChevronLeft className={`${isMobile ? "w-5 h-5" : "w-6 h-6"} text-white`} />
                  </button>
                  <button
                    onClick={goToNext}
                    className={`absolute ${isMobile ? "right-2 w-9 h-9" : "right-4 w-12 h-12"} top-1/2 -translate-y-1/2 z-50 rounded-full flex items-center justify-center transition-transform duration-200 focus:outline-none hover:scale-110 active:scale-90`}
                    style={{
                      backgroundColor: "rgba(17, 24, 39, 0.95)",
                      border: "1px solid rgba(6, 182, 212, 0.5)",
                      boxShadow: tier === "high" ? "0 0 25px rgba(6, 182, 212, 0.4)" : "none",
                    }}
                    aria-label="Next product"
                  >
                    <Icons.ChevronRight className={`${isMobile ? "w-5 h-5" : "w-6 h-6"} text-white`} />
                  </button>
                </>
              )}

              {/* Mobile Footer */}
              {isMobile && (
                <div className="fixed bottom-0 left-0 right-0 z-[70] flex items-center justify-between gap-3 p-4 bg-gray-950/98 backdrop-blur-sm border-t border-cyan-400/20">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Цена</span>
                    <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {currentProduct?.lp} LP
                    </div>
                  </div>
                  {products.length > 1 && (
                    <div
                      className="px-3 py-1 rounded-full text-white text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(17, 24, 39, 0.95)",
                        border: "1px solid rgba(6, 182, 212, 0.4)",
                      }}
                    >
                      <span className="text-cyan-400">{currentIndex + 1}</span>
                      <span className="text-gray-500 mx-1">/</span>
                      <span className="text-gray-300">{products.length}</span>
                    </div>
                  )}
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 active:from-cyan-400 active:to-blue-400 text-white font-bold text-sm rounded-lg transition-all duration-150 active:scale-95 shadow-lg shadow-cyan-500/30 whitespace-nowrap"
                  >
                    <Icons.ShoppingCart className="w-4 h-4" />
                    <span>В корзину</span>
                  </button>
                </div>
              )}
            </motion.div>

            {/* Desktop Pagination */}
            {!isMobile && products.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.15, duration: 0.25 }}
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-white text-sm font-semibold pointer-events-none"
                style={{
                  backgroundColor: "rgba(17, 24, 39, 0.95)",
                  border: "1px solid rgba(6, 182, 212, 0.5)",
                  boxShadow: tier === "high" ? "0 0 25px rgba(6, 182, 212, 0.25)" : "none",
                }}
              >
                <span className="text-cyan-400">{currentIndex + 1}</span>
                <span className="text-gray-500 mx-1.5">/</span>
                <span className="text-gray-300">{products.length}</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  }
);

// Product Slide Component
const ProductSlide: React.FC<{
  product: DetailedProduct | null;
  panelImageRef: React.RefObject<HTMLDivElement>;
  originalProduct: DetailedProduct | null;
  tier: "low" | "medium" | "high";
  isMobile: boolean;
  onAddToCart: (e: React.MouseEvent) => void;
}> = ({ product, panelImageRef, originalProduct, isMobile, onAddToCart }) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = React.useState(false);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [showArrow, setShowArrow] = React.useState(true);
  const hasInteractedRef = React.useRef(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    hasInteractedRef.current = false;
    setShowArrow(true);
    
    const contentEl = contentRef.current;
    if (contentEl) {
      contentEl.classList.remove('scroll-started');
      contentEl.scrollTop = 0;
    }

    const checkScroll = () => {
      if (contentEl) {
        const hasScrollableContent = contentEl.scrollHeight > contentEl.clientHeight;
        setHasScroll(hasScrollableContent);
        if (!hasScrollableContent) {
          setShowArrow(false);
        }
      }
    };

    const timer = setTimeout(checkScroll, 50);
    window.addEventListener("resize", checkScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScroll);
    };
  }, [product]);

  const handleScroll = React.useCallback(() => {
    if (!hasInteractedRef.current && contentRef.current) {
      hasInteractedRef.current = true;
      setShowArrow(false);
      contentRef.current.classList.add('scroll-started');
    }
    
    setIsScrolling(true);
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1200);
  }, []);

  const scrollDown = React.useCallback(() => {
    if (contentRef.current && !hasInteractedRef.current) {
      hasInteractedRef.current = true;
      setShowArrow(false);
      contentRef.current.classList.add('scroll-started');
      contentRef.current.scrollBy({ top: 200, behavior: "smooth" });
    }
  }, []);

  if (!product) return null;

  return (
    <div
      className={`w-full h-full flex flex-col lg:flex-row ${isMobile ? "gap-0" : "gap-0"} ${isMobile ? "p-0" : "p-6 md:p-8 lg:p-10"}`}
      style={{ height: isMobile ? "100vh" : "calc(95vh - 3rem)" }}
    >
      {/* Image Section */}
      <div className={`relative ${isMobile ? "w-full" : "w-[45%] flex-shrink-0"} flex items-center justify-center ${isMobile ? "bg-white" : ""}`}>
        <div className={`relative w-full ${isMobile ? "aspect-[4/3]" : "aspect-square max-w-[500px] rounded-2xl"} overflow-hidden ${isMobile ? "" : "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20"}`}>
          <div
            ref={product.id === originalProduct?.id ? panelImageRef : null}
            className="w-full h-full"
            style={{
              backgroundImage: `url(${product.image})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className={`relative ${isMobile ? "w-full" : "w-[55%] flex-shrink-0"} flex flex-col ${isMobile ? "p-4 pb-24" : "pl-8 pr-4"}`}>
        <div
          ref={contentRef}
          data-lenis-prevent
          data-allow-native-scroll="true"
          onScroll={handleScroll}
          className={`flex-1 flex flex-col ${isMobile ? "space-y-3" : "space-y-4"} overflow-y-auto text-white premium-scroll ${hasScroll ? "has-scroll" : ""} ${isScrolling ? "is-scrolling" : ""}`}
          style={{
            maxHeight: isMobile ? "calc(100vh - 280px)" : "calc(95vh - 12rem)",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {hasScroll && !isMobile && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: showArrow ? 1 : 0, scale: showArrow ? 1 : 0.8 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              onClick={scrollDown}
              className="scroll-arrow-indicator"
              style={{ pointerEvents: showArrow ? "auto" : "none" }}
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icons.ChevronDown className="w-4 h-4 text-cyan-400" />
              </motion.div>
            </motion.button>
          )}

          <div className="flex flex-wrap gap-1.5">
            {product.categories.map((category: string) => (
              <span
                key={category}
                className={`${isMobile ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"} font-semibold uppercase tracking-wide bg-cyan-500/10 text-cyan-300 rounded-md border border-cyan-400/30`}
              >
                {category}
              </span>
            ))}
          </div>

          <h1 className={`${isMobile ? "text-xl" : "text-3xl md:text-4xl xl:text-5xl"} font-bold text-white leading-tight`}>
            {product.name}
          </h1>

          <p className={`${isMobile ? "text-sm" : "text-base md:text-lg"} text-gray-300 leading-relaxed`}>
            {product.mainDescription}
          </p>

          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

          <div className={`${isMobile ? "space-y-2" : "space-y-3"}`}>
            <h3 className={`${isMobile ? "text-xs" : "text-sm"} font-bold uppercase tracking-widest text-cyan-400/90`}>
              Основная поддержка
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {product.mainSupport.map((support: string) => (
                <span
                  key={support}
                  className={`${isMobile ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"} bg-gradient-to-br from-green-500/15 to-emerald-500/10 text-green-300 rounded-md border border-green-400/30 font-medium`}
                >
                  {support}
                </span>
              ))}
            </div>
          </div>

          <div className={`${isMobile ? "space-y-2" : "space-y-3"}`}>
            <h3 className={`${isMobile ? "text-xs" : "text-sm"} font-bold uppercase tracking-widest text-cyan-400/90`}>
              Ключевые преимущества
            </h3>
            <ul className={`${isMobile ? "space-y-1.5" : "space-y-2.5"}`}>
              {product.keyBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <div
                    className={`mt-0.5 ${isMobile ? "w-4 h-4" : "w-5 h-5"} rounded-full bg-gradient-to-br from-green-400/20 to-emerald-400/10 border border-green-400/40 flex items-center justify-center flex-shrink-0`}
                  >
                    <Icons.Check className={`${isMobile ? "w-2.5 h-2.5" : "w-3 h-3"} text-green-400`} />
                  </div>
                  <span className={`${isMobile ? "text-xs" : "text-sm"} leading-relaxed`}>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Desktop Footer */}
        {!isMobile && (
          <div className="flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 pb-2 border-t border-cyan-400/20 mt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Цена</span>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {product.lp} LP
              </div>
            </div>
            <button
              onClick={onAddToCart}
              className="group relative flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl transition-all duration-150 active:scale-95 shadow-lg shadow-cyan-500/30 whitespace-nowrap"
            >
              <Icons.ShoppingCart className="w-5 h-5" />
              <span>В корзину</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

ProductDetailModal.displayName = "ProductDetailModal";
export default ProductDetailModal;
