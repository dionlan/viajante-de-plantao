"use client";

import React, { JSX } from "react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function StarRating({
  rating,
  size = "md",
  className,
}: StarRatingProps) {
  const stars: JSX.Element[] = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={i} className={`text-yellow-400 ${sizes[size]}`}>
        ★
      </span>
    );
  }

  if (hasHalfStar) {
    stars.push(
      <span key="half" className={`text-yellow-400 ${sizes[size]}`}>
        ★
      </span>
    );
  }

  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <span key={`empty-${i}`} className={`text-gray-300 ${sizes[size]}`}>
        ★
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {stars}
      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}
