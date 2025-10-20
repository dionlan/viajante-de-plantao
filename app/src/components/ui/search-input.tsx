"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Plane } from "lucide-react";
import { cn } from "app/src/lib/utils";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (value: string) => void;
  suggestions?: string[];
  loading?: boolean;
  variant?: "default" | "large";
}

export default function SearchInput({
  onSearch,
  suggestions = [],
  loading = false,
  variant = "default",
  className,
  ...props
}: SearchInputProps) {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setValue(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setValue("");
    setShowSuggestions(false);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          {/* Input sem motion para evitar conflitos de tipagem */}
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={
              variant === "large" ? "Para onde você quer viajar?" : "Buscar..."
            }
            className={cn(
              "flex h-12 w-full rounded-xl border border-gray-300 bg-white px-10 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#317873] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
              variant === "large" && "h-14 text-lg px-12",
              className
            )}
            {...props}
          />

          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className={variant === "large" ? "w-5 h-5" : "w-4 h-4"} />
          </div>

          {/* Clear Button */}
          {value && (
            <motion.button
              type="button"
              onClick={clearSearch}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}

          {/* Search Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!value || loading}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 bg-[#317873] text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed",
              variant === "large" ? "px-4 py-2" : "px-3 py-1.5"
            )}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className={variant === "large" ? "w-5 h-5" : "w-4 h-4"} />
            )}
          </motion.button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
              >
                <Plane className="w-4 h-4 text-gray-400" />
                <span>{suggestion}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
