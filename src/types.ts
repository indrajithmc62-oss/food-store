export const CATEGORIES = ["Fruits", "Vegetables", "Bakery", "Dairy", "Snacks"] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  emoji: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}