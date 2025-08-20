import { DetailedProduct } from "@/data/productsData"; // <-- ИЗМЕНЕНИЕ: Импортируем DetailedProduct
import { createContext } from "react";

/** @description Расширяет тип DetailedProduct, добавляя поле `quantity`. */
// --- ИЗМЕНЕНИЕ: Теперь наследуемся от DetailedProduct, а не от Product ---
export interface ProductListItem extends DetailedProduct {
  quantity: number;
}

/** @description Определяет структуру данных и функций, предоставляемых `ProductListContext`. */
export interface ProductListContextType {
  items: ProductListItem[];
  addToList: (product: DetailedProduct, quantity?: number) => void; // <-- ИЗМЕНЕНИЕ: Тип продукта теперь DetailedProduct
  removeFromList: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearList: () => void;
  getTotalItems: () => number;
}

/** @description Контекст для управления списком выбранных продуктов (корзиной). */
export const ProductListContext = createContext<ProductListContextType | undefined>(undefined);
