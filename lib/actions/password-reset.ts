"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/lib/db";
import { createInviteToken } from "@/lib/invites";

export type ResetState = { sent?: boolean; error?: string } | undefined;

export async function requestPasswordReset(
  _prev: ResetState,
  formData: FormData
): Promise<ResetState> {
  const parsed = z
    .string()
    .email()
    .safeParse(formData.get("email"));

  if (!parsed.success) return { error: "Enter a valid email address." };

  const user = await db.user.findUnique({
    where: { email: parsed.data.toLowerCase() },
    select: { id: true, status: true },
  });

  // Only active accounts can reset. Never reveal whether the email exists —
  // the response below is identical either way (prevents account enumeration).
  if (user?.status === "active") {
    const token = await createInviteToken(user.id);
    const origin = (await headers()).get("origin") ?? "";
    const link = `${origin}/invite/${token}`;

    // ponytail: no SMTP yet — the link is logged server-side so a moderator can
    // relay it. Swap this line for sendEmail(...) when SMTP credentials land.
    console.log(`[password-reset] ${parsed.data} -> ${link}`);
  }

  return { sent: true };
}
