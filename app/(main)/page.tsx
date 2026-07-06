import { GuildedNav } from "@/components/shared/GuildedNav";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { EligibilitySection } from "@/components/home/EligibilitySection";
import { ConfidentialitySection } from "@/components/home/ConfidentialitySection";
import { HomeFooter } from "@/components/home/HomeFooter";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-guilded-green">
      <GuildedNav />
      <HeroSection />
      <FeaturesSection />
      <EligibilitySection />
      <ConfidentialitySection />
      <HomeFooter />
    </div>
  );
}
