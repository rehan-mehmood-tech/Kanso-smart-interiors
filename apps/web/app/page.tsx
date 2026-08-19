import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { WorkflowStepsSection } from "@/components/landing/WorkflowStepsSection";
import { CuratedAestheticsSection } from "@/components/landing/CuratedAestheticsSection";
import { ArtisanTrustSection } from "@/components/landing/ArtisanTrustSection";
import { BottomCtaSection } from "@/components/landing/BottomCtaSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f4]">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        <HeroSection />
        <WorkflowStepsSection />
        <CuratedAestheticsSection />
        <ArtisanTrustSection />
        <BottomCtaSection />
      </main>
      <Footer />
    </div>
  );
}

