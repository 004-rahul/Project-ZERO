import Link from "next/link";
import { FOOTER_COLS } from "../content";
import { Mono, Rule, Shell } from "@/components/ui";

/**
 * Footer. The wordmark is set as an oversized watermark clipped by the page
 * edge — it closes the composition at the same scale the hero opened it,
 * rather than trailing off into small print.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-zone-footer pt-20">
      <Shell className="relative">
        <div className="grid grid-cols-12 gap-y-10 pb-16 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-black text-void">
                Z
              </span>
              <span className="text-md font-bold text-ink">Project Zero</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              Enterprise intelligence, grounded in the systems your organization already runs.
            </p>
          </div>

          {FOOTER_COLS.map((col) => (
            <nav key={col.head} className="col-span-6 sm:col-span-4 lg:col-span-2 lg:col-start-auto">
              <Mono className="text-faint">{col.head}</Mono>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted transition-colors hover:text-accent"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Rule />

        <div className="flex flex-wrap items-center justify-between gap-4 py-7">
          <Mono className="text-faint">© {new Date().getFullYear()} Project Zero</Mono>
          <Mono className="text-faint">Tenant isolated · audit logged</Mono>
        </div>
      </Shell>

      {/* clipped by the page edge on purpose — it reads as a mark, not a label */}
      <span
        aria-hidden
        className="pointer-events-none block select-none text-center text-[26vw] font-black leading-[0.72] tracking-[-0.06em] text-ink/[.04]"
      >
        ZERO
      </span>
    </footer>
  );
}
