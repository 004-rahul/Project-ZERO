import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { hero } from "@/content/copy";
import { Container } from "@/components/layout/Container";
import { DecisionBrief } from "@/components/product/DecisionBrief";
import { Magnetic, TextReveal } from "@/motion/primitives";
import { easeOutExpo } from "@/motion/easings";
import { duration } from "@/motion/durations";

/**
 * HERO.
 *
 * Composition rules, each one a correction to what read as generated:
 *
 * 1. The product is on screen in the first viewport. A B2B site that shows
 *    no interface is the clearest template tell there is.
 * 2. Type scale is violently contrasted — a display headline against 11px
 *    mono metadata — instead of three sizes that are all roughly similar.
 * 3. The panel overlaps the baseline rule and bleeds past the grid column.
 *    Nothing that reads as designed sits politely inside its box.
 * 4. Depth comes from a graded ambient field, not from drawn rules. An
 *    earlier version had vertical hairlines at the gutters; they read as
 *    arbitrary because they marked nothing. A line has to mean something.
 * 5. Density is deliberately uneven: an airy left column against a dense
 *    right panel. Even distribution is what makes a layout feel automated.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });

  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const panelY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={section} className="relative overflow-hidden pt-32 pb-0 md:pt-40">
      {/* Ambient grade rather than drawn rules. The previous version had
          vertical hairlines at the gutters and the two-thirds column; they
          read as arbitrary lines because they marked nothing the reader
          could act on. Colour depth does the same job — giving the frame a
          shape — without asking the eye to explain a line. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="wash-cool absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(48% 38% at 78% 34%, var(--second-subtle), transparent 68%)",
          }}
        />
      </div>

      <Container className="relative">
        <div className="grid grid-cols-1 items-start gap-y-14 lg:grid-cols-12 lg:gap-x-10">
          {/* ── left: airy, display type ── */}
          <motion.div style={{ y: copyY, opacity: fade }} className="lg:col-span-7 lg:pr-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: duration.base, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="rounded-full border border-line-strong px-2.5 py-1 font-mono text-2xs tracking-[0.12em] text-accent-contrast uppercase">
                Private beta
              </span>
              <span className="font-mono text-2xs tracking-[0.18em] text-text-faint uppercase">
                {hero.eyebrow}
              </span>
            </motion.div>

            <h1 className="mt-9 text-[clamp(2.6rem,6.4vw,5.2rem)] leading-[0.94] font-semibold tracking-[-0.052em] text-text">
              <TextReveal lines={hero.headline} delay={0.18} />
              <TextReveal
                lines={[hero.headlineAccent]}
                delay={0.42}
                lineClassName="text-text-faint"
              />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.slow, ease: easeOutExpo, delay: 0.68 }}
              className="mt-8 max-w-[44ch] text-[17px] leading-relaxed text-text-muted"
            >
              {hero.sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.slow, ease: easeOutExpo, delay: 0.8 }}
              className="mt-10 flex flex-wrap items-center gap-5"
            >
              <Magnetic>
                <a
                  href="#access"
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-md bg-accent px-6 py-3.5 text-sm font-medium text-text-on-accent transition-colors duration-150 hover:bg-accent-hover"
                  style={{ boxShadow: "var(--glow)" }}
                >
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
                className="text-sm font-medium text-text-muted underline-offset-[6px] transition-colors duration-150 hover:text-text hover:underline"
              >
                {hero.secondary}
              </a>
            </motion.div>
          </motion.div>

          {/* ── right: dense, the product itself, bleeding past the column ── */}
          <motion.div
            style={{ y: panelY }}
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: easeOutExpo, delay: 0.34 }}
            className="relative lg:col-span-5 lg:-mr-[6vw] xl:-mr-[9vw]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-20"
              style={{
                background:
                  "radial-gradient(50% 40% at 50% 45%, var(--accent-subtle), transparent 72%)",
              }}
            />
            <DecisionBrief className="relative" />
          </motion.div>
        </div>
      </Container>

      {/* ── baseline spec strip: dense, factual, full-bleed ── */}
      <div className="relative mt-20 border-t border-line-subtle md:mt-28">
        <Container>
          <dl className="grid grid-cols-2 divide-x divide-line-subtle md:grid-cols-4">
            {[
              ["Sources per answer", "4–12"],
              ["Median response", "4.1s"],
              ["Tenant isolation", "Enforced in query"],
              ["Model lock-in", "None"],
            ].map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.95 + i * 0.06, duration: duration.slow }}
                className="px-5 py-6 first:pl-0"
              >
                <dt className="font-mono text-2xs tracking-[0.14em] text-text-faint uppercase">
                  {k}
                </dt>
                <dd className="mt-2 text-lg font-medium tracking-[-0.02em] text-text tabular">
                  {v}
                </dd>
              </motion.div>
            ))}
          </dl>
        </Container>
      </div>
    </section>
  );
}
