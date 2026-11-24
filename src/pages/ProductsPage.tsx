/**
 * @module src/pages/ProductsPage.tsx
 * @description Awwwards SOTY 2027+ Luminous Clinical Obsidian Apothecary Catalog.
 * Clean, calm, distraction-free 4-beat flow:
 *   1) Luminous Obsidian Hero with desktop ambient video over still-life underlay
 *   2) Immediate Product Collection with Swiss Editorial Underline Tabs (items-baseline 14px + 12px count),
 *      `/` keyboard search focus shortcut, full-height volumetric studio illumination,
 *      and 144–240Hz Zero-Paint 17-formula gallery (natural negative space, zero forced filler card)
 *   3) Mathematically Y-centered Optical Shutter Wipe Synergy Showcase (`clip-path: inset` + clickable 01/02/03 rail)
 *   4) Zero-Jump Hydraulic 5-question FAQ -> Global Sticky Curtain Footer
 */

import ProductsFAQ from "@/components/sections/ProductsCatalog/ProductsFAQ";
import ProductsGrid from "@/components/sections/ProductsCatalog/ProductsGrid";
import ProductsHero from "@/components/sections/ProductsCatalog/ProductsHero";
import SynergyAtelier from "@/components/sections/ProductsCatalog/SynergyAtelier";
import ProductDetailModal from "@/components/ui/ProductDetailModal";
import { DetailedProduct, productsData } from "@/data/productsData";
import { usePerformanceTier } from "@/hooks";
import { useProductList } from "@/hooks/useProductList";
import { lenis } from "@/lib/lenis";
import { SEO } from "@/seo/SEO";
import { siteConfig } from "@/site-config/site";
import "@/styles/pages/products-page.css";
import {
  CATALOG_FILTER_GROUPS,
  CatalogFilterGroupId,
  filterProducts,
  getCategoryGroupCounts,
} from "@/utils/catalogHelpers";
import { Icons } from "@/utils/icons";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const VALID_GROUP_IDS = new Set<string>(CATALOG_FILTER_GROUPS.map((g) => g.id));

