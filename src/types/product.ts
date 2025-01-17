export type ProductType =
  | "pizza"
  | "pasta"
  | "salad"
  | "dessert"
  | "drinks"
  | "dips";

export interface Product {
  id: number | string;
  name: string;
  ingredients: string[];
  price: number;
  image: string;
  type: ProductType;
  description?: string;
  allergener?: string[];
  spicyLevel?: number;
  originalPrice?: number;
}
