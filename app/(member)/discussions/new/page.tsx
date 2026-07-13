"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { createPost } from "@/lib/member/actions";
import { CATEGORIES } from "@/lib/member/categories";
import { cn } from "@/lib/utils";

export default function CreatePostPage() {
  const [state, action, pending] = useActionState(createPost, undefined);
  const [category, setCategory] = useState<string>(CATEGORIES[0]);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/discussions"
        className="mb-5 flex w-fit items-center gap-1.5 text-[13px] text-portal-muted hover:text-portal-cream"
      >
        <ArrowLeft className="size-4" />
        Back to discussions
      </Link>

      <form
        action={action}
        className="rounded-xl bg-portal-card p-6 ring-1 ring-portal-cream/8"
      >
        <h1 className="mb-6 font-serif text-xl text-portal-cream">
          Create post
        </h1>

        <p className="mb-2 text-[10px] tracking-[0.08em] uppercase text-portal-muted">
          Category
        </p>
        <input type="hidden" name="category" value={category} />
        <div className="mb-5 flex flex-wrap gap-2.5">
          {CATEGORIES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name)}
              className={cn(
                "cursor-pointer rounded-lg px-4 py-2 text-[13px] transition-colors",
                category === name
                  ? "bg-portal-gold/15 text-portal-gold ring-1 ring-portal-gold"
                  : "text-portal-cream ring-1 ring-portal-cream/12 hover:bg-portal-cream/5"
              )}
            >
              {name}
            </button>
          ))}
        </div>

        <label
          htmlFor="title"
          className="mb-2 block text-[10px] tracking-[0.08em] uppercase text-portal-muted"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          minLength={5}
          placeholder="What do you want to ask the room?"
          className="mb-5 h-11 w-full rounded-lg bg-portal-cream/4 px-3.5 text-sm text-portal-cream placeholder:text-portal-muted outline-none ring-1 ring-portal-cream/10 focus-visible:ring-portal-gold/50"
        />

        <label
          htmlFor="body"
          className="mb-2 block text-[10px] tracking-[0.08em] uppercase text-portal-muted"
        >
          Details
        </label>
        <textarea
          id="body"
          name="body"
          required
          minLength={10}
          rows={7}
          placeholder="Context, what you've tried, what you're deciding between…"
          className="mb-5 w-full resize-y rounded-lg bg-portal-cream/4 p-3.5 text-sm leading-relaxed text-portal-cream placeholder:text-portal-muted outline-none ring-1 ring-portal-cream/10 focus-visible:ring-portal-gold/50"
        />

        {state?.error && (
          <p
            role="alert"
            className="mb-4 rounded-lg bg-portal-red/12 px-3 py-2 text-[13px] text-portal-red"
          >
            {state.error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href="/discussions"
            className="rounded-lg px-5 py-2.5 text-[13px] text-portal-cream ring-1 ring-portal-cream/15 transition-colors hover:bg-portal-cream/8"
          >
            Discard
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="cursor-pointer rounded-lg bg-portal-gold px-5 py-2.5 text-[13px] font-semibold text-portal-ongold transition-colors hover:bg-portal-gold/85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Posting…" : "Create post"}
          </button>
        </div>
      </form>
    </div>
  );
}
