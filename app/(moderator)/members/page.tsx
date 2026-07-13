import { dangerButton, outlineButton, panel } from "@/components/moderator/ui";
import { setMemberActive } from "@/lib/moderator/actions";
import { avatarColor, getMembers } from "@/lib/moderator/queries";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<string, string> = {
  active: "bg-portal-green/15 text-portal-green",
  deactivated: "bg-portal-red/15 text-portal-red",
  rejected: "bg-portal-red/15 text-portal-red",
  pending_application: "bg-portal-cream/10 text-portal-muted",
  interview_scheduled: "bg-portal-gold/15 text-portal-gold",
  accepted: "bg-portal-gold/15 text-portal-gold",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div className={panel}>
      <div className="flex items-center justify-between border-b border-portal-cream/8 px-6 py-5">
        <h1 className="text-[15px] font-semibold text-portal-cream">
          Members{" "}
          <span className="text-portal-muted">({members.length})</span>
        </h1>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left">
          <thead>
            <tr className="border-b border-portal-cream/8 text-[10px] tracking-[0.08em] uppercase text-portal-muted">
              <th className="px-6 py-3 font-medium">Member</th>
              <th className="px-6 py-3 font-medium">Agency</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Joined</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const agency = member.applications[0];
              return (
                <tr
                  key={member.id}
                  className="border-b border-portal-cream/5 last:border-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-portal-bright",
                          avatarColor(member.name) === "green"
                            ? "bg-portal-green"
                            : "bg-portal-red"
                        )}
                      >
                        {initials(member.name)}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-portal-cream">
                          {member.name}
                        </p>
                        <p className="text-xs text-portal-muted">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {agency ? (
                      <>
                        <p className="text-sm text-portal-cream">
                          {agency.agencyName}
                        </p>
                        <p className="text-xs text-portal-muted">
                          {agency.industry}
                          {agency.location && ` · ${agency.location}`}
                        </p>
                      </>
                    ) : (
                      <span className="text-xs text-portal-faint">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] capitalize text-portal-cream">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px]",
                        STATUS_TONE[member.status] ??
                          "bg-portal-cream/10 text-portal-muted"
                      )}
                    >
                      {member.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-portal-muted">
                    {member.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {member.role === "member" ? (
                      <form
                        action={setMemberActive.bind(
                          null,
                          member.id,
                          member.status !== "active"
                        )}
                      >
                        <button
                          className={
                            member.status === "active"
                              ? dangerButton
                              : outlineButton
                          }
                        >
                          {member.status === "active"
                            ? "Deactivate"
                            : "Reactivate"}
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-portal-faint">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {members.length === 0 && (
          <p className="py-10 text-center text-sm text-portal-muted">
            No accounts yet.
          </p>
        )}
      </div>
    </div>
  );
}
