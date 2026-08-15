import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { hero } from "@/content/copy";
import { Container } from "@/components/layout/Container";
import { FieldLines } from "@/components/decor/FieldLines";
import { Magnetic, TextReveal } from "@/motion/primitives";
import { easeOutExpo } from "@/motion/easings";
import { duration } from "@/motion/durations";

/**
 * HERO.
 *
 * Deliberately no autoplaying graphic. A decorative animation looping in the
 * corner is the thing that reads as filler; the motion here is instead
 * *earned* — the composition responds to the reader leaving it.
 *
 * Three layers exit at different rates as you scroll away: the grid drifts
 * fastest, the headline slower, the rail slowest and last. Depth comes from
 * the rate difference, not from a blur or a scale.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });

  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "34%"]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.62], [1, 0]);
  const railY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    <section ref={section} className="relative min-h-svh overflow-hidden pt-36 pb-16 md:pt-44">
      <motion.div style={{ y: gridY, opacity: gridOpacity }} className="absolute inset-0">
        <FieldLines className="absolute inset-0" />
      </motion.div>

      <Container className="relative">
        <motion.div style={{ y: copyY, opacity: copyOpacity }}>
          <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-8 xl:col-span-7">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: duration.base, delay: 0.1 }}
                className="mb-8 flex items-center gap-3 font-mono text-2xs tracking-[0.22em] text-text-faint uppercase"
              >
                <span className="inline-block h-px w-9 bg-line-strong" />
                {hero.eyebrow}
              </motion.p>

              <h1 className="text-4xl leading-[0.97] font-semibold tracking-[-0.05em] text-text xl:text-5xl">
                <TextReveal lines={hero.headline} delay={0.2} />
                <TextReveal
                  lines={[hero.headlineAccent]}
                  delay={0.2 + hero.headline.length * 0.12}
                  lineClassName="text-text-muted"
                />
              </h1>
            </div>

            {/* Sub-copy offset into the right columns rather than sitting
                directly under the headline — the stagger across the grid is
                what stops the block reading as a stacked template. */}
            <div className="lg:col-span-5 lg:col-start-8 xl:col-start-9">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration.slow, ease: easeOutExpo, delay: 0.72 }}
                className="text-base leading-relaxed text-text-muted lg:mt-4"
              >
                {hero.sub}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration.slow, ease: easeOutExpo, delay: 0.84 }}
                className="mt-9 flex flex-wrap items-center gap-4"
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
            </div>
          </div>
        </motion.div>
      </Container>

      {/* Baseline rail. Anchors the composition to the bottom of the frame so
          the hero is not a block floating in the middle of the viewport. */}
      <motion.div
        style={{ y: railY }}
        className="absolute inset-x-0 bottom-0"
      >
        <Container>
          <div className="flex items-center justify-between border-t border-line-subtle py-6">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: duration.slow }}
              className="font-mono text-2xs tracking-[0.18em] text-text-faint uppercase"
            >
              Scroll to see the mechanism
            </motion.span>
            <motion.span
              aria-hidden="true"
              className="h-8 w-px bg-line-strong"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1.1, duration: duration.slow, ease: easeOutExpo }}
              style={{ transformOrigin: "top" }}
            />
          </div>
        </Container>
      </motion.div>
    </section>
  );
}
