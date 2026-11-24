import { DetailedProduct } from "@/data/productsData";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ProductListContext,
  ProductListContextType,
  ProductListItem,
} from "./ProductListContext.helpers";
import {
  loadFromStorage,
  saveToStorage,
  STORAGE_KEY,
} from "./ProductListUtils";

export const MAX_QTY_PER_PRODUCT = 10;
export const MAX_TOTAL_CART_ITEMS = 30;

const ProductListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<ProductListItem[]>(loadFromStorage);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        try {
          const newItems = event.newValue ? JSON.parse(event.newValue) : [];
          setItems((currentItems) => {
            const hasChanged =
              JSON.stringify(currentItems) !== JSON.stringify(newItems);
            return hasChanged ? newItems : currentItems;
          });
        } catch (error) {
          console.error(
            "[ProductListProvider] Storage sync error:",
            error,
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const addToList = useCallback(
    (product: DetailedProduct, quantity: number = 1) => {
      const safeDelta = Math.max(1, Math.floor(quantity));
      setItems((prev) => {
        const currentTotal = prev.reduce((sum, item) => sum + item.quantity, 0);
        const remainingGlobal = Math.max(0, MAX_TOTAL_CART_ITEMS - currentTotal);
        if (remainingGlobal <= 0) return prev;

        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          const allowedNewQty = Math.min(
            MAX_QTY_PER_PRODUCT,
            existing.quantity + Math.min(safeDelta, remainingGlobal),
          );
          if (allowedNewQty === existing.quantity) return prev;
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: allowedNewQty } : item,
          );
        }
        const initialQty = Math.min(MAX_QTY_PER_PRODUCT, safeDelta, remainingGlobal);
        if (initialQty <= 0) return prev;
        return [...prev, { ...product, quantity: initialQty }];
      });
    },
    [],
  );

  const removeFromList = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const updateItemQuantity = useCallback(
    (productId: string, quantity: number) => {
      const safeQty = Math.floor(quantity);
      setItems((prev) => {
        if (safeQty <= 0) return prev.filter((i) => i.id !== productId);
        const otherTotal = prev.reduce(
          (sum, item) => (item.id === productId ? sum : sum + item.quantity),
          0,
        );
        const maxAllowed = Math.min(
          MAX_QTY_PER_PRODUCT,
          Math.max(0, MAX_TOTAL_CART_ITEMS - otherTotal),
        );
        const clamped = Math.min(safeQty, maxAllowed);
        if (clamped <= 0) return prev.filter((i) => i.id !== productId);
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: clamped } : item,
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
      isModalOpen,
      openModal,
      closeModal,
    }),
    [
      items,
      addToList,
      removeFromList,
      updateItemQuantity,
      clearList,
      getTotalItems,
      isModalOpen,
      openModal,
      closeModal,
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
