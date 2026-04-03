// src/components/ui/ProductDetailModal.tsx
/**
 * @module ProductDetailModal
 * @description Awwwards 2026 — Premium Product Modal
 * Apple-style gallery (vertical thumbnails desktop / horizontal mobile)
 * Telegram-style product strip at bottom
 * Tier-aware: low=static, medium=transitions, high=full animations+blur
 * 60fps on all tiers — no heavy JS on scroll path
 * @version 14.0.0
 */

import { DetailedProduct, GalleryItem } from "@/data/productsData";
import { usePerformanceTier } from "@/hooks";
import { lenis } from "@/lib/lenis";
import { Icons } from "@/utils/icons";
import { AnimatePresence, motion } from "framer-motion";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import SciFiCloseButton from "./SciFiCloseButton";
import { useShoppingCart } from "./ShoppingCartAnimation";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductDetailModalProps {
  product: DetailedProduct | null;
  products: DetailedProduct[];
  isOpen: boolean;
  onClose: () => void;
}

export interface ProductDetailModalHandle {
  getPanelImage: () => HTMLDivElement | null;
}

const IS_TOUCH = typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;

// ─── Tier configs ─────────────────────────────────────────────────────────────

const ANIM = {
  low: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const },
  medium: { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const },
  high: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
};

// ─── Fallback gallery ─────────────────────────────────────────────────────────

const buildGallery = (product: DetailedProduct): GalleryItem[] => {
  if (product.gallery && product.gallery.length > 0) return product.gallery;
  return [{ type: "image", src: product.image, alt: product.name }];
};

// ─── MediaSlide ───────────────────────────────────────────────────────────────

const MediaSlide: React.FC<{
  item: GalleryItem;
  isActive: boolean;
  tier: "low" | "medium" | "high";
}> = ({ item, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [isActive]);

  if (item.type === "video") {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src={item.src}
          poster={item.poster}
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-contain"
        />
        {/* Play icon overlay when paused */}
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-black/50 border border-white/30 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4">
      <img
        src={item.src}
        alt={item.alt ?? ""}
        loading="lazy"
        decoding="async"
        className="max-w-full max-h-full object-contain"
        style={{ imageRendering: "auto" }}
      />
    </div>
  );
};

// ─── ThumbnailStrip (vertical desktop / horizontal mobile) ───────────────────

