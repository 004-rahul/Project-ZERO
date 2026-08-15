import { ThemeProvider } from "./app/providers/ThemeProvider";
import { MotionProvider } from "./app/providers/MotionProvider";
import { SmoothScrollProvider } from "./app/providers/SmoothScrollProvider";
import { Nav } from "./components/layout/Nav";
import { Grain } from "./components/decor/Grain";
import { Hero } from "./sections/Hero/Hero";
import { Pipeline } from "./sections/Pipeline/Pipeline";
import { Capabilities } from "./sections/Capabilities/Capabilities";
import { Evidence } from "./sections/Evidence/Evidence";
import { Integrations } from "./sections/Integrations/Integrations";
import { CTA } from "./sections/CTA/CTA";

/**
 * Section order is a motion decision as much as an editorial one: each
 * section changes the *kind* of movement, so the page never repeats itself.
 *
 *   Hero          layered parallax exit
 *   Pipeline      pinned, scroll-scrubbed sequence
 *   Capabilities  vertical scroll redirected horizontally
 *   Integrations  velocity-coupled ticker
 *   Evidence      sticky split, two columns at different rates
 *   CTA           quiet, one growing wash
 */
export default function App() {
  return (
    <ThemeProvider>
      <MotionProvider>
        <SmoothScrollProvider>
          <Grain />
          <Nav />
          <main>
            <Hero />
            <Pipeline />
            <Capabilities />
            <Integrations />
            <Evidence />
            <CTA />
          </main>
        </SmoothScrollProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}
