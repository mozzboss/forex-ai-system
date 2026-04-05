"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type HTMLAttributes } from "react";

import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" },
  { href: "/pairs", label: "Pairs", icon: "M3 3v18h18M7 16l4-4 4 4 5-5" },
  { href: "/trades", label: "Trades", icon: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" },
  { href: "/mt-import", label: "MT Import", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" },
  { href: "/performance", label: "Performance", icon: "M4 18h16M6 15l3-3 3 2 5-6 1 1" },
  { href: "/review", label: "EOD Review", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { href: "/journal", label: "Journal", icon: "M4 19V5a2 2 0 012-2h8a2 2 0 012 2v14l-6-3-6 3z" },
  { href: "/settings", label: "Settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33" },
];

interface SidebarProps extends HTMLAttributes<HTMLElement> {
  onNavigate?: () => void;
  onClose?: () => void;
}

export function Sidebar({ className, onNavigate, onClose, ...props }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className={cn("flex w-72 shrink-0 flex-col border-r border-white/5 bg-surface-light", className)} {...props}>
      <div className="border-b border-white/5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              <span className="text-brand-500">Forex</span> AI
            </h1>
            <p className="mt-0.5 text-xs text-gray-500">Discipline | Risk | Clarity</p>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-gray-300 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            >
              Close
            </button>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={icon} />
              </svg>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-4">
        <div className="rounded-2xl border border-white/10 bg-surface p-4">
          <div className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Signed In</div>
          <div className="mt-2 text-sm font-medium text-white">{user?.email || "Authenticated trader"}</div>
          <div className="mt-1 text-[11px] text-gray-500">
            Your accounts, trades, and journal now stay scoped to this login.
          </div>
          <button
            type="button"
            onClick={async () => {
              onNavigate?.();
              await signOut();
            }}
            className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
