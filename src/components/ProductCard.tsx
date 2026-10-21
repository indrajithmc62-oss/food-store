import type { Product } from "../types";

// Discount % per product id (display only).
const DEALS: Record<number, number> = {
  1: 10, 3: 15, 8: 20, 10: 12, 12: 18, 14: 15, 19: 10, 23: 10, 25: 20, 27: 15,
};
const BEST_SELLERS = new Set([2, 4, 7, 9, 11, 23]);

interface Props {
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
  onChangeQuantity: (id: number, delta: number) => void;
}

export default function ProductCard({ product, quantity, onAdd, onChangeQuantity }: Props) {
  const discount = DEALS[product.id];
  const oldPrice = discount ? Math.round(product.price / (1 - discount / 100)) : null;
  const bestSeller = BEST_SELLERS.has(product.id);

  return (
    <div
      className={`flex flex-col rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        quantity > 0 ? "ring-2 ring-green-600" : "ring-1 ring-gray-200"
      }`}
    >
      <div className="relative mb-3 flex h-32 items-center justify-center rounded-xl bg-green-50 text-7xl">
        {product.emoji}
        {discount && (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
            {discount}% OFF
          </span>
        )}
        {bestSeller && !discount && (
          <span className="absolute left-2 top-2 rounded-full bg-yellow-300 px-2.5 py-0.5 text-xs font-bold text-green-950">
            ⭐ Best seller
          </span>
        )}
      </div>

      <span className="text-xs font-medium uppercase text-green-700">{product.category}</span>
      <h3 className="font-semibold text-gray-900">{product.name}</h3>
      <p className="mb-3 flex-1 text-sm text-gray-500">{product.description}</p>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          {oldPrice && <span className="ml-2 text-sm text-gray-400 line-through">₹{oldPrice}</span>}
        </div>

        {quantity === 0 ? (
          <button
            onClick={() => onAdd(product)}
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800 active:scale-95"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center gap-1 rounded-lg bg-green-700 text-white">
            <button
              onClick={() => onChangeQuantity(product.id, -1)}
              aria-label={`Decrease ${product.name}`}
              className="h-9 w-9 rounded-lg text-lg hover:bg-green-800"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
            <button
              onClick={() => onChangeQuantity(product.id, 1)}
              aria-label={`Increase ${product.name}`}
              className="h-9 w-9 rounded-lg text-lg hover:bg-green-800"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}