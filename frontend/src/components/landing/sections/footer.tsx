import Link from "next/link";
import { FOOTER_COLS } from "../content";
import { Shell } from "../primitives";

/**
 * Footer (Design Bible §19.4): graphite continuation of the closing band with
 * an oversized wordmark watermark, so the page ends on brand rather than on a
 * thin legal strip.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-zone-footer pb-10 pt-16">
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none text-[26vw] font-black leading-none tracking-[-0.06em] text-white/[.025]"
      >
        ZERO
      </span>

      <Shell className="relative">
        <div className="grid grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-12 md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-black text-white">
                Z
              </span>
              <span className="text-md font-bold text-on-dark">Project Zero</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-on-dark-muted">
              The intelligence layer over the tools you already use. Every answer with proof.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Tenant-isolated", "Audited", "Provider-agnostic"].map((b) => (
                <span
                  key={b}
                  className="rounded-md border border-white/10 bg-white/[.03] px-2.5 py-1 text-2xs font-semibold text-on-dark-muted"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.head} className="col-span-6 md:col-span-2">
              <h4 className="text-2xs font-extrabold uppercase tracking-[.18em] text-on-dark-muted/60">
                {col.head}
              </h4>
              <ul className="mt-5 space-y-3 text-sm text-on-dark-muted">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1.5 transition-colors hover:text-on-dark"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-12 md:col-span-1" />
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-on-dark-muted/60 md:flex-row">
          <span>© 2026 Project Zero. All rights reserved.</span>
          <span className="pz-num">Privacy · Terms · DPA · Trust Center</span>
        </div>
      </Shell>
    </footer>
  );
}
