import HeroSection from "@/components/HeroSection";
import TrustBadges from "@/components/TrustBadges";
import StatsSection from "@/components/StatsSection";
import WhyGSSASection from "@/components/WhyGSSASection";
import GSASection from "@/components/GSASection";
import ServicesShowcase from "@/components/ServicesShowcase";
import CompanySection from "@/components/CompanySection";
import PartnerHubSection from "@/components/PartnerHubSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TrustBadges />
      <StatsSection />
      <WhyGSSASection />
      <GSASection />
      <ServicesShowcase />
      <CompanySection />
      <PartnerHubSection />
      <ContactSection />
    </main>
  );
}
