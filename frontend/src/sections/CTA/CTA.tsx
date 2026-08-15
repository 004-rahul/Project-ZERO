import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Container } from "@/components/layout/Container";
import { cta } from "@/content/copy";
import { Magnetic, TextReveal } from "@/motion/primitives";

/**
 * CLOSING FRAME.
 *
 * A single accent wash that grows as the section is approached, so the page
 * warms toward its one ask instead of ending on a flat band. Everything else
 * here is quiet on purpose — this is the last thing read, and competing
 * motion at the point of decision is the most expensive place to be busy.
 */
export function CTA() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "center center"],
  });

  const glow = useTransform(scrollYProgress, [0, 1], [0.18, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1.15]);

  return (
    <section ref={section} id="access" className="relative overflow-hidden py-36 md:py-48">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: glow,
          scale,
          background:
            "radial-gradient(58% 44% at 50% 62%, var(--accent-subtle), transparent 70%)",
        }}
      />

      <Container className="relative">
        <div className="max-w-[52rem]">
          <h2 className="text-4xl leading-[1.02] font-semibold tracking-[-0.045em] text-text">
            <TextReveal lines={cta.title} lineClassName="[&:last-child]:text-text-muted" />
          </h2>
          <p className="mt-7 max-w-[48ch] text-lg leading-relaxed text-text-muted">
            {cta.body}
          </p>

          <div className="mt-11 flex flex-wrap items-center gap-5">
            <Magnetic strength={0.4}>
              <a
                href="#"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-md bg-accent px-7 py-4 text-sm font-medium text-text-on-accent transition-colors duration-150 hover:bg-accent-hover"
                style={{ boxShadow: "var(--glow)" }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-[130%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[130%]"
                />
                <span className="relative">{cta.action}</span>
                <span className="relative transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Magnetic>
            <p className="max-w-[30ch] text-sm text-text-faint">{cta.note}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
