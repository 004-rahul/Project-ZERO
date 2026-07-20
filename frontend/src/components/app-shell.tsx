import Link from "next/link";
import type { ReactNode } from "react";
import { ParticleFace } from "@/components/particle-face";

/**
 * The four-zone application shell (Design Bible v3.1 §9): Graphite-Ink header,
 * Graphite-Panel sidebar, Neutral-White canvas, Deep-Graphite footer.
 */

const NAV_SECTIONS: { label: string; items: { name: string; icon: string; href: string }[] }[] = [
  {
    label: "Platform",
    items: [
      { name: "Dashboard", icon: "◪", href: "/dashboard" },
      { name: "AI Workspace", icon: "✦", href: "/dashboard" },
      { name: "Knowledge", icon: "◈", href: "/dashboard" },
      { name: "Decisions", icon: "⚖", href: "/dashboard" },
      { name: "Connectors", icon: "⇄", href: "/dashboard" },
    ],
  },
  {
    label: "Manage",
    items: [
      { name: "Organization", icon: "▦", href: "/dashboard" },
      { name: "Files", icon: "▤", href: "/dashboard" },
      { name: "Notifications", icon: "◷", href: "/dashboard" },
      { name: "Settings", icon: "⚙", href: "/dashboard" },
    ],
  },
];

export function AppShell({ active, children }: { active: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-rows-[60px_1fr_38px] grid-cols-1 lg:grid-cols-[244px_1fr] lg:[grid-template-areas:'header_header''sidebar_main''footer_footer']">
      {/* header */}
      <header className="z-10 flex items-center gap-6 border-b border-white/10 bg-zone-header px-5 lg:[grid-area:header]">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-accent text-sm font-extrabold text-white">
            Z
          </span>
          <span className="text-base font-bold text-on-dark">Project Zero</span>
        </Link>
        <div className="hidden max-w-md flex-1 items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-on-dark-muted md:flex">
          ⌕ Ask anything about your organization…
          <kbd className="ml-auto rounded border border-white/20 px-1.5 py-0.5 text-2xs">Ctrl K</kbd>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1.5 pr-3 text-xs text-on-dark-muted">
            <ParticleFace state="idle" size={24} lines={false} />
            AI Ready
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-strong text-xs font-bold text-white">
            ZO
          </span>
        </div>
      </header>

      {/* sidebar */}
      <aside className="hidden flex-col bg-zone-sidebar p-3 lg:flex lg:[grid-area:sidebar]">
        {NAV_SECTIONS.map((section) => (
          <nav key={section.label} aria-label={section.label}>
            <p className="px-3 pb-1.5 pt-4 text-2xs font-bold uppercase tracking-widest text-[#6E7077]">
              {section.label}
            </p>
            {section.items.map((item) => {
              const isActive = item.name === active;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative my-px flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-white/10 text-white before:absolute before:-left-2 before:bottom-1.5 before:top-1.5 before:w-0.5 before:rounded before:bg-accent"
                      : "text-on-dark-muted hover:bg-white/5 hover:text-on-dark"
                  }`}
                >
                  <span className="w-4 text-center opacity-85" aria-hidden>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        ))}
        <div className="mt-auto border-t border-white/10 px-3 pt-3 text-xs text-on-dark-muted">
          <span className="mb-2 inline-block rounded-full border border-accent/35 px-3 py-1 text-2xs font-bold uppercase tracking-wider text-accent-bright">
            Development build
          </span>
        </div>
      </aside>

      {/* canvas */}
      <main className="overflow-auto bg-zone-canvas p-7 lg:[grid-area:main]">{children}</main>

      {/* footer */}
      <footer className="flex items-center gap-6 border-t border-white/5 bg-zone-footer px-5 text-2xs text-[#7C7E85] lg:[grid-area:footer]">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_0_3px_rgba(22,163,74,.14)]" />
          All systems operational
        </span>
        <span className="ml-auto">
          <b className="font-semibold text-[#BFC1C7]">Project Zero</b> © 2026
        </span>
      </footer>
    </div>
  );
}
