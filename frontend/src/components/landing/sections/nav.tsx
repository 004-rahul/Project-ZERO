"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Magnetic } from "../primitives";

/**
 * Landing chrome (Design Bible §19.4): a fixed graphite bar with a sliding
 * active-section indicator, a scroll-progress hairline, and a translucency
 * that deepens once the hero is passed. Anonymous by rule (§19.1).
 */

const LINKS = [
  { href: "#features", label: "Features", id: "features" },
  { href: "#how", label: "How it works", id: "how" },
  { href: "#pricing", label: "Pricing", id: "pricing" },
  { href: "#faq", label: "FAQ", id: "faq" },
];

export function LandingNav() {
  const { scrollYProgress } = useScroll();
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (v) => setSolid(v > 0.03));

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0.01, 0.25, 0.5] },
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* The chrome cross-fades as its own layer. Toggling `border-b` shifts
          every following pixel by 1px on scroll, and `backdrop-blur` cannot be
          transitioned at all — both read as the bar snapping rather than
          settling. Opacity on a layer is smooth and costs no layout. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 border-b border-white/10 bg-zone-header/90 backdrop-blur-xl transition-opacity duration-500 ease-out ${
          solid ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="relative mx-auto flex w-full max-w-[1400px] items-center gap-8 px-6 py-4 md:px-10 lg:px-16">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black transition-colors ${
              solid ? "bg-accent text-white" : "bg-ink text-white"
            }`}
          >
            Z
          </span>
          <span
            className={`text-md font-bold transition-colors ${solid ? "text-on-dark" : "text-ink"}`}
          >
            Project Zero
          </span>
        </Link>

        <nav className="relative ml-auto hidden items-center gap-1 lg:flex">
          {LINKS.map(({ href, label, id }) => (
            <a
              key={id}
              href={href}
              className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                solid
                  ? active === id
                    ? "text-on-dark"
                    : "text-on-dark-muted hover:text-on-dark"
                  : active === id
                    ? "text-ink"
                    : "text-muted hover:text-ink"
              }`}
            >
              {active === id && (
                <motion.span
                  layoutId="nav-pill"
                  className={`absolute inset-0 -z-10 rounded-lg ${
                    solid ? "bg-white/10" : "bg-ink/[.06]"
                  }`}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <Magnetic strength={0.18}>
            <Link
              href="/login"
              className={`hidden rounded-lg border px-4 py-2 text-sm font-semibold transition-colors sm:block ${
                solid
                  ? "border-white/20 text-on-dark hover:bg-white/10"
                  : "border-line-strong text-ink hover:border-accent hover:text-accent"
              }`}
            >
              Log in
            </Link>
          </Magnetic>
          <Magnetic strength={0.18}>
            <Link
              href="/register"
              className="group relative block overflow-hidden rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(124,58,237,.35),inset_0_1px_0_rgba(255,255,255,.3)] transition-colors hover:bg-accent-strong"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/25 blur-md transition-transform duration-700 group-hover:translate-x-[400%] motion-reduce:hidden"
              />
              Start free
            </Link>
          </Magnetic>
        </div>
      </div>

      <motion.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="h-px origin-left bg-accent"
      />
    </header>
  );
}
