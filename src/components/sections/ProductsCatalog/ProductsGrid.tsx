/**
 * @module src/components/sections/ProductsCatalog/ProductsGrid.tsx
 * @description Awwwards SOTY 2026+ 144–240Hz Zero-Paint Monochrome Architectural Apothecary Gallery.
 *
 * Design & Performance Architecture:
 * - Unified monochrome overhead studio lightbox (zero RGB category traffic lights, zero AI reticle circles,
 *   zero duplicate horizon lines, zero colliding overlays).
 * - Zero `getBoundingClientRect()` on `pointermove`: caches card rect + scrollY once on `pointerenter`
 *   and compensates live scroll offset arithmetically while updating pre-baked orb(s) via GPU `translate3d`
 *   throttled to 1× per animation frame.
 * - Zero real-time `filter: drop-shadow()` or `filter: blur()` on cards or bottles.
 * - Strict 3-tier hardware adaptation:
 *     - High Desktop: 1px perimeter beam orb + soft interior specular orb + compositor bottle levitation.
 *     - Medium Desktop: 1px perimeter beam orb (1 texture) + compositor bottle levitation.
 *     - Low / Mobile: zero orb DOM nodes, zero multi-layer hover transitions, solid obsidian luxury.
 */

import { MAX_QTY_PER_PRODUCT, MAX_TOTAL_CART_ITEMS } from "@/context/ProductListProvider";
import { DetailedProduct } from "@/data/productsData";
import { useIsMobile, usePerformanceTier } from "@/hooks";
import { useProductList } from "@/hooks/useProductList";
import { estimateRetailRub, formatPackSize, formatRub } from "@/utils/catalogHelpers";
import { Icons } from "@/utils/icons";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type PerfTier = "low" | "medium" | "high";

interface ProductsGridProps {
  products: DetailedProduct[];
  onClearFilters: () => void;
  onProductClick: (product: DetailedProduct) => void;
}

/**
 * Unified clinical overhead lightbox illumination (zero RGB category spotlights).
 * Lets the actual formula packaging carry its own color cleanly across all 17 cards.
 */
const STUDIO_LIGHTBOX_BG =
  "radial-gradient(ellipse 74% 58% at 50% 24%, rgba(186, 230, 253, 0.085) 0%, rgba(14, 165, 233, 0.03) 44%, rgba(5, 10, 20, 0) 78%), linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(5, 10, 20, 0) 36%)";

/**
 * Zero-Paint rAF-throttled pointer tracker for pre-baked GPU orbs.
 * Reads `getBoundingClientRect()` strictly once on `pointerenter` and compensates scroll delta arithmetically.
 */
