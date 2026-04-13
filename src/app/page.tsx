import { LiquidBackground } from "@/components/landing/LiquidBackground";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { TrustedBy } from "@/components/landing/TrustedBy";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { Timeline } from "@/components/landing/Timeline";
import { OrbitalSystem } from "@/components/landing/OrbitalSystem";
import { FloatingGallery } from "@/components/landing/FloatingGallery";
import { BigMarquee } from "@/components/landing/BigMarquee";
import { Pillars } from "@/components/landing/Pillars";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <LiquidBackground />
      <Header />
      <Hero />
      <main className="z-10 w-full relative">
        <TrustedBy />
        <BentoGrid />
        <Timeline />
        <OrbitalSystem />
        <FloatingGallery />
        <BigMarquee />
        <Pillars />
        <Testimonials />
        <Pricing />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
