import { z } from "zod";

export const onboardingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  linkedin: z.string().url("Enter a valid LinkedIn URL").optional().or(z.literal("")),
});

export const step2Schema = z.object({
  agencyName: z.string().min(1, "Agency name is required"),
  industry: z.string().min(1, "Industry is required"),
  agencySize: z.string().min(1, "Agency size is required"),
  yearsInOperation: z.string().min(1, "Years in operation is required"),
  monthlyRevenue: z.string().min(1, "Monthly revenue is required"),
  primaryServices: z.string().min(1, "Primary services is required"),
});

export const step3Schema = z.object({
  motivation: z.string().min(1, "Please tell us why you want to join"),
  currentChallenge: z.string().min(1, "Please describe your current challenge"),
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;
export type AgencyValues = z.infer<typeof step2Schema>;
export type FinishingValues = z.infer<typeof step3Schema>;
