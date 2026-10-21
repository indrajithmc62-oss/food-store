import { useEffect } from "react";
import type { CartItem } from "../types";

const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_FEE = 40;

interface Props {
  open: boolean;
  items: CartItem[];
  totalPrice: number; // items subtotal, before delivery
  onClose: () => void;
  onChangeQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: (finalTotal: number) => void;
}

export default function Cart({ open, items, totalPrice, onClose, onChangeQuantity, onRemove, onCheckout }: Props) {
  // Esc closes the cart. Hooks must run before any early return.
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const deliveryFee = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const grandTotal = totalPrice + deliveryFee;
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - totalPrice);
  const progress = Math.min(100, (totalPrice / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-20 flex justify-end bg-black/40" onClick={onClose}>
      {/* stopPropagation stops clicks inside the panel from closing it */}
      <aside
        className="flex h-full w-full max-w-md flex-col bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart" className="text-2xl text-gray-500 hover:text-black">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p className="mt-10 text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            {/* Free delivery progress */}
            <div className="mb-4 rounded-lg bg-green-50 p-3">
              <p className="mb-2 text-sm font-medium text-green-800">
                {remaining > 0
                  ? `Add ₹${remaining} more for free delivery`
                  : "🎉 You've unlocked free delivery!"}
              </p>
              <div className="h-2 overflow-hidden rounded-full bg-green-200">
                <div
                  className="h-full rounded-full bg-green-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 space-y-3 overflow-y-auto">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <span className="text-3xl">{product.emoji}</span>
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">₹{product.price} each</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button onClick={() => onChangeQuantity(product.id, -1)} className="h-7 w-7 rounded bg-gray-100 hover:bg-gray-200">−</button>
                      <span className="w-6 text-center">{quantity}</span>
                      <button onClick={() => onChangeQuantity(product.id, 1)} className="h-7 w-7 rounded bg-gray-100 hover:bg-gray-200">+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{product.price * quantity}</p>
                    <button onClick={() => onRemove(product.id)} className="text-xs text-red-600 hover:underline">Remove</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between pt-1 text-lg font-bold">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
              <button
                onClick={() => onCheckout(grandTotal)}
                className="mt-2 w-full rounded-lg bg-green-700 py-3 font-semibold text-white hover:bg-green-800"
              >
                Place order
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}