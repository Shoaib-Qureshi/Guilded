"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Circle, LogOut, MessagesSquare, Star } from "lucide-react";

import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/discussions", label: "Discussions", icon: MessagesSquare },
  { href: "/sessions", label: "Sessions", icon: Circle },
  { href: "/client-experience", label: "Client Experience", icon: Star },
];

export type ActivityItem = {
  id: string;
  actor: string;
  text: string;
  timeAgo: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export function MemberSidebar({
  name,
  activity,
}: {
  name: string;
  activity: ActivityItem[];
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[233px] shrink-0 flex-col bg-portal-card/60 px-6 py-6">
      <div className="mb-7 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-portal-gold/20 text-xs font-semibold text-portal-gold">
          {initials(name)}
        </span>
        <div>
          <p className="text-[15px] font-semibold leading-tight text-portal-cream">
            {name}
          </p>
          <p className="text-[11px] text-portal-muted">View Membership</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors",
                active
                  ? "bg-portal-cream/8 text-portal-cream"
                  : "text-portal-muted hover:bg-portal-cream/4 hover:text-portal-cream"
              )}
            >
              <Icon
                className={cn("size-4", active && "text-portal-gold")}
                strokeWidth={2}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-7 border-t border-portal-cream/10 pt-6">
        <p className="mb-4 text-[13px] font-medium text-portal-muted">
          Activity
        </p>
        <div className="flex flex-col gap-4">
          {activity.map((item) => (
            <div key={item.id} className="flex gap-2.5">
              <span className="mt-0.5 size-6 shrink-0 rounded-full bg-portal-cream/8" />
              <p className="text-[11px] leading-snug text-portal-cream">
                <span className="font-medium">{item.actor}</span>
                <span className="text-portal-muted"> · {item.timeAgo}</span>
                <br />
                <span className="text-portal-muted">{item.text}</span>
              </p>
            </div>
          ))}
          {activity.length === 0 && (
            <p className="text-[11px] leading-snug text-portal-faint">
              No activity yet. Likes and replies on your posts will show up here.
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto flex flex-col items-start gap-3 border-t border-portal-cream/10 pt-6">
        <form action={logout}>
          <button
            type="submit"
            className="flex cursor-pointer items-center gap-2 text-[13px] text-portal-muted transition-colors hover:text-portal-red"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
