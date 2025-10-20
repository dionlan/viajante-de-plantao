"use client";

import React from "react";
import { motion, MotionProps } from "framer-motion";
import { cn } from "app/src/lib/utils";
import Loading from "./loading";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  rounded?: "default" | "full" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps & MotionProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      rounded = "default",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";

    const variants = {
      primary:
        "bg-[#317873] text-white hover:bg-[#49796b] focus:ring-[#317873] shadow-lg hover:shadow-xl",
      secondary:
        "bg-[#a0d6b4] text-[#317873] hover:bg-[#8bc9a8] focus:ring-[#a0d6b4] shadow-md hover:shadow-lg",
      outline:
        "border-2 border-[#317873] text-[#317873] hover:bg-[#317873] hover:text-white focus:ring-[#317873]",
      ghost:
        "text-[#317873] hover:bg-[#a0d6b4] hover:text-[#317873] focus:ring-[#a0d6b4]",
      gradient:
        "bg-gradient-to-r from-[#317873] to-[#49796b] text-white hover:from-[#49796b] hover:to-[#317873] focus:ring-[#317873] shadow-lg hover:shadow-xl",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
      xl: "px-10 py-5 text-xl",
    };

    const roundedStyles = {
      default: "rounded-xl",
      lg: "rounded-2xl",
      full: "rounded-full",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{
          scale: disabled || loading ? 1 : 1.02,
          y: disabled || loading ? 0 : -2,
        }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          roundedStyles[rounded],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {/* Ripple Effect */}
        <span className="absolute inset-0 overflow-hidden rounded-inherit">
          <span className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
        </span>

        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit">
            <Loading size="sm" />
          </div>
        )}

        {/* Content */}
        <span
          className={cn(
            "flex items-center gap-2 transition-all duration-200",
            loading && "opacity-0"
          )}
        >
          {icon && iconPosition === "left" && (
            <span className="shrink-0">{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className="shrink-0">{icon}</span>
          )}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
