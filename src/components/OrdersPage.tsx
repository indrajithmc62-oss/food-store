import { useMemo } from "react";
import { useAuth } from "../auth/useAuth";
import { getOrders } from "../data/orders";

interface Props {
  onShop: () => void;
  onSignIn: () => void;
}

export default function OrdersPage({ onShop, onSignIn }: Props) {
  const { user, ready } = useAuth();
  const orders = useMemo(() => (user ? getOrders(user) : []), [user]);

  if (!ready) return null;

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-5xl">🔒</p>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Sign in to see your orders</h2>
        <button
          onClick={onSignIn}
          className="mt-6 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
        >
          Sign in
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-900">My orders</h2>

      {orders.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          <p className="text-5xl">🛒</p>
          <p className="mt-3">You haven't placed any orders yet.</p>
          <button
            onClick={onShop}
            className="mt-4 rounded-lg bg-green-700 px-5 py-2.5 font-semibold text-white hover:bg-green-800"
          >
            Start shopping
          </button>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-sm font-semibold text-gray-900">#{o.id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                {o.items.map(({ product, quantity }) => (
                  <li key={product.id}>
                    {product.emoji} {product.name} × {quantity}
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t pt-3 text-right font-bold text-gray-900">Total ₹{o.total}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}