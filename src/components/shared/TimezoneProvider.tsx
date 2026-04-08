"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AppTimezone = "UTC" | "EDT";

const STORAGE_KEY = "forex-mb-timezone";

interface TimezoneContextValue {
  timezone: AppTimezone;
  toggle: () => void;
}

const TimezoneContext = createContext<TimezoneContextValue>({
  timezone: "UTC",
  toggle: () => {},
});

export function TimezoneProvider({ children }: { children: ReactNode }) {
  const [timezone, setTimezone] = useState<AppTimezone>("UTC");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "EDT" || stored === "UTC") {
      setTimezone(stored);
    }
  }, []);

  function toggle() {
    setTimezone((prev) => {
      const next: AppTimezone = prev === "UTC" ? "EDT" : "UTC";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  return (
    <TimezoneContext.Provider value={{ timezone, toggle }}>
      {children}
    </TimezoneContext.Provider>
  );
}

export function useTimezone() {
  return useContext(TimezoneContext);
}
