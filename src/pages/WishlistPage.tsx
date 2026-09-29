// =============================================================
// Drift & Co. — Wishlist Page
// Shows all products the user has saved to their wishlist.
// Users can add items to cart or remove them from the wishlist.
// =============================================================
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import type { Product } from "@/types";
import { useApp } from "@/context/AppContext";
import StarRating from "@/components/StarRating";
import { formatINR } from "@/utils/format";

interface WishlistPageProps {
  onNavigate: (path: string) => void;
  onViewProduct: (product: Product) => void;
}

export default function WishlistPage({ onNavigate, onViewProduct }: WishlistPageProps) {
  const { wishlist, allProducts, toggleWishlist, addToCart } = useApp();

  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <Heart size={36} className="text-gray-300" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">Your wishlist is empty</h1>
        <p className="mt-2 text-gray-500">Tap the heart icon on any product to save it here.</p>
        <button
          onClick={() => onNavigate("/men")}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
      <p className="mt-1 text-gray-500">{wishlistProducts.length} item(s) saved</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistProducts.map((product) => (
          <div
            key={product.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="h-full w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
                onClick={() => onViewProduct(product)}
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:bg-white"
                aria-label="Remove from wishlist"
              >
                <Heart size={18} className="fill-red-500 text-red-500" />
              </button>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{product.category}</span>
              <h3
                className="mt-1 cursor-pointer text-sm font-semibold text-gray-900 transition hover:text-gray-600"
                onClick={() => onViewProduct(product)}
              >
                {product.name}
              </h3>
              <div className="mt-1.5">
                <StarRating rating={product.rating} size={14} showNumber reviewCount={product.reviewCount} />
              </div>
              <span className="mt-2 text-lg font-bold text-gray-900">{formatINR(product.price)}</span>
              <div className="mt-auto flex gap-2 pt-3">
                <button
                  onClick={() => addToCart({ product, quantity: 1, selectedSize: product.sizes[0], selectedColor: product.colors[0] })}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gray-900 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800"
                >
                  <ShoppingBag size={14} /> Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
