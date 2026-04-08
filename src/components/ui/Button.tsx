import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl border font-semibold tracking-tight transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/60 focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-[1px]",
          {
            "border-brand-500/40 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 text-surface shadow-[0_15px_50px_-25px_rgba(45,212,191,0.75)] hover:brightness-110":
              variant === "primary",
            "border-white/10 bg-surface-lighter/70 text-slate-200 hover:border-white/25 hover:text-white hover:-translate-y-[1px]":
              variant === "secondary",
            "border-red-500/30 bg-red-500/15 text-red-200 hover:bg-red-500/25":
              variant === "danger",
            "border-transparent text-gray-400 hover:text-white hover:bg-white/5":
              variant === "ghost",
          },
          {
            "text-xs px-3 py-1.5": size === "sm",
            "text-sm px-4 py-2": size === "md",
            "text-base px-5 py-2.5": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
