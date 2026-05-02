/**
 * @module ProductsGrid
 * @description Three distinct grid layouts — Tibico-exact structure
 *
 * Grid 4 — "Обзор": 4 col, image + name only. Быстрый взгляд.
 * Grid 3 — "Каталог": 3 col, image + name + description.
 * Grid 2 — "Детали": 2 col, horizontal (image left ~40%, text right on page bg).
 *
 * Tibico structure:
 * - Image = standalone rounded block (no card wrapper bg)
 * - Text = below image, on page background (no card bg)
 * - Icon = circle inset into bottom-right corner, bg = page bg color
 * - Hover: image swaps bottom-to-top via CSS (.product-card-tibico)
 */

import { DetailedProduct } from "@/data/productsData";
import { useTheme } from "@/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React from "react";

interface ProductsGridProps {
  products: DetailedProduct[];
  gridMode: 2 | 3 | 4;
  setGridMode: (mode: 2 | 3 | 4) => void;
  selectedCategory: string | null;
  onClearFilters: () => void;
  onProductClick: (product: DetailedProduct) => void;
}

// ─── Tibico icon: circle inset into bottom-right corner ──────────────────────
// bg of outer wrapper = page bg → creates "cut corner" illusion
// bg of inner circle = slightly elevated surface
const TibicoIcon: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <div
    className="absolute bottom-0 right-0 z-10 w-14 h-14 rounded-tl-3xl flex items-center justify-center"
    style={{ backgroundColor: isDark ? "#020617" : "#ffffff" }}
  >
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-gray-100"}`}
    >
      <svg
        className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-gray-500"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        viewBox="0 0 24 24"
      >
        <line x1="5" y1="8" x2="19" y2="8" />
        <line x1="5" y1="12" x2="19" y2="12" />
        <line x1="5" y1="16" x2="19" y2="16" />
      </svg>
    </div>
  </div>
);

