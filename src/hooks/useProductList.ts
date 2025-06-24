import { useContext } from "react";
import { ProductListContext } from "@/context/ProductListContext.helpers";

/**
 * Хук для работы с контекстом списка продуктов
 * @returns Контекст ProductListContext
 * @throws Ошибку, если используется вне ProductListProvider
 */
export const useProductList = () => {
  const context = useContext(ProductListContext);
  if (!context) {
    throw new Error("useProductList must be used within a ProductListProvider");
  }
  return context;
};
