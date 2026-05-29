import { DetailedProduct } from "@/data/productsData";

export interface ProductDetailModalProps {
  product: DetailedProduct | null;
  products: DetailedProduct[];
  isOpen: boolean;
  onClose: () => void;
}

export interface ProductDetailModalHandle {
  getPanelImage: () => HTMLDivElement | null;
}
