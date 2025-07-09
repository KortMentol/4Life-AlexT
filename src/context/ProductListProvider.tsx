/**
 * @module src/context/ProductListProvider.tsx
 * @description Провайдер для управления состоянием списка продуктов (корзины). Реализует логику добавления, удаления, обновления количества и очистки списка. Синхронизирует состояние с `localStorage`, чтобы сохранять выбор пользователя между сессиями.
 * @author Kort
 * @version 1.0.0
 * @param {React.ReactNode} children - Дочерние компоненты, которые получат доступ к контексту.
 * @see ProductListUtils - Утилиты для работы с `localStorage`.
 * @usage
 * 1. `src/App.tsx`: Оборачивает все приложение, чтобы обеспечить глобальный доступ к списку продуктов.
 * @example
 * <ProductListProvider>
 *   <App />
 * </ProductListProvider>
 */
import { Product } from "@/types/Product";
import React, { useEffect, useState } from "react";
import {
  ProductListContext,
  ProductListContextType,
  ProductListItem,
} from "./ProductListContext.helpers";
import { loadFromStorage, saveToStorage } from "./ProductListUtils";

export const ProductListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<ProductListItem[]>(loadFromStorage);

  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  const addToList = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromList = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.id !== productId);
      return prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      );
    });
  };

  const clearList = () => setItems([]);

  const getTotalItems = () =>
    items.reduce((total, item) => total + item.quantity, 0);

  const value: ProductListContextType = {
    items,
    addToList,
    removeFromList,
    updateItemQuantity,
    clearList,
    getTotalItems,
  };

  return (
    <ProductListContext.Provider value={value}>
      {children}
    </ProductListContext.Provider>
  );
};
