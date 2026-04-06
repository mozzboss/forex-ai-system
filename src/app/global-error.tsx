"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0f1e] text-slate-200 antialiased">
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-red-400/80">
              Critical Error
            </div>
            <h1 className="mt-3 text-xl font-bold text-white">Application failed</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {error.message || "A critical error occurred. Please reload."}
            </p>
            {error.digest && (
              <p className="mt-2 font-mono text-xs text-slate-500">ref: {error.digest}</p>
            )}
            <button
              onClick={reset}
              className="mt-6 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
            >
              Reload app
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
