// =============================================================
// Drift & Co. — Star Rating Component
// Renders a row of 5 stars based on a numeric rating (0–5).
// Used on product cards and the product details page.
// =============================================================
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
  reviewCount?: number;
}

export default function StarRating({ rating, size = 16, showNumber = false, reviewCount }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <Star
              key={star}
              size={size}
              className={
                filled
                  ? "fill-amber-400 text-amber-400"
                  : half
                    ? "fill-amber-400/50 text-amber-400"
                    : "fill-gray-200 text-gray-200"
              }
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-medium text-gray-600">
          {rating.toFixed(1)}
          {reviewCount !== undefined && <span className="text-gray-400"> ({reviewCount})</span>}
        </span>
      )}
    </div>
  );
}
