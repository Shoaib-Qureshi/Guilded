"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { step3Schema, type FinishingValues } from "@/lib/validations/onboarding";

const LABEL_CLS = "px-[33px] font-thin text-[20px] text-guilded-cream tracking-[-0.06em]";

const TEXTAREA_CLS =
  "bg-[#d6ccb3] border border-[#261a0f] rounded-[20px] px-[33px] pt-[10px] pb-[28px] w-full " +
  "font-thin text-[20px] tracking-[-0.06em] text-[#261a0f] " +
  "placeholder:text-[rgba(38,26,15,0.4)] " +
  "resize-none focus:outline-none focus:border-guilded-gold";

type Props = {
  onSubmit: (values: FinishingValues) => void;
  submitting?: boolean;
  error?: string | null;
};

export function FinishingForm({ onSubmit, submitting, error }: Props) {
  const form = useForm<FinishingValues>({
    resolver: zodResolver(step3Schema),
    defaultValues: { motivation: "", currentChallenge: "" },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-[341px] flex-col gap-[38px] mx-auto"
      >
        {/* Motivation */}
        <FormField
          control={form.control}
          name="motivation"
          render={({ field }) => (
            <FormItem className="gap-[6px]">
              <FormLabel className={LABEL_CLS}>Tell us why you want to join.</FormLabel>
              <textarea
                {...field}
                className={TEXTAREA_CLS}
                style={{ height: "64px" }}
                placeholder="Tell us why you want to join."
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Current challenge */}
        <FormField
          control={form.control}
          name="currentChallenge"
          render={({ field }) => (
            <FormItem className="gap-[6px]">
              <FormLabel className={LABEL_CLS}>Current challenge</FormLabel>
              <textarea
                {...field}
                className={TEXTAREA_CLS}
                style={{ height: "82px" }}
                placeholder="What is your biggest challenge currently?"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Helper text */}
        <p
          className="text-center font-thin text-[14px] tracking-[-0.06em] -mt-6"
          style={{ color: "rgba(255,255,255,0.61)" }}
        >
          This helps us match you with relevant peers!
        </p>

        {/* Server error */}
        {error && (
          <p className="text-center text-[14px] text-destructive -mt-6">{error}</p>
        )}

        {/* Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            className="bg-guilded-gold rounded-[15px] px-[32px] py-[10px] font-thin text-[20px] text-guilded-cream tracking-[-0.06em] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </form>
    </Form>
  );
}
