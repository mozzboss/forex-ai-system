import type { Metadata } from "next";

import { AppShell, AuthProvider } from "@/components/shared";

import "./globals.css";

export const metadata: Metadata = {
  title: "Forex AI - Disciplined Trading System",
  description: "AI-powered trading assistant for disciplined Forex trading",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface text-slate-200 antialiased">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
