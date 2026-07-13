"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { redeemInviteToken } from "@/lib/invites";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.");

export type SetPasswordState = { error?: string } | undefined;

export async function setPassword(
  token: string,
  _prev: SetPasswordState,
  formData: FormData
): Promise<SetPasswordState> {
  const password = formData.get("password");
  const confirm = formData.get("confirmPassword");

  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  const ok = await redeemInviteToken(token, parsed.data);
  if (!ok) {
    return { error: "This invite link has expired or already been used." };
  }

  redirect("/login?welcome=1");
}
