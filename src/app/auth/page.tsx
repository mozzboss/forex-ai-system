"use client";

import { useState } from "react";

import { Button, Card, CardHeader } from "@/components/ui";
import { useAuth } from "@/hooks";

type AuthMode = "signin" | "signup";

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "signin") {
        const result = await signIn({ email, password });

        if (result.error) {
          setError(result.error);
          return;
        }

        setMessage("Signed in successfully. Loading your workspace...");
        return;
      }

      const result = await signUp({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      setMessage(
        result.requiresEmailConfirmation
          ? "Account created. Check your email to confirm the account before signing in."
          : "Account created and signed in. Loading your workspace..."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.1),_transparent_24%),linear-gradient(160deg,_rgba(15,23,42,1),_rgba(2,6,23,1))] px-6 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-slate-950/35 p-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300/80">
              Forex MB
            </div>
            <h1 className="mt-4 max-w-xl text-4xl font-bold tracking-tight text-white">
              Discipline first. Execution second. Capital protection always.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Sign in to access your accounts, journal, and trade history. Every workflow inside the app
              still enforces WAIT, READY, CONFIRMED, and INVALID without shortcuts.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <InfoTile title="Protected Accounts" detail="Every account, trade, and journal entry now belongs to a real authenticated user." />
            <InfoTile title="Safer Execution" detail="Trade recording still requires CONFIRMED status, stop loss, and valid funded or personal risk rules." />
            <InfoTile
              title="No Impulse Mode"
              detail={'The system stays conservative even after sign-in. "No trade" remains a valid result.'}
            />
          </div>
        </div>

        <Card className="self-center border-white/10 bg-surface-light/95">
          <div className="mb-6 flex gap-2 rounded-full border border-white/5 bg-surface p-1">
            <AuthModeButton
              label="Sign In"
              active={mode === "signin"}
              onClick={() => setMode("signin")}
            />
            <AuthModeButton
              label="Sign Up"
              active={mode === "signup"}
              onClick={() => setMode("signup")}
            />
          </div>

          <CardHeader>{mode === "signin" ? "Welcome back" : "Create your workspace"}</CardHeader>
          <p className="mt-2 text-sm text-slate-400">
            {mode === "signin"
              ? "Use your Supabase account credentials to unlock your personal trading workspace."
              : "Create an account first, then add your funded and personal trading accounts in Settings."}
          </p>

          <div className="mt-6 space-y-4">
            {mode === "signup" ? (
              <Field
                label="Name"
                value={name}
                onChange={setName}
                placeholder="Disciplined Trader"
                onEnter={submit}
              />
            ) : null}

            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              onEnter={submit}
            />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Minimum 6 characters"
              onEnter={submit}
            />
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
              {message}
            </div>
          ) : null}

          <div className="mt-6 flex gap-2">
            <Button onClick={submit} disabled={loading || !email || !password || (mode === "signup" && !name.trim())}>
              {loading
                ? mode === "signin"
                  ? "Signing In..."
                  : "Creating Account..."
                : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setMessage(null);
              }}
              disabled={loading}
            >
              {mode === "signin" ? "Need an account?" : "Already have an account?"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AuthModeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-brand-600 text-white"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  onEnter,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  onEnter?: () => void;
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && onEnter) onEnter();
        }}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
      />
    </label>
  );
}

function InfoTile({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-300">{detail}</p>
    </div>
  );
}
