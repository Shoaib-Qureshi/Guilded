"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { onboardingSchema, type OnboardingValues } from "@/lib/validations/onboarding";

const INPUT_CLS =
  "bg-[#d6ccb3] border border-[#261a0f] rounded-[15px] px-[32px] py-[10px] h-auto w-full " +
  "font-thin text-[20px] tracking-[-0.06em] text-[#261a0f] " +
  "placeholder:text-[rgba(38,26,15,0.4)] " +
  "focus-visible:border-guilded-gold focus-visible:ring-guilded-gold/30";

const LABEL_CLS = "px-[33px] font-thin text-[20px] text-guilded-cream tracking-[-0.06em]";

type Props = {
  onComplete: (values: OnboardingValues) => void;
  arrowFlying: boolean;
};

export function OnboardingForm({ onComplete, arrowFlying }: Props) {
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { name: "", email: "", linkedin: "" },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onComplete)}
        className="flex w-full max-w-[341px] flex-col gap-6 mx-auto"
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="gap-[6px]">
              <FormLabel className={LABEL_CLS}>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" className={INPUT_CLS} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="gap-[6px]">
              <FormLabel className={LABEL_CLS}>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className={INPUT_CLS}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* LinkedIn — arrow button inline */}
        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem className="gap-[6px]">
              <FormLabel className={LABEL_CLS}>LinkedIn Profile</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="url"
                    placeholder="Enter a link to your LinkedIn profile"
                    className={`${INPUT_CLS} pr-[56px] sm:pr-[32px]`}
                    {...field}
                  />
                </FormControl>
                <button
                  type="submit"
                  aria-label="Continue"
                  className="absolute top-1/2 right-[5px] sm:right-auto sm:left-[calc(100%+12px)] size-[44px] cursor-pointer rounded-[15px] bg-guilded-gold flex items-center justify-center p-[10px]"
                  style={{
                    transform: arrowFlying
                      ? "translateX(-900px) translateY(-50%) rotate(180deg)"
                      : "translateX(0) translateY(-50%)",
                    opacity: arrowFlying ? 0 : 1,
                    transition: "transform 0.38s ease-in-out, opacity 0.22s ease-in-out",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/svg/arrow.svg" alt="" className="w-full h-full" />
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
