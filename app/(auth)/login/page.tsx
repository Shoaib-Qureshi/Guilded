"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { GuildedLogo } from "@/components/shared/GuildedLogo";
import { login } from "@/lib/actions/auth";

const inputClass =
  "h-10 w-full rounded-lg bg-portal-cream/4 pl-10 pr-3 text-sm text-portal-cream placeholder:text-portal-muted outline-none ring-1 ring-portal-cream/10 focus-visible:ring-portal-gold/50";
const labelClass =
  "mb-2 block text-[10px] tracking-[0.12em] uppercase text-portal-muted";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-portal-bg font-sans text-portal-cream">
      <header className="px-16 py-4">
        <GuildedLogo />
      </header>

      <div className="flex items-start justify-center px-4 pt-12">
        <div className="w-full max-w-[400px] rounded-xl bg-portal-card px-9 py-10 ring-1 ring-portal-cream/8">
          <div className="mb-8">
            <h1 className="font-serif text-2xl text-portal-cream">
              Welcome back
            </h1>
            <p className="mt-1.5 text-[13px] text-portal-muted">
              Sign in to your Guilded account
            </p>
          </div>

          <form action={action} className="flex flex-col">
            <div className="mb-4">
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-portal-muted" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={inputClass}
                  placeholder="you@youragency.com"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-portal-muted" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={inputClass}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-portal-muted transition-colors hover:text-portal-cream"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              {/* ponytail: cosmetic — NextAuth sessions are a fixed 30d. Wire this to a
                  per-login cookie maxAge if short-lived sessions are ever actually wanted. */}
              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-portal-cream">
                <input
                  type="checkbox"
                  name="rememberMe"
                  defaultChecked
                  className="size-3.5 cursor-pointer rounded-sm accent-portal-gold"
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-[13px] text-portal-gold hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {state?.error && (
              <p
                role="alert"
                className="mb-4 rounded-lg bg-portal-red/12 px-3 py-2 text-[13px] text-portal-red"
              >
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="h-10 cursor-pointer rounded-lg bg-portal-gold text-[13px] font-semibold tracking-[0.08em] uppercase text-portal-ongold transition-colors hover:bg-portal-gold/85 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-portal-cream/10" />
            <span className="text-[11px] text-portal-muted">OR</span>
            <span className="h-px flex-1 bg-portal-cream/10" />
          </div>

          {/* ponytail: needs GOOGLE_CLIENT_ID/SECRET — add the provider in lib/auth.ts and drop `disabled`. */}
          <button
            type="button"
            disabled
            title="Google sign-in isn't configured yet"
            className="flex h-10 w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-lg text-[13px] text-portal-muted opacity-60 ring-1 ring-portal-cream/10"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-[13px] text-portal-muted">
            Not a member?{" "}
            <Link href="/onboarding" className="text-portal-gold hover:underline">
              Apply for access
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51Z"
      />
    </svg>
  );
}
