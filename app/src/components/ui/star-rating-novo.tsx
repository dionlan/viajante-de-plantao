// components/ui/star-rating.tsx
"use client";

import { Star } from "lucide-react";
import { cn } from "app/src/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function StarRating({ rating, size = "md", className }: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5"
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating 
              ? "text-yellow-400 fill-yellow-400" 
              : "text-gray-300 fill-gray-300",
            "transition-colors duration-200"
          )}
        />
      ))}
    </div>
  );
}