"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Airport, searchAirports } from "@/lib/airports";

interface AirportAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAirportSelect: (airport: Airport) => void;
  placeholder: string;
  label: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function AirportAutocomplete({
  value,
  onChange,
  onAirportSelect,
  placeholder,
  label,
  error,
  disabled,
  className,
}: AirportAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const results = searchAirports(value);
      setSuggestions(results);
      setIsOpen(results.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
    setHighlightedIndex(-1);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleAirportSelect = (airport: Airport) => {
    onChange(`${airport.city} (${airport.code})`);
    onAirportSelect(airport);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleAirportSelect(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const formatAirportDisplay = (airport: Airport) => {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#317873] to-[#a0d6b4] rounded-lg flex items-center justify-center">
            <Plane className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-900">{airport.city}</div>
            <div className="text-sm text-gray-600">{airport.name}</div>
          </div>
        </div>
        <div className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-700">
          {airport.code}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value && setSuggestions(searchAirports(value))}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-sm transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[#317873] focus:border-transparent",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            error && "border-red-500 focus:ring-red-500",
            isOpen && "ring-2 ring-[#317873] ring-offset-2"
          )}
        />
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-[100] overflow-hidden"
          >
            {suggestions.map((airport, index) => (
              <motion.button
                key={`${airport.code}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleAirportSelect(airport)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "w-full px-4 py-3 text-left transition-all duration-200 border-b border-gray-100 last:border-b-0",
                  "hover:bg-gray-50 focus:outline-none focus:bg-gray-50",
                  highlightedIndex === index && "bg-gray-50"
                )}
              >
                {formatAirportDisplay(airport)}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-sm text-red-600 mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
