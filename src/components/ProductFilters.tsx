// =============================================================
// Drift & Co. — Product Filters Sidebar
// Reusable filter panel used on Men, Women, and Kids product
// listing pages. Supports filtering by category, size, color,
// price range, minimum rating, plus sorting by price or rating.
// =============================================================
import { SlidersHorizontal } from "lucide-react";

export interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceMin: number;
  priceMax: number;
  minRating: number;
  sort: "featured" | "price-low" | "price-high" | "rating" | "newest";
}

interface ProductFiltersProps {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  availableCategories: string[];
  availableSizes: string[];
  availableColors: string[];
  maxPrice: number;
}

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y", "7-8Y", "8-9Y", "9-10Y", "10-11Y", "11-12Y", "12-13Y", "26", "28", "30", "32", "34", "36", "38", "40", "42", "44", "Free Size"];
const SORT_OPTIONS: { value: FilterState["sort"]; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];
const RATING_OPTIONS = [0, 3, 4, 4.5];

export default function ProductFilters({
  filters,
  setFilters,
  availableCategories,
  availableSizes,
  availableColors,
  maxPrice,
}: ProductFiltersProps) {
  const toggle = (key: "categories" | "sizes" | "colors", value: string) => {
    const arr = filters[key];
    setFilters({
      ...filters,
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <SlidersHorizontal size={18} className="text-gray-700" />
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Filters</h3>
      </div>

      {/* Sort */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Sort By</label>
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value as FilterState["sort"] })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Category filter */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Category</h4>
        <div className="space-y-1.5">
          {availableCategories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggle("categories", cat)}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Size filter */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Size</h4>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => toggle("sizes", size)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                filters.sizes.includes(size)
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color filter */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Color</h4>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((color) => (
            <button
              key={color}
              onClick={() => toggle("colors", color)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                filters.colors.includes(color)
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Price range filter */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Price Range (₹)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.priceMin}
            min={0}
            max={maxPrice}
            onChange={(e) => setFilters({ ...filters, priceMin: Number(e.target.value) })}
            className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-gray-400"
            placeholder="Min"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            value={filters.priceMax}
            min={0}
            max={maxPrice}
            onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
            className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-gray-400"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Rating filter */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Minimum Rating</h4>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => setFilters({ ...filters, minRating: r })}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                filters.minRating === r
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              {r === 0 ? "All" : `${r}★+`}
            </button>
          ))}
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={() => setFilters({ categories: [], sizes: [], colors: [], priceMin: 0, priceMax: maxPrice, minRating: 0, sort: "featured" })}
        className="w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
      >
        Clear All Filters
      </button>
    </div>
  );
}

export { ALL_SIZES };
