"use client";

import Link from "next/link";
import { AiOrb } from "@/components/landing/ai-orb";
import { FOOTER_COLS, INTEGRATION_CATEGORIES } from "@/components/landing/content";
import { Enter, Lines } from "../motion";
import { Action, Bound, Label, Pulse } from "../kit";

/**
 * Close — the ask, then the index.
 *
 * The final module is the only one with no section label. Dropping the
 * numbering signals the argument is finished: this is not another exhibit.
 * Type returns to hero scale so the page opens and closes in the same voice,
 * and the footer is folded into the same surface rather than starting a new
 * one — a separate footer band would re-open the page after closing it.
 */
export function Close() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-zone-footer">
      <Bound wide className="relative pt-28 md:pt-40">
        <div className="grid grid-cols-12 items-center gap-y-14 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-7">
            <Pulse label="Free plan · no credit card" />
            <Lines
              as="h2"
              className="mt-7 text-[clamp(40px,6vw,88px)] font-black leading-[0.9] tracking-[-0.055em] text-ink"
            >
              {["Ask your first", "question in", "five minutes."]}
            </Lines>
            <Enter delay={0.12} className="mt-9 max-w-md">
              <p className="text-md leading-relaxed text-muted">
                Connect one tool, ask one question, and read the citations it comes back with.
              </p>
            </Enter>
            <Enter delay={0.18} className="mt-10">
              <div className="flex flex-wrap items-center gap-5">
                <Action href="/register">Start free</Action>
                <Action href="/login" variant="bare" icon="→">
                  Log in
                </Action>
              </div>
            </Enter>
          </div>

          <div className="col-span-12 flex justify-center lg:col-span-5">
            <AiOrb state="speaking" size={260} />
          </div>
        </div>

        {/* index */}
        <div className="mt-28 grid grid-cols-12 gap-y-10 border-t border-line pt-14 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center bg-accent text-sm font-black text-void">
                Z
              </span>
              <span className="text-md font-bold text-ink">Project Zero</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              Enterprise intelligence, grounded in the systems your organization already runs.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5">
              {INTEGRATION_CATEGORIES.slice(0, 4).map((c) => (
                <Label key={c} className="text-faint">
                  {c}
                </Label>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map((col) => (
            <nav key={col.head} className="col-span-6 sm:col-span-4 lg:col-span-2">
              <Label className="text-faint">{col.head}</Label>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted transition-colors hover:text-accent">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-7">
          <Label className="text-faint">© {new Date().getFullYear()} Project Zero</Label>
          <Label className="text-faint">Tenant isolated · audit logged</Label>
        </div>
      </Bound>

      {/* the mark, clipped by the page edge */}
      <span
        aria-hidden
        className="pointer-events-none block select-none text-center text-[24vw] font-black leading-[0.7] tracking-[-0.07em] text-ink/[.035]"
      >
        ZERO
      </span>
    </footer>
  );
}
