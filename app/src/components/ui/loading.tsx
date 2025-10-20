"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "app/src/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Componente de carregamento animado
 * - Usa framer-motion para rotação infinita
 * - Respeita os tamanhos configuráveis
 * - Segue padrão de client component para uso em Next.js
 */
const Loading: React.FC<LoadingProps> = ({ size = "md", className }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("flex items-center justify-center", className)}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={cn(
          "border-2 border-[#317873] border-t-transparent rounded-full",
          sizes[size]
        )}
      />
    </motion.div>
  );
};

export default Loading;
