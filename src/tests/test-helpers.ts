import type { NextRequest } from "next/server";

export function createJsonRequest(
  url: string,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
  } = {}
): NextRequest {
  const headers = new Headers(options.headers);

  if (options.body !== undefined && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  return new Request(url, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  }) as NextRequest;
}

export function restoreDeps<T extends Record<string, unknown>>(target: T, snapshot: T) {
  for (const key of Object.keys(target)) {
    delete target[key as keyof T];
  }

  Object.assign(target, snapshot);
}
