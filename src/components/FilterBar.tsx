import { CATEGORIES } from "../types";
import type { Category } from "../types";

export type SortOption = "default" | "low" | "high";

const CATEGORY_ICONS: Record<Category | "All", string> = {
  All: "🛍️",
  Fruits: "🍎",
  Vegetables: "🥕",
  Bakery: "🥖",
  Dairy: "🥛",
  Snacks: "🍿",
};

interface Props {
  category: Category | "All";
  onCategory: (value: Category | "All") => void;
  sort: SortOption;
  onSort: (value: SortOption) => void;
  resultCount: number;
}

export default function FilterBar({ category, onCategory, sort, onSort, resultCount }: Props) {
  return (
    <div className="space-y-4">
      {/* Category buttons: scroll sideways on small phones instead of wrapping */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => onCategory(c)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              category === c
                ? "bg-green-700 text-white shadow-md"
                : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-green-50 hover:ring-green-300"
            }`}
          >
            <span>{CATEGORY_ICONS[c]}</span>
            {c}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{resultCount}</span>{" "}
          {resultCount === 1 ? "item" : "items"}
        </p>
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value as SortOption)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        >
          <option value="default">Sort: Featured</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}