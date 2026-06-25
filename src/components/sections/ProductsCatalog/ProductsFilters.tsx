/**
 * @module src/components/sections/ProductsCatalog/ProductsFilters.tsx
 * @description Стеклянная капсула фильтров продуктов
 * @author Kort
 * @version 1.0.0
 */

import { usePerformanceTier, useTheme } from "@/hooks";
import { Icons } from "@/utils/icons";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import "@/styles/filter-capsule.css";

interface ProductsFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  productCount: number;
  isOpen: boolean;
  onClose: () => void;
}

const ProductsFilters: React.FC<ProductsFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  productCount,
  isOpen,
  onClose,
}) => {
  const { theme } = useTheme();
  const tier = usePerformanceTier();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className={`fixed inset-0 z-40 ${
              theme === "dark" ? "bg-black/15" : "bg-black/10"
            }`}
          />

          {/* Filter Capsule */}
          <motion.div
            data-tier={tier}
            initial={{ y: 150, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 150, opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 0.3 },
            }}
            className={`filter-capsule ${theme === "dark" ? "filter-capsule--dark" : "filter-capsule--light"}`}
            data-lenis-prevent="true"
            onPointerDown={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div className="filter-capsule-content">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <svg
                    className={`w-5 h-5 flex-shrink-0 ${theme === "dark" ? "text-cyan-400" : "text-blue-600"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  <h3
                    className={`text-base font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    Фильтры
                  </h3>
                  <span
                    key={productCount}
                    className={`product-counter changed text-xs font-bold px-2.5 py-1 rounded-full ${
                      theme === "dark"
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/30"
                        : "bg-blue-500/20 text-blue-600 border border-blue-400/30"
                    }`}
                  >
                    {productCount}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Reset button - Apple style (only when filter is active) */}
                  <AnimatePresence>
                    {selectedCategory && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 10 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => onCategoryChange(null)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`text-sm font-medium transition-colors duration-200 ${
                          theme === "dark"
                            ? "text-gray-400 hover:text-cyan-400"
                            : "text-gray-500 hover:text-blue-600"
                        }`}
                      >
                        Сбросить
                      </motion.button>
                    )}
                  </AnimatePresence>
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.08, rotate: 90 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 flex-shrink-0 ${
                      theme === "dark"
                        ? "bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900"
                    }`}
                    aria-label="Закрыть фильтры"
                  >
                    <Icons.X className="w-4 h-4" strokeWidth={2.5} />
                  </motion.button>
                </div>
              </div>

              {/* Categories - Multi-row wrap */}
              <div className="flex flex-wrap gap-2.5">
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    onClick={() =>
                      onCategoryChange(selectedCategory === cat ? null : cat)
                    }
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      selectedCategory === cat
                        ? theme === "dark"
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/40"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40"
                        : theme === "dark"
                          ? "bg-white/10 text-gray-300 hover:bg-white/15 hover:text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(ProductsFilters);
