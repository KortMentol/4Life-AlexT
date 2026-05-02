/**
 * @module src/hooks/useProductFilters.ts
 * @description High-performance product filtering hook with memoization
 * @author Kort
 * @version 1.0.0
 * @usage Global search: useProductFilters
 */

import { DetailedProduct } from "@/data/productsData";
import { useMemo } from "react";

export interface FilterState {
  search: string;
  categories: string[];
  sortBy: "name" | "lp" | "newest";
  sortOrder: "asc" | "desc";
  priceRange: [number, number];
}

export const useProductFilters = (
  products: DetailedProduct[],
  filters: FilterState,
) => {
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.shortDescription.toLowerCase().includes(searchTerm) ||
          product.mainDescription.toLowerCase().includes(searchTerm) ||
          product.categories.some((cat) =>
            cat.toLowerCase().includes(searchTerm),
          ) ||
          product.mainSupport.some((support) =>
            support.toLowerCase().includes(searchTerm),
          ) ||
          product.keyBenefits.some((benefit) =>
            benefit.toLowerCase().includes(searchTerm),
          ),
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.some((category) =>
          product.categories.includes(category),
        ),
      );
    }

    // Price range filter
    result = result.filter(
      (product) =>
        product.lp >= filters.priceRange[0] &&
        product.lp <= filters.priceRange[1],
    );

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name, "ru");
          break;
        case "lp":
          comparison = a.lp - b.lp;
          break;
        case "newest":
          // Assuming newer products have higher IDs or use a different logic
          comparison = a.id.localeCompare(b.id);
          break;
      }

      return filters.sortOrder === "desc" ? -comparison : comparison;
    });

    return result;
  }, [products, filters]);

  return {
    filteredProducts,
    totalCount: products.length,
    filteredCount: filteredProducts.length,
  };
};
