"use client";

import {
  Blogs,
  FAQ,
  Features,
  FinalCTA,
  Footer,
  Header,
  HeroSection,
  Testimonials,
} from "@/components/LandingPage";
import { useScrollTracking } from "@/hooks/useScrollTracking";

export default function QuickFormCVLanding() {
  useScrollTracking();

  return (
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <HeroSection />
          <Features />
          <Testimonials />
          <Blogs />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
      </div>
  );
}