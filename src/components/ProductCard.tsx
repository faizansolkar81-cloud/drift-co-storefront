// =============================================================
// Drift & Co. — Product Card
// Displays a single product with image, name, price (INR),
// category, rating, a wishlist heart button, and two action
// buttons: "View Details" and "Add to Cart".
// Used on the home page, product listing pages, and wishlist.
// =============================================================
import { ShoppingCart, Eye, Heart } from "lucide-react";
import type { Product } from "@/types";
import StarRating from "@/components/StarRating";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/utils/format";

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
}

export default function ProductCard({ product, onView }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();

  const handleQuickAdd = () => {
    addToCart({
      product,
      quantity: 1,
      selectedSize: product.sizes[0],
      selectedColor: product.colors[0],
    });
  };

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Product image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.trending && (
            <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              Trending
            </span>
          )}
          {product.newArrival && (
            <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              New
            </span>
          )}
        </div>
        {/* Wishlist heart button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:bg-white"
          aria-label="Toggle wishlist"
        >
          <Heart
            size={18}
            className={inWishlist ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}
          />
        </button>
        {/* Hover overlay buttons */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-2 p-3 transition-transform duration-300 group-hover:translate-y-0">
          <button
            onClick={() => onView(product)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/95 py-2.5 text-sm font-semibold text-gray-900 shadow-md backdrop-blur transition hover:bg-white"
          >
            <Eye size={16} /> View
          </button>
          <button
            onClick={handleQuickAdd}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-gray-800"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{product.category}</span>
        <h3
          className="mt-1 cursor-pointer text-sm font-semibold text-gray-900 transition hover:text-gray-600"
          onClick={() => onView(product)}
        >
          {product.name}
        </h3>
        <div className="mt-1.5">
          <StarRating rating={product.rating} size={14} showNumber reviewCount={product.reviewCount} />
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-gray-900">{formatINR(product.price)}</span>
          <button
            onClick={handleQuickAdd}
            className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-900 hover:text-white"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
