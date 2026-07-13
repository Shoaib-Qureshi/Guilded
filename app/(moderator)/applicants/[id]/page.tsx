import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { InviteLink } from "@/components/moderator/invite-link";
import { getInviteToken } from "@/lib/invites";
import { decideApplicant } from "@/lib/moderator/actions";
import {
  avatarColor,
  getApplication,
  type FitScores,
} from "@/lib/moderator/queries";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-portal-cream/4 px-5 py-4 ring-1 ring-portal-cream/8">
      <p className="mb-1 text-[10px] tracking-[0.08em] uppercase text-portal-muted">
        {label}
      </p>
      <p className="text-[15px] font-semibold text-portal-cream">{value}</p>
    </div>
  );
}

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await getApplication(id);
  if (!application) notFound();

  const isAccepted = application.status === "accepted";
  const inviteToken = isAccepted
    ? await getInviteToken(application.userId)
    : null;

  const name = application.user.name;
  const appliedDate = application.createdAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const fit = application.fitScores as FitScores | null;
  const fits = fit
    ? [
        { label: "Profile Fit", value: fit.profile },
        { label: "Niche Fit", value: fit.niche },
        { label: "Activity Fit", value: fit.activity },
      ]
    : [];
  const services = application.primaryServices
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 border-b border-portal-cream/8 pb-5">
        <Link
          href="/dashboard"
          aria-label="Back to dashboard"
          className="flex size-11 items-center justify-center rounded-xl bg-portal-gold/12 text-portal-gold ring-1 ring-portal-gold/25 transition-colors hover:bg-portal-gold/20"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="font-sans text-xl font-semibold text-portal-cream">
            {name}
          </h1>
          <p className="text-[13px] text-portal-muted">
            {application.agencyName}
            {application.location && ` · ${application.location}`} · Applied{" "}
            {appliedDate}
          </p>
        </div>
      </div>

      <div className="flex items-start justify-between rounded-2xl bg-portal-cream/4 p-7 ring-1 ring-portal-cream/8">
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "flex size-14 items-center justify-center rounded-full text-lg font-bold text-portal-bright",
              avatarColor(name) === "green" ? "bg-portal-green" : "bg-portal-red"
            )}
          >
            {initials(name)}
          </span>
          <div>
            <p className="text-lg font-bold text-portal-cream">{name}</p>
            <p className="mb-2 text-sm text-portal-muted">
              {application.agencyName}
            </p>
            <span className="rounded-full bg-[rgba(57,72,23,0.62)] px-3 py-1 text-[11px] text-[#b5c98a]">
              {application.industry}
            </span>
          </div>
        </div>
        {fits.length > 0 && (
          <div className="flex flex-col items-end gap-1.5">
            {fits.map((f) => (
              <div key={f.label} className="text-right">
                <p className="text-[9px] tracking-[0.1em] uppercase text-portal-muted">
                  {f.label}
                </p>
                <p className="text-base font-bold text-portal-gold">
                  {f.value}%
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InfoCard label="Revenue" value={application.monthlyRevenue} />
        <InfoCard label="Team Size" value={application.agencySize} />
        <InfoCard label="Years in Operation" value={application.yearsInOperation} />
        <InfoCard label="Applied" value={appliedDate} />
      </div>

      <div>
        <p className="mb-3 text-[10px] tracking-[0.08em] uppercase text-portal-muted">
          Primary Services
        </p>
        <div className="flex flex-wrap gap-3">
          {services.map((service) => (
            <span
              key={service}
              className="rounded-lg bg-[rgba(57,72,23,0.62)] px-4 py-2 text-[13px] font-medium text-[#b5c98a]"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-portal-cream/4 px-5 py-5 ring-1 ring-portal-cream/8">
        <div>
          <p className="mb-1 text-[10px] tracking-[0.08em] uppercase text-portal-muted">
            Why do they want to join?
          </p>
          <p className="text-sm text-portal-cream/90">{application.motivation}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] tracking-[0.08em] uppercase text-portal-muted">
            Biggest challenge right now
          </p>
          <p className="text-sm text-portal-cream/90">
            {application.currentChallenge}
          </p>
        </div>
      </div>

      {isAccepted && inviteToken && <InviteLink token={inviteToken} />}

      {application.status === "rejected" && (
        <p className="rounded-xl bg-portal-red/10 px-5 py-4 text-sm text-portal-red ring-1 ring-portal-red/20">
          This application was rejected.
        </p>
      )}

      {(application.status === "submitted" ||
        application.status === "interview_scheduled") && (
        <div className="flex justify-end gap-3">
          <form
            action={decideApplicant.bind(null, application.id, "reject", "/dashboard")}
          >
            <button className="cursor-pointer rounded-lg bg-portal-red/12 px-6 py-2.5 text-sm font-medium text-portal-red ring-1 ring-portal-red/25 transition-colors hover:bg-portal-red/20">
              Reject
            </button>
          </form>
          <form
            action={decideApplicant.bind(null, application.id, "accept", undefined)}
          >
            <button className="cursor-pointer rounded-lg bg-portal-gold px-6 py-2.5 text-sm font-medium text-portal-ongold transition-colors hover:bg-portal-gold/85">
              {application.status === "interview_scheduled"
                ? "Approve member"
                : "Accept & schedule interview"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
