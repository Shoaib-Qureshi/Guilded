import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// Fresh DB read per request (React-cached within a render pass) — this is what
// makes moderator-initiated deactivation take effect immediately despite JWT sessions.
export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, role: true, status: true },
  });
  if (!user || user.status !== "active") return null;
  return user;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireModerator() {
  const user = await requireUser();
  // Members land on /dashboard after login; bounce them to their own home.
  if (user.role !== "moderator" && user.role !== "admin") redirect("/discussions");
  return user;
}
