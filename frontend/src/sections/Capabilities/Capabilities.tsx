import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Container } from "@/components/layout/Container";
import { capabilities } from "@/content/copy";
import { MaskReveal } from "@/motion/primitives";

/**
 * HORIZONTAL RAIL — vertical scroll drives horizontal travel.
 *
 * The axis change is the point. A page that only ever moves one direction
 * reads as a document; one that redirects your motion reads as designed. It
 * also earns the reader's attention for a list that would otherwise be a
 * grid of boxes they skim past.
 *
 * Cards counter-rotate very slightly as they travel, so the rail has depth
 * rather than sliding as one flat plane.
 */
export function Capabilities() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-62%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [1.2, -1.2]);

  return (
    <section ref={section} id="capabilities" className="relative h-[320svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <Container>
          <MaskReveal>
            <p className="font-mono text-2xs tracking-[0.2em] text-text-faint uppercase">
              What it does that the others do not
            </p>
          </MaskReveal>
        </Container>

        <motion.ul style={{ x }} className="mt-12 flex w-max gap-5 pl-[5vw]">
          {capabilities.map((c) => (
            <motion.li
              key={c.k}
              style={{ rotate }}
              className="group relative flex h-[19rem] w-[21rem] flex-col justify-between rounded-xl border border-line-subtle bg-surface p-7 transition-colors duration-500 hover:border-line-strong md:w-[24rem]"
            >
              {/* Accent wash that arrives from the corner on hover — one
                  gradient, no extra DOM, transform-free. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(120% 90% at 100% 0%, var(--accent-subtle), transparent 62%)",
                }}
              />
              <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
              <div className="relative">
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-text">{c.k}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{c.v}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
