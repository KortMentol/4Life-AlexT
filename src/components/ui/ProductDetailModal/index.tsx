/**
 * ProductDetailModal v15 — "Snake Sheet"
 * Mobile: panel scrolls itself (overflowY auto), drag handle closes
 * Desktop: fixed modal, media left, content right
 */
import { DetailedProduct, GalleryItem } from "@/data/productsData";
import { usePerformanceTier, useTheme } from "@/hooks";
import { Icons } from "@/utils/icons";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import SciFiCloseButton from "../SciFiCloseButton";
import { useShoppingCart } from "../ShoppingCartAnimation";
import { ContentPanel } from "./components/ContentPanel";
import { DragHandle } from "./components/DragHandle";
import { MediaGallery } from "./components/MediaGallery";
import { ProductCarousel } from "./components/ProductCarousel";
import { useModalBodyLock } from "./hooks";
import { ProductDetailModalHandle, ProductDetailModalProps } from "./types";
import { buildGallery, IS_TOUCH } from "./utils";

// ─── Spring configs ───────────────────────────────────────────────────────────
const SPRING_HIGH = {
  type: "spring" as const,
  stiffness: 380,
  damping: 40,
  mass: 0.8,
};
const SPRING_LOW = {
  type: "tween" as const,
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1] as const,
};
const FADE = { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const };

