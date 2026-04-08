import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "status";
}

export function Card({ className, variant = "default", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-surface-light/80 p-5 shadow-[0_22px_70px_-45px_rgba(0,0,0,0.65)] backdrop-blur before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_18%_18%,rgba(45,212,191,0.12),transparent_38%)] before:opacity-80 before:transition-opacity before:duration-200 hover:before:opacity-100",
        variant === "status" && "border-brand-500/40 bg-gradient-to-br from-surface-light/90 via-surface-lighter/80 to-surface/80",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
