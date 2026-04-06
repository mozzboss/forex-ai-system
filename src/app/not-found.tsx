import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md rounded-2xl border border-white/10 bg-surface-light p-8 text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300/80">
          404
        </div>
        <h1 className="mt-3 text-xl font-bold text-white">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          This page does not exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
