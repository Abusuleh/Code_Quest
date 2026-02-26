import { HeroSection } from "@/components/organisms/HeroSection";
import { TrustBar } from "@/components/organisms/TrustBar";
import { WorldMap } from "@/components/organisms/WorldMap";
import { HowItWorks } from "@/components/organisms/HowItWorks";
import { MentorShowcase } from "@/components/organisms/MentorShowcase";
import { RewardsPreview } from "@/components/organisms/RewardsPreview";
import { WaitlistCTA } from "@/components/organisms/WaitlistCTA";

export default function MarketingPage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <WorldMap />
      <HowItWorks />
      <MentorShowcase />
      <RewardsPreview />
      <WaitlistCTA />
    </>
  );
}
