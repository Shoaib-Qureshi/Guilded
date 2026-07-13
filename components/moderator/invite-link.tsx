"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function InviteLink({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  // Built client-side so it carries whatever host the moderator is actually on.
  const url =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/invite/${token}`;

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl bg-portal-gold/8 px-5 py-4 ring-1 ring-portal-gold/25">
      <p className="mb-1 text-[10px] tracking-[0.08em] uppercase text-portal-gold">
        Invite link — send this to the applicant
      </p>
      <p className="mb-3 text-xs text-portal-muted">
        They set a password with it and can then sign in. Expires in 7 days.
      </p>
      <div className="flex items-center gap-2">
        <code className="flex-1 truncate rounded-lg bg-portal-bg/60 px-3 py-2 text-xs text-portal-cream">
          {url || `/invite/${token}`}
        </code>
        <button
          type="button"
          onClick={copy}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-portal-gold px-4 py-2 text-[13px] font-medium text-portal-ongold transition-colors hover:bg-portal-gold/85"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
