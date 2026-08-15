"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Magnetic } from "../motion";
import { Action, Label } from "../kit";

/**
 * Chrome — the fixed bar and the section rail.
 *
 * The bar never changes size or gains a border on scroll: its backdrop
 * cross-fades as its own layer, because toggling a border shifts every pixel
 * below it and backdrop-blur cannot be transitioned.
 *
 * The rail is the navigation. On wide screens the page indexes itself down the
 * left edge instead of hiding the structure behind menu labels — it shows the
 * reader how much page is left, which a top nav never does.
 */

const SECTIONS = [
  { id: "capabilities", label: "Capabilities" },
  { id: "process", label: "Process" },
  { id: "plans", label: "Plans" },
  { id: "trust", label: "Trust" },
];

export function Chrome() {
  const { scrollYProgress } = useScroll();
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (v) => setSolid(v > 0.015));

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        const top = es
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0.01, 0.2, 0.5] },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 border-b border-line bg-zone-header/80 backdrop-blur-xl transition-opacity duration-500 ease-out ${
            solid ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="relative mx-auto flex w-full max-w-[1680px] items-center gap-8 px-5 py-4 sm:px-8 lg:px-14">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center bg-accent text-sm font-black text-void">
              Z
            </span>
            <span className="text-md font-bold tracking-tight text-ink">Project Zero</span>
          </Link>

          <div className="ml-auto flex items-center gap-5">
            <Link
              href="/login"
              className="hidden text-sm font-semibold text-muted transition-colors hover:text-ink sm:block"
            >
              Log in
            </Link>
            <Magnetic strength={0.16}>
              <Action href="/register" size="sm">
                Start free
              </Action>
            </Magnetic>
          </div>
        </div>
        <motion.div
          aria-hidden
          style={{ scaleX: scrollYProgress }}
          className="h-px origin-left bg-accent"
        />
      </header>

      {/* section rail — the page indexes itself */}
      <nav
        aria-label="Sections"
        className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
      >
        <ul className="flex flex-col gap-5">
          {SECTIONS.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id}>
                <a href={`#${s.id}`} className="group flex items-center gap-3">
                  <span
                    className={`block h-px transition-all duration-300 ${
                      on ? "w-8 bg-accent" : "w-4 bg-line-strong group-hover:w-6 group-hover:bg-muted"
                    }`}
                  />
                  <Label
                    className={`transition-opacity duration-300 ${
                      on ? "text-accent opacity-100" : "text-faint opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {s.label}
                  </Label>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
