import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export function StarRating({
  rating,
  max = 5,
  size = "md",
  showValue = false,
  className,
}: {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}) {
  const sizes = { sm: "h-3.5 w-3.5", md: "h-5 w-5", lg: "h-6 w-6" };

  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizes[size],
            i < Math.floor(rating)
              ? "fill-accent-400 text-accent-400"
              : i < rating
                ? "fill-accent-200 text-accent-400"
                : "fill-sand-200 text-sand-300"
          )}
          aria-hidden="true"
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-ink">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
