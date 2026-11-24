export interface Product {
  id: string;
  name: string;
  image: string;
  shortDescription: string;
  longDescription?: string;
  keyIngredients: string[];
  benefits?: string[];
  categories: string[];
  scientificNotes?: string;
  link?: string;
  lpValue?: number;
}
