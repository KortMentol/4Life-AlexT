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

  // Expose both new and legacy API for smoother migration
  const value: ProductListContextType & {
    /* legacy aliases */
    cartItems: ProductListItem[];
    addToCart: ProductListContextType["addToList"];
    removeFromCart: ProductListContextType["removeFromList"];
    updateCartItemQuantity: ProductListContextType["updateItemQuantity"];
  } = {
    items,
    addToList,
    removeFromList,
    updateItemQuantity,
    clearList,
    getTotalItems,
    /* legacy aliases */
    cartItems: items,
    addToCart: addToList,
    removeFromCart: removeFromList,
    updateCartItemQuantity: updateItemQuantity,
  };

  return (
    <ProductListContext.Provider value={value}>
      {children}
    </ProductListContext.Provider>
  );
};
