import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import UseCases from "@/components/sections/UseCases";
import Pricing from "@/components/sections/Pricing";
import Referral from "@/components/sections/Referral";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <UseCases />
      <Pricing />
      <Referral />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
