"use client";

import { Currency } from "@/types";
import { CURRENCIES } from "@/config/trading";
import { cn } from "@/lib/utils";

interface CurrencyStrengthProps {
  data: Partial<Record<Currency, number>>; // -10 to +10
}

export function CurrencyStrength({ data }: CurrencyStrengthProps) {
  const sorted = CURRENCIES
    .map((c) => ({ currency: c, strength: data[c] || 0 }))
    .sort((a, b) => b.strength - a.strength);

  return (
    <div className="space-y-2">
      {sorted.map(({ currency, strength }) => {
        const pct = ((strength + 10) / 20) * 100; // normalize to 0-100
        const isPositive = strength > 0;
        const isNegative = strength < 0;

        return (
          <div key={currency} className="flex items-center gap-3">
            <span className="text-xs font-mono w-8 text-gray-400">{currency}</span>
            <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden relative">
              {/* Center line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
              {/* Bar */}
              <div
                className={cn(
                  "absolute top-0 h-full rounded-full transition-all",
                  isPositive ? "bg-green-500/60" : isNegative ? "bg-red-500/60" : "bg-gray-500/40"
                )}
                style={{
                  left: isPositive ? "50%" : `${pct}%`,
                  width: `${Math.abs(strength) * 5}%`,
                }}
              />
            </div>
            <span
              className={cn(
                "text-xs font-mono w-8 text-right",
                isPositive ? "text-green-400" : isNegative ? "text-red-400" : "text-gray-500"
              )}
            >
              {strength > 0 ? "+" : ""}
              {strength}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Placeholder version when no data
export function CurrencyStrengthPlaceholder() {
  const mockData: Record<Currency, number> = {
    USD: 3, EUR: -1, GBP: 5, JPY: -4, CHF: 0, AUD: 2, NZD: -2, CAD: 1,
  };
  return <CurrencyStrength data={mockData} />;
}
