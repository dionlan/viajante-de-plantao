"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "app/src/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient";
  showValue?: boolean;
  className?: string;
}

export default function Progress({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showValue = false,
  className,
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const variants = {
    default: "bg-[#317873]",
    gradient: "bg-gradient-to-r from-[#317873] to-[#a0d6b4]",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {showValue && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progresso</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}

      <div
        className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          sizes[size]
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full transition-all duration-300",
            variants[variant]
          )}
        />
      </div>
    </div>
  );
}
