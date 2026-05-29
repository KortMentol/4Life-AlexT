import { DetailedProduct, GalleryItem } from "@/data/productsData";

export function buildGallery(product: DetailedProduct): GalleryItem[] {
  if (product.gallery && product.gallery.length > 0) return product.gallery;
  return [{ type: "image", src: product.image, alt: product.name }];
}

export const IS_TOUCH =
  typeof window !== "undefined" ? "ontouchstart" in window || navigator.maxTouchPoints > 0 : false;
