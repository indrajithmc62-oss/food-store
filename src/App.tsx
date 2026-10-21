import { useCallback, useMemo, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import CategoryTiles from "./components/CategoryTiles";
import FilterBar from "./components/FilterBar";
import type { SortOption } from "./components/FilterBar";
import ProductCard from "./components/ProductCard";
import Reveal from "./components/Reveal";
import WhyUs from "./components/WhyUs";
import Cart from "./components/Cart";
import StickyCartBar from "./components/StickyCartBar";
import AuthModal from "./components/AuthModal";
import OrdersPage from "./components/OrdersPage";
import AdminPage from "./components/AdminPage";
import { products } from "./data/products";
import { placeOrder } from "./data/orders";
import { useCart } from "./hooks/useCart";
import { useAuth } from "./auth/useAuth";
import type { Category } from "./types";

type Page = "store" | "orders" | "admin";

export default function App() {
  const { user } = useAuth();
  const [page, setPage] = useState<Page>("store");
  const [authReason, setAuthReason] = useState<null | "signin" | "checkout">(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [sort, setSort] = useState<SortOption>("default");
  const [cartOpen, setCartOpen] = useState(false);
  const [orderTotal, setOrderTotal] = useState<number | null>(null);

  const { items, addItem, changeQuantity, removeItem, clearCart, totalCount, totalPrice } = useCart();

  const visibleProducts = useMemo(() => {
    const result = products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        p.name.toLowerCase().includes(search.trim().toLowerCase())
    );
    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    return result;
  }, [search, category, sort]);

  const closeCart = useCallback(() => setCartOpen(false), []);
  const closeAuth = useCallback(() => setAuthReason(null), []);
  const openCart = () => setCartOpen(true);

  const scrollTo = (target: string) => {
    if (target === "top") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
  };

  // If we're on the orders/admin page, go back to the store first, then scroll.
  const goTo = (target: string) => {
    if (page !== "store") {
      setPage("store");
      setTimeout(() => scrollTo(target), 80);
    } else {
      scrollTo(target);
    }
  };

  const openPage = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0 });
  };

  const pickCategory = (c: Category) => {
    setCategory(c);
    setSearch("");
    goTo("products");
  };

  const handleCheckout = (finalTotal: number) => {
    if (!user) {
      setCartOpen(false);
      setAuthReason("checkout");
      return;
    }
    placeOrder({
      userId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      items,
      total: finalTotal,
    });
    clearCart();
    setCartOpen(false);
    setOrderTotal(finalTotal);
  };

  const handleAuthSuccess = () => {
    if (authReason === "checkout") setCartOpen(true);
    setAuthReason(null);
  };

  const quantityOf = (id: number) => items.find((i) => i.product.id === id)?.quantity ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        cartCount={totalCount}
        search={search}
        onSearch={setSearch}
        onNavigate={goTo}
        onCartClick={openCart}
        onSignIn={() => setAuthReason("signin")}
        onOpenPage={openPage}
      />

      <div className="flex-1">
        {page === "store" && (
          <>
            <Hero onShop={() => goTo("products")} />
            <Highlights />

            <div id="catalog" className="scroll-mt-24">
              <CategoryTiles onSelect={pickCategory} />
            </div>

            <main id="products" className="mx-auto w-full max-w-6xl scroll-mt-24 space-y-6 px-4 py-10">
              <h2 className="text-2xl font-bold text-gray-900">Shop all products</h2>

              <FilterBar
                category={category}
                onCategory={setCategory}
                sort={sort}
                onSort={setSort}
                resultCount={visibleProducts.length}
              />

              {visibleProducts.length === 0 ? (
                <div className="py-16 text-center text-gray-500">
                  <p className="text-5xl">🔍</p>
                  <p className="mt-3">No products match your search.</p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setCategory("All");
                    }}
                    className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleProducts.map((p, i) => (
                    <Reveal key={p.id} delay={(i % 4) * 60}>
                      <ProductCard
                        product={p}
                        quantity={quantityOf(p.id)}
                        onAdd={addItem}
                        onChangeQuantity={changeQuantity}
                      />
                    </Reveal>
                  ))}
                </div>
              )}
            </main>

            <WhyUs />
          </>
        )}

        {page === "orders" && <OrdersPage onShop={() => goTo("products")} onSignIn={() => setAuthReason("signin")} />}
        {page === "admin" && <AdminPage onShop={() => goTo("products")} onSignIn={() => setAuthReason("signin")} />}
      </div>

      {/* Contact section. The details below are placeholders: replace them with your own. */}
      <footer id="contact" className="scroll-mt-24 border-t border-gray-200 bg-white pb-24 pt-10">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 text-sm text-gray-600 sm:grid-cols-3">
          <div>
            <p className="flex items-center gap-1.5 text-xl font-extrabold text-orange-500">
              <span>🍃</span> FRESH
            </p>
            <p className="mt-2 max-w-xs">Fresh groceries picked every morning and delivered to your door.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Contact us</p>
            <p className="mt-2">📞 +91 98765 43210</p>
            <p>✉️ hello@freshstore.example</p>
            <p>📍 Bengaluru, Karnataka</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Opening hours</p>
            <p className="mt-2">Mon – Sat: 7 am – 10 pm</p>
            <p>Sunday: 8 am – 8 pm</p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Fresh Store · Built with React, TypeScript & Tailwind
        </p>
      </footer>

      {page === "store" && <StickyCartBar count={totalCount} total={totalPrice} onOpen={openCart} />}

      <Cart
        open={cartOpen}
        items={items}
        totalPrice={totalPrice}
        onClose={closeCart}
        onChangeQuantity={changeQuantity}
        onRemove={removeItem}
        onCheckout={handleCheckout}
      />

      {authReason && (
        <AuthModal
          message={authReason === "checkout" ? "Sign in to place your order. Your cart is saved." : undefined}
          onClose={closeAuth}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Order confirmation popup */}
      {orderTotal !== null && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setOrderTotal(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-6xl">✅</p>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Order placed!</h2>
            <p className="mt-2 text-gray-600">
              Thank you for shopping with us. You paid <span className="font-semibold">₹{orderTotal}</span>.
            </p>
            <button
              onClick={() => {
                setOrderTotal(null);
                openPage("orders");
              }}
              className="mt-6 w-full rounded-lg bg-green-700 py-3 font-semibold text-white hover:bg-green-800"
            >
              View my orders
            </button>
            <button
              onClick={() => setOrderTotal(null)}
              className="mt-2 w-full rounded-lg py-3 font-semibold text-green-800 hover:bg-green-50"
            >
              Continue shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}