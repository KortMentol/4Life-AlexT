export interface Product {
  id: string;
  name: string;
  image: string; // URL or static import path to product image
  shortDescription: string;
  longDescription: string;
  keyIngredients: string[];
  benefits: string[];
  categories: string[];
  scientificNotes: string;
  /**
   * Optional link to detailed product page or external URL
   */
  link?: string;
  lpValue?: number;
}
