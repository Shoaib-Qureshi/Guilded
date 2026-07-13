import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Trash2 } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { addComment, deletePost, toggleLike } from "@/lib/member/actions";
import { getPost, timeAgo } from "@/lib/member/discussions";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

function Byline({
  name,
  agency,
  at,
}: {
  name: string;
  agency?: string;
  at: Date;
}) {
  return (
    <div className="flex items-center gap-2 text-[13px]">
      <span className="flex size-6 items-center justify-center rounded-full bg-portal-gold/20 text-[9px] font-semibold text-portal-gold">
        {initials(name)}
      </span>
      <span className="font-medium text-portal-cream">{name}</span>
      <span className="text-portal-muted">
        {agency && `• ${agency} `}• {timeAgo(at)}
      </span>
    </div>
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, user] = await Promise.all([params, requireUser()]);
  const post = await getPost(id, user.id);
  if (!post) notFound();

  const canDelete =
    post.authorId === user.id ||
    user.role === "moderator" ||
    user.role === "admin";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <Link
        href="/discussions"
        className="flex w-fit items-center gap-1.5 text-[13px] text-portal-muted hover:text-portal-cream"
      >
        <ArrowLeft className="size-4" />
        Back to discussions
      </Link>

      <article className="rounded-xl bg-portal-card p-6 ring-1 ring-portal-cream/8">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-block rounded bg-[rgba(57,72,23,0.62)] px-2.5 py-1 text-[11px] text-[#b5c98a]">
            {post.category}
          </span>
          {canDelete && (
            <form action={deletePost.bind(null, post.id)}>
              <button
                aria-label="Delete post"
                className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] text-portal-muted transition-colors hover:bg-portal-red/12 hover:text-portal-red"
              >
                <Trash2 className="size-3.5" />
                Delete
              </button>
            </form>
          )}
        </div>

        <h1 className="mt-3 text-2xl font-semibold text-portal-cream">
          {post.title}
        </h1>

        <div className="mt-3">
          <Byline
            name={post.author.name}
            agency={post.author.applications[0]?.agencyName}
            at={post.createdAt}
          />
        </div>

        <p className="mt-5 text-sm leading-relaxed whitespace-pre-wrap text-portal-cream/90">
          {post.body}
        </p>

        <div className="mt-6 flex items-center gap-5 border-t border-portal-cream/8 pt-4">
          <form action={toggleLike.bind(null, post.id)}>
            <button
              className={cn(
                "flex cursor-pointer items-center gap-1.5 text-[13px] transition-colors",
                post.likedByViewer
                  ? "text-portal-gold"
                  : "text-portal-muted hover:text-portal-cream"
              )}
            >
              <Heart
                className={cn("size-4", post.likedByViewer && "fill-current")}
              />
              {post._count.likes} {post._count.likes === 1 ? "Like" : "Likes"}
            </button>
          </form>
          <span className="flex items-center gap-1.5 text-[13px] text-portal-muted">
            <MessageCircle className="size-4" />
            {post.comments.length}{" "}
            {post.comments.length === 1 ? "Comment" : "Comments"}
          </span>
        </div>
      </article>

      <section className="rounded-xl bg-portal-card p-6 ring-1 ring-portal-cream/8">
        <h2 className="mb-5 text-[15px] font-semibold text-portal-cream">
          Comments
        </h2>

        <form
          action={addComment.bind(null, post.id)}
          className="mb-6 flex flex-col gap-3"
        >
          <textarea
            name="body"
            required
            rows={3}
            placeholder="Add to the discussion…"
            className="w-full resize-y rounded-lg bg-portal-cream/4 p-3.5 text-sm leading-relaxed text-portal-cream placeholder:text-portal-muted outline-none ring-1 ring-portal-cream/10 focus-visible:ring-portal-gold/50"
          />
          <button className="cursor-pointer self-end rounded-lg bg-portal-gold px-5 py-2 text-[13px] font-semibold text-portal-ongold transition-colors hover:bg-portal-gold/85">
            Comment
          </button>
        </form>

        <div className="flex flex-col gap-5">
          {post.comments.map((comment) => (
            <div
              key={comment.id}
              className="border-t border-portal-cream/8 pt-4 first:border-0 first:pt-0"
            >
              <Byline
                name={comment.author.name}
                agency={comment.author.applications[0]?.agencyName}
                at={comment.createdAt}
              />
              <p className="mt-2 pl-8 text-sm leading-relaxed whitespace-pre-wrap text-portal-cream/90">
                {comment.body}
              </p>
            </div>
          ))}

          {post.comments.length === 0 && (
            <p className="text-[13px] text-portal-muted">
              No comments yet. Start the conversation.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
