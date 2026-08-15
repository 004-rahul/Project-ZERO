import { Curtain } from "@/components/landing/curtain";
import { SmoothScroll } from "@/components/landing/smooth-scroll";
import { Cta } from "@/components/landing/sections/cta";
import { Faq } from "@/components/landing/sections/faq";
import { Features } from "@/components/landing/sections/features";
import { Footer } from "@/components/landing/sections/footer";
import { Hero } from "@/components/landing/sections/hero";
import { How } from "@/components/landing/sections/how";
import { LandingNav } from "@/components/landing/sections/nav";
import { Pricing } from "@/components/landing/sections/pricing";
import { Proof } from "@/components/landing/sections/proof";
import { Testimonials } from "@/components/landing/sections/testimonials";

/**
 * Public landing page (Design Bible §19.4 · v5.0).
 *
 * Composed as a tonal arc rather than a stack of equal blocks — base, deep,
 * base, raised, base, deep, base, deep — so the eye gets a floor roughly every
 * other section and the page reads as chapters instead of one long scroll.
 *
 * Each section owns a genuinely different structure: an editorial hero, a
 * measured proof band, a specification index, a pinned sequence, a broken-row
 * rate card, a single display quote, a split FAQ, and a final inversion. The
 * shared language is the 1400px measure, the numbered markers, the hairline
 * system and the ice-cyan accent — not a repeated layout.
 *
 * Anonymous by rule (§19.1): nothing personalized renders pre-authentication.
 */
export default function LandingPage() {
  return (
    <>
      <SmoothScroll />
      <Curtain />
      <LandingNav />
      <main className="overflow-x-clip bg-cream text-ink">
        <Hero />
        <Proof />
        <Features />
        <How />
        <Pricing />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
