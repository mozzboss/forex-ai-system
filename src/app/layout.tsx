import type { Metadata, Viewport } from "next";

import { AppShell, AuthProvider, TimezoneProvider } from "@/components/shared";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Forex MB",
    template: "%s | Forex MB",
  },
  description: "AI-powered trading assistant for disciplined Forex trading",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface text-slate-200 antialiased">
        <TimezoneProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </TimezoneProvider>
      </body>
    </html>
  );
}
