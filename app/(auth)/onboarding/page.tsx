import { GuildedNav } from "@/components/shared/GuildedNav";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-guilded-green flex flex-col">
      <GuildedNav />
      <OnboardingShell />
    </div>
  );
}
