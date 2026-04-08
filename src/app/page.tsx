import HeroSection from "@/components/HeroSection";
import TrustBadges from "@/components/TrustBadges";
import StatsSection from "@/components/StatsSection";
import CompanySection from "@/components/CompanySection";
import ServicesShowcase from "@/components/ServicesShowcase";
import GSASection from "@/components/GSASection";
import PartnerHubSection from "@/components/PartnerHubSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TrustBadges />
      <StatsSection />
      <GSASection />
      <ServicesShowcase />
      <CompanySection />
      <PartnerHubSection />
      <ContactSection />
    </main>
  );
}
