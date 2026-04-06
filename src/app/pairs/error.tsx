"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ForexAI] Page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-red-400/80">
          Something went wrong
        </div>
        <h1 className="mt-3 text-xl font-bold text-white">Page failed to load</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {error.message || "An unexpected error occurred. Your data is safe."}
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-slate-500">ref: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="mt-6 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
