"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleDashed,
  LayoutGrid,
  LogOut,
  Mail,
  Ticket,
  UserPlus,
} from "lucide-react";

import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

// `soon` = no backing table / no design yet. Rendered disabled rather than
// linking to a 404. Wire the href when the feature lands.
const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/members", label: "Members", icon: UserPlus },
  { href: "/guild", label: "Guild", icon: CircleDashed, soon: true },
  { href: "/events", label: "Events", icon: Ticket },
  { href: "/inbox", label: "Inbox", icon: Mail, soon: true },
];

const itemClass =
  "flex items-center gap-3 rounded-full px-4 py-2.5 text-[13px] font-medium tracking-[0.08em] uppercase transition-colors";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export function ModeratorSidebar({ name }: { name: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[258px] shrink-0 flex-col bg-portal-card/60 px-5 py-6">
      <div className="mb-8 flex items-center gap-3 px-1">
        <span className="flex size-10 items-center justify-center rounded-xl bg-portal-gold/20 font-serif text-sm text-portal-gold">
          {initials(name)}
        </span>
        <div>
          <p className="font-serif text-lg leading-tight text-portal-cream">
            {name}
          </p>
          <p className="text-[11px] text-portal-muted">Moderator</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, soon }) =>
          soon ? (
            <span
              key={href}
              aria-disabled="true"
              title="Not built yet"
              className={cn(itemClass, "cursor-not-allowed text-portal-faint")}
            >
              <Icon className="size-4.5" />
              {label}
              <span className="ml-auto text-[9px] normal-case tracking-normal">
                soon
              </span>
            </span>
          ) : (
            <Link
              key={href}
              href={href}
              className={cn(
                itemClass,
                pathname.startsWith(href)
                  ? "bg-portal-cream/8 text-portal-gold"
                  : "text-portal-muted hover:bg-portal-cream/4 hover:text-portal-cream"
              )}
            >
              <Icon className="size-4.5" />
              {label}
            </Link>
          )
        )}
      </nav>

      <div className="mt-8 flex flex-col items-start gap-4 border-t border-portal-cream/10 px-4 pt-6">
        <form action={logout}>
          <button
            type="submit"
            className="flex cursor-pointer items-center gap-2 text-[13px] tracking-[0.08em] uppercase text-portal-muted transition-colors hover:text-portal-red"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
