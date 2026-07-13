"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireModerator } from "@/lib/dal";
import { db } from "@/lib/db";
import { createInviteToken } from "@/lib/invites";

import { approveMockSessionRequest } from "./store";

// Every action re-checks the caller — a gated UI does not stop a direct POST.

// Vetting gates per docs/moderator-flow.md §3:
// submitted --accept--> interview_scheduled --accept--> accepted; reject at either gate -> rejected.
// ponytail: emails are TODO until SMTP exists — gate-2 acceptance mints an invite
// link the moderator copies from the applicant page instead.
export async function decideApplicant(
  id: string,
  decision: "accept" | "reject",
  redirectTo?: string
) {
  const moderator = await requireModerator();

  const application = await db.application.findUnique({ where: { id } });
  if (!application) return;

  const nextStatus =
    decision === "reject"
      ? "rejected"
      : application.status === "submitted"
        ? "interview_scheduled"
        : "accepted";

  await db.$transaction([
    db.application.update({
      where: { id },
      data: {
        status: nextStatus,
        reviewedById: moderator.id,
        reviewedAt: new Date(),
      },
    }),
    db.user.update({
      where: { id: application.userId },
      data:
        nextStatus === "accepted"
          ? { status: "active", role: "member" }
          : { status: nextStatus },
    }),
  ]);

  // Accepted members have no password yet — mint the invite that lets them set one.
  if (nextStatus === "accepted") {
    await createInviteToken(application.userId);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/applicants/${id}`);
  if (redirectTo) redirect(redirectTo);
}

export async function decideReview(id: string, decision: "approve" | "reject") {
  const moderator = await requireModerator();

  await db.clientReview.update({
    where: { id },
    data: {
      status: decision === "approve" ? "approved" : "rejected",
      reviewedById: moderator.id,
      reviewedAt: new Date(),
    },
  });
  revalidatePath("/dashboard");
}

// Session requests are Phase 2 (docs/figma-screen-map.md) — mock-backed until then.
export async function approveSessionRequest(id: string) {
  await requireModerator();
  approveMockSessionRequest(id);
  revalidatePath("/dashboard");
}

// Moderators may deactivate members only — not each other (docs/roles-and-permissions.md).
export async function setMemberActive(userId: string, active: boolean) {
  const moderator = await requireModerator();

  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target || target.id === moderator.id) return;
  if (target.role !== "member") return;

  await db.user.update({
    where: { id: userId },
    data: { status: active ? "active" : "deactivated" },
  });
  revalidatePath("/members");
}

export async function cancelEvent(id: string) {
  await requireModerator();
  await db.event.update({ where: { id }, data: { status: "cancelled" } });
  revalidatePath("/events");
  revalidatePath("/dashboard");
}

export async function createEvent(formData: FormData) {
  const moderator = await requireModerator();

  const parsed = z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      hostName: z.string().min(1),
      category: z.string().optional(),
      scheduledAt: z.coerce.date(),
      durationMinutes: z.coerce.number().int().positive(),
      seatLimit: z.coerce.number().int().positive().optional(),
    })
    .safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      hostName: formData.get("hostName"),
      category: formData.get("category") || undefined,
      scheduledAt: formData.get("scheduledAt"),
      durationMinutes: formData.get("durationMinutes"),
      seatLimit: formData.get("seatLimit") || undefined,
    });

  if (!parsed.success) {
    console.error("createEvent validation failed:", parsed.error.issues);
    return;
  }

  await db.event.create({
    data: { ...parsed.data, createdById: moderator.id },
  });
  revalidatePath("/events");
  revalidatePath("/dashboard");
}
