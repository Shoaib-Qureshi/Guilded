import "server-only";

import { db } from "@/lib/db";

export type FitScores = { profile: number; niche: number; activity: number };

// Fixed rubric keys — docs/rules-and-regulations.md §3 (scores 1–5, plus one boolean).
export type ReviewRating = {
  payment_behaviour: number;
  communication_quality: number;
  scope_clarity: number;
  scope_creep: number;
  decision_making_speed: number;
  ease_of_working: number;
  professionalism: number;
  would_work_again: boolean;
};

export function avatarColor(name: string): "green" | "red" {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return hash % 2 === 0 ? "green" : "red";
}

export function timeAgo(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
}

export async function getDashboardStats() {
  const [activeMembers, pendingApplications, pendingReviews, upcomingEvents] =
    await Promise.all([
      db.user.count({ where: { role: "member", status: "active" } }),
      db.application.count({
        where: { status: { in: ["submitted", "interview_scheduled"] } },
      }),
      db.clientReview.count({ where: { status: "pending" } }),
      db.event.count({ where: { status: "upcoming" } }),
    ]);
  return { activeMembers, pendingApplications, pendingReviews, upcomingEvents };
}

/** Every account, newest first — the Members screen. */
export async function getMembers() {
  return db.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      applications: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { agencyName: true, industry: true, location: true },
      },
    },
  });
}

export async function getAllEvents() {
  return db.event.findMany({
    orderBy: { scheduledAt: "asc" },
    include: { _count: { select: { rsvps: true } } },
  });
}

export async function getPendingApplications() {
  return db.application.findMany({
    where: { status: { in: ["submitted", "interview_scheduled"] } },
    include: { user: { select: { name: true, email: true, linkedinUrl: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getApplication(id: string) {
  return db.application.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true, linkedinUrl: true } } },
  });
}

export async function getPendingReviews() {
  return db.clientReview.findMany({
    where: { status: "pending" },
    include: { submittedBy: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUpcomingEvents() {
  return db.event.findMany({
    where: { status: "upcoming" },
    orderBy: { scheduledAt: "asc" },
    take: 5,
  });
}

// The 6 dashboard bars, derived from the stored 8-dimension rating (0–1 values).
export function reviewCriteriaBars(rating: ReviewRating) {
  const dims = [
    { label: "Payment", value: rating.payment_behaviour },
    { label: "Communication", value: rating.communication_quality },
    { label: "Scope Clarity", value: rating.scope_clarity },
    { label: "Decision Speed", value: rating.decision_making_speed },
    { label: "Boundaries", value: rating.professionalism },
  ];
  const overall =
    (dims.reduce((sum, d) => sum + d.value, 0) +
      rating.scope_creep +
      rating.ease_of_working) /
    7;
  return [...dims, { label: "Overall", value: overall }].map((d) => ({
    label: d.label,
    value: d.value / 5,
  }));
}
