import type { CartItem } from "../types";
import type { User } from "../auth/useAuth";

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  createdAt: string;
}

const ORDERS_KEY = "food-store-orders";

function readAll(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function placeOrder(order: Omit<Order, "id" | "createdAt">): Order {
  const saved: Order = {
    ...order,
    id: "FS" + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(ORDERS_KEY, JSON.stringify([saved, ...readAll()]));
  return saved;
}

// Authorization: admins get every order, customers get only their own.
export function getOrders(user: User): Order[] {
  const all = readAll();
  return user.role === "admin" ? all : all.filter((o) => o.userId === user.id);
}