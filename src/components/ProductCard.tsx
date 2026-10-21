import { useState } from "react";
import type { Product } from "../types";

interface Props {
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
  onChangeQuantity: (id: number, delta: number) => void;
}

export default function ProductCard({ product, quantity, onAdd, onChangeQuantity }: Props) {
  // Try .webp first, then .jpg, then fall back to the emoji.
  const sources = [`/products/${product.id}.webp`, `/products/${product.id}.jpg`];
  const [attempt, setAttempt] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  const handleError = () => {
    if (attempt < sources.length - 1) setAttempt(attempt + 1);
    else setImgFailed(true);
  };

  return (
    <div className="flex flex-col rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
      <div className="mb-3 flex h-40 items-center justify-center overflow-hidden rounded-lg bg-green-50 text-6xl">
        {imgFailed ? (
          product.emoji
        ) : (
          <img
            key={sources[attempt]}
            src={sources[attempt]}
            alt={product.name}
            width={400}
            height={160}
            loading="lazy"
            onError={handleError}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <span className="text-xs font-medium uppercase text-green-700">{product.category}</span>
      <h3 className="font-semibold text-gray-900">{product.name}</h3>
      <p className="mb-3 flex-1 text-sm text-gray-500">{product.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">₹{product.price}</span>

        {quantity === 0 ? (
          <button
            onClick={() => onAdd(product)}
            className="rounded-lg bg-green-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-800"
          >
            Add to cart
          </button>
        ) : (
          <div className="flex items-center gap-1 rounded-lg bg-green-700 text-white">
            <button
              onClick={() => onChangeQuantity(product.id, -1)}
              aria-label={`Decrease ${product.name}`}
              className="h-8 w-8 rounded-lg text-lg hover:bg-green-800"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
            <button
              onClick={() => onChangeQuantity(product.id, 1)}
              aria-label={`Increase ${product.name}`}
              className="h-8 w-8 rounded-lg text-lg hover:bg-green-800"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}