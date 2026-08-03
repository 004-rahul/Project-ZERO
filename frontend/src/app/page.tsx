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
 * Public landing page (Design Bible §19.4 v4.0).
 *
 * Composition: a tonal arc — light editorial hero → graphite proof band →
 * light feature bento → pinned scroll-scrubbed "how it works" with the live
 * demo → pricing with a broken-row featured tier → draggable testimonial rail
 * → split FAQ → graphite finale + footer. Each section owns its own layout
 * language and interaction; the shared vocabulary is the 1400px grid, the
 * numbered eyebrows, the hairline rules and the violet accent.
 *
 * Anonymous by rule (§19.1): nothing personalized renders pre-authentication.
 */
export default function LandingPage() {
  return (
    <>
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
