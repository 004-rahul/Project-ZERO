"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Magnetic } from "./magnetic";

/**
 * Landing chrome (Design Bible §19.4 v3.6): a fixed full-width glass bar
 * pinned to the top edge — not floating — with a violet scroll-progress
 * line beneath it. Anonymous by rule (§19.1).
 */
export function LandingNav() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/80 bg-cream/85 backdrop-blur-xl">
      <div className="flex items-center gap-8 px-5 py-3.5 sm:px-8 lg:px-[4vw]">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,.35)]">
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
              className="block rounded-lg border border-line bg-card px-4 py-2 text-sm font-semibold text-ink shadow-card transition-colors hover:border-accent hover:text-accent"
            >
              Log in
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/register"
              className="block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(124,58,237,.35),inset_0_1px_0_rgba(255,255,255,.35)] transition-colors hover:bg-accent-strong"
            >
              Start free
            </Link>
          </Magnetic>
        </div>
      </div>
      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-0.5 bg-accent"
        style={{ width: `${progress}%` }}
      />
    </header>
  );
}
