import "server-only";

import { randomBytes } from "node:crypto";

import { db } from "@/lib/db";

// Reuses NextAuth's VerificationToken table (identifier = userId) — no new table needed.
const INVITE_TTL_DAYS = 7;

export async function createInviteToken(userId: string) {
  const token = randomBytes(32).toString("hex");

  // One live invite per user — drop any previous, unused one.
  await db.verificationToken.deleteMany({ where: { identifier: userId } });
  await db.verificationToken.create({
    data: {
      identifier: userId,
      token,
      expires: new Date(Date.now() + INVITE_TTL_DAYS * 86_400_000),
    },
  });

  return token;
}

export async function getInviteToken(userId: string) {
  const invite = await db.verificationToken.findFirst({
    where: { identifier: userId, expires: { gt: new Date() } },
  });
  return invite?.token ?? null;
}

/** Returns the userId if the token is valid and unexpired, else null. */
export async function verifyInviteToken(token: string) {
  const invite = await db.verificationToken.findUnique({ where: { token } });
  if (!invite || invite.expires < new Date()) return null;
  return invite.identifier;
}

/** Sets the user's password and burns the token. */
export async function redeemInviteToken(token: string, password: string) {
  const bcrypt = await import("bcryptjs");

  const userId = await verifyInviteToken(token);
  if (!userId) return false;

  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { passwordHash: await bcrypt.hash(password, 10) },
    }),
    db.verificationToken.delete({ where: { token } }),
  ]);
  return true;
}
