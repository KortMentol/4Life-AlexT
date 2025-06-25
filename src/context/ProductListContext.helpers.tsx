import { Product } from "@/types/Product";
import { createContext } from "react";

export interface ProductListItem extends Product {
  quantity: number;
}

export interface ProductListContextType {
  items: ProductListItem[];
  addToList: (product: Product, quantity?: number) => void;
  removeFromList: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearList: () => void;
  getTotalItems: () => number;
}

export const ProductListContext = createContext<
  ProductListContextType | undefined
>(undefined);
