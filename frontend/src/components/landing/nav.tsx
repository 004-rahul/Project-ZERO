"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "./magnetic";

/**
 * Landing chrome (Design Bible §19.4): a floating glass-pill navigation that
 * hides on scroll-down and returns on scroll-up, plus a top scroll-progress
 * line. Anonymous by rule — no personalized content pre-auth (§19.1).
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
        className="fixed left-0 top-0 z-[60] h-[2.5px] bg-gradient-to-r from-aurora-violet via-aurora-magenta to-aurora-amber"
        style={{ width: `${progress}%` }}
      />
      <header
        className={`fixed left-1/2 top-3.5 z-50 flex w-[min(1100px,94vw)] -translate-x-1/2 items-center gap-6 rounded-full border border-white/[.13] bg-white/5 px-5 py-2.5 shadow-lift backdrop-blur-xl transition-transform duration-500 [transition-timing-function:cubic-bezier(.2,.7,.2,1)] ${
          hidden ? "-translate-y-[84px]" : "translate-y-0"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-aurora-strong to-aurora-pink text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,.35)]">
            Z
          </span>
          <span className="text-md font-bold text-on-dark">Project Zero</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-6 text-sm text-on-dark-muted md:flex">
          <a href="#demo" className="transition-colors hover:text-on-dark">
            Demo
          </a>
          <a href="#story" className="transition-colors hover:text-on-dark">
            How it works
          </a>
          <a href="#caps" className="transition-colors hover:text-on-dark">
            Capabilities
          </a>
        </nav>
        <div className="flex items-center gap-2.5">
          <Magnetic>
            <Link
              href="/login"
              className="block rounded-full border border-white/[.18] px-4 py-2 text-sm font-semibold text-on-dark transition-colors hover:bg-white/10"
            >
              Log in
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/register"
              className="block rounded-full bg-gradient-to-br from-aurora-strong to-aurora-pink px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(197,95,214,.4),inset_0_1px_0_rgba(255,255,255,.3)]"
            >
              Get started
            </Link>
          </Magnetic>
        </div>
      </header>
    </>
  );
}
