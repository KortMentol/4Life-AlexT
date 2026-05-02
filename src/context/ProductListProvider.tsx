/**
 * @module src/context/ProductListProvider.tsx
 * @description Провайдер для управления состоянием списка продуктов (корзины). Реализует логику добавления, удаления, обновления количества и очистки списка. Синхронизирует состояние с `localStorage`, чтобы сохранять выбор пользователя между сессиями.
 * @author Kort
 * @version 1.1.0 - Updated to use DetailedProduct type
 * @param {React.ReactNode} children - Дочерние компоненты, которые получат доступ к контексту.
 * @see ProductListUtils - Утилиты для работы с `localStorage`.
 * @usage
 * 1. `src/App.tsx`: Оборачивает все приложение, чтобы обеспечить глобальный доступ к списку продуктов.
 * @example
 * <ProductListProvider>
 *   <App />
 * </ProductListProvider>
 */
import { DetailedProduct } from "@/data/productsData";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ProductListContext,
  ProductListContextType,
  ProductListItem,
} from "./ProductListContext.helpers";
import { loadFromStorage, saveToStorage } from "./ProductListUtils";

const ProductListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<ProductListItem[]>(loadFromStorage);

  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  const addToList = useCallback(
    (product: DetailedProduct, quantity: number = 1) => {
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
    },
    [],
  );

  const removeFromList = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const updateItemQuantity = useCallback(
    (productId: string, quantity: number) => {
      setItems((prev) => {
        if (quantity <= 0) return prev.filter((i) => i.id !== productId);
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        );
      });
    },
    [],
  );

  const clearList = useCallback(() => setItems([]), []);

  const getTotalItems = useCallback(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const value = useMemo<ProductListContextType>(
    () => ({
      items,
      addToList,
      removeFromList,
      updateItemQuantity,
      clearList,
      getTotalItems,
    }),
    [
      items,
      addToList,
      removeFromList,
      updateItemQuantity,
      clearList,
      getTotalItems,
    ],
  );

  return (
    <ProductListContext.Provider value={value}>
      {children}
    </ProductListContext.Provider>
  );
};

const MemoizedProductListProvider = React.memo(ProductListProvider);

export { MemoizedProductListProvider as ProductListProvider };
export default MemoizedProductListProvider;
