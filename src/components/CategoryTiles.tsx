import { CATEGORIES } from "../types";
import type { Category } from "../types";
import { products } from "../data/products";

const ICONS: Record<Category, string> = {
  Fruits: "🍎",
  Vegetables: "🥕",
  Bakery: "🥖",
  Dairy: "🥛",
  Snacks: "🍿",
};

const COLORS: Record<Category, string> = {
  Fruits: "from-red-50 to-orange-100",
  Vegetables: "from-green-50 to-emerald-100",
  Bakery: "from-amber-50 to-yellow-100",
  Dairy: "from-sky-50 to-blue-100",
  Snacks: "from-purple-50 to-pink-100",
};

interface Props {
  onSelect: (category: Category) => void;
}

export default function CategoryTiles({ onSelect }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-10">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">Shop by category</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className={`group rounded-2xl bg-gradient-to-br p-5 text-left shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg ${COLORS[c]}`}
          >
            <span className="block text-5xl transition group-hover:scale-110">{ICONS[c]}</span>
            <span className="mt-3 block font-bold text-gray-900">{c}</span>
            <span className="text-xs text-gray-600">
              {products.filter((p) => p.category === c).length} items
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}