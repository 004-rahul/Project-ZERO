"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/motion";
import { Button, Mono } from "@/components/ui";

/**
 * Chrome. The bar itself never changes size or borders on scroll — its
 * backdrop cross-fades as a separate layer, because toggling a border shifts
 * every pixel below it and backdrop-blur cannot be transitioned at all.
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

  useMotionValueEvent(scrollYProgress, "change", (v) => setSolid(v > 0.02));

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top) setActive(top.target.id);
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
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 border-b border-line bg-zone-header/85 backdrop-blur-xl transition-opacity duration-500 ease-out ${
          solid ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="relative mx-auto flex w-full max-w-[1400px] items-center gap-8 px-6 py-4 md:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-black text-void">
            Z
          </span>
          <span className="text-md font-bold text-ink">Project Zero</span>
        </Link>

        <nav className="relative ml-auto hidden items-center gap-1 lg:flex">
          {LINKS.map(({ href, label, id }) => (
            <a
              key={id}
              href={href}
              className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                active === id ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {active === id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-lg bg-raised"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <Magnetic strength={0.16}>
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink sm:block"
            >
              Log in
            </Link>
          </Magnetic>
          <Magnetic strength={0.16}>
            <Button href="/register" size="sm">
              Start free
            </Button>
          </Magnetic>
        </div>
      </div>

      {/* read position, not decoration */}
      <motion.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="h-px origin-left bg-accent"
      />
      <span className="sr-only">
        <Mono>navigation</Mono>
      </span>
    </header>
  );
}
