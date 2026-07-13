import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import {
  onboardingSchema,
  step2Schema,
  step3Schema,
} from "@/lib/validations/onboarding";

const WEBHOOK = "https://a1.apix-drive.com/web-hooks/15241/p1h1m7x1";

const applicationSchema = onboardingSchema.merge(step2Schema).merge(step3Schema);

export async function POST(request: Request) {
  let payload: z.infer<typeof applicationSchema>;
  try {
    payload = applicationSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const email = payload.email.toLowerCase();

  // Re-application reuses the same user row with a fresh application (docs/roles-and-permissions.md).
  const user = await db.user.upsert({
    where: { email },
    create: {
      email,
      name: payload.name,
      linkedinUrl: payload.linkedin || null,
      role: "applicant",
      status: "pending_application",
    },
    update: {
      name: payload.name,
      linkedinUrl: payload.linkedin || null,
      status: "pending_application",
    },
  });

  await db.application.create({
    data: {
      userId: user.id,
      agencyName: payload.agencyName,
      industry: payload.industry,
      agencySize: payload.agencySize,
      yearsInOperation: payload.yearsInOperation,
      monthlyRevenue: payload.monthlyRevenue,
      primaryServices: payload.primaryServices,
      motivation: payload.motivation,
      currentChallenge: payload.currentChallenge,
    },
  });

  // Best-effort CRM webhook — the application is already saved, so a webhook
  // failure must not surface as a user-facing error (it caused duplicate resubmits before).
  try {
    await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Onboarding webhook failed:", error);
  }

  return NextResponse.json({ success: true });
}
