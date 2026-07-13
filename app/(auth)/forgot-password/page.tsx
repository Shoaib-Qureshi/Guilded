"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Mail } from "lucide-react";

import { GuildedLogo } from "@/components/shared/GuildedLogo";
import { requestPasswordReset } from "@/lib/actions/password-reset";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);

  return (
    <main className="min-h-screen bg-portal-bg font-sans text-portal-cream">
      <header className="px-16 py-4">
        <GuildedLogo />
      </header>

      <div className="flex items-start justify-center px-4 pt-12">
        <div className="w-full max-w-[400px] rounded-xl bg-portal-card px-9 py-10 ring-1 ring-portal-cream/8">
          {state?.sent ? (
            <>
              <h1 className="font-serif text-2xl">Check your email</h1>
              <p className="mt-2 text-[13px] leading-relaxed text-portal-muted">
                If an account exists for that address, we&apos;ve sent a link to
                reset your password. The link expires in 7 days.
              </p>
              <Link
                href="/login"
                className="mt-6 flex h-10 items-center justify-center rounded-lg text-[13px] text-portal-cream ring-1 ring-portal-cream/15 transition-colors hover:bg-portal-cream/8"
              >
                Back to sign in
              </Link>
            </>
          ) : (
            <>
              <h1 className="font-serif text-2xl">Reset your password</h1>
              <p className="mt-1.5 mb-8 text-[13px] text-portal-muted">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form action={action}>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[10px] tracking-[0.12em] uppercase text-portal-muted"
                >
                  Email address
                </label>
                <div className="relative mb-6">
                  <Mail className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-portal-muted" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@youragency.com"
                    className="h-10 w-full rounded-lg bg-portal-cream/4 pl-10 pr-3 text-sm text-portal-cream placeholder:text-portal-muted outline-none ring-1 ring-portal-cream/10 focus-visible:ring-portal-gold/50"
                  />
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
                  className="h-10 w-full cursor-pointer rounded-lg bg-portal-gold text-[13px] font-semibold tracking-[0.08em] uppercase text-portal-ongold transition-colors hover:bg-portal-gold/85 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending ? "Sending…" : "Send reset link"}
                </button>
              </form>

              <p className="mt-6 text-center text-[13px] text-portal-muted">
                Remembered it?{" "}
                <Link href="/login" className="text-portal-gold hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