// ─── Sub-component prop types ─────────────────────────────────────────────────
interface SharedProps {
  currentProduct: DetailedProduct | null;
  gallery: GalleryItem[];
  mediaIndex: number;
  setMediaIndex: (i: number) => void;
  products: DetailedProduct[];
  productIndex: number;
  isDark: boolean;
  tier: "low" | "medium" | "high";
  borderColor: string;
  bg: string;
  navigateTo: (id: string) => void;
  handleAddToCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// ─── Mobile layout ────────────────────────────────────────────────────────────
const MobileLayout: React.FC<SharedProps> = ({
  currentProduct,
  gallery,
  mediaIndex,
  setMediaIndex,
  products,
  productIndex,
  isDark,
  tier,
  borderColor,
  bg,
  navigateTo,
  handleAddToCart,
}) => {
  if (!currentProduct) return null;
  return (
    <div style={{ paddingBottom: "max(env(safe-area-inset-bottom), 16px)" }}>
      {/* Media */}
      <div
        style={{
          width: "100%",
          aspectRatio: "4/3",
          background: isDark ? "#0f172a" : "#f1f5f9",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <MediaGallery
          gallery={gallery}
          activeIndex={mediaIndex}
          onIndexChange={setMediaIndex}
          isDark={isDark}
          isMobile
          onSwipeLeft={() => {
            const n = products[(productIndex + 1) % products.length];
            if (n) navigateTo(n.id);
          }}
          onSwipeRight={() => {
            const p = products[(productIndex - 1 + products.length) % products.length];
            if (p) navigateTo(p.id);
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 12px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProduct.id}
            initial={tier !== "low" ? { opacity: 0, y: 6 } : {}}
            animate={{ opacity: 1, y: 0 }}
            exit={tier !== "low" ? { opacity: 0, y: -6 } : {}}
            transition={FADE}
          >
            <ContentPanel product={currentProduct} isDark={isDark} isMobile onAddToCart={handleAddToCart} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel + CTA */}
      <div style={{ borderTop: `1px solid ${borderColor}`, background: bg }}>
        <ProductCarousel products={products} activeIndex={productIndex} onSelect={navigateTo} isDark={isDark} />
        <div style={{ padding: "4px 16px 16px" }}>
          <button
            onClick={handleAddToCart}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "14px 20px",
              borderRadius: 16,
              background: isDark
                ? "linear-gradient(135deg,#06b6d4,#3b82f6)"
                : "linear-gradient(135deg,#2563eb,#06b6d4)",
              color: "#fff",
              fontSize: 15,
              border: "none",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
            className="typography-label"
          >
            <Icons.ShoppingCart style={{ width: 18, height: 18, flexShrink: 0 }} />
            <span>Добавить в список</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Desktop layout ───────────────────────────────────────────────────────────
interface DesktopLayoutProps extends SharedProps {
  closeButtonRef: React.RefObject<HTMLButtonElement>;
  handleClose: () => void;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  currentProduct,
  gallery,
  mediaIndex,
  setMediaIndex,
  products,
  productIndex,
  isDark,
  tier,
  borderColor,
  navigateTo,
  handleAddToCart,
  closeButtonRef,
  handleClose,
}) => (
  <>
    <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
      <SciFiCloseButton ref={closeButtonRef} onClick={handleClose} />
    </div>
    <div style={{ display: "flex", flex: 1, minHeight: 0, padding: 24, gap: 24 }}>
      {/* Media */}
      <div
        style={{
          width: "48%",
          flexShrink: 0,
          borderRadius: 16,
          overflow: "hidden",
          background: isDark ? "#0f172a" : "#f1f5f9",
          position: "relative",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentProduct?.id}-m${mediaIndex}`}
            initial={tier !== "low" ? { opacity: 0 } : {}}
            animate={{ opacity: 1 }}
            exit={tier !== "low" ? { opacity: 0 } : {}}
            transition={{ duration: 0.2 }}
            style={{ position: "absolute", inset: 0 }}
          >
            {currentProduct && (
              <MediaGallery
                gallery={gallery}
                activeIndex={mediaIndex}
                onIndexChange={setMediaIndex}
                isDark={isDark}
                isMobile={false}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Divider */}
      <div style={{ width: 1, flexShrink: 0, background: borderColor }} />
      {/* Content */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
          overscrollBehavior: "contain",
        }}
        className="premium-scroll"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProduct?.id}
            initial={tier !== "low" ? { opacity: 0, x: 10 } : {}}
            animate={{ opacity: 1, x: 0 }}
            exit={tier !== "low" ? { opacity: 0, x: -10 } : {}}
            transition={FADE}
          >
            {currentProduct && (
              <ContentPanel product={currentProduct} isDark={isDark} isMobile={false} onAddToCart={handleAddToCart} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
    <div style={{ borderTop: `1px solid ${borderColor}`, flexShrink: 0 }}>
      <ProductCarousel products={products} activeIndex={productIndex} onSelect={navigateTo} isDark={isDark} />
    </div>
  </>
);

// ─── Main component ───────────────────────────────────────────────────────────
const ProductDetailModal = forwardRef<ProductDetailModalHandle, ProductDetailModalProps>(
  ({ product, products, isOpen, onClose }, ref) => {
    const { addToCart } = useShoppingCart();
    const { theme } = useTheme();
    const tier = usePerformanceTier();
    const isDark = theme === "dark";
    const [, setSearchParams] = useSearchParams();

    const panelRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Drag-to-close motion values
    const dragY = useMotionValue(0);
    const panelOpacity = useTransform(dragY, [0, 260], [1, 0.5]);
    const backdropOpacity = useTransform(dragY, [0, 260], [1, 0]);

    useModalBodyLock(isOpen, IS_TOUCH);

    const productIndex = useMemo(() => {
      if (!product) return 0;
      const i = products.findIndex((p) => p.id === product.id);
      return i >= 0 ? i : 0;
    }, [product, products]);

    const [mediaIndex, setMediaIndex] = useState(0);
    const currentProduct = products[productIndex] ?? null;
    const gallery = useMemo(() => (currentProduct ? buildGallery(currentProduct) : []), [currentProduct]);

    useImperativeHandle(ref, () => ({ getPanelImage: () => panelRef.current }));

    useEffect(() => {
      setMediaIndex(0);
    }, [productIndex]);

    useEffect(() => {
      if (isOpen) {
        dragY.set(0);
        setTimeout(() => closeButtonRef.current?.focus(), 350);
      }
    }, [isOpen, dragY]);

    // Header sync (desktop only)
    useEffect(() => {
      if (IS_TOUCH) return;
      document.body.style.setProperty("--header-y", isOpen ? "-130%" : "0%");
      document.body.style.setProperty("--header-opacity", isOpen ? "0" : "1");
      return () => {
        document.body.style.setProperty("--header-y", "0%");
        document.body.style.setProperty("--header-opacity", "1");
      };
    }, [isOpen]);

    useEffect(() => {
      window.dispatchEvent(new CustomEvent("modal-state-change", { detail: { isOpen } }));
    }, [isOpen]);

    const navigateTo = useCallback(
      (id: string) => {
        setSearchParams(
          (prev) => {
            prev.set("productId", id);
            return prev;
          },
          { replace: true },
        );
      },
      [setSearchParams],
    );

    const goNext = useCallback(() => {
      const p = products[(productIndex + 1) % products.length];
      if (p) navigateTo(p.id);
    }, [productIndex, products, navigateTo]);

    const goPrev = useCallback(() => {
      const p = products[(productIndex - 1 + products.length) % products.length];
      if (p) navigateTo(p.id);
    }, [productIndex, products, navigateTo]);

    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    useEffect(() => {
      if (!isOpen) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") handleClose();
        if (e.key === "ArrowRight") goNext();
        if (e.key === "ArrowLeft") goPrev();
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [isOpen, handleClose, goNext, goPrev]);

    const handleAddToCart = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!currentProduct) return;
        const btn = (e.target as HTMLElement).closest("button") as HTMLElement | null;
        if (btn) addToCart(currentProduct, btn);
      },
      [currentProduct, addToCart],
    );

    const handleDragEnd = useCallback(
      (_: unknown, info: { velocity: { y: number }; offset: { y: number } }) => {
        if (info.velocity.y > 400 || info.offset.y > 180) {
          handleClose();
        } else {
          dragY.set(0);
        }
      },
      [handleClose, dragY],
    );

    const bg = isDark ? "#080d18" : "#ffffff";
    const borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
    const spring = tier === "low" ? SPRING_LOW : SPRING_HIGH;
    const backdropBg = isDark ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.55)";
    const backdropBlur = IS_TOUCH ? 0 : tier === "high" ? 16 : tier === "medium" ? 8 : 0;

    const sharedProps: SharedProps = {
      currentProduct,
      gallery,
      mediaIndex,
      setMediaIndex,
      products,
      productIndex,
      isDark,
      tier,
      borderColor,
      bg,
      navigateTo,
      handleAddToCart,
    };

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleClose}
              data-lenis-prevent
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9998,
                backgroundColor: backdropBg,
                backdropFilter: backdropBlur > 0 ? `blur(${backdropBlur}px)` : "none",
                opacity: IS_TOUCH ? backdropOpacity : undefined,
              }}
            />

            {IS_TOUCH ? (
              /* ── MOBILE PANEL ── */
              <motion.div
                key="panel-mobile"
                ref={panelRef}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={spring}
                style={{
                  position: "fixed",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9999,
                  y: dragY,
                  opacity: panelOpacity,
                  backgroundColor: bg,
                  borderRadius: "28px 28px 0 0",
                  boxShadow: "0 -4px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
                  willChange: "transform",
                  maxHeight: "94dvh",
                  overflowY: "auto",
                  WebkitOverflowScrolling: "touch",
                  overscrollBehavior: "contain",
                }}
              >
                {/* Drag handle — only this element has drag */}
                <motion.div
                  drag="y"
                  dragConstraints={{ top: 0 }}
                  dragElastic={{ top: 0.02, bottom: 0.3 }}
                  dragMomentum={false}
                  onDrag={(_, info) => {
                    dragY.set(Math.max(0, info.offset.y));
                  }}
                  onDragEnd={handleDragEnd}
                  style={{
                    touchAction: "none",
                    cursor: "grab",
                    userSelect: "none",
                  }}
                >
                  <DragHandle isDark={isDark} />
                </motion.div>

                {/* Close button */}
                <div style={{ position: "absolute", top: 8, right: 16, zIndex: 10 }}>
                  <SciFiCloseButton ref={closeButtonRef} onClick={handleClose} />
                </div>

                <MobileLayout {...sharedProps} />
              </motion.div>
            ) : (
              /* ── DESKTOP PANEL ── */
              <motion.div
                key="panel-desktop"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={spring}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 9999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 16,
                  pointerEvents: "none",
                }}
              >
                <div
                  ref={panelRef}
                  style={{
                    width: "100%",
                    maxWidth: "72rem",
                    height: "90vh",
                    backgroundColor: bg,
                    borderRadius: 24,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    pointerEvents: "auto",
                    position: "relative",
                    boxShadow: isDark
                      ? "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)"
                      : "0 24px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.06)",
                  }}
                >
                  <DesktopLayout {...sharedProps} closeButtonRef={closeButtonRef} handleClose={handleClose} />
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>,
      document.body,
    );
  },
);

ProductDetailModal.displayName = "ProductDetailModal";
export default ProductDetailModal;
