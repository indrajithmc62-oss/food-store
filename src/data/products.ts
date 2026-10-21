import type { Product } from "../types";

export const products: Product[] = [
  // Fruits
  { id: 1, name: "Apples (1 kg)", price: 180, category: "Fruits", emoji: "🍎", description: "Crisp and sweet, farm fresh." },
  { id: 2, name: "Bananas (1 dozen)", price: 70, category: "Fruits", emoji: "🍌", description: "Ripe and ready to eat." },
  { id: 3, name: "Mangoes (1 kg)", price: 220, category: "Fruits", emoji: "🥭", description: "Juicy seasonal mangoes." },
  { id: 13, name: "Oranges (1 kg)", price: 90, category: "Fruits", emoji: "🍊", description: "Tangy, full of vitamin C." },
  { id: 14, name: "Grapes (500 g)", price: 110, category: "Fruits", emoji: "🍇", description: "Seedless and sweet." },
  { id: 15, name: "Watermelon (1 pc)", price: 80, category: "Fruits", emoji: "🍉", description: "Cool, juicy and refreshing." },

  // Vegetables
  { id: 4, name: "Tomatoes (1 kg)", price: 40, category: "Vegetables", emoji: "🍅", description: "Red, firm and full of flavour." },
  { id: 5, name: "Carrots (500 g)", price: 35, category: "Vegetables", emoji: "🥕", description: "Sweet and crunchy." },
  { id: 6, name: "Broccoli (1 pc)", price: 60, category: "Vegetables", emoji: "🥦", description: "Fresh green florets." },
  { id: 16, name: "Potatoes (1 kg)", price: 30, category: "Vegetables", emoji: "🥔", description: "Great for curries and fries." },
  { id: 17, name: "Onions (1 kg)", price: 45, category: "Vegetables", emoji: "🧅", description: "Every kitchen staple." },
  { id: 18, name: "Spinach (1 bunch)", price: 25, category: "Vegetables", emoji: "🥬", description: "Tender leaves, rich in iron." },

  // Bakery
  { id: 7, name: "Whole Wheat Bread", price: 55, category: "Bakery", emoji: "🍞", description: "Baked this morning." },
  { id: 8, name: "Butter Croissant", price: 90, category: "Bakery", emoji: "🥐", description: "Flaky and buttery." },
  { id: 19, name: "Chocolate Donut", price: 60, category: "Bakery", emoji: "🍩", description: "Soft, glazed and chocolatey." },
  { id: 20, name: "Vanilla Cupcake", price: 75, category: "Bakery", emoji: "🧁", description: "Light sponge with creamy frosting." },
  { id: 21, name: "Sesame Bagel", price: 65, category: "Bakery", emoji: "🥯", description: "Chewy and freshly baked." },
  { id: 22, name: "French Baguette", price: 85, category: "Bakery", emoji: "🥖", description: "Crusty outside, soft inside." },

  // Dairy
  { id: 9, name: "Milk (1 L)", price: 64, category: "Dairy", emoji: "🥛", description: "Full cream, pasteurised." },
  { id: 10, name: "Cheddar Cheese", price: 140, category: "Dairy", emoji: "🧀", description: "Sharp, aged cheddar block." },
  { id: 23, name: "Eggs (1 dozen)", price: 84, category: "Dairy", emoji: "🥚", description: "Farm fresh, protein packed." },
  { id: 24, name: "Salted Butter (200 g)", price: 115, category: "Dairy", emoji: "🧈", description: "Rich and creamy." },
  { id: 25, name: "Vanilla Ice Cream", price: 150, category: "Dairy", emoji: "🍦", description: "Classic, smooth and cold." },
  { id: 26, name: "Fresh Curd (400 g)", price: 45, category: "Dairy", emoji: "🥣", description: "Thick and set daily." },

  // Snacks
  { id: 11, name: "Salted Popcorn", price: 50, category: "Snacks", emoji: "🍿", description: "Light and crunchy." },
  { id: 12, name: "Dark Chocolate", price: 120, category: "Snacks", emoji: "🍫", description: "70% cocoa bar." },
  { id: 27, name: "Choco Chip Cookies", price: 70, category: "Snacks", emoji: "🍪", description: "Crunchy with melty chips." },
  { id: 28, name: "Roasted Peanuts", price: 60, category: "Snacks", emoji: "🥜", description: "Lightly salted and crunchy." },
  { id: 29, name: "Potato Chips", price: 40, category: "Snacks", emoji: "🍟", description: "Crispy, classic salted." },
  { id: 30, name: "Pretzel Sticks", price: 55, category: "Snacks", emoji: "🥨", description: "Salty, crunchy and fun." },
];