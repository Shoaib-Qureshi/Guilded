"use client";

import { useActionState } from "react";

import { setPassword, type SetPasswordState } from "@/lib/actions/invite";

const inputClass =
  "h-11 rounded-lg bg-portal-cream/4 px-3.5 text-sm text-portal-cream placeholder:text-portal-muted outline-none ring-1 ring-portal-cream/10 focus-visible:ring-portal-gold/50";

export function SetPasswordForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const action = setPassword.bind(null, token);
  const [state, formAction, pending] = useActionState<SetPasswordState, FormData>(
    action,
    undefined
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl bg-portal-card p-6 ring-1 ring-portal-cream/8"
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] text-portal-muted">Email</label>
        <p className="text-sm text-portal-cream">{email}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-[13px] text-portal-cream">
          Choose a password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={inputClass}
          placeholder="At least 8 characters"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmPassword"
          className="text-[13px] text-portal-cream"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={inputClass}
          placeholder="Re-enter password"
        />
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-lg bg-portal-red/12 px-3 py-2 text-[13px] text-portal-red"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 h-11 cursor-pointer rounded-lg bg-portal-gold text-sm font-medium text-portal-ongold transition-colors hover:bg-portal-gold/85 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Activating…" : "Activate account"}
      </button>
    </form>
  );
}
