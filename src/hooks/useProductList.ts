import { useContext } from "react";
import { ProductListContext } from "@/context/ProductListContext.helpers";

/**
 * @module src/hooks/useProductList.ts
 * @description Хук для получения доступа к контексту `ProductListContext`. Предоставляет компонентам простой API для взаимодействия со списком продуктов (корзиной).
 * @author Kort
 * @version 1.0.0
 * @returns {ProductListContextType} Объект контекста со списком товаров и функциями для управления им.
 * @throws {Error} Выбрасывает ошибку, если хук используется вне `ProductListProvider`.
 * @see ProductListProvider - Провайдер, который необходимо использовать выше по дереву компонентов.
 * @usage
 * 1. `src/components/ui/ProductCard.tsx`: Для добавления товара в список.
 * 2. `src/components/ui/ProductDetailModal.tsx`: Для добавления товара в список.
 * 3. `src/components/ui/ProductListIcon.tsx`: Для отображения и управления содержимым списка.
 * @example
 * const { addToList, items } = useProductList();
 * 
 * const handleAdd = (product) => {
 *   addToList(product, 1);
 * };
 */
export const useProductList = () => {
  const context = useContext(ProductListContext);
  if (!context) {
    throw new Error("useProductList must be used within a ProductListProvider");
  }
  return context;
};
