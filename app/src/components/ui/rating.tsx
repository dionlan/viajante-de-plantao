"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "app/src/lib/utils";

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Rating({
  value,
  onChange,
  readOnly = false,
  size = "md",
  className,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (newValue: number) => {
    if (!readOnly && onChange) {
      onChange(newValue);
    }
  };

  const handleMouseEnter = (newValue: number) => {
    if (!readOnly) {
      setHoverValue(newValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverValue || value);
        const isInteractive = !readOnly && onChange;

        return (
          <motion.button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            whileHover={isInteractive ? { scale: 1.2 } : {}}
            whileTap={isInteractive ? { scale: 0.9 } : {}}
            className={cn(
              "transition-colors duration-200",
              isInteractive ? "cursor-pointer" : "cursor-default",
              sizes[size]
            )}
            disabled={readOnly}
          >
            <Star
              className={cn(
                "transition-all duration-200",
                isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              )}
            />
          </motion.button>
        );
      })}

      {!readOnly && (
        <span className="ml-2 text-sm text-gray-600">
          {hoverValue || value}.0
        </span>
      )}
    </div>
  );
}
