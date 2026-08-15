import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Container } from "@/components/layout/Container";
import { evidence } from "@/content/copy";
import { easeOutExpo } from "@/motion/easings";
import { duration, viewport } from "@/motion/durations";

/**
 * SPEC SHEET.
 *
 * Deliberately the densest, most technical block on the page — a numbered
 * table with hairline rules rather than cards. Density contrast is what
 * gives a long page rhythm; if every section breathes the same amount, the
 * whole thing reads as one template applied repeatedly.
 *
 * The heading is set against the left rule and runs into the table, so the
 * section has no "header band" of its own.
 */
export function Evidence() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section
      ref={section}
      id="trust"
      className="relative border-t border-line-subtle py-28 md:py-36"
    >
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <motion.div style={{ y }} className="lg:sticky lg:top-32">
              <h2 className="text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.04] font-semibold tracking-[-0.038em] text-text">
                {evidence.title}
              </h2>
              <p className="mt-6 max-w-[36ch] text-base leading-relaxed text-text-muted">
                {evidence.body}
              </p>
              <div className="mt-8 inline-flex items-center gap-2.5 rounded-md border border-line-subtle px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-second" />
                <span className="font-mono text-2xs tracking-[0.12em] text-text-muted uppercase">
                  {evidence.eyebrow}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <ul>
              {evidence.items.map((item, i) => (
                <motion.li
                  key={item.k}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewport}
                  transition={{ duration: duration.slow, ease: easeOutExpo, delay: i * 0.07 }}
                  className="group relative grid grid-cols-[3rem_1fr] gap-5 border-t border-line-subtle py-7 last:border-b"
                >
                  <span className="font-mono text-2xs text-text-faint tabular">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium tracking-[-0.015em] text-text">
                      {item.k}
                    </h3>
                    <p className="mt-1.5 max-w-[52ch] text-sm leading-relaxed text-text-muted">
                      {item.v}
                    </p>
                  </div>
                  {/* rule that draws in from the number column on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute -top-px left-0 h-px w-0 bg-accent transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
                  />
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
