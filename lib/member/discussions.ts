import "server-only";

import { db } from "@/lib/db";

export { CATEGORIES } from "./categories";

export function timeAgo(date: Date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (mins < 60) return `${Math.max(mins, 1)}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days}d` : `${Math.floor(days / 7)}w`;
}

/** Author's agency name, taken from their most recent application. */
const authorSelect = {
  id: true,
  name: true,
  applications: {
    orderBy: { createdAt: "desc" },
    take: 1,
    select: { agencyName: true },
  },
} as const;

export async function getPosts({
  category,
  q,
}: {
  category?: string;
  q?: string;
}) {
  return db.post.findMany({
    where: {
      deletedAt: null,
      ...(category ? { category } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" as const } },
              { body: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: authorSelect },
      _count: { select: { likes: true, comments: { where: { deletedAt: null } } } },
    },
  });
}

export async function getPost(id: string, viewerId: string) {
  const post = await db.post.findFirst({
    where: { id, deletedAt: null },
    include: {
      author: { select: authorSelect },
      comments: {
        where: { deletedAt: null },
        orderBy: { createdAt: "asc" },
        include: { author: { select: authorSelect } },
      },
      likes: { where: { userId: viewerId }, select: { id: true } },
      _count: { select: { likes: true } },
    },
  });
  if (!post) return null;
  return { ...post, likedByViewer: post.likes.length > 0 };
}

/**
 * The sidebar Activity feed: likes and comments other people left on your posts.
 * ponytail: derived from the existing tables — no Notification table to keep in
 * sync, and it can never drift from reality.
 */
export async function getActivity(userId: string) {
  const [likes, comments] = await Promise.all([
    db.postLike.findMany({
      where: { post: { authorId: userId }, userId: { not: userId } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { name: true } } },
    }),
    db.postComment.findMany({
      where: { post: { authorId: userId }, authorId: { not: userId }, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { author: { select: { name: true } } },
    }),
  ]);

  return [
    ...likes.map((like) => ({
      id: `like-${like.id}`,
      actor: like.user.name,
      text: "liked your post",
      at: like.createdAt,
    })),
    ...comments.map((comment) => ({
      id: `comment-${comment.id}`,
      actor: comment.author.name,
      text: "commented on your post",
      at: comment.createdAt,
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 5)
    .map(({ at, ...rest }) => ({ ...rest, timeAgo: timeAgo(at) }));
}