// ─── Grid 3 & 4: Tibico-style card ───────────────────────────────────────────
// image block standalone + text below on page bg
const TibicoCard: React.FC<{
  product: DetailedProduct;
  isDark: boolean;
  idx: number;
  gridMode: 3 | 4;
  onClick: () => void;
}> = ({ product, isDark, idx, gridMode, onClick }) => (
  <div
    data-product-id={product.id}
    className="product-card-wrapper product-card-tibico"
    style={
      { "--card-delay": `${Math.min(idx * 30, 350)}ms` } as React.CSSProperties
    }
    onClick={onClick}
  >
    {/* Image block — rounded, standalone */}
    <div
      className={`product-image-container rounded-2xl overflow-hidden ${isDark ? "bg-[#111827]" : "bg-gray-100"}`}
    >
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        decoding="async"
        className="product-image-primary w-full h-full object-contain p-4"
      />
      <img
        src={product.image}
        alt=""
        loading="lazy"
        decoding="async"
        aria-hidden="true"
        className="product-image-secondary w-full h-full object-contain p-4"
      />
      {/* LP badge */}
      <div
        className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold ${
          isDark
            ? "bg-black/50 text-white/80 border border-white/10"
            : "bg-white/90 text-gray-700 border border-black/10 shadow-sm"
        }`}
      >
        {product.lp} LP
      </div>
      {/* Tibico icon */}
      <TibicoIcon isDark={isDark} />
    </div>

    {/* Text — on page background, no card bg */}
    <div className="pt-3 px-0.5">
      <div className="flex flex-wrap gap-x-2 mb-1">
        {product.categories.slice(0, gridMode === 4 ? 1 : 2).map((cat) => (
          <span
            key={cat}
            className={`text-[9px] uppercase tracking-[0.14em] font-semibold ${
              isDark ? "text-slate-500" : "text-gray-400"
            }`}
          >
            {cat}
          </span>
        ))}
      </div>
      <h3
        className={`font-bold leading-snug line-clamp-2 ${
          gridMode === 3 ? "text-base" : "text-sm min-h-[2.5rem]"
        } ${isDark ? "text-white" : "text-gray-900"}`}
      >
        {product.name}
      </h3>
      {gridMode === 3 && (
        <p
          className={`text-xs leading-relaxed line-clamp-2 mt-1 mb-[1.5rem] ${isDark ? "text-slate-500" : "text-gray-400"}`}
        >
          {product.shortDescription}
        </p>
      )}
    </div>
  </div>
);

// ─── Grid 2: Horizontal — image left, text right on page bg ──────────────────
// Like Tibico list view: image standalone rounded, text beside it on page bg
const DetailCard: React.FC<{
  product: DetailedProduct;
  isDark: boolean;
  idx: number;
  onClick: () => void;
}> = ({ product, isDark, idx, onClick }) => {
  const qty = product.capsules
    ? `${product.capsules} капс.`
    : product.servings
      ? `${product.servings} порц.`
      : null;

  return (
    <div
      data-product-id={product.id}
      className="product-card-wrapper product-card-tibico cursor-pointer flex flex-row gap-4 items-start"
      style={
        {
          "--card-delay": `${Math.min(idx * 35, 400)}ms`,
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      {/* Image — standalone rounded square, ~40% width */}
      <div
        className={`product-image-container rounded-2xl overflow-hidden flex-shrink-0 ${
          isDark ? "bg-[#111827]" : "bg-gray-100"
        }`}
        style={{ width: "42%", aspectRatio: "1/1" }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="product-image-primary w-full h-full object-contain p-4"
        />
        <img
          src={product.image}
          alt=""
          loading="lazy"
          decoding="async"
          aria-hidden="true"
          className="product-image-secondary w-full h-full object-contain p-4"
        />
        {/* LP badge */}
        <div
          className={`absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isDark
              ? "bg-black/50 text-white/70 border border-white/10"
              : "bg-white/90 text-gray-600 border border-black/10 shadow-sm"
          }`}
        >
          {product.lp} LP
        </div>
        {/* Tibico icon */}
        <TibicoIcon isDark={isDark} />
      </div>

      {/* Text — on page background, no card bg */}
      <div className="flex-1 min-w-0 flex flex-col gap-2 pt-1">
        <div className="flex flex-wrap gap-x-2">
          {product.categories.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className={`text-[9px] uppercase tracking-[0.14em] font-semibold ${
                isDark ? "text-slate-500" : "text-gray-400"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
        <h3
          className={`text-sm font-bold leading-snug line-clamp-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {product.name}
        </h3>
        <p
          className={`text-xs leading-relaxed line-clamp-3 ${isDark ? "text-slate-500" : "text-gray-400"}`}
        >
          {product.shortDescription}
        </p>
        <div className="flex flex-wrap gap-1">
          {product.mainSupport.slice(0, 2).map((s) => (
            <span
              key={s}
              className={`px-2 py-0.5 text-[10px] rounded-lg font-medium ${
                isDark
                  ? "bg-white/[0.02] text-slate-400 border border-white/[0.031]"
                  : "bg-gray-100 text-gray-500 border border-gray-200"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
        {qty && (
          <span
            className={`text-[10px] ${isDark ? "text-slate-600" : "text-gray-400"}`}
          >
            {qty}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Main Grid ────────────────────────────────────────────────────────────────
const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  gridMode,
  setGridMode,
  selectedCategory,
  onClearFilters,
  onProductClick,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Коллекция
          </h2>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
            {products.length}{" "}
            {products.length === 1
              ? "продукт"
              : products.length < 5
                ? "продукта"
                : "продуктов"}
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
                <X className="w-3 h-3" /> Сбросить
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Grid switcher */}
        <div
          className={`hidden md:flex items-center gap-1 p-1 rounded-xl ${
            isDark ? "bg-gray-900/80 border border-gray-800" : "bg-gray-100"
          }`}
        >
          {([2, 3, 4] as const).map((num) => {
            const labels: Record<number, string> = {
              2: "Детали",
              3: "Каталог",
              4: "Обзор",
            };
            return (
              <button
                key={num}
                onClick={() => setGridMode(num)}
                title={labels[num]}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  gridMode === num
                    ? isDark
                      ? "bg-gray-800 text-cyan-400 shadow-sm"
                      : "bg-white text-blue-600 shadow-sm"
                    : isDark
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-800"
                }`}
                aria-label={labels[num]}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {num === 2 && (
                    <>
                      <rect x="3" y="3" width="8" height="18" rx="1.5" />
                      <rect x="13" y="3" width="8" height="18" rx="1.5" />
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
            );
          })}
        </div>
      </div>

      {/* ── GRID 4: Compact overview ── */}
      {gridMode === 4 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product, idx) => (
            <TibicoCard
              key={product.id}
              product={product}
              isDark={isDark}
              idx={idx}
              gridMode={4}
              onClick={() => onProductClick(product)}
            />
          ))}
        </div>
      )}

      {/* ── GRID 3: Catalog ── */}
      {gridMode === 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {products.map((product, idx) => (
            <TibicoCard
              key={product.id}
              product={product}
              isDark={isDark}
              idx={idx}
              gridMode={3}
              onClick={() => onProductClick(product)}
            />
          ))}
        </div>
      )}

      {/* ── GRID 2: Detail horizontal ── */}
      {gridMode === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {products.map((product, idx) => (
            <DetailCard
              key={product.id}
              product={product}
              isDark={isDark}
              idx={idx}
              onClick={() => onProductClick(product)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default React.memo(ProductsGrid);
