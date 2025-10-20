"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface FilterDropdownProps {
  options: FilterOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function FilterDropdown({
  options,
  value,
  onValueChange,
  placeholder,
  icon,
  className,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 h-10 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#317873] focus:border-transparent",
          isOpen && "ring-2 ring-[#317873] ring-offset-2 border-[#317873]"
        )}
      >
        {icon}
        <span className="text-gray-700">
          {selectedOption?.label || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  onValueChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-3 text-left transition-all duration-200 border-b border-gray-100 last:border-b-0",
                  "hover:bg-gray-50 focus:outline-none focus:bg-gray-50",
                  option.value === value &&
                    "bg-[#317873] text-white hover:bg-[#49796b]"
                )}
              >
                <div className="flex items-center gap-3">
                  {option.icon}
                  <span className="font-medium">{option.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {option.count !== undefined && (
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        option.value === value
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {option.count}
                    </span>
                  )}
                  {option.value === value && <Check className="w-4 h-4" />}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
