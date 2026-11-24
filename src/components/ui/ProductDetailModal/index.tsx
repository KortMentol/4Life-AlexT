/**
 * @module src/components/ui/ProductDetailModal/index.tsx
 * @description Swiss Editorial Product Detail Modal with persistent Bottom Action Dock.
 * Docks Prev/Next navigation AND live order CTA / (- qty +) stepper at the bottom edge
 * so users never have to scroll to add/adjust products or browse formulas.
 */

import { MAX_QTY_PER_PRODUCT, MAX_TOTAL_CART_ITEMS } from "@/context/ProductListProvider";
import { DetailedProduct } from "@/data/productsData";
import { usePerformanceTier } from "@/hooks";
import { useProductList } from "@/hooks/useProductList";
import { formatRub, getCategoryAura } from "@/utils/catalogHelpers";
import { Icons } from "@/utils/icons";
import { AnimatePresence, motion, useIsPresent, useMotionValue, useTransform } from "framer-motion";
import { forwardRef, ReactNode, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import SciFiCloseButton from "../SciFiCloseButton";
import SmoothModalScroll from "../SmoothModalScroll";
import { ContentPanel } from "./components/ContentPanel";
import { DragHandle } from "./components/DragHandle";
import { MediaGallery } from "./components/MediaGallery";
import { useModalBodyLock } from "./hooks";
import { ProductDetailModalHandle, ProductDetailModalProps } from "./types";
import { buildGallery, IS_TOUCH } from "./utils";

const SPRING_HIGH = {
  type: "spring" as const,
  stiffness: 380,
  damping: 40,
  mass: 0.8,
};
const SPRING_LOW = {
  type: "tween" as const,
  duration: 0.25,
  ease: [0.22, 1, 0.36, 1] as const,
};
const FADE = { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const };

/**
 * Subscribes to AnimatePresence's PresenceContext so exiting modal layers
 * synchronously flip to pointer-events: none and drop data-lenis-prevent on frame 0.
 */
function ModalPresenceBridge({ children }: { children: (isPresent: boolean) => ReactNode }) {
  const isPresent = useIsPresent();
  return <>{children(isPresent)}</>;
}

const ProductDetailModal = forwardRef<ProductDetailModalHandle, ProductDetailModalProps>(
  ({ product, products, isOpen, onClose }, ref) => {
    const { items, addToList, updateItemQuantity, removeFromList, openModal } = useProductList();
    const tier = usePerformanceTier();
    const [, setSearchParams] = useSearchParams();

    const panelRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const dragY = useMotionValue(0);
    const panelOpacity = useTransform(dragY, [0, 260], [1, 0.5]);
    const backdropOpacity = useTransform(dragY, [0, 260], [1, 0]);

    useModalBodyLock(isOpen);

    const productIndex = useMemo(() => {
      if (!product) return 0;
      const i = products.findIndex((p) => p.id === product.id);
      return i >= 0 ? i : 0;
    }, [product, products]);

    const [mediaIndex, setMediaIndex] = useState(0);
    const currentProduct: DetailedProduct | null = products[productIndex] ?? product ?? null;
    const gallery = useMemo(() => (currentProduct ? buildGallery(currentProduct) : []), [currentProduct]);
    const auraColor = useMemo(
      () => (currentProduct ? getCategoryAura(currentProduct.categories) : "rgba(6, 182, 212, 0.20)"),
      [currentProduct],
    );

    const itemCountInList = useMemo(() => {
      if (!currentProduct) return 0;
      return items.find((item) => item.id === currentProduct.id)?.quantity ?? 0;
    }, [items, currentProduct]);

    const totalItemsInList = useMemo(
      () => items.reduce((sum, item) => sum + item.quantity, 0),
      [items],
    );

    const isAtMaxLimit =
      itemCountInList >= MAX_QTY_PER_PRODUCT || totalItemsInList >= MAX_TOTAL_CART_ITEMS;

    useImperativeHandle(ref, () => ({ getPanelImage: () => panelRef.current }));

    useEffect(() => {
      setMediaIndex(0);
    }, [currentProduct?.id]);

    useEffect(() => {
      if (isOpen) {
        dragY.set(0);
        setTimeout(() => closeButtonRef.current?.focus(), 300);
      }
    }, [isOpen, dragY]);

    useEffect(() => {
      if (IS_TOUCH) return;
      document.body.style.setProperty("--header-y", isOpen ? "-130%" : "0%");
      document.body.style.setProperty("--header-opacity", isOpen ? "0" : "1");
      return () => {
        document.body.style.setProperty("--header-y", "0%");
        document.body.style.setProperty("--header-opacity", "1");
      };
    }, [isOpen]);

    const navigateTo = useCallback(
      (id: string) => {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.set("productId", id);
            return next;
          },
          { replace: true },
        );
      },
      [setSearchParams],
    );

    const goNext = useCallback(() => {
      if (products.length <= 1) return;
      const next = products[(productIndex + 1) % products.length];
      if (next) navigateTo(next.id);
    }, [productIndex, products, navigateTo]);

    const goPrev = useCallback(() => {
      if (products.length <= 1) return;
      const prev = products[(productIndex - 1 + products.length) % products.length];
      if (prev) navigateTo(prev.id);
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

    const handleAddToList = useCallback(() => {
      if (!currentProduct || isAtMaxLimit) return;
      addToList(currentProduct, 1);
    }, [currentProduct, addToList, isAtMaxLimit]);

    const handleDecrementInList = useCallback(() => {
      if (!currentProduct) return;
      if (itemCountInList <= 1) {
        removeFromList(currentProduct.id);
      } else {
        updateItemQuantity(currentProduct.id, itemCountInList - 1);
      }
    }, [currentProduct, itemCountInList, removeFromList, updateItemQuantity]);

    const handleRemoveProduct = useCallback(() => {
      if (!currentProduct) return;
      removeFromList(currentProduct.id);
    }, [currentProduct, removeFromList]);

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

    const handleOpenOrderList = useCallback(() => {
      // Open cart modal first so ref-counted scroll lock stays locked (1 -> 2 -> 1) with zero background jump
      openModal();
      onClose();
    }, [onClose, openModal]);

    const spring = tier === "low" ? SPRING_LOW : SPRING_HIGH;
    const backdropBlur = IS_TOUCH ? 0 : tier === "high" ? 10 : tier === "medium" ? 8 : 0;

    return createPortal(
      <AnimatePresence>
        {isOpen && currentProduct && (
          <ModalPresenceBridge key="product-detail-modal">
            {(isPresent) => (
              <>
                <motion.div
                  key="backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  onClick={isPresent ? handleClose : undefined}
                  onWheel={isPresent ? (e) => e.stopPropagation() : undefined}
                  data-lenis-prevent={isPresent ? "" : undefined}
                  style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9998,
                    backgroundColor: "rgba(3, 5, 10, 0.9)",
                    backdropFilter: backdropBlur > 0 ? `blur(${backdropBlur}px)` : "none",
                    opacity: IS_TOUCH ? backdropOpacity : undefined,
                    pointerEvents: isPresent ? "auto" : "none",
                  }}
                />

                {IS_TOUCH ? (
                  <motion.div
                    key="panel-mobile"
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label={currentProduct.name}
                    data-lenis-prevent={isPresent ? "" : undefined}
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
                      pointerEvents: isPresent ? "auto" : "none",
                      backgroundColor: "#060b14",
                      borderRadius: "28px 28px 0 0",
                      boxShadow: "0 -8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
                      maxHeight: "94dvh",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                <motion.div
                  drag="y"
                  dragConstraints={{ top: 0 }}
                  dragElastic={{ top: 0.02, bottom: 0.3 }}
                  dragMomentum={false}
                  onDrag={(_, info) => {
                    dragY.set(Math.max(0, info.offset.y));
                  }}
                  onDragEnd={handleDragEnd}
                  style={{ touchAction: "none", cursor: "grab", userSelect: "none" }}
                >
                  <DragHandle />
                </motion.div>

                {/* Minimal Mobile Top Bar */}
                <div className="flex items-center justify-between px-4 pb-3 border-b border-white/[0.08] flex-shrink-0">
                  <span className="text-xs text-slate-300 font-medium truncate pr-3">
                    <span className="typography-mono text-cyan-400 tabular-nums">
                      {String(productIndex + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
                    </span>
                    <span className="mx-2 text-white/25" aria-hidden="true">
                      ·
                    </span>
                    <span>{currentProduct.categories[0] ?? "4Life"}</span>
                  </span>
                  <SciFiCloseButton ref={closeButtonRef} onClick={handleClose} />
                </div>

                {/* Scrollable Mobile Content with dynamic top/bottom fade cues */}
                <SmoothModalScroll
                  className="flex-1 min-h-0"
                  contentClassName="p-4"
                  resetKey={currentProduct.id}
                  showTopFade
                  showBottomFade
                  fadeColor="#060b14"
                  dataScrollAttr="data-modal-content-scroll"
                >
                  <div className="h-[320px] mb-5">
                    <MediaGallery
                      gallery={gallery}
                      activeIndex={mediaIndex}
                      onIndexChange={setMediaIndex}
                      isMobile
                      auraColor={auraColor}
                    />
                  </div>

                  <ContentPanel product={currentProduct} onClose={handleClose} />
                </SmoothModalScroll>

                {/* Persistent Mobile Bottom Action Dock */}
                <div
                  className="flex-shrink-0 px-4 pt-3 border-t border-white/[0.09] bg-[#040811] flex items-center justify-between gap-2.5"
                  style={{ paddingBottom: "max(env(safe-area-inset-bottom), 14px)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label="Предыдущий продукт"
                      className="h-11 w-11 rounded-full flex items-center justify-center text-slate-200 bg-white/[0.05] border border-white/[0.1] active:scale-95"
                    >
                      <Icons.ChevronLeft className="w-4 h-4 text-cyan-400" />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Следующий продукт"
                      className="h-11 w-11 rounded-full flex items-center justify-center text-slate-200 bg-white/[0.05] border border-white/[0.1] active:scale-95"
                    >
                      <Icons.ChevronRight className="w-4 h-4 text-cyan-400" />
                    </button>
                  </div>

                  {itemCountInList > 0 ? (
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 flex items-center justify-between h-11 px-2 rounded-full bg-white/[0.06] border border-cyan-400/35">
                        <button
                          type="button"
                          onClick={handleDecrementInList}
                          aria-label="Уменьшить количество"
                          className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-white/[0.08] active:scale-90"
                        >
                          <Icons.Minus className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-semibold text-white tabular-nums">
                          {itemCountInList} шт. · ≈ {formatRub(currentProduct.priceRub * itemCountInList)}
                        </span>
                        <button
                          type="button"
                          onClick={handleAddToList}
                          disabled={isAtMaxLimit}
                          aria-label={
                            isAtMaxLimit
                              ? `Достигнут лимит (${MAX_QTY_PER_PRODUCT} шт.)`
                              : "Добавить ещё одну упаковку"
                          }
                          className={`h-8 w-8 rounded-full flex items-center justify-center transition-opacity ${
                            isAtMaxLimit
                              ? "text-slate-500 bg-white/5 opacity-50 cursor-not-allowed"
                              : "text-cyan-200 bg-white/[0.08] active:scale-90"
                          }`}
                        >
                          <Icons.Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenOrderList}
                        aria-label={`Открыть список заказа (${totalItemsInList})`}
                        className="h-11 px-3.5 rounded-full flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-white/[0.06] border border-white/[0.14] active:scale-95 flex-shrink-0"
                      >
                        <Icons.ShoppingBag className="w-4 h-4 text-cyan-400" />
                        <span className="tabular-nums">{totalItemsInList}</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddToList}
                      disabled={isAtMaxLimit}
                      className="flex-1 h-11 flex items-center justify-center gap-2 px-4 rounded-full font-semibold text-sm bg-white/[0.06] text-white border border-cyan-400/40 active:scale-95 disabled:opacity-45"
                    >
                      <Icons.ShoppingBag className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">В список · ≈ {formatRub(currentProduct.priceRub)}</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="panel-desktop"
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={spring}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 9999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "68px 28px 20px",
                  pointerEvents: "none",
                }}
              >
                <div
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label={currentProduct.name}
                  data-lenis-prevent={isPresent ? "" : undefined}
                  style={{ pointerEvents: isPresent ? "auto" : "none" }}
                  className="w-full max-w-6xl h-[82vh] max-h-[780px] bg-[#060b14] border border-white/[0.1] rounded-3xl flex flex-col overflow-hidden relative shadow-[0_36px_100px_rgba(0,0,0,0.85)]"
                >
                  {/* Minimal Editorial Header */}
                  <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.08] flex-shrink-0 bg-[#04070e]/90">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="typography-mono text-xs text-cyan-400 font-semibold tabular-nums">
                        {String(productIndex + 1).padStart(2, "0")}{" "}
                        <span className="text-white/25">/</span>{" "}
                        {String(products.length).padStart(2, "0")}
                      </span>
                      <span className="text-white/20" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-xs text-slate-300 truncate">
                        {currentProduct.categories.join(" · ")}
                      </span>
                    </div>

                    <SciFiCloseButton ref={closeButtonRef} onClick={handleClose} />
                  </div>

                  {/* Body Split: Media Left (46%), Editorial Dossier Right (54%) */}
                  <div className="flex flex-1 min-h-0 px-6 py-5 gap-8">
                    <div className="w-[46%] flex-shrink-0 h-full">
                      <MediaGallery
                        gallery={gallery}
                        activeIndex={mediaIndex}
                        onIndexChange={setMediaIndex}
                        isMobile={false}
                        auraColor={auraColor}
                      />
                    </div>

                    <div className="w-px flex-shrink-0 bg-white/[0.08]" />

                    <SmoothModalScroll
                      className="flex-1 min-w-0 h-full"
                      contentClassName="pr-5"
                      resetKey={currentProduct.id}
                      showTopFade
                      showBottomFade
                      fadeColor="#060b14"
                      dataScrollAttr="data-modal-content-scroll"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentProduct.id}
                          initial={tier !== "low" ? { opacity: 0, x: 8 } : false}
                          animate={{ opacity: 1, x: 0 }}
                          exit={tier !== "low" ? { opacity: 0, x: -8 } : undefined}
                          transition={FADE}
                        >
                          <ContentPanel product={currentProduct} onClose={handleClose} />
                        </motion.div>
                      </AnimatePresence>
                    </SmoothModalScroll>
                  </div>

                  {/* Persistent Bottom Action Dock: Prev/Next on left + Live Add/Stepper CTA on right */}
                  <div className="flex items-center justify-between gap-4 px-6 py-3.5 border-t border-white/[0.09] bg-[#04070e]/95 flex-shrink-0">
                    {/* Formula Prev / Index / Next */}
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={goPrev}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium text-slate-200 bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.09] hover:border-cyan-400/40 transition-colors cursor-pointer active:scale-95"
                      >
                        <Icons.ChevronLeft className="w-4 h-4 text-cyan-400" />
                        <span>Предыдущий</span>
                      </button>

                      <span className="px-2 text-xs text-slate-400 font-heading tabular-nums select-none">
                        {String(productIndex + 1).padStart(2, "0")}{" "}
                        <span className="text-white/25">/</span>{" "}
                        {String(products.length).padStart(2, "0")}
                      </span>

                      <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium text-slate-200 bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.09] hover:border-cyan-400/40 transition-colors cursor-pointer active:scale-95"
                      >
                        <span>Следующий</span>
                        <Icons.ChevronRight className="w-4 h-4 text-cyan-400" />
                      </button>
                    </div>

                    {/* Live Action / Stepper + One-Tap Clear */}
                    <div className="flex items-center gap-2.5">
                      {itemCountInList > 0 ? (
                        <>
                          {itemCountInList >= 2 && (
                            <button
                              type="button"
                              onClick={handleRemoveProduct}
                              title="Убрать все упаковки этой формулы"
                              aria-label="Убрать позицию из списка"
                              className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full text-sm text-slate-400 hover:text-rose-300 bg-white/[0.03] hover:bg-rose-500/10 border border-white/[0.09] hover:border-rose-400/35 transition-colors cursor-pointer active:scale-95"
                            >
                              <Icons.Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Убрать</span>
                            </button>
                          )}

                          <div
                            data-modal-stepper={currentProduct.id}
                            className="inline-flex items-center gap-3 px-2 py-2 rounded-full bg-white/[0.06] border border-cyan-400/35"
                          >
                            <button
                              type="button"
                              onClick={handleDecrementInList}
                              aria-label="Уменьшить количество в списке"
                              className="h-8 w-8 rounded-full flex items-center justify-center text-white bg-white/[0.07] hover:bg-white/[0.15] transition-colors cursor-pointer active:scale-90"
                            >
                              <Icons.Minus className="w-4 h-4" />
                            </button>

                            <div className="text-center min-w-[152px] px-1">
                              <span className="block text-[13px] font-semibold text-white tabular-nums leading-tight">
                                {itemCountInList} шт. · ≈ {formatRub(currentProduct.priceRub * itemCountInList)}
                              </span>
                              <span className="block text-[11px] text-slate-400 tabular-nums leading-tight mt-0.5">
                                {isAtMaxLimit
                                  ? `Макс. лимит · ${currentProduct.lp * itemCountInList} LP`
                                  : `Итого ${currentProduct.lp * itemCountInList} LP`}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={handleAddToList}
                              disabled={isAtMaxLimit}
                              title={
                                isAtMaxLimit
                                  ? `Достигнут лимит заказа (макс. ${MAX_QTY_PER_PRODUCT} шт. позиции)`
                                  : "Добавить ещё одну упаковку"
                              }
                              aria-label={
                                isAtMaxLimit
                                  ? `Достигнут лимит (${MAX_QTY_PER_PRODUCT} шт.)`
                                  : "Добавить ещё одну упаковку"
                              }
                              className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                                isAtMaxLimit
                                  ? "text-slate-500 bg-white/[0.04] cursor-not-allowed opacity-50"
                                  : "text-cyan-200 bg-white/[0.08] hover:bg-cyan-400/20 hover:text-white cursor-pointer active:scale-90"
                              }`}
                            >
                              <Icons.Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={handleOpenOrderList}
                            className="inline-flex items-center gap-2 h-11 px-4 rounded-full text-sm font-semibold text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] hover:border-white/[0.24] transition-colors cursor-pointer active:scale-95 whitespace-nowrap"
                          >
                            <Icons.ShoppingBag className="w-4 h-4 text-cyan-400" />
                            <span>К заказу ({totalItemsInList})</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={handleAddToList}
                          disabled={isAtMaxLimit}
                          data-modal-add={currentProduct.id}
                          className="inline-flex items-center justify-center gap-2.5 py-2.5 px-6 rounded-full font-semibold text-sm tracking-wide bg-white/[0.055] text-white border border-cyan-400/45 hover:border-cyan-300/80 hover:bg-cyan-500/12 transition-colors duration-200 active:scale-[0.97] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                        >
                          <Icons.ShoppingBag className="w-4 h-4 text-cyan-400" />
                          <span>В список · ≈ {formatRub(currentProduct.priceRub)}</span>
                          <span className="text-xs text-slate-400 tabular-nums font-heading">
                            ({currentProduct.lp} LP)
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
              </>
            )}
          </ModalPresenceBridge>
        )}
      </AnimatePresence>,
      document.body,
    );
  },
);

ProductDetailModal.displayName = "ProductDetailModal";
export default ProductDetailModal;