import { Product } from "@/types/Product";
import { createContext } from "react";

/** @description Расширяет стандартный тип `Product`, добавляя поле `quantity` для отслеживания количества товара в списке. */
export interface ProductListItem extends Product {
  quantity: number;
}

/** @description Определяет структуру данных и функций, предоставляемых `ProductListContext`. */
export interface ProductListContextType {
  items: ProductListItem[];
  addToList: (product: Product, quantity?: number) => void;
  removeFromList: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearList: () => void;
  getTotalItems: () => number;
}

/** @description Контекст для управления списком выбранных продуктов (корзиной). */
export const ProductListContext = createContext<
  ProductListContextType | undefined
>(undefined);
