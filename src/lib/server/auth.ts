import { type AuthUser } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

import { createSupabaseTokenClient } from "@/lib/supabase/client";
import { ensureAuthenticatedUserSetup, ensureDefaultUserSetup } from "./default-user";

export class AuthenticationError extends Error {
  status = 401;

  constructor(message = "Authentication required.") {
    super(message);
    this.name = "AuthenticationError";
  }
}

function getBearerToken(req: NextRequest) {
  const authorization = req.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

export async function requireSupabaseUser(req: NextRequest): Promise<AuthUser> {
  const accessToken = getBearerToken(req);

  if (!accessToken) {
    throw new AuthenticationError();
  }

  const supabase = createSupabaseTokenClient(accessToken);
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    throw new AuthenticationError("Your session is no longer valid. Please sign in again.");
  }

  return data.user;
}

export async function requireAppUserId(req: NextRequest): Promise<string> {
  const accessToken = getBearerToken(req);

  // Single-user fallback: if no bearer token is present, operate as the seeded default user.
  if (!accessToken) {
    return ensureDefaultUserSetup();
  }

  const user = await requireSupabaseUser(req);
  return ensureAuthenticatedUserSetup(user);
}
