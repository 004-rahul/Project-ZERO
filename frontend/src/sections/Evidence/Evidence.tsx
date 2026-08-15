import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Container } from "@/components/layout/Container";
import { evidence } from "@/content/copy";
import { MaskReveal, TextReveal } from "@/motion/primitives";
import { easeOutExpo } from "@/motion/easings";
import { duration, viewport } from "@/motion/durations";

/**
 * STICKY SPLIT — one half holds, the other moves past it.
 *
 * The asymmetry is deliberate: the claim stays on screen while its
 * supporting detail scrolls through, so the reader never loses the thesis
 * while reading the proof. It is the layout equivalent of the product's own
 * argument — keep the answer and the evidence visible together.
 */
export function Evidence() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });

  // Very slight counter-drift on the pinned half so the two columns are
  // clearly moving at different rates rather than one being simply frozen.
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section ref={section} id="trust" className="relative py-32 md:py-44">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <motion.div style={{ y }} className="lg:sticky lg:top-32">
              <p className="font-mono text-2xs tracking-[0.2em] text-accent-contrast uppercase">
                {evidence.eyebrow}
              </p>
              <h2 className="mt-6 text-3xl leading-[1.06] font-semibold tracking-[-0.035em] text-text">
                <TextReveal lines={[evidence.title]} />
              </h2>
              <p className="mt-6 max-w-[40ch] text-base leading-relaxed text-text-muted">
                {evidence.body}
              </p>
            </motion.div>
          </div>

          <ul className="lg:col-span-6 lg:col-start-7">
            {evidence.items.map((item, i) => (
              <motion.li
                key={item.k}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: duration.slow, ease: easeOutExpo, delay: i * 0.06 }}
                className="group border-b border-line-subtle py-8 first:border-t"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <h3 className="text-lg font-medium text-text">{item.k}</h3>
                  <span className="font-mono text-2xs text-text-faint tabular">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-text-muted">
                  {item.v}
                </p>
                <MaskReveal>
                  <span className="mt-6 block h-px w-0 bg-accent transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
                </MaskReveal>
              </motion.li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