function useZeroPaintBeam(enableBeam: boolean, enableInteriorGlow: boolean) {
  const beamOrbRef = useRef<HTMLDivElement>(null);
  const glowOrbRef = useRef<HTMLDivElement>(null);
  const cachedBoundsRef = useRef<{ left: number; top: number; enterScrollY: number } | null>(null);
  const pendingCoordsRef = useRef<{ x: number; y: number } | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const flushTransform = useCallback(() => {
    rafIdRef.current = null;
    const coords = pendingCoordsRef.current;
    if (!coords) return;
    const tx = `translate3d(${coords.x.toFixed(1)}px, ${coords.y.toFixed(1)}px, 0)`;
    if (beamOrbRef.current) {
      beamOrbRef.current.style.transform = tx;
    }
    if (enableInteriorGlow && glowOrbRef.current) {
      glowOrbRef.current.style.transform = tx;
    }
  }, [enableInteriorGlow]);

  const onPointerEnter = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!enableBeam || e.pointerType !== "mouse") return;
      const rect = e.currentTarget.getBoundingClientRect();
      cachedBoundsRef.current = {
        left: rect.left,
        top: rect.top,
        enterScrollY: window.scrollY,
      };
      pendingCoordsRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      if (rafIdRef.current === null) {
        rafIdRef.current = window.requestAnimationFrame(flushTransform);
      }
    },
    [enableBeam, flushTransform],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!enableBeam || e.pointerType !== "mouse") return;
      let bounds = cachedBoundsRef.current;
      if (!bounds) {
        const rect = e.currentTarget.getBoundingClientRect();
        bounds = { left: rect.left, top: rect.top, enterScrollY: window.scrollY };
        cachedBoundsRef.current = bounds;
      }
      const scrollDelta = window.scrollY - bounds.enterScrollY;
      pendingCoordsRef.current = {
        x: e.clientX - bounds.left,
        y: e.clientY - (bounds.top - scrollDelta),
      };
      if (rafIdRef.current === null) {
        rafIdRef.current = window.requestAnimationFrame(flushTransform);
      }
    },
    [enableBeam, flushTransform],
  );

  const onPointerLeave = useCallback(() => {
    cachedBoundsRef.current = null;
    pendingCoordsRef.current = null;
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  return { beamOrbRef, glowOrbRef, onPointerEnter, onPointerMove, onPointerLeave };
}

interface InlineQuantityStepperProps {
  product: DetailedProduct;
  countInList: number;
  canIncrement: boolean;
  onIncrement: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDecrement: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const InlineQuantityStepper: React.FC<InlineQuantityStepperProps> = ({
  product,
  countInList,
  canIncrement,
  onIncrement,
  onDecrement,
}) => {
  if (countInList <= 0) {
    return (
      <button
        type="button"
        onClick={onIncrement}
        disabled={!canIncrement}
        aria-label={`Добавить ${product.name} в список заказа`}
        data-quick-add={product.id}
        className="h-10 px-4 rounded-full inline-flex items-center gap-1.5 border border-white/[0.14] bg-white/[0.045] hover:border-cyan-400/55 hover:bg-cyan-400/12 text-sm font-medium text-white transition-colors duration-200 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
      >
        <Icons.Plus className="w-3.5 h-3.5 text-cyan-300" />
        <span>В список</span>
      </button>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      data-quick-stepper={product.id}
      className="h-10 px-1 rounded-full inline-flex items-center gap-0.5 bg-white/[0.06] border border-cyan-400/45"
    >
      <button
        type="button"
        onClick={onDecrement}
        aria-label={
          countInList === 1
            ? `Убрать ${product.name} из списка`
            : `Уменьшить количество ${product.name} (сейчас ${countInList})`
        }
        data-quick-dec={product.id}
        className="h-8 w-8 rounded-full flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 transition-colors active:scale-90 cursor-pointer"
      >
        <Icons.Minus className="w-3.5 h-3.5" />
      </button>

      <span
        className="min-w-[1.5rem] text-center typography-mono text-sm font-semibold text-white tabular-nums select-none"
        aria-live="polite"
      >
        {countInList}
      </span>

      <button
        type="button"
        onClick={onIncrement}
        disabled={!canIncrement}
        aria-label={
          canIncrement
            ? `Добавить ещё ${product.name} (сейчас ${countInList})`
            : `Достигнут лимит ${MAX_QTY_PER_PRODUCT} шт. на позицию`
        }
        data-quick-inc={product.id}
        className="h-8 w-8 rounded-full flex items-center justify-center text-cyan-200 hover:text-white hover:bg-cyan-400/20 transition-colors active:scale-90 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
      >
        <Icons.Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

interface ApothecaryCardProps {
  product: DetailedProduct;
  index: number;
  tier: PerfTier;
  countInList: number;
  canIncrement: boolean;
  enableBeam: boolean;
  enableInteriorGlow: boolean;
  pulseKey: number;
  onIncrement: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDecrement: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClick: () => void;
}

const ApothecaryCard: React.FC<ApothecaryCardProps> = React.memo(
  ({
    product,
    index,
    tier,
    countInList,
    canIncrement,
    enableBeam,
    enableInteriorGlow,
    pulseKey,
    onIncrement,
    onDecrement,
    onClick,
  }) => {
    const { beamOrbRef, glowOrbRef, onPointerEnter, onPointerMove, onPointerLeave } = useZeroPaintBeam(
      enableBeam,
      enableInteriorGlow,
    );
    const retailRub = estimateRetailRub(product.priceRub);
    const packLabel = formatPackSize(product);

    return (
      <article
        data-product-id={product.id}
        data-tier={tier}
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ "--cell-delay": `${Math.min(index * 20, 200)}ms` } as React.CSSProperties}
        className="specimen-cell-enter apothecary-card group"
      >
        {/* Zero-Paint 1px Perimeter Beam Orb (High/Medium Desktop only; unmounted on Low/Touch) */}
        {enableBeam && <div ref={beamOrbRef} aria-hidden="true" className="apothecary-beam-orb" />}

        {/* Seamless Monolith Inner Card Surface (Zero box-inside-a-box double borders) */}
        <div className="apothecary-card-inner flex flex-col">
          {/* Interior Specular Orb (High Desktop only) */}
          {enableInteriorGlow && <div ref={glowOrbRef} aria-hidden="true" className="apothecary-glow-orb" />}

          {/* Brief cyan confirmation beam along top rim when user adds item */}
          {pulseKey > 0 && <div key={pulseKey} aria-hidden="true" className="apothecary-added-pulse" />}

          {/* Full-Bleed Monochrome Architectural Studio Chamber (Zero RGB spotlights, zero AI rings) */}
          <button
            type="button"
            onClick={onClick}
            aria-label={`Открыть описание ${product.name}`}
            className="apothecary-vitrine relative z-10 w-full flex flex-col cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400/75"
            style={{ backgroundImage: STUDIO_LIGHTBOX_BG }}
          >
            {/* Quiet Editorial Metadata Header integrated cleanly inside the stage */}
            <div className="w-full flex items-center justify-between gap-3 px-5 sm:px-6 pt-5 pb-1 text-xs">
              <span className="text-slate-400 truncate">{product.categories[0] ?? "4Life"}</span>
              <span className="typography-mono text-slate-400/90 tabular-nums flex-shrink-0">
                {product.lp} LP
              </span>
            </div>

            {/* Clean Museum Bottle Stage (pure contact shadow, zero reticle rings, zero double lines) */}
            <div className="relative w-full aspect-[4/3.15] flex items-center justify-center px-6 pt-2 pb-6">
              <span
                aria-hidden="true"
                className="apothecary-floor-shadow pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 w-36 h-5 rounded-full"
              />

              <img
                src={product.image}
                alt={product.name}
                loading={index < 6 ? "eager" : "lazy"}
                decoding="async"
                className="apothecary-bottle relative z-10 max-h-[88%] max-w-[82%] w-auto h-auto object-contain"
              />
            </div>

            {/* Single Hairline Architectural Stage Divider */}
            <span
              aria-hidden="true"
              className="pointer-events-none block w-full h-px bg-white/[0.07]"
            />
          </button>

          {/* Clean Scannable Title (+ Kinetic Hover Arrow), Concise 2-Line Lead & Minimal Price Baseline */}
          <div className="relative z-10 flex flex-col flex-1 justify-between gap-5 px-5 sm:px-6 pt-5 pb-5 sm:pb-6">
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={onClick}
                className="text-left flex items-start justify-between gap-3 w-full cursor-pointer focus-visible:outline-none focus-visible:text-cyan-300"
              >
                <h3 className="font-heading text-lg font-semibold leading-snug text-white group-hover:text-cyan-200 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <Icons.ArrowRight
                  aria-hidden="true"
                  className="apothecary-title-arrow w-4 h-4 mt-1 flex-shrink-0 text-slate-500 group-hover:text-cyan-300"
                />
              </button>
              <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 text-pretty">
                {product.shortDescription}
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 mt-auto">
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span
                    data-product-price={product.id}
                    className="font-heading text-lg font-semibold text-white tabular-nums leading-none"
                  >
                    ≈ {formatRub(product.priceRub)}
                  </span>
                  {retailRub > product.priceRub && (
                    <span
                      data-product-retail={product.id}
                      className="text-xs text-slate-500 line-through tabular-nums leading-none"
                    >
                      {formatRub(retailRub)}
                    </span>
                  )}
                </div>
                {packLabel && (
                  <span className="text-xs text-slate-400 mt-1.5 block tabular-nums truncate">
                    {packLabel}
                  </span>
                )}
              </div>

              <InlineQuantityStepper
                product={product}
                countInList={countInList}
                canIncrement={canIncrement}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
              />
            </div>
          </div>
        </div>
      </article>
    );
  },
);

ApothecaryCard.displayName = "ApothecaryCard";

const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  onClearFilters,
  onProductClick,
}) => {
  const tier = usePerformanceTier();
  const isMobile = useIsMobile();
  const enableBeam = tier !== "low" && !isMobile;
  const enableInteriorGlow = tier === "high" && !isMobile;

  const { items, addToList, updateItemQuantity, removeFromList, getTotalItems } = useProductList();
  const totalItems = getTotalItems();
  const [pulseMap, setPulseMap] = useState<Record<string, number>>({});

  const quantityById = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      map.set(item.id, item.quantity);
    }
    return map;
  }, [items]);

  const handleIncrement = useCallback(
    (product: DetailedProduct) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      addToList(product, 1);
      setPulseMap((prev) => ({ ...prev, [product.id]: (prev[product.id] ?? 0) + 1 }));
    },
    [addToList],
  );

  const handleDecrement = useCallback(
    (product: DetailedProduct, currentQty: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (currentQty <= 1) {
        removeFromList(product.id);
      } else {
        updateItemQuantity(product.id, currentQty - 1);
      }
    },
    [removeFromList, updateItemQuantity],
  );

  if (products.length === 0) {
    return (
      <div className="py-20 px-6 text-center rounded-3xl border border-white/[0.1] bg-[#0a1426]/80">
        <p className="typography-h3 text-white mb-3">Ничего не найдено</p>
        <p className="typography-body text-slate-300/80 mb-7 max-w-md mx-auto">
          Попробуйте другой запрос или вернитесь ко всей коллекции.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 h-11 px-6 rounded-full text-sm font-semibold text-cyan-200 border border-cyan-400/50 hover:bg-cyan-500/15 transition-colors cursor-pointer"
        >
          <Icons.RefreshCw className="w-4 h-4" />
          <span>Показать все формулы</span>
        </button>
      </div>
    );
  }

  return (
    <div
      data-catalog-gallery="true"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7"
    >
      {products.map((product, idx) => {
        const count = quantityById.get(product.id) ?? 0;
        const canIncrement = count < MAX_QTY_PER_PRODUCT && totalItems < MAX_TOTAL_CART_ITEMS;
        return (
          <ApothecaryCard
            key={product.id}
            product={product}
            index={idx}
            tier={tier}
            countInList={count}
            canIncrement={canIncrement}
            enableBeam={enableBeam}
            enableInteriorGlow={enableInteriorGlow}
            pulseKey={pulseMap[product.id] ?? 0}
            onIncrement={handleIncrement(product)}
            onDecrement={handleDecrement(product, count)}
            onClick={() => onProductClick(product)}
          />
        );
      })}
    </div>
  );
};

export default React.memo(ProductsGrid);