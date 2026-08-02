"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "./magnetic";

/**
 * Landing chrome (Design Bible §19.4 v3.5 — light): a floating white glass
 * bar that hides on scroll-down and returns on scroll-up, plus a violet
 * scroll-progress line. Anonymous by rule (§19.1).
 */
export function LandingNav() {
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (y / max) * 100 : 0);
      setHidden(y > lastY.current && y > 300);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="fixed left-0 top-0 z-[60] h-0.5 bg-accent"
        style={{ width: `${progress}%` }}
      />
      <header
        className={`fixed inset-x-4 top-4 z-50 flex items-center gap-8 rounded-lg border border-line bg-white/85 px-5 py-3 shadow-card backdrop-blur-xl transition-transform duration-500 [transition-timing-function:cubic-bezier(.2,.7,.2,1)] sm:inset-x-6 lg:inset-x-[4vw] lg:px-8 ${
          hidden ? "-translate-y-24" : "translate-y-0"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-black text-white">
            Z
          </span>
          <span className="text-md font-bold text-ink">Project Zero</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-7 text-sm font-medium text-muted lg:flex">
          <a href="#features" className="transition-colors hover:text-ink">
            Features
          </a>
          <a href="#how" className="transition-colors hover:text-ink">
            How it works
          </a>
          <a href="#pricing" className="transition-colors hover:text-ink">
            Pricing
          </a>
          <a href="#faq" className="transition-colors hover:text-ink">
            FAQ
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <Magnetic className="hidden sm:block">
            <Link
              href="/login"
              className="block rounded-lg border border-line-strong px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Log in
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/register"
              className="block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-accent-glow transition-colors hover:bg-accent-strong"
            >
              Start free
            </Link>
          </Magnetic>
        </div>
      </header>
    </>
  );
}
