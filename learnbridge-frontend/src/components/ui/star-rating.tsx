import { Star } from "lucide-react";

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          fill={i <= Math.round(rating) ? "#facc15" : "transparent"}
          stroke={i <= Math.round(rating) ? "#facc15" : "#d1d5db"}
        />
      ))}
    </div>
  );
}
