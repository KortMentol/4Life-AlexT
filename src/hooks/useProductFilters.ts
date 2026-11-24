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

    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.some((category) =>
          product.categories.includes(category),
        ),
      );
    }

    result = result.filter(
      (product) =>
        product.lp >= filters.priceRange[0] &&
        product.lp <= filters.priceRange[1],
    );

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
