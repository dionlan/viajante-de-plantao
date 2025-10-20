"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceDisplayProps {
  miles: number;
  cash: number;
  size?: "sm" | "md" | "lg";
  showTrend?: boolean;
  trend?: "up" | "down";
  className?: string;
}

export default function PriceDisplay({
  miles,
  cash,
  size = "md",
  showTrend = false,
  trend = "down",
  className,
}: PriceDisplayProps) {
  const sizes = {
    sm: {
      miles: "text-lg",
      cash: "text-sm",
      icon: "w-3 h-3",
    },
    md: {
      miles: "text-2xl",
      cash: "text-base",
      icon: "w-4 h-4",
    },
    lg: {
      miles: "text-3xl",
      cash: "text-lg",
      icon: "w-5 h-5",
    },
  };

  const currentSize = sizes[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("text-center space-y-1", className)}
    >
      {/* Miles Price */}
      <div className="flex items-center justify-center gap-2">
        {showTrend && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(trend === "up" ? "text-green-500" : "text-red-500")}
          >
            {trend === "up" ? (
              <TrendingUp className={currentSize.icon} />
            ) : (
              <TrendingDown className={currentSize.icon} />
            )}
          </motion.div>
        )}

        <motion.div
          className={cn("font-bold text-[#317873]", currentSize.miles)}
        >
          {miles.toLocaleString("pt-BR")} milhas
        </motion.div>
      </div>

      {/* Cash Price */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={cn("text-gray-600", currentSize.cash)}
      >
        ou R$ {cash.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </motion.div>

      {/* Per Passenger */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xs text-gray-500"
      >
        por passageiro
      </motion.div>
    </motion.div>
  );
}
