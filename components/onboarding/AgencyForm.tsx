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
import { Input } from "@/components/ui/input";
import { step2Schema, type AgencyValues } from "@/lib/validations/onboarding";
import { CustomSelect } from "@/components/onboarding/CustomSelect";

const LABEL_CLS = "px-[33px] font-thin text-[20px] text-guilded-cream tracking-[-0.06em]";

const INPUT_CLS =
  "bg-[#d6ccb3] border border-[#261a0f] rounded-[15px] px-[32px] py-[10px] h-auto w-full " +
  "font-thin text-[20px] tracking-[-0.06em] text-[#261a0f] " +
  "placeholder:text-[rgba(38,26,15,0.4)] " +
  "focus-visible:border-guilded-gold focus-visible:ring-guilded-gold/30";

const INDUSTRIES = [
  { value: "Marketing", label: "Marketing" },
  { value: "Design", label: "Design" },
  { value: "Technology", label: "Technology" },
  { value: "PR & Communications", label: "PR & Communications" },
  { value: "Consulting", label: "Consulting" },
  { value: "Media & Entertainment", label: "Media & Entertainment" },
  { value: "Events", label: "Events" },
  { value: "Other", label: "Other" },
];

const AGENCY_SIZES = [
  { value: "2-5", label: "2–5 employees" },
  { value: "6-10", label: "6–10 employees" },
  { value: "11-20", label: "11–20 employees" },
  { value: "21-50", label: "21–50 employees" },
];

const SERVICES = [
  { value: "Digital Marketing", label: "Digital Marketing" },
  { value: "Branding & Design", label: "Branding & Design" },
  { value: "Web Development", label: "Web Development" },
  { value: "Social Media", label: "Social Media" },
  { value: "PR & Communications", label: "PR & Communications" },
  { value: "Content Creation", label: "Content Creation" },
  { value: "SEO / SEM", label: "SEO / SEM" },
  { value: "Consulting", label: "Consulting" },
  { value: "Other", label: "Other" },
];

type Props = {
  onComplete: (values: AgencyValues) => void;
  arrowFlying: boolean;
};

export function AgencyForm({ onComplete, arrowFlying }: Props) {
  const form = useForm<AgencyValues>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      agencyName: "",
      industry: "",
      agencySize: "",
      yearsInOperation: "",
      monthlyRevenue: "",
      primaryServices: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onComplete)}
        className="flex w-full max-w-[341px] flex-col gap-[38px] mx-auto"
      >
        {/* Agency name */}
        <FormField
          control={form.control}
          name="agencyName"
          render={({ field }) => (
            <FormItem className="gap-[6px]">
              <FormLabel className={LABEL_CLS}>Agency name</FormLabel>
              <Input
                placeholder="What is your agency's name?"
                className={INPUT_CLS}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Industry */}
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem className="gap-[6px]">
              <FormLabel className={LABEL_CLS}>Industry</FormLabel>
              <CustomSelect
                options={INDUSTRIES}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Industry"
                name={field.name}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Agency size */}
        <FormField
          control={form.control}
          name="agencySize"
          render={({ field }) => (
            <FormItem className="gap-[6px]">
              <FormLabel className={LABEL_CLS}>Agency size</FormLabel>
              <CustomSelect
                options={AGENCY_SIZES}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="What is the size of your agency?"
                name={field.name}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Years in operation */}
        <FormField
          control={form.control}
          name="yearsInOperation"
          render={({ field }) => (
            <FormItem className="gap-[6px]">
              <FormLabel className={LABEL_CLS}>Years in operation</FormLabel>
              <Input
                placeholder="Number of years in operation"
                className={INPUT_CLS}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Monthly Revenue */}
        <FormField
          control={form.control}
          name="monthlyRevenue"
          render={({ field }) => (
            <FormItem className="gap-[6px]">
              <FormLabel className={LABEL_CLS}>Monthly Revenue</FormLabel>
              <Input
                placeholder="What is your monthly revenue?"
                className={INPUT_CLS}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Primary Services — next arrow sits outside the 341px form boundary */}
        <FormField
          control={form.control}
          name="primaryServices"
          render={({ field }) => (
            <FormItem className="gap-[6px]">
              <FormLabel className={LABEL_CLS}>Primary Services</FormLabel>
              <div className="relative">
                <CustomSelect
                  options={SERVICES}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Primary services"
                  name={field.name}
                />
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
