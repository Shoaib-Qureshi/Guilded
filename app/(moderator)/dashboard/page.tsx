import Link from "next/link";
import {
  CalendarCheck,
  Clock,
  Mic2,
  Pencil,
  Ticket,
  Triangle,
  Users,
} from "lucide-react";

import { goldButton, outlineButton } from "@/components/moderator/ui";
import {
  approveSessionRequest,
  decideApplicant,
  decideReview,
} from "@/lib/moderator/actions";
import {
  avatarColor,
  getDashboardStats,
  getPendingApplications,
  getPendingReviews,
  getUpcomingEvents,
  reviewCriteriaBars,
  timeAgo,
  type ReviewRating,
} from "@/lib/moderator/queries";
import { readSessionRequests } from "@/lib/moderator/store";
import { cn } from "@/lib/utils";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

function Section({
  title,
  badge,
  action,
  children,
}: {
  title: string;
  badge?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl bg-portal-cream/4">
      <div className="flex items-center justify-between border-b border-portal-cream/8 px-6 py-5">
        <h2 className="text-[15px] font-semibold text-portal-cream">{title}</h2>
        <div className="flex items-center gap-4">
          {badge && <span className="text-xs text-portal-gold">{badge}</span>}
          {action ?? (
            <button className="cursor-pointer rounded-full px-4 py-1.5 text-[13px] text-portal-cream ring-1 ring-[rgba(245,240,230,0.36)] transition-colors hover:bg-portal-cream/8">
              View All
            </button>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function CriteriaBar({ label, value }: { label: string; value: number }) {
  const tone =
    value >= 0.7
      ? "bg-portal-green"
      : value >= 0.4
        ? "bg-portal-gold"
        : "bg-portal-red";
  return (
    <div>
      <p className="mb-1.5 text-[10px] tracking-[0.06em] uppercase text-portal-muted">
        {label}
      </p>
      <div className="h-[3px] w-full rounded-[2px] bg-portal-cream/10">
        <div
          className={cn("h-full rounded-[2px]", tone)}
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}

export default async function ModeratorDashboardPage() {
  const [applications, reviews, events, counts] = await Promise.all([
    getPendingApplications(),
    getPendingReviews(),
    getUpcomingEvents(),
    getDashboardStats(),
  ]);
  const sessionRequests = readSessionRequests().filter(
    (r) => r.status === "pending"
  );

  // All real DB counts. The Figma's "New Messages" tile has no backing table yet
  // (messaging isn't modeled) — showing upcoming events instead of a fake number.
  const stats = [
    {
      icon: Users,
      value: String(counts.activeMembers),
      label: "Active Members",
    },
    {
      icon: CalendarCheck,
      value: String(
        counts.pendingApplications +
          counts.pendingReviews +
          sessionRequests.length
      ),
      label: "Pending Tasks",
    },
    {
      icon: Ticket,
      value: String(counts.upcomingEvents),
      label: "Upcoming Events",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-5">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-xl bg-portal-card px-6 py-7 ring-1 ring-portal-cream/8"
          >
            <Icon className="size-7 text-portal-cream" strokeWidth={1.5} />
            <div>
              <p className="text-[22px] font-bold leading-tight text-portal-gold">
                {value}
              </p>
              <p className="text-[13px] text-portal-cream/80">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <Section
        title="New Member Requests"
        badge={`${applications.length} pending`}
      >
        <div className="grid grid-cols-2 gap-5">
          {applications.map((application) => (
            <div
              key={application.id}
              className="rounded-xl bg-portal-card p-5 ring-1 ring-portal-cream/8"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full text-sm font-bold text-portal-bright",
                      avatarColor(application.user.name) === "green"
                        ? "bg-portal-green"
                        : "bg-portal-red"
                    )}
                  >
                    {initials(application.user.name)}
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-portal-cream">
                      {application.user.name}
                    </p>
                    <p className="text-xs text-portal-muted">
                      {application.agencyName}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-[rgba(57,72,23,0.62)] px-3 py-1 text-[11px] text-[#b5c98a]">
                  {application.industry}
                </span>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4 border-y border-portal-cream/8 py-3">
                <div>
                  <p className="text-[10px] tracking-[0.08em] uppercase text-portal-muted">
                    Revenue
                  </p>
                  <p className="text-sm font-semibold text-portal-cream">
                    {application.monthlyRevenue}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.08em] uppercase text-portal-muted">
                    Team Size
                  </p>
                  <p className="text-sm font-semibold text-portal-cream">
                    {application.agencySize}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <form
                  action={decideApplicant.bind(null, application.id, "reject", undefined)}
                >
                  <button className={cn(outlineButton, "w-full")}>Reject</button>
                </form>
                <Link
                  href={`/applicants/${application.id}`}
                  className={cn(goldButton, "text-center")}
                >
                  View full application
                </Link>
              </div>
            </div>
          ))}
          {applications.length === 0 && (
            <p className="col-span-2 py-4 text-center text-sm text-portal-muted">
              No pending member requests.
            </p>
          )}
        </div>
      </Section>

      <Section
        title="Client Experiences - Pending reviews"
        badge={`${reviews.length} new`}
      >
        <div className="grid grid-cols-2 gap-5">
          {reviews.map((review) => {
            const rating = review.rating as ReviewRating;
            return (
              <div
                key={review.id}
                className="rounded-xl bg-portal-card p-5 ring-1 ring-portal-cream/8"
              >
                <div className="mb-1 flex items-start justify-between gap-3">
                  <p className="text-[17px] font-semibold text-portal-cream">
                    {review.clientCompany}
                  </p>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] ring-1",
                      rating.would_work_again
                        ? "text-portal-green ring-portal-green/40"
                        : "text-portal-gold ring-portal-gold/40"
                    )}
                  >
                    {rating.would_work_again
                      ? "Would work again"
                      : "Depends on the brief"}
                  </span>
                </div>
                <p className="mb-4 text-xs text-portal-faint">
                  Submitted by {review.submittedBy.name}
                  {review.isAnonymous && " · Anonymous"}
                </p>
                <div className="mb-4 grid grid-cols-3 gap-x-4 gap-y-3">
                  {reviewCriteriaBars(rating).map((criterion) => (
                    <CriteriaBar key={criterion.label} {...criterion} />
                  ))}
                </div>
                <p className="mb-5 border-l-2 border-portal-gold pl-3 text-[13px] text-portal-cream/85">
                  {review.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-portal-faint">
                    {timeAgo(review.createdAt)}
                  </span>
                  <div className="flex gap-2.5">
                    <button className={outlineButton}>View review</button>
                    <form action={decideReview.bind(null, review.id, "approve")}>
                      <button className={goldButton}>Approve</button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
          {reviews.length === 0 && (
            <p className="col-span-2 py-4 text-center text-sm text-portal-muted">
              No reviews waiting.
            </p>
          )}
        </div>
      </Section>

      <Section
        title="Session requests - Pending reviews"
        badge={`${sessionRequests.length} new`}
      >
        <div className="grid grid-cols-2 gap-5">
          {sessionRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl bg-portal-card p-5 ring-1 ring-portal-cream/8"
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[10px] font-semibold tracking-[0.06em] uppercase",
                    request.kind === "topic"
                      ? "bg-[#7ab8ef]/15 text-[#7ab8ef]"
                      : "bg-portal-gold/15 text-portal-gold"
                  )}
                >
                  {request.kind === "topic" ? "Topic Request" : "Host Request"}
                </span>
                {request.upvotes && (
                  <span className="flex items-center gap-1 rounded-md bg-portal-gold/15 px-2 py-1 text-xs font-semibold text-portal-gold">
                    <Triangle className="size-2.5 fill-current" />
                    {request.upvotes}
                  </span>
                )}
              </div>
              <p className="mb-2 text-[15px] font-semibold text-portal-cream">
                {request.title}
              </p>
              <p className="mb-4 text-[13px] leading-relaxed text-portal-muted">
                {request.description}
              </p>
              <div className="mb-4 flex items-center gap-4 text-xs text-portal-muted">
                <span className="flex items-center gap-1.5">
                  <Mic2 className="size-3.5" />
                  {request.requester}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {request.meta}
                </span>
              </div>
              <div className="flex gap-2.5">
                <button className={outlineButton}>View review</button>
                <form action={approveSessionRequest.bind(null, request.id)}>
                  <button className={goldButton}>
                    {request.kind === "topic"
                      ? "Approve & Find Host"
                      : "Approve & Schedule"}
                  </button>
                </form>
              </div>
            </div>
          ))}
          {sessionRequests.length === 0 && (
            <p className="col-span-2 py-4 text-center text-sm text-portal-muted">
              No session requests waiting.
            </p>
          )}
        </div>
      </Section>

      <Section
        title="Event Schedule"
        action={
          <Link href="/events" className={goldButton}>
            Create new event
          </Link>
        }
      >
        <div className="flex flex-col">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={cn(
                "flex items-center gap-6 py-4",
                index > 0 && "border-t border-portal-cream/8"
              )}
            >
              <div className="w-24 shrink-0">
                <p className="text-sm font-bold text-portal-cream">
                  {MONTHS[event.scheduledAt.getMonth()]}{" "}
                  {event.scheduledAt.getDate()}
                </p>
                <p className="text-[11px] tracking-[0.08em] text-portal-muted">
                  {WEEKDAYS[event.scheduledAt.getDay()]}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-portal-cream">
                  {event.title}
                </p>
                <p className="mb-1.5 text-xs text-portal-muted">
                  {event.description}
                </p>
                {event.category && (
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[10px]",
                      event.category === "Guild Meeting"
                        ? "bg-portal-gold/12 text-portal-gold"
                        : "bg-[rgba(57,72,23,0.32)] text-[#8fae5a]"
                    )}
                  >
                    {event.category}
                  </span>
                )}
              </div>
              <div className="flex w-40 items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-full bg-portal-gold/20 text-[10px] font-semibold text-portal-gold">
                  {initials(event.hostName)}
                </span>
                <span className="text-[13px] text-portal-cream">
                  {event.hostName}
                </span>
              </div>
              <Link
                href="/events"
                className={cn(outlineButton, "flex items-center gap-2")}
              >
                <Pencil className="size-3.5" />
                Manage
              </Link>
            </div>
          ))}
          {events.length === 0 && (
            <p className="py-4 text-center text-sm text-portal-muted">
              No upcoming events.
            </p>
          )}
        </div>
      </Section>
    </div>
  );
}
