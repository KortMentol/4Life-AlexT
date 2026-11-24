import { DetailedProduct } from "@/data/productsData";
import { createContext } from "react";

export interface ProductListItem extends DetailedProduct {
  quantity: number;
}

export interface ProductListContextType {
  items: ProductListItem[];
  addToList: (product: DetailedProduct, quantity?: number) => void;
  removeFromList: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearList: () => void;
  getTotalItems: () => number;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const ProductListContext = createContext<
  ProductListContextType | undefined
>(undefined);
