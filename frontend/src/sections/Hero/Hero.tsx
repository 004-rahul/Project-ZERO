import { motion } from "motion/react";
import { hero, pipeline } from "@/content/copy";
import { Container } from "@/components/layout/Container";
import { FieldLines } from "@/components/decor/FieldLines";
import { Scene } from "@/three/Canvas";
import { Magnetic, TextReveal } from "@/motion/primitives";
import { easeOutExpo } from "@/motion/easings";
import { duration, stagger } from "@/motion/durations";

/**
 * Hero.
 *
 * Composition is deliberately asymmetric and off-centre: the headline sits in
 * a seven-column block on the left, the scene bleeds off the right edge, and
 * the pipeline rail runs along the bottom as a baseline. A centred headline
 * over a centred graphic with a centred button is the layout that makes a
 * page read as generated, so the whole section is built to avoid it.
 *
 * The scene bleeding past the viewport edge is the point — a graphic fully
 * contained in its box reads as an illustration dropped in. One that runs off
 * the edge reads as a window onto something larger.
 */
export function Hero() {
  return (
    <section className="relative min-h-[92svh] overflow-hidden pt-32 pb-16 md:min-h-svh md:pt-40">
      <FieldLines className="pointer-events-none absolute inset-0" />

      {/* Scene: right-biased and bleeding off-canvas. Sits behind the text on
          narrow viewports, beside it on wide ones. */}
      <Scene className="absolute top-1/2 right-[-18%] h-[128vmin] w-[128vmin] -translate-y-1/2 opacity-70 md:right-[-10%] md:opacity-100" />

      {/* Ground gradient tying the scene into the page rather than letting it
          sit on top as a separate layer. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 78% 45%, transparent 35%, var(--bg) 78%)",
        }}
      />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-y-14 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-7 xl:col-span-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: duration.base, delay: 0.15 }}
              className="mb-7 flex items-center gap-3 font-mono text-2xs tracking-[0.22em] text-text-faint uppercase"
            >
              <span className="inline-block h-px w-8 bg-line-strong" />
              {hero.eyebrow}
            </motion.p>

            <h1 className="text-4xl leading-[0.98] font-semibold tracking-[-0.045em] text-text xl:text-5xl">
              <TextReveal
                lines={hero.headline}
                delay={0.25}
                lineClassName="[&:last-child]:text-text-muted"
              />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.slow, ease: easeOutExpo, delay: 0.7 }}
              className="mt-8 max-w-[46ch] text-lg leading-relaxed text-text-muted"
            >
              {hero.sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.slow, ease: easeOutExpo, delay: 0.82 }}
              className="mt-11 flex flex-wrap items-center gap-4"
            >
              <Magnetic>
                <a
                  href="#access"
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-md bg-accent px-6 py-3.5 text-sm font-medium text-text-on-accent transition-colors duration-150 hover:bg-accent-hover"
                  style={{ boxShadow: "var(--glow)" }}
                >
                  {/* Sheen crossing the primary action on hover. One element
                      on the page does this. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -translate-x-[130%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[130%]"
                  />
                  <span className="relative">{hero.primary}</span>
                  <span className="relative transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </Magnetic>

              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-md border border-line-strong px-6 py-3.5 text-sm font-medium text-text transition-colors duration-150 hover:border-accent hover:text-accent-contrast"
              >
                {hero.secondary}
              </a>
            </motion.div>
          </div>
        </div>

        {/* Pipeline rail. A real sequence, so it is numbered — and it doubles
            as the section's baseline, which is what stops the composition
            floating in the middle of the viewport. */}
        <motion.ul
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: stagger.base, delayChildren: 1.0 } } }}
          className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line-subtle bg-line-subtle md:mt-32 md:grid-cols-4"
        >
          {pipeline.map((stage, i) => (
            <motion.li
              key={stage.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easeOutExpo } },
              }}
              className="group relative bg-bg p-5 transition-colors duration-300 hover:bg-surface md:p-6"
            >
              <span className="font-mono text-2xs tracking-[0.16em] text-text-faint tabular">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-base font-medium text-text">{stage.label}</p>
              <p className="mt-1 text-sm text-text-muted">{stage.note}</p>
              {/* Accent edge that draws in on hover — the interaction is the
                  same everywhere on this rail, so it reads as one component. */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
              />
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
