"use client";

import React, { useState } from "react";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Search, Check, X } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  helperText?: string;
  variant?: "default" | "filled" | "flushed";
}

const Input = React.forwardRef<HTMLInputElement, InputProps & MotionProps>(
  (
    {
      className,
      label,
      error,
      success,
      icon,
      helperText,
      variant = "default",
      type,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const variants = {
      default: "border-gray-300 focus:border-[#317873] focus:ring-[#317873]",
      filled:
        "bg-gray-50 border-gray-200 focus:bg-white focus:border-[#317873] focus:ring-[#317873]",
      flushed:
        "border-0 border-b-2 border-gray-300 rounded-none focus:border-[#317873] focus:ring-0 px-0",
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}

          <motion.input
            ref={ref}
            type={inputType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            whileFocus={{ scale: 1.005 }}
            className={cn(
              "flex h-12 w-full bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 border rounded-xl",
              variants[variant],
              icon && "pl-10",
              error && "border-red-500 focus-visible:ring-red-500",
              success && "border-green-500 focus-visible:ring-green-500",
              isPassword && "pr-10",
              className
            )}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Success Indicator */}
          {success && !error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Check className="w-4 h-4 text-green-500" />
            </div>
          )}

          {/* Error Indicator */}
          {error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <X className="w-4 h-4 text-red-500" />
            </div>
          )}
        </div>

        {/* Helper Text & Error */}
        {(helperText || error) && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={cn("text-sm", error ? "text-red-600" : "text-gray-500")}
          >
            {error || helperText}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

Input.displayName = "Input";

export default Input;
