// =============================================================
// Drift & Co. — Product Listing Page
// Displays a grid of products with a sidebar of filters
// (category, size, color, price, sort). Used for the Men,
// Women, Kids, and Search pages by passing a `gender` or
// `searchQuery` prop.
// =============================================================
import { useMemo, useState } from "react";
import { PackageX } from "lucide-react";
import type { Product, Gender } from "@/types";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import ProductFilters, { type FilterState, ALL_SIZES } from "@/components/ProductFilters";

interface ProductListingPageProps {
  gender?: Gender;
  searchQuery?: string;
  title: string;
  subtitle?: string;
  onNavigate: (path: string) => void;
  onViewProduct: (product: Product) => void;
}

export default function ProductListingPage({
  gender,
  searchQuery,
  title,
  subtitle,
  onNavigate,
  onViewProduct,
}: ProductListingPageProps) {
  const { allProducts } = useApp();
  const maxPrice = Math.ceil(Math.max(...allProducts.map((p) => p.price)));

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    priceMin: 0,
    priceMax: maxPrice,
    minRating: 0,
    sort: "featured",
  });

  // Derive available filter options from the products shown on this page
  const pageProducts = useMemo(() => {
    let list = allProducts;
    if (gender) list = list.filter((p) => p.gender === gender);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.gender.toLowerCase().includes(q),
      );
    }
    return list;
  }, [allProducts, gender, searchQuery]);

  const availableCategories = [...new Set(pageProducts.map((p) => p.category))];
  const availableSizes = [...new Set(pageProducts.flatMap((p) => p.sizes))].sort(
    (a, b) => ALL_SIZES.indexOf(a) - ALL_SIZES.indexOf(b),
  );
  const availableColors = [...new Set(pageProducts.flatMap((p) => p.colors))];

  // Apply filters + sorting
  const filteredProducts = useMemo(() => {
    let list = pageProducts.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (filters.sizes.length && !p.sizes.some((s) => filters.sizes.includes(s))) return false;
      if (filters.colors.length && !p.colors.some((c) => filters.colors.includes(c))) return false;
      if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
      if (p.rating < filters.minRating) return false;
      return true;
    });

    switch (filters.sort) {
      case "price-low": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-high": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      case "newest": list = [...list].sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0)); break;
    }
    return list;
  }, [pageProducts, filters]);

  return (
    <div>
      {/* Page header */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters sidebar */}
          <aside className="lg:w-64 lg:shrink-0">
            <div className="lg:sticky lg:top-20 rounded-2xl border border-gray-100 bg-white p-5">
              <ProductFilters
                filters={filters}
                setFilters={setFilters}
                availableCategories={availableCategories}
                availableSizes={availableSizes}
                availableColors={availableColors}
                maxPrice={maxPrice}
              />
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center">
                <PackageX size={48} className="text-gray-300" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => setFilters({ categories: [], sizes: [], colors: [], priceMin: 0, priceMax: maxPrice, minRating: 0, sort: "featured" })}
                  className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onView={onViewProduct} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
