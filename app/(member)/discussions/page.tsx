import Link from "next/link";
import { Heart, MessageCircle, SlidersHorizontal } from "lucide-react";

import { CATEGORIES, getPosts, timeAgo } from "@/lib/member/discussions";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export default async function DiscussionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const posts = await getPosts({ category, q });

  // Toggling a chip off = clear the filter; the search term survives either way.
  const chipHref = (value?: string) => {
    const params = new URLSearchParams();
    if (value) params.set("category", value);
    if (q) params.set("q", q);
    const query = params.toString();
    return query ? `/discussions?${query}` : "/discussions";
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <SlidersHorizontal className="size-4 shrink-0 text-portal-muted" />
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((name) => {
            const active = category === name;
            return (
              <Link
                key={name}
                href={chipHref(active ? undefined : name)}
                className={cn(
                  "rounded-lg px-4 py-2 text-[13px] transition-colors",
                  active
                    ? "bg-portal-gold/15 text-portal-gold ring-1 ring-portal-gold"
                    : "text-portal-cream ring-1 ring-portal-cream/12 hover:bg-portal-cream/5"
                )}
              >
                {name}
              </Link>
            );
          })}
        </div>
      </div>

      {q && (
        <p className="text-[13px] text-portal-muted">
          {posts.length} result{posts.length === 1 ? "" : "s"} for{" "}
          <span className="text-portal-cream">&ldquo;{q}&rdquo;</span>
        </p>
      )}

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/discussions/${post.id}`}
            className="rounded-xl bg-portal-card p-5 ring-1 ring-portal-cream/8 transition-colors hover:bg-portal-card/70"
          >
            <span className="inline-block rounded bg-[rgba(57,72,23,0.62)] px-2.5 py-1 text-[11px] text-[#b5c98a]">
              {post.category}
            </span>

            <h2 className="mt-3 text-lg font-semibold text-portal-cream">
              {post.title}
            </h2>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13px]">
                <span className="flex size-6 items-center justify-center rounded-full bg-portal-gold/20 text-[9px] font-semibold text-portal-gold">
                  {initials(post.author.name)}
                </span>
                <span className="font-medium text-portal-cream">
                  {post.author.name}
                </span>
                <span className="text-portal-muted">
                  {post.author.applications[0] &&
                    `• ${post.author.applications[0].agencyName} `}
                  • {timeAgo(post.createdAt)}
                </span>
              </div>

              <div className="flex items-center gap-5 text-[13px] text-portal-muted">
                <span className="flex items-center gap-1.5">
                  <Heart className="size-3.5" />
                  {post._count.likes} Likes
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="size-3.5" />
                  {post._count.comments} Comments
                </span>
              </div>
            </div>
          </Link>
        ))}

        {posts.length === 0 && (
          <div className="rounded-xl bg-portal-card px-6 py-16 text-center ring-1 ring-portal-cream/8">
            <p className="text-sm text-portal-cream">
              {q || category ? "Nothing matches that." : "No discussions yet."}
            </p>
            <p className="mt-1 text-[13px] text-portal-muted">
              {q || category
                ? "Try a different search or category."
                : "Be the first to start one — hit Create Post."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
