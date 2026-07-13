"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireUser } from "@/lib/dal";
import { db } from "@/lib/db";

import { CATEGORIES } from "./categories";

const postSchema = z.object({
  category: z.enum(CATEGORIES),
  title: z.string().trim().min(5, "Give your post a clearer title."),
  body: z.string().trim().min(10, "Add a bit more detail."),
});

export type PostFormState = { error?: string } | undefined;

export async function createPost(
  _prev: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const user = await requireUser();

  const parsed = postSchema.safeParse({
    category: formData.get("category"),
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const post = await db.post.create({
    data: { ...parsed.data, authorId: user.id },
  });

  revalidatePath("/discussions");
  redirect(`/discussions/${post.id}`);
}

export async function toggleLike(postId: string) {
  const user = await requireUser();

  const existing = await db.postLike.findUnique({
    where: { postId_userId: { postId, userId: user.id } },
  });

  if (existing) {
    await db.postLike.delete({ where: { id: existing.id } });
  } else {
    await db.postLike.create({ data: { postId, userId: user.id } });
  }

  revalidatePath("/discussions");
  revalidatePath(`/discussions/${postId}`);
}

export async function addComment(postId: string, formData: FormData) {
  const user = await requireUser();

  const body = z.string().trim().min(1).safeParse(formData.get("body"));
  if (!body.success) return;

  await db.postComment.create({
    data: { postId, authorId: user.id, body: body.data },
  });
  revalidatePath(`/discussions/${postId}`);
}

/** Authors delete their own posts; moderators can delete any (docs/roles-and-permissions.md). */
export async function deletePost(postId: string) {
  const user = await requireUser();

  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post) return;

  const canDelete =
    post.authorId === user.id ||
    user.role === "moderator" ||
    user.role === "admin";
  if (!canDelete) return;

  await db.post.update({
    where: { id: postId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/discussions");
  redirect("/discussions");
}
