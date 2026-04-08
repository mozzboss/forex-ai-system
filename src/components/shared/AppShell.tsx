"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Sidebar } from "./Sidebar";
import { useAuth } from "./AuthProvider";

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-surface via-surface-light/80 to-surface px-6">
      <div className="max-w-md rounded-3xl border border-white/10 bg-surface-light/90 px-6 py-8 text-center shadow-[0_25px_80px_-50px_rgba(0,0,0,0.7)] backdrop-blur">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-500/80">
          Forex AI
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white">Securing your workspace</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">{message}</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isAuthRoute = pathname.startsWith("/auth");

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user && !isAuthRoute) {
      router.replace("/auth");
      return;
    }

    if (user && isAuthRoute) {
      router.replace("/dashboard");
    }
  }, [isAuthRoute, loading, router, user]);

  if (loading) {
    return <LoadingScreen message="Checking your session before loading accounts, trades, and journal data." />;
  }

  if (!user && !isAuthRoute) {
    return <LoadingScreen message="Redirecting to sign in. Protected routes stay locked until you are authenticated." />;
  }

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {mobileNavOpen ? (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          />
          <Sidebar
            onClose={() => setMobileNavOpen(false)}
            onNavigate={() => setMobileNavOpen(false)}
            className="fixed inset-y-0 left-0 z-50 h-full shadow-2xl lg:hidden"
          />
        </>
      ) : null}

      <main className="relative min-w-0 flex-1 overflow-y-auto bg-surface">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-surface/85 px-4 py-3 backdrop-blur lg:hidden">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-500/80">
              Forex AI
            </div>
            <div className="text-sm font-semibold text-white">Mobile Workspace</div>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 transition-all hover:-translate-y-[1px] hover:bg-white/10 hover:text-white"
          >
            <span
              aria-hidden="true"
              className="block h-3 w-4 bg-[linear-gradient(to_bottom,_currentColor_0,_currentColor_2px,_transparent_2px,_transparent_5px,_currentColor_5px,_currentColor_7px,_transparent_7px,_transparent_10px,_currentColor_10px,_currentColor_12px)]"
            />
            Menu
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
