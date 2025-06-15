// Context alias for "Мой Список" feature. Keeps backward compatibility while transitioning away from cart terminology.
// Author: Cascade AI
// Date: 2025-06-15
// Purpose: Re-export CartContext primitives under new semantic names to emphasize product list (wishlist) concept.

import { Product } from "@/types/Product";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface ProductListItem extends Product {
  quantity: number;
}

interface ProductListContextType {
  items: ProductListItem[];
  addToList: (product: Product, quantity?: number) => void;
  removeFromList: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearList: () => void;
  getTotalItems: () => number;
}

const ProductListContext = createContext<ProductListContextType | undefined>(undefined);

export const ProductListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ProductListItem[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("productList4life");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("productList4life", JSON.stringify(items));
  }, [items]);

  const addToList = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
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
      return prev.map((item) => (item.id === productId ? { ...item, quantity } : item));
    });
  };

  const clearList = () => setItems([]);

  const getTotalItems = () => items.reduce((total, item) => total + item.quantity, 0);

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

  return <ProductListContext.Provider value={value}>{children}</ProductListContext.Provider>;
};

export const useProductList = () => {
  const context = useContext(ProductListContext);
  if (!context) {
    throw new Error("useProductList must be used within a ProductListProvider");
  }
  return context;
};
