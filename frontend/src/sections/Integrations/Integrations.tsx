import { integrations } from "@/content/copy";
import { Marquee } from "@/motion/primitives";
import { Container } from "@/components/layout/Container";

/**
 * VELOCITY-COUPLED TICKER.
 *
 * Two rows drifting opposite ways, both accelerating with the page and
 * reversing when the reader scrolls back. Edges are masked so nothing ever
 * pops in or out at a hard boundary — an unmasked marquee is the clearest
 * tell of a template.
 */
export function Integrations() {
  return (
    <section className="border-y border-line-subtle py-20 md:py-24">
      <Container>
        <p className="font-mono text-2xs tracking-[0.2em] text-text-faint uppercase">
          Connects to what you already run
        </p>
      </Container>

      <div className="mt-10 flex flex-col gap-4">
        {[0, 1].map((row) => (
          <Marquee
            key={row}
            baseSpeed={row === 0 ? 26 : -22}
            className="[mask-image:linear-gradient(90deg,transparent,#000_9%,#000_91%,transparent)]"
          >
            <div className="flex shrink-0 items-center gap-4 pr-4">
              {(row === 0 ? integrations : [...integrations].reverse()).map((name) => (
                <span
                  key={name}
                  className="shrink-0 rounded-lg border border-line-subtle bg-surface px-6 py-3.5 text-sm text-text-muted transition-colors duration-300 hover:border-line-strong hover:text-text"
                >
                  {name}
                </span>
              ))}
            </div>
          </Marquee>
        ))}
      </div>
    </section>
  );
}
