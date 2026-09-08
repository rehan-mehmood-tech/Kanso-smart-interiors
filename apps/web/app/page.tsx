import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { UrgencyTicker } from "@/components/landing/UrgencyTicker";
import { WorkflowStepsSection } from "@/components/landing/WorkflowStepsSection";
import { StorySection } from "@/components/landing/StorySection";
import { CuratedAestheticsSection } from "@/components/landing/CuratedAestheticsSection";
import { ArtisanTrustSection } from "@/components/landing/ArtisanTrustSection";
import { VoicesSection } from "@/components/landing/VoicesSection";
import { BottomCtaSection } from "@/components/landing/BottomCtaSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f4]">
      <Navbar />
      <main className="flex w-full flex-1 flex-col">
        <HeroSection />
        <UrgencyTicker />
        <WorkflowStepsSection />
        <StorySection />
        <CuratedAestheticsSection />
        <ArtisanTrustSection />
        <VoicesSection />
        <BottomCtaSection />
      </main>
      <Footer />
    </div>
  );
}
