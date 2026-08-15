import { SmoothScroll } from "@/components/landing/smooth-scroll";
import { Field } from "@/components/site/field";
import { Chrome } from "@/components/site/sections/chrome";
import { Hero } from "@/components/site/sections/hero";
import { Signal } from "@/components/site/sections/signal";
import { Track } from "@/components/site/sections/track";
import { Process } from "@/components/site/sections/process";
import { Plans } from "@/components/site/sections/plans";
import { Trust } from "@/components/site/sections/trust";
import { Close } from "@/components/site/sections/close";

/**
 * Landing page.
 *
 * Built as instrumentation rather than a brochure: one persistent WebGL field
 * behind the whole page (not a canvas per section), content docking into it,
 * and a left rail that indexes the page instead of hiding its structure behind
 * menu labels.
 *
 * The six modules deliberately do not share a shape:
 *   hero     an oversized headline with the live product cropped by the edge
 *   signal   a quiet measured band — the only module that just states facts
 *   track    capabilities running HORIZONTALLY, driven by vertical scroll
 *   process  three ordered beats advanced by scroll, then the demo itself
 *   plans    a rate table read across a shared baseline
 *   trust    voices and security objections as one argument
 *   close    the ask, with the index folded into the same surface
 *
 * Anonymous by rule: nothing personalised renders before sign-in.
 */
export default function LandingPage() {
  return (
    <>
      <SmoothScroll />
      <Field />
      <Chrome />
      <main className="relative overflow-x-clip bg-cream text-ink">
        <Hero />
        <Signal />
        <Track />
        <Process />
        <Plans />
        <Trust />
      </main>
      <Close />
    </>
  );
}
