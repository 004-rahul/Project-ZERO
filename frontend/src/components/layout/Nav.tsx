import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { nav } from "@/content/copy";
import { Container } from "./Container";
import { cn } from "@/lib/cn";

/**
 * The bar earns its background only once the page has moved. A permanently
 * filled bar sitting over a hero is the single most common giveaway of a
 * template layout.
 */
export function Nav() {
  const { scrollY } = useScroll();
  const [lifted, setLifted] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setLifted(v > 24));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        lifted && "border-b border-line-subtle bg-bg/80 backdrop-blur-xl",
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between md:h-[4.5rem]">
          <a href="#" className="flex items-center gap-2.5" aria-label="Project Zero, home">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-[2px] bg-accent"
              style={{ boxShadow: "var(--glow)" }}
            />
            <span className="text-sm font-semibold tracking-tight text-text">
              Project Zero
            </span>
          </a>

          <ul className="hidden items-center gap-9 md:flex">
            {nav.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative text-sm text-text-muted transition-colors duration-150 hover:text-text"
                >
                  {l.label}
                  <motion.span
                    aria-hidden="true"
                    className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#access"
            className="rounded-md border border-line-strong px-4 py-2 text-sm font-medium text-text transition-colors duration-150 hover:border-accent hover:text-accent-contrast"
          >
            {nav.cta}
          </a>
        </nav>
      </Container>
    </header>
  );
}
