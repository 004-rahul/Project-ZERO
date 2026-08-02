"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "./magnetic";

/**
 * Landing chrome (Design Bible §19.4 v3.3): a floating glass bar (12px radius)
 * that hides on scroll-down and returns on scroll-up, plus a top scroll-
 * progress line. Anonymous by rule — no personalized content pre-auth (§19.1).
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
        className="fixed left-0 top-0 z-[60] h-0.5 bg-aurora-strong"
        style={{ width: `${progress}%` }}
      />
      <header
        className={`fixed inset-x-4 top-4 z-50 flex items-center gap-8 rounded-lg border border-white/[.12] bg-void/70 px-5 py-3 shadow-lift backdrop-blur-xl transition-transform duration-500 [transition-timing-function:cubic-bezier(.2,.7,.2,1)] sm:inset-x-6 lg:inset-x-[4vw] lg:px-8 ${
          hidden ? "-translate-y-24" : "translate-y-0"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-aurora-strong text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,.3)]">
            Z
          </span>
          <span className="text-md font-bold text-on-dark">Project Zero</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-7 text-sm font-medium text-on-dark-muted lg:flex">
          <a href="#features" className="transition-colors hover:text-on-dark">
            Features
          </a>
          <a href="#how" className="transition-colors hover:text-on-dark">
            How it works
          </a>
          <a href="#pricing" className="transition-colors hover:text-on-dark">
            Pricing
          </a>
          <a href="#faq" className="transition-colors hover:text-on-dark">
            FAQ
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <Magnetic className="hidden sm:block">
            <Link
              href="/login"
              className="block rounded-lg border border-white/[.16] px-4 py-2 text-sm font-semibold text-on-dark transition-colors hover:bg-white/10"
            >
              Log in
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/register"
              className="block rounded-lg bg-aurora-strong px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(197,95,214,.35),inset_0_1px_0_rgba(255,255,255,.3)] transition-colors hover:bg-aurora-pink"
            >
              Start free
            </Link>
          </Magnetic>
        </div>
      </header>
    </>
  );
}
