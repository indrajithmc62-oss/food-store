import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../auth/useAuth";

const NAV = [
  { label: "Home", target: "top" },
  { label: "Catalog", target: "catalog" },
  { label: "Shop", target: "products" },
  { label: "Contact", target: "contact" },
];

interface Props {
  cartCount: number;
  search: string;
  onSearch: (value: string) => void;
  onNavigate: (target: string) => void;
  onCartClick: () => void;
  onSignIn: () => void;
  onOpenPage: (page: "orders" | "admin") => void;
}

export default function Header({
  cartCount,
  search,
  onSearch,
  onNavigate,
  onCartClick,
  onSignIn,
  onOpenPage,
}: Props) {
  const { user, signOut } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);

  // Keyboard shortcut: press "/" to jump to the search box.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "SELECT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Close the account menu when clicking anywhere else.
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNavigate("products");
  };

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
        {/* Logo */}
        <button
          onClick={() => {
            setActive("Home");
            onNavigate("top");
          }}
          className="flex items-center gap-1.5"
        >
          <span className="text-2xl">🍃</span>
          <span className="hidden text-2xl font-extrabold tracking-tight text-orange-500 min-[420px]:block">FRESH</span>
        </button>

        {/* Nav links (hidden on small screens) */}
        <nav className="ml-6 hidden gap-7 md:flex">
          {NAV.map((n) => (
            <button
              key={n.label}
              onClick={() => {
                setActive(n.label);
                onNavigate(n.target);
              }}
              className={`relative pb-1 text-sm font-medium transition hover:text-gray-900 ${
                active === n.label ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {n.label}
              {active === n.label && (
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-orange-500" />
              )}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Search pill */}
          <form onSubmit={handleSubmit} className="relative w-28 sm:w-56">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              🔍
            </span>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search"
              className="w-full rounded-full border border-gray-300 bg-white py-2 pl-9 pr-8 text-sm outline-none placeholder:text-gray-400 focus:border-[#2d6a4f] focus:ring-2 focus:ring-green-100"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </form>

          {/* Cart */}
          <button
            onClick={onCartClick}
            aria-label="Open cart"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-green-950 transition hover:bg-yellow-300"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Account */}
          {user ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-full bg-[#2d6a4f] py-1.5 pl-1.5 pr-2 text-sm font-semibold text-white transition hover:bg-[#245840] sm:pr-4"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-[#2d6a4f]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-24 truncate sm:block">{user.name.split(" ")[0]}</span>
              </button>

              {menuOpen && (
                <div role="menu" className="absolute right-0 mt-2 w-56 rounded-xl bg-white p-2 text-sm shadow-xl ring-1 ring-black/5">
                  <div className="border-b border-gray-100 px-3 pb-2 pt-1">
                    <p className="truncate font-semibold text-gray-900">{user.name}</p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                    {user.role === "admin" && (
                      <span className="mt-1 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenPage("orders");
                    }}
                    className="mt-1 w-full rounded-lg px-3 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    📦 My orders
                  </button>
                  {user.role === "admin" && (
                    <button
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenPage("admin");
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      📊 Admin dashboard
                    </button>
                  )}
                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="shrink-0 rounded-lg bg-[#2d6a4f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#245840] sm:px-5"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}