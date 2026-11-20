import { buildGallery } from "./utils";
import type { ProductDetailModalHandle, ProductDetailModalProps } from "./types";
import { ContentPanel } from "./components/ContentPanel";
import { MediaGallery } from "./components/MediaGallery";
import { useModalBodyLock } from "./hooks";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { Icons } from "@/utils/icons";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

const ProductNavigator: React.FC<{
  index: number;
  count: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  closeRef?: React.RefObject<HTMLButtonElement>;
}> = ({ index, count, onPrevious, onNext, onClose, closeRef }) => (
  <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-4 py-3 md:px-6">
    <div className="flex items-center gap-2" role="group" aria-label="Переключение товара">
      <button
        type="button"
        onClick={onPrevious}
        disabled={count < 2}
        className="flex size-10 items-center justify-center rounded-full border border-white/[0.1] text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-35"
        aria-label="Предыдущий товар"
      >
        <Icons.ChevronLeft className="size-4" aria-hidden="true" />
      </button>
      <span className="min-w-12 text-center font-mono text-xs tabular-nums text-slate-400" aria-live="polite">
        {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={count < 2}
        className="flex size-10 items-center justify-center rounded-full border border-white/[0.1] text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-35"
        aria-label="Следующий товар"
      >
        <Icons.ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </div>
    <button
      ref={closeRef}
      type="button"
      onClick={onClose}
      className="flex size-10 items-center justify-center rounded-full text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      aria-label="Закрыть карточку товара"
    >
      <Icons.X className="size-5" aria-hidden="true" />
    </button>
  </div>
);

const ProductDetailModal = forwardRef<ProductDetailModalHandle, ProductDetailModalProps>(
  ({ product, products, isOpen, onClose, onNavigate }, ref) => {
    const tier = usePerformanceTier();
    const prefersReducedMotion = useReducedMotion();
    const isLowMotion = tier === "low" || prefersReducedMotion === true;
    const panelRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useModalBodyLock(isOpen, isMobile);
    useImperativeHandle(ref, () => ({ getPanelImage: () => panelRef.current }), []);

    const productIndex = useMemo(() => {
      if (!product) return 0;
      const index = products.findIndex((entry) => entry.id === product.id);
      return index >= 0 ? index : 0;
    }, [product, products]);
    const gallery = useMemo(() => (product ? buildGallery(product) : []), [product]);
    const backdropBlur = isMobile || tier === "low" ? 0 : tier === "medium" ? 6 : 14;

    const navigate = useCallback(
      (direction: -1 | 1) => {
        if (products.length < 2) return;
        const nextIndex = (productIndex + direction + products.length) % products.length;
        onNavigate?.(nextIndex);
      },
      [onNavigate, productIndex, products.length],
    );

    useEffect(() => {
      const media = window.matchMedia("(max-width: 767px)");
      const update = (event?: MediaQueryListEvent) => setIsMobile(event?.matches ?? media.matches);
      update();
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }, []);

    useEffect(() => {
      setActiveIndex(0);
    }, [product?.id]);

    useEffect(() => {
      window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen } }));
      return () => {
        window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen: false } }));
      };
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen) {
        previousFocusRef.current?.focus();
        previousFocusRef.current = null;
        return;
      }

      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
      return () => window.cancelAnimationFrame(frame);
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen) return;
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
          return;
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          navigate(-1);
          return;
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          navigate(1);
          return;
        }
        if (event.key !== "Tab" || !panelRef.current) return;
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable.item(0);
        const last = focusable.item(focusable.length - 1);
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, navigate, onClose]);

    const closeOnBackdrop = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) onClose();
    };
    const navigatorProps = {
      index: productIndex,
      count: products.length,
      onPrevious: () => navigate(-1),
      onNext: () => navigate(1),
      onClose,
    };

    return (
      <AnimatePresence>
        {product && isOpen ? (
        <motion.div
          key="product-detail-modal"
          className="fixed inset-0 z-[120] flex items-end justify-center bg-black/80 p-0 md:items-center md:p-6"
          style={backdropBlur ? { backdropFilter: `blur(${backdropBlur}px)` } : undefined}
          initial={isLowMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={isLowMotion ? undefined : { opacity: 0 }}
          transition={{ duration: isLowMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
          onMouseDown={closeOnBackdrop}
          role="presentation"
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            data-lenis-prevent
            className="relative w-full max-w-[1480px] overflow-hidden border border-white/[0.08] bg-[#050811] text-white shadow-2xl outline-none md:rounded-3xl"
            style={{ maxHeight: isMobile ? "96dvh" : "min(92dvh, 900px)", overscrollBehavior: "contain" }}
            initial={isLowMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={isLowMotion ? undefined : { opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: isLowMotion ? 0 : 0.36, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="product-modal-title" className="sr-only">{product.name}</h2>
            {isMobile ? (
              <div className="max-h-[96dvh] overflow-y-auto overscroll-contain">
                <div className="sticky top-0 z-20 bg-[#050811]/95">
                  <ProductNavigator {...navigatorProps} closeRef={closeButtonRef} />
                </div>
                <div className="h-[38svh] min-h-[260px] max-h-[400px]">
                  <MediaGallery gallery={gallery} activeIndex={activeIndex} onIndexChange={setActiveIndex} isMobile />
                </div>
                  <ContentPanel product={product} isMobile={isMobile} />
              </div>
            ) : (
              <div className="grid min-h-[640px] grid-cols-[minmax(0,1.04fr)_minmax(420px,0.96fr)]">
                <div className="min-h-[640px] border-r border-white/[0.07]">
                  <MediaGallery gallery={gallery} activeIndex={activeIndex} onIndexChange={setActiveIndex} isMobile={false} />
                </div>
                <div className="max-h-[min(92dvh,900px)] overflow-y-auto overscroll-contain">
                  <div className="sticky top-0 z-20 bg-[#050811]/95">
                    <ProductNavigator {...navigatorProps} closeRef={closeButtonRef} />
                  </div>
                  <ContentPanel product={product} isMobile={isMobile} />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
        ) : null}
      </AnimatePresence>
    );
  },
);

ProductDetailModal.displayName = "ProductDetailModal";

export default React.memo(ProductDetailModal);
