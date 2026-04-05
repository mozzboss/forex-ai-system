import Link from "next/link";

import { MAJOR_PAIRS } from "@/config/trading";

export default function PairsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Currency Pairs</h1>
        <p className="text-sm text-gray-500 mt-1">Major pairs plus gold only. Select an instrument for full analysis.</p>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Major Pairs + Gold
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MAJOR_PAIRS.map((pair) => (
            <Link
              key={pair}
              href={`/pairs/${pair}`}
              className="card hover:border-brand-500/30 transition-colors cursor-pointer"
            >
              <div className="text-sm font-semibold">{pair}</div>
              <div className="text-xs text-gray-500 mt-1">Click to analyze</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
