import { useMemo } from "react";
import { useAuth } from "../auth/useAuth";
import { getOrders } from "../data/orders";

interface Props {
  onShop: () => void;
  onSignIn: () => void;
}

export default function AdminPage({ onShop, onSignIn }: Props) {
  const { user, ready, listUsers } = useAuth();
  const orders = useMemo(() => (user?.role === "admin" ? getOrders(user) : []), [user]);
  const users = useMemo(() => listUsers(), [listUsers]);

  if (!ready) return null;

  // Not signed in
  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-5xl">🔒</p>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Sign in required</h2>
        <button
          onClick={onSignIn}
          className="mt-6 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
        >
          Sign in
        </button>
      </section>
    );
  }

  // Signed in, but not an admin
  if (user.role !== "admin") {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-5xl">⛔</p>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Access denied</h2>
        <p className="mt-2 text-gray-500">This page is for store admins only.</p>
        <button
          onClick={onShop}
          className="mt-6 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
        >
          Back to store
        </button>
      </section>
    );
  }

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-900">Admin dashboard</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Orders", value: orders.length },
          { label: "Revenue", value: `₹${revenue}` },
          { label: "Users", value: users.length },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-1 text-3xl font-extrabold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-10 text-lg font-bold text-gray-900">All orders</h3>
      <div className="mt-3 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-mono">#{o.id}</td>
                  <td className="px-4 py-3">
                    {o.customerName}
                    <span className="block text-xs text-gray-400">{o.customerEmail}</span>
                  </td>
                  <td className="px-4 py-3">{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
                  <td className="px-4 py-3">
                    {new Date(o.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">₹{o.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h3 className="mt-10 text-lg font-bold text-gray-900">Users</h3>
      <div className="mt-3 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      u.role === "admin" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}