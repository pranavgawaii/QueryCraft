import * as React from "react";

import { cn } from "@/utils/cn";

type ButtonVariant = "default" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-900 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 dark:active:bg-white",
  outline: "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 active:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:active:bg-neutral-900",
  ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-transparent dark:text-neutral-300 dark:hover:bg-neutral-800 dark:active:bg-transparent",
  destructive: "bg-red-600 text-white hover:bg-red-500 active:bg-red-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", isLoading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? "Loading..." : children}
      </button>
    );
  },
);

Button.displayName = "Button";
