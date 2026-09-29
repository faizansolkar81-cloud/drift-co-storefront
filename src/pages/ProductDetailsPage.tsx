// =============================================================
// Drift & Co. — Product Details Page
// Shows a large product image, name, price (INR), description,
// available sizes & colors (selectable), a quantity selector,
// Add to Cart + wishlist buttons, and customer reviews with
// star ratings. Users can submit their own rating and review,
// which is saved to localStorage via the app context.
// =============================================================
import { useState } from "react";
import { ChevronLeft, Minus, Plus, ShoppingCart, Check, Heart, Star, ArrowRight } from "lucide-react";
import type { Product, Review } from "@/types";
import { useApp } from "@/context/AppContext";
import StarRating from "@/components/StarRating";
import ProductCard from "@/components/ProductCard";
import { formatINR } from "@/utils/format";

interface ProductDetailsPageProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export default function ProductDetailsPage({ product, onNavigate }: ProductDetailsPageProps) {
  const { addToCart, toggleWishlist, isInWishlist, getReviewsForProduct, addReview, user } = useApp();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // ---- Review form state ----
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const productReviews = getReviewsForProduct(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart({ product, quantity, selectedSize, selectedColor });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Submit a new review — saved to localStorage via context
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    const newReview: Review = {
      id: Date.now(),
      productId: product.id,
      author: user?.name ?? "Guest User",
      rating: reviewRating,
      date: new Date().toISOString().slice(0, 10),
      comment: reviewComment.trim(),
    };
    addReview(newReview);
    setReviewComment("");
    setReviewRating(5);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <button
        onClick={() => onNavigate(`/${product.gender}`)}
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-900"
      >
        <ChevronLeft size={16} /> Back to {product.gender === "men" ? "Men" : product.gender === "women" ? "Women" : "Kids"}
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ---- Large product image ---- */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-50">
          <img src={product.image} alt={product.name} className="aspect-[3/4] w-full object-cover" />
          <div className="absolute left-4 top-4 flex flex-col gap-1.5">
            {product.trending && (
              <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">Trending</span>
            )}
            {product.newArrival && (
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">New Arrival</span>
            )}
          </div>
          {/* Wishlist button on details page */}
          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:bg-white"
            aria-label="Toggle wishlist"
          >
            <Heart size={20} className={inWishlist ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"} />
          </button>
        </div>

        {/* ---- Product info ---- */}
        <div className="flex flex-col">
          <span className="text-sm font-medium uppercase tracking-wide text-gray-400">{product.category}</span>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">{product.name}</h1>
          <div className="mt-2">
            <StarRating rating={product.rating} size={18} showNumber reviewCount={product.reviewCount} />
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{formatINR(product.price)}</p>
          <p className="mt-4 leading-relaxed text-gray-600">{product.description}</p>

          {/* Available sizes */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900">
              Size: <span className="font-normal text-gray-500">{selectedSize}</span>
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    selectedSize === size
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Available colors */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900">
              Color: <span className="font-normal text-gray-500">{selectedColor}</span>
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    selectedColor === color
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900">Quantity</h3>
            <div className="mt-2 inline-flex items-center rounded-lg border border-gray-200">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600 transition hover:bg-gray-50">
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 text-sm font-semibold text-gray-900">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="px-3 py-2 text-gray-600 transition hover:bg-gray-50">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Stock indicator */}
          <p className={`mt-4 text-sm ${product.stock > 10 ? "text-emerald-600" : "text-amber-600"}`}>
            {product.stock > 10 ? "In Stock" : `Only ${product.stock} left in stock!`}
          </p>

          {/* Add to cart + wishlist buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAddToCart}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold text-white transition ${
                added ? "bg-emerald-600" : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              {added ? (<><Check size={18} /> Added to Cart!</>) : (<><ShoppingCart size={18} /> Add to Cart — {formatINR(product.price * quantity)}</>)}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-4 text-sm font-semibold transition ${
                inWishlist ? "border-red-300 bg-red-50 text-red-600" : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Heart size={18} className={inWishlist ? "fill-red-500 text-red-500" : ""} />
              {inWishlist ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* ---- Customer Reviews ---- */}
      <section className="mt-16 border-t border-gray-100 pt-10">
        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-gray-900">{product.rating.toFixed(1)}</span>
            <StarRating rating={product.rating} size={16} />
            <span className="mt-1 text-xs text-gray-500">{productReviews.length + product.reviewCount} reviews</span>
          </div>
        </div>

        {/* ---- Write a Review form ---- */}
        <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-5">
          <h3 className="text-sm font-semibold text-gray-900">Write a Review</h3>
          {reviewSubmitted ? (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <Check size={16} /> Thank you! Your review has been submitted.
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="mt-3 space-y-3">
              {/* Star selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Your rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                    >
                      <Star
                        size={20}
                        className={star <= reviewRating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              {/* Comment textarea */}
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={3}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
              <button
                type="submit"
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>

        {/* Individual reviews */}
        <div className="mt-8 space-y-4">
          {productReviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-500">
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            productReviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-gray-100 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{review.author}</p>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size={14} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