const ThumbnailStrip: React.FC<{
  items: GalleryItem[];
  activeIndex: number;
  onSelect: (i: number) => void;
  orientation: "vertical" | "horizontal";
  tier: "low" | "medium" | "high";
}> = ({ items, activeIndex, onSelect, orientation }) => {
  const isV = orientation === "vertical";

  return (
    <div
      className={`flex ${isV ? "flex-col gap-2 w-16 flex-shrink-0" : "flex-row gap-2 h-14 overflow-x-auto scrollbar-hide"}`}
      style={{ contain: "layout paint" }}
    >
      {items.map((item, i) => {
        const isActive = i === activeIndex;
        const thumb = item.type === "video" ? (item.poster ?? item.src) : item.src;

        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 focus:outline-none ${
              isV ? "w-14 h-14" : "w-14 h-14"
            } ${isActive ? "opacity-100 scale-105" : "opacity-40 hover:opacity-70 scale-100"}`}
            style={{ contain: "layout paint" }}
            aria-label={item.alt ?? `Медиа ${i + 1}`}
          >
            {item.type === "video" ? (
              <>
                <img src={thumb} alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </>
            ) : (
              <img src={thumb} alt="" className="w-full h-full object-cover" loading="lazy" />
            )}
          </button>
        );
      })}
    </div>
  );
};

// ─── ProductStrip (bottom Telegram-style) ────────────────────────────────────

const ProductStrip: React.FC<{
  products: DetailedProduct[];
  activeIndex: number;
  onSelect: (i: number) => void;
  tier: "low" | "medium" | "high";
}> = ({ products, activeIndex, onSelect }) => {
  const stripRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active item into view
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const active = strip.children[activeIndex] as HTMLElement | undefined;
    if (active) {
      active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeIndex]);

  if (products.length <= 1) return null;

  return (
    <div
      ref={stripRef}
      className="flex flex-row gap-2 overflow-x-auto scrollbar-hide px-4 py-2"
      style={{ contain: "layout paint" }}
    >
      {products.map((p, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(i)}
            className={`relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden transition-all duration-200 focus:outline-none ${
              isActive ? "opacity-100 scale-110 brightness-110" : "opacity-35 hover:opacity-65 scale-100"
            }`}
            style={{ contain: "layout paint" }}
            aria-label={p.name}
          >
            <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-contain bg-white p-1" />
          </button>
        );
      })}
    </div>
  );
};

// ─── ContentPanel ─────────────────────────────────────────────────────────────

const ContentPanel: React.FC<{
  product: DetailedProduct;
  tier: "low" | "medium" | "high";
  isMobile: boolean;
  onAddToCart: (e: React.MouseEvent) => void;
}> = ({ product, isMobile, onAddToCart }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>();
  const modalLenisRef = useRef<import("lenis").default | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setHasScroll(el.scrollHeight > el.clientHeight + 4);
    const t = setTimeout(check, 60);
    window.addEventListener("resize", check, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", check);
    };
  }, [product]);

  // Lenis smooth scroll внутри модалки — только десктоп (не touch)
  useEffect(() => {
    if (isMobile) return;
    const el = scrollRef.current;
    if (!el) return;

    import("lenis").then(({ default: Lenis }) => {
      const instance = new Lenis({
        wrapper: el,
        content: el.firstElementChild as HTMLElement,
        lerp: 0.1,
        smoothWheel: true,
        infinite: false,
        gestureOrientation: "vertical",
      });
      modalLenisRef.current = instance;

      let rafId: number;
      const loop = (time: number) => {
        instance.raf(time);
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);

      return () => {
        cancelAnimationFrame(rafId);
        instance.destroy();
        modalLenisRef.current = null;
      };
    });

    return () => {
      modalLenisRef.current?.destroy();
      modalLenisRef.current = null;
    };
  }, [isMobile]);

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => setIsScrolling(false), 1000);
  }, []);

  const qty = product.capsules ? `${product.capsules} капсул` : product.servings ? `${product.servings} порций` : null;

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        data-lenis-prevent
        className={`flex-1 overflow-y-auto pr-1 premium-scroll ${hasScroll ? "has-scroll" : ""} ${isScrolling ? "is-scrolling" : ""}`}
        style={{
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
      >
        <div className="space-y-5">
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5">
            {product.categories.map((cat) => (
              <span
                key={cat}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                  isMobile
                    ? "bg-white/8 text-slate-300 border border-white/10"
                    : "bg-cyan-500/10 text-cyan-300 border border-cyan-400/20"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Name */}
          <h2
            className={`font-bold text-white leading-tight tracking-tight ${isMobile ? "text-xl" : "text-2xl md:text-3xl"}`}
          >
            {product.name}
          </h2>

          {/* Meta row — price + volume */}
          <div
            className={`flex items-center gap-5 py-3 px-4 rounded-xl ${
              isMobile ? "bg-white/4 border border-white/8" : "bg-white/[0.03] border border-white/[0.07]"
            }`}
          >
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold mb-0.5">Цена</span>
              <span
                className={`font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent ${
                  isMobile ? "text-xl" : "text-2xl"
                }`}
              >
                {product.lp} LP
              </span>
            </div>
            {qty && (
              <>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold mb-0.5">
                    Объём
                  </span>
                  <span className="text-sm font-medium text-slate-300">{qty}</span>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <p className={`text-slate-300 leading-relaxed ${isMobile ? "text-sm" : "text-sm"}`}>
            {product.mainDescription}
          </p>

          {/* Main support */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Поддерживает</h3>
            <div className="flex flex-wrap gap-1.5">
              {product.mainSupport.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/8 text-emerald-300 border border-emerald-400/20 font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Key benefits */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Преимущества</h3>
            <ul className="space-y-1.5">
              {product.keyBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="mt-1 w-3.5 h-3.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                    <Icons.Check className="w-2 h-2 text-emerald-400" />
                  </div>
                  <span className={`text-slate-400 leading-relaxed ${isMobile ? "text-xs" : "text-xs"}`}>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How to use */}
          <div className="space-y-1.5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Применение</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{product.howToUse}</p>
          </div>

          {/* Scientific evidence */}
          <div
            className={`p-4 rounded-xl space-y-1.5 ${
              isMobile ? "bg-blue-500/5 border border-blue-400/12" : "bg-blue-500/5 border border-blue-400/15"
            }`}
          >
            <div className="flex items-center gap-2">
              <Icons.FlaskConical className="w-3.5 h-3.5 text-blue-400/80 flex-shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400/70">Научная база</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{product.scientificEvidence}</p>
          </div>

          {/* Composition */}
          <div className="space-y-1.5 pb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Состав</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">{product.composition}</p>
          </div>
        </div>
        {/* end inner content wrapper */}
      </div>

      {/* Footer CTA — desktop only (mobile has fixed footer) */}
      {!isMobile && (
        <div className="flex-shrink-0 pt-4 border-t border-white/8 mt-2">
          <button
            onClick={onAddToCart}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-base transition-all duration-200 active:scale-[0.98] shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/25"
          >
            <Icons.ShoppingCart className="w-5 h-5" />
            <span>Добавить в список</span>
          </button>
          <p className="text-center text-xs text-slate-600 mt-2">Консультация по подбору — бесплатно</p>
        </div>
      )}
    </div>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────

const ProductDetailModal = forwardRef<ProductDetailModalHandle, ProductDetailModalProps>(
  ({ product, products, isOpen, onClose }, ref) => {
    const { addToCart } = useShoppingCart();
    const tier = usePerformanceTier();
    const panelImageRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Which product in the list
    const [productIndex, setProductIndex] = useState(0);
    // Which media item in gallery
    const [mediaIndex, setMediaIndex] = useState(0);
    // Swipe state
    const dragStartX = useRef(0);
    const isDragging = useRef(false);

    const isMobile = IS_TOUCH || (typeof window !== "undefined" && window.innerWidth < 768);
    const anim = ANIM[tier];

    const currentProduct = products[productIndex] ?? null;
    const gallery = currentProduct ? buildGallery(currentProduct) : [];

    useImperativeHandle(ref, () => ({ getPanelImage: () => panelImageRef.current }));

    // Sync product index when modal opens
    useEffect(() => {
      if (isOpen && product) {
        const idx = products.findIndex((p) => p.id === product.id);
        setProductIndex(idx >= 0 ? idx : 0);
        setMediaIndex(0);
      }
    }, [isOpen, product, products]);

    // Reset media index when product changes
    useEffect(() => {
      setMediaIndex(0);
    }, [productIndex]);

    // Lenis + body scroll lock
    useEffect(() => {
      const root = document.getElementById("root");
      if (isOpen) {
        document.body.classList.add("menu-open");
        document.documentElement.classList.add("menu-open");
        if (root) root.inert = true;
        lenis.stop();
        setTimeout(() => closeButtonRef.current?.focus(), 100);
      }
      return () => {
        document.body.classList.remove("menu-open");
        document.documentElement.classList.remove("menu-open");
        if (root) root.inert = false;
        lenis.start();
      };
    }, [isOpen]);

    // Keyboard
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (!isOpen) return;
        if (e.key === "Escape") handleClose();
        if (e.key === "ArrowRight") goNextProduct();
        if (e.key === "ArrowLeft") goPrevProduct();
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [isOpen, productIndex]);

    const handleClose = useCallback(() => {
      onClose();
      setTimeout(() => {
        setProductIndex(0);
        setMediaIndex(0);
      }, 300);
    }, [onClose]);

    const goNextProduct = useCallback(() => {
      setProductIndex((p) => (p + 1) % products.length);
    }, [products.length]);

    const goPrevProduct = useCallback(() => {
      setProductIndex((p) => (p - 1 + products.length) % products.length);
    }, [products.length]);

    const handleAddToCart = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentProduct) {
          const btn = (e.target as HTMLElement).closest("button");
          if (btn) addToCart(currentProduct, btn);
        }
      },
      [currentProduct, addToCart],
    );

    // Swipe handlers for product navigation
    const onDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
      isDragging.current = true;
      dragStartX.current = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
    }, []);

    const onDragEnd = useCallback(
      (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        const endX = "changedTouches" in e ? (e.changedTouches[0]?.clientX ?? 0) : e.clientX;
        const delta = endX - dragStartX.current;
        const threshold = isMobile ? 50 : 80;
        if (Math.abs(delta) > threshold) {
          if (delta < 0) goNextProduct();
          else goPrevProduct();
        }
      },
      [isMobile, goNextProduct, goPrevProduct],
    );

    const backdropBlur = isMobile ? 0 : tier === "high" ? 16 : tier === "medium" ? 8 : 0;

    if (!isOpen) return null;

    return createPortal(
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: anim.duration }}
            className={`fixed inset-0 z-[9999] flex items-end md:items-center justify-center ${isMobile ? "" : "p-4"}`}
            style={{
              backgroundColor: "rgba(0,0,0,0.92)",
              backdropFilter: backdropBlur > 0 ? `blur(${backdropBlur}px)` : "none",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose();
            }}
            data-lenis-prevent
          >
            <motion.div
              key="modal-panel"
              initial={{ opacity: 0, y: isMobile ? 60 : 24, scale: isMobile ? 1 : 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: isMobile ? 60 : 24, scale: isMobile ? 1 : 0.97 }}
              transition={{ duration: anim.duration, ease: anim.ease }}
              className={`relative flex flex-col w-full bg-[#030712] overflow-hidden ${
                isMobile ? "h-[95dvh] rounded-t-3xl" : "max-w-6xl h-[90vh] rounded-3xl"
              }`}
              style={{
                boxShadow:
                  tier === "high"
                    ? "0 0 120px rgba(6,182,212,0.18), 0 40px 120px -20px rgba(0,0,0,0.95)"
                    : "0 30px 80px -20px rgba(0,0,0,0.9)",
              }}
              onMouseDown={onDragStart}
              onMouseUp={onDragEnd}
              onTouchStart={onDragStart}
              onTouchEnd={onDragEnd}
            >
              {/* Close button */}
              <div className={`absolute ${isMobile ? "top-4 right-4" : "top-5 right-5"} z-50`}>
                <SciFiCloseButton ref={closeButtonRef} onClick={handleClose} />
              </div>

              {/* ── DESKTOP LAYOUT ── */}
              {!isMobile && (
                <div className="flex flex-1 min-h-0 p-6 gap-5">
                  {/* Left: thumbnail strip + main media */}
                  <div className="flex gap-3 w-[48%] flex-shrink-0">
                    {/* Vertical thumbnails */}
                    <ThumbnailStrip
                      items={gallery}
                      activeIndex={mediaIndex}
                      onSelect={setMediaIndex}
                      orientation="vertical"
                      tier={tier}
                    />

                    {/* Main media */}
                    <div className="flex-1 rounded-2xl overflow-hidden bg-slate-900 relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${currentProduct?.id}-${mediaIndex}`}
                          initial={tier !== "low" ? { opacity: 0, scale: 0.98 } : {}}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={tier !== "low" ? { opacity: 0, scale: 0.98 } : {}}
                          transition={{ duration: anim.duration * 0.7, ease: anim.ease }}
                          className="absolute inset-0"
                          ref={mediaIndex === 0 ? panelImageRef : undefined}
                        >
                          <MediaSlide item={gallery[mediaIndex]!} isActive={true} tier={tier} />
                        </motion.div>
                      </AnimatePresence>

                      {/* Media nav arrows */}
                      {gallery.length > 1 && (
                        <>
                          <button
                            onClick={() => setMediaIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-white hover:bg-black/80 transition-colors z-10"
                          >
                            <Icons.ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setMediaIndex((i) => (i + 1) % gallery.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-white hover:bg-black/80 transition-colors z-10"
                          >
                            <Icons.ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-px bg-white/[0.08] flex-shrink-0" />

                  {/* Right: content */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentProduct?.id}
                        initial={tier !== "low" ? { opacity: 0, x: 16 } : {}}
                        animate={{ opacity: 1, x: 0 }}
                        exit={tier !== "low" ? { opacity: 0, x: -16 } : {}}
                        transition={{ duration: anim.duration * 0.8, ease: anim.ease }}
                        className="h-full"
                      >
                        {currentProduct && (
                          <ContentPanel
                            product={currentProduct}
                            tier={tier}
                            isMobile={false}
                            onAddToCart={handleAddToCart}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* ── MOBILE LAYOUT ── */}
              {isMobile && (
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Media area */}
                  <div className="relative h-[42%] flex-shrink-0 bg-slate-900">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${currentProduct?.id}-${mediaIndex}`}
                        initial={tier !== "low" ? { opacity: 0 } : {}}
                        animate={{ opacity: 1 }}
                        exit={tier !== "low" ? { opacity: 0 } : {}}
                        transition={{ duration: anim.duration * 0.6 }}
                        className="absolute inset-0"
                      >
                        <MediaSlide item={gallery[mediaIndex]!} isActive={true} tier={tier} />
                      </motion.div>
                    </AnimatePresence>

                    {/* Horizontal thumbnail strip over image */}
                    {gallery.length > 1 && (
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                        <div className="flex gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
                          {gallery.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setMediaIndex(i)}
                              className={`rounded-full transition-all duration-200 ${
                                i === mediaIndex ? "w-4 h-1.5 bg-cyan-400" : "w-1.5 h-1.5 bg-white/40"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-h-0 overflow-hidden px-4 pt-4 pb-20">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentProduct?.id}
                        initial={tier !== "low" ? { opacity: 0, y: 12 } : {}}
                        animate={{ opacity: 1, y: 0 }}
                        exit={tier !== "low" ? { opacity: 0, y: -12 } : {}}
                        transition={{ duration: anim.duration * 0.7, ease: anim.ease }}
                        className="h-full"
                      >
                        {currentProduct && (
                          <ContentPanel
                            product={currentProduct}
                            tier={tier}
                            isMobile={true}
                            onAddToCart={handleAddToCart}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Mobile fixed footer */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#030712]/98 border-t border-white/8 px-4 py-3 flex items-center gap-3">
                    <div className="flex flex-col flex-shrink-0">
                      <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">Цена</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        {currentProduct?.lp} LP
                      </span>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm active:scale-[0.97] transition-transform shadow-lg shadow-cyan-500/20"
                    >
                      <Icons.ShoppingCart className="w-4 h-4" />
                      <span>Добавить в список</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── PRODUCT STRIP (bottom, both layouts) ── */}
              {products.length > 1 && (
                <div className={`flex-shrink-0 border-t border-white/8 bg-[#030712] ${isMobile ? "pb-20" : ""}`}>
                  <ProductStrip products={products} activeIndex={productIndex} onSelect={setProductIndex} tier={tier} />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    );
  },
);

ProductDetailModal.displayName = "ProductDetailModal";
export default ProductDetailModal;