const ProductsPage: React.FC = () => {
  const tier = usePerformanceTier();
  const isLow = tier === "low";
  const { addToList, isModalOpen } = useProductList();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialGroup = searchParams.get("group");
  const [activeGroup, setActiveGroup] = useState<CatalogFilterGroupId>(
    initialGroup && VALID_GROUP_IDS.has(initialGroup) ? (initialGroup as CatalogFilterGroupId) : "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [addedProgramId, setAddedProgramId] = useState<string | null>(null);

  const catalogAnchorRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const urlProductId = searchParams.get("productId");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(urlProductId);

  useEffect(() => {
    setSelectedProductId(urlProductId);
  }, [urlProductId]);

  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return productsData.find((p) => p.id === selectedProductId) ?? null;
  }, [selectedProductId]);

  const categoryCounts = useMemo(() => getCategoryGroupCounts(productsData), []);

  const filteredProducts = useMemo(
    () => filterProducts(productsData, activeGroup, searchQuery),
    [activeGroup, searchQuery],
  );

  const scrollToCatalog = useCallback(() => {
    const anchor = catalogAnchorRef.current;
    if (!anchor) return;
    if (lenis) {
      lenis.scrollTo(anchor, { offset: -76, duration: 1.05 });
    } else {
      const top = anchor.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  }, []);

  // Desktop `/` shortcut focuses catalog search cleanly without interfering with inputs or open modals
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen || Boolean(selectedProduct)) return;
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const tagName = target?.tagName ?? "";
      if (tagName === "INPUT" || tagName === "TEXTAREA" || target?.isContentEditable) return;

      const input = searchInputRef.current;
      if (!input) return;
      e.preventDefault();
      input.focus({ preventScroll: false });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, selectedProduct]);

  const handleGroupChange = useCallback(
    (groupId: CatalogFilterGroupId) => {
      const resolvedId: CatalogFilterGroupId = groupId !== "all" && activeGroup === groupId ? "all" : groupId;
      setActiveGroup(resolvedId);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (resolvedId === "all") next.delete("group");
          else next.set("group", resolvedId);
          return next;
        },
        { replace: true },
      );
    },
    [activeGroup, setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setActiveGroup("all");
    setSearchQuery("");
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("group");
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const handleProductClick = useCallback(
    (product: DetailedProduct) => {
      setSelectedProductId(product.id);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("productId", product.id);
          return next;
        },
        { replace: false },
      );
    },
    [setSearchParams],
  );

  const handleCloseProductModal = useCallback(() => {
    // Urgent synchronous state close so scrollLock unlocks and modal goes wheel-through on frame 0
    setSelectedProductId(null);
    // Strictly preserve user's exact scroll position on close — never yank back up to catalog grid
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("productId");
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const handleAddProgram = useCallback(
    (programId: string, productIds: readonly [string, string]) => {
      for (const pid of productIds) {
        const prod = productsData.find((p) => p.id === pid);
        if (prod) addToList(prod, 1);
      }
      setAddedProgramId(programId);
      window.setTimeout(() => {
        setAddedProgramId((curr) => (curr === programId ? null : curr));
      }, 2400);
    },
    [addToList],
  );

  return (
    <div className="relative min-h-screen bg-[#03050a] text-slate-200">
      <SEO
        title="Продукты 4Life — Коллекция 17 формул Трансфер Фактор со скидкой −25% РЦ 67"
        description="Полная коллекция из 17 оригинальных формул 4Life Research по ценам склада РЦ 67 Москва со скидкой −25% от 1 упаковки и проверенные синергичные связки."
        path="/products"
      />

      {/* ACT 1: Luminous Obsidian Opening (flows directly into the catalog) */}
      <ProductsHero totalCount={productsData.length} onExploreCatalog={scrollToCatalog} />

      {/* ACT 2: Immediate Apothecary Product Collection (Full-Height Illuminated Laboratory Canvas) */}
      <section
        ref={catalogAnchorRef}
        id="catalog-archive"
        className="relative bg-[#03050a] overflow-x-clip"
      >
        {/* Full-Height Multi-Zone Volumetric Studio Illumination */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: [
              "radial-gradient(62% 520px at 18% 8%, rgba(14, 165, 233, 0.13) 0%, rgba(3, 5, 10, 0) 72%)",
              "radial-gradient(56% 540px at 84% 28%, rgba(30, 64, 175, 0.14) 0%, rgba(3, 5, 10, 0) 74%)",
              "radial-gradient(58% 580px at 16% 62%, rgba(6, 182, 212, 0.11) 0%, rgba(3, 5, 10, 0) 74%)",
              "radial-gradient(60% 520px at 82% 90%, rgba(37, 99, 235, 0.13) 0%, rgba(3, 5, 10, 0) 74%)",
            ].join(", "),
          }}
        />

        {/* Pure CSS Architectural Micro-Dot Laboratory Texture */}
        <div aria-hidden="true" className="obsidian-micro-grid pointer-events-none absolute inset-0 z-0 opacity-75" />

        {/* Zero-Mask Seamless Top & Bottom Edge Scrims over dot-grid (eliminates hard horizontal shelf at Hero/Synergy seams) */}
        <div
          aria-hidden="true"
          data-catalog-top-seam-fade="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-36 z-[1]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #03050a 0%, rgba(3,5,10,0.84) 36%, rgba(3,5,10,0.28) 72%, rgba(3,5,10,0) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-36 z-[1]"
          style={{
            backgroundImage:
              "linear-gradient(0deg, #03050a 0%, rgba(3,5,10,0.82) 38%, rgba(3,5,10,0.22) 74%, rgba(3,5,10,0) 100%)",
          }}
        />

        <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-8 sm:pt-12 pb-20 sm:pb-28">
          {/* 2-Zone Swiss Architectural Catalog Control Header (Zero 5+1 Orphan Wrap) */}
          <div data-catalog-filter-bar="true" className="mb-10 sm:mb-12">
            {/* Zone 1: Index Telemetry on Left + Sleek Search Input on Right */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="typography-label text-slate-400">Каталог формул</span>
                  <span className="text-white/15" aria-hidden="true">
                    /
                  </span>
                  <span className="typography-mono text-xs text-cyan-300/90 tabular-nums">
                    {filteredProducts.length === productsData.length
                      ? `${productsData.length} позиций`
                      : `${filteredProducts.length} из ${productsData.length}`}
                  </span>
                  {(activeGroup !== "all" || searchQuery.trim().length > 0) && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="ml-1 text-xs text-slate-400 hover:text-cyan-300 underline underline-offset-4 decoration-white/20 hover:decoration-cyan-400 transition-colors cursor-pointer"
                    >
                      Сбросить
                    </button>
                  )}
                </div>
                <p data-catalog-pricing-note="true" className="text-xs text-slate-400/90">
                  Цены склада РЦ 67 по ID {siteConfig.distributor.fourLifeId} (−25% от 1 упаковки)
                </p>
              </div>

              {/* Minimalist Search Input (14px floor) with `/` keyboard shortcut */}
              <div className="relative flex-shrink-0 w-full sm:w-72 md:w-80">
                <Icons.Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearchQuery("");
                      e.currentTarget.blur();
                    }
                  }}
                  placeholder="Поиск по названию или задаче..."
                  aria-label="Поиск по каталогу"
                  className="w-full h-10 pl-10 pr-10 rounded-full bg-white/[0.045] border border-white/[0.11] focus:border-cyan-400/65 text-sm text-white placeholder:text-slate-400/80 focus:outline-none transition-colors"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Очистить поиск"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <Icons.X className="w-4 h-4" />
                  </button>
                ) : (
                  !isSearchFocused && (
                    <kbd
                      aria-hidden="true"
                      className="hidden sm:inline-flex items-center justify-center w-5 h-5 rounded-md border border-white/[0.12] bg-white/[0.04] text-xs font-mono text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      /
                    </kbd>
                  )
                )}
              </div>
            </div>

            {/* Zone 2: Full-Width Swiss Editorial Underline Tabs (1 clean row on lg+, balanced 3×2 on sm/md, 2×3 on mobile) */}
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-nowrap lg:items-baseline lg:justify-between gap-x-4 gap-y-1 border-b border-white/[0.1]"
              role="tablist"
              aria-label="Направления формул"
            >
              {CATALOG_FILTER_GROUPS.map((group) => {
                const isActive = activeGroup === group.id;
                const count = categoryCounts[group.id] ?? 0;
                return (
                  <button
                    key={group.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    data-catalog-tab={group.id}
                    onClick={() => handleGroupChange(group.id)}
                    className={`relative pb-3.5 pt-2 inline-flex items-baseline justify-center lg:justify-start gap-1.5 text-[13px] xl:text-sm font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                      isActive ? "text-white" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    <span>{group.label}</span>
                    <span
                      className={`typography-mono text-xs tabular-nums transition-colors ${
                        isActive ? "text-cyan-300" : "text-slate-500"
                      }`}
                    >
                      {count}
                    </span>

                    {isActive && (
                      <motion.span
                        layoutId={isLow ? undefined : "catalog-active-underline"}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        aria-hidden="true"
                        className="absolute -bottom-px inset-x-0 h-[2px] rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.65)]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spacious 3-Column 144Hz Zero-Paint Apothecary Gallery (Clean 17-Formula Collection) */}
          <ProductsGrid
            products={filteredProducts}
            onClearFilters={clearFilters}
            onProductClick={handleProductClick}
          />
        </div>
      </section>

      {/* ACT 3: Mathematically Y-Centered Optical Shutter Wipe Synergy Showcase */}
      <SynergyAtelier
        products={productsData}
        addedProgramId={addedProgramId}
        onAddProgram={handleAddProgram}
        onProductClick={handleProductClick}
      />

      {/* ACT 4: Zero-Jump Hydraulic 5-Question FAQ -> Sticky Curtain Footer */}
      <ProductsFAQ />

      {/* Product Detail Dossier Modal */}
      <ProductDetailModal
        product={selectedProduct}
        products={filteredProducts.length > 0 ? filteredProducts : productsData}
        isOpen={Boolean(selectedProduct)}
        onClose={handleCloseProductModal}
      />
    </div>
  );
};

export default ProductsPage;