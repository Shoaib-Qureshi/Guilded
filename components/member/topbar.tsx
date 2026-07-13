"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";

import { cn } from "@/lib/utils";

const TABS = [
  { href: "/discussions", label: "Discussions" },
  { href: "/sessions", label: "Sessions" },
  { href: "/client-experience", label: "Client Experience" },
];

// The primary CTA changes with the section (per Figma).
function ctaFor(pathname: string) {
  if (pathname.startsWith("/client-experience")) {
    return { href: "/client-experience/share", label: "Share Experience" };
  }
  return { href: "/discussions/new", label: "Create Post" };
}

export function MemberTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cta = ctaFor(pathname);

  // Search filters the section you're already in — submit rewrites ?q=.
  function onSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = new FormData(event.currentTarget).get("q");
    const target = typeof q === "string" && q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
    router.push(`${pathname}${target}`);
  }

  return (
    <header className="px-6 pt-6">
      <div className="flex items-center gap-4">
        <form onSubmit={onSearch} className="relative flex-1">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-portal-gold" />
          <input
            name="q"
            type="search"
            defaultValue={searchParams.get("q") ?? ""}
            placeholder="Search"
            className="h-[42px] w-full rounded-lg bg-portal-cream/4 pl-11 pr-4 text-sm text-portal-cream placeholder:text-portal-muted outline-none ring-1 ring-portal-cream/8 focus-visible:ring-portal-gold/40"
          />
        </form>

        <Link
          href={cta.href}
          className="flex h-[42px] shrink-0 items-center gap-2 rounded-lg bg-portal-gold px-5 text-[13px] font-semibold text-portal-ongold transition-colors hover:bg-portal-gold/85"
        >
          <Plus className="size-4" />
          {cta.label}
        </Link>
      </div>

      <nav className="mt-5 flex gap-7 border-b border-portal-cream/8">
        {TABS.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "-mb-px border-b-2 pb-3 text-[13px] transition-colors",
                active
                  ? "border-portal-gold text-portal-gold"
                  : "border-transparent text-portal-muted hover:text-portal-cream"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
