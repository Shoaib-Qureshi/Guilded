import { Download, Search } from "lucide-react";

import { ModeratorSidebar } from "@/components/moderator/sidebar";
import { requireModerator } from "@/lib/dal";

export default async function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirects non-moderators before any moderator UI renders.
  const moderator = await requireModerator();

  return (
    <div className="flex h-screen bg-portal-bg font-sans text-portal-cream">
      <ModeratorSidebar name={moderator.name} />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <header className="flex items-center gap-4 px-8 pt-8 pb-5">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-portal-gold" />
            <input
              type="search"
              placeholder="Search"
              className="h-[52px] w-full rounded-xl bg-portal-cream/4 pl-12 pr-4 text-sm text-portal-cream placeholder:text-portal-muted outline-none ring-1 ring-portal-cream/8 focus-visible:ring-portal-gold/40"
            />
          </div>
          <button className="flex h-[52px] cursor-pointer items-center gap-2.5 rounded-xl bg-portal-cream/4 px-5 text-sm text-portal-cream ring-1 ring-portal-cream/15 transition-colors hover:bg-portal-cream/8">
            <Download className="size-4.5" />
            Download report
          </button>
        </header>
        <main className="flex-1 px-8 pb-10">{children}</main>
      </div>
    </div>
  );
}
