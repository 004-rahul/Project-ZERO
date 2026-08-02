import type { ReactNode } from "react";
import Link from "next/link";
import { AiOrb } from "@/components/landing/ai-orb";
import { FlowLines } from "@/components/landing/flow-lines";

/**
 * Shared auth layout (Design Bible §19.1 — v4 visual language): the Zero Orb
 * listening on a deep graphite panel with flow lines, the form on the warm
 * cream canvas inside a bordered white card. ANONYMITY RULE: nothing
 * personalized may render here — the platform cannot know who the user is
 * before sign-in.
 */
export function AuthPanel({
  headline,
  subline,
  badges,
  children,
}: {
  headline: ReactNode;
  subline: string;
  badges: string[];
  children: ReactNode;
}) {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[46fr_54fr]">
      <section className="relative hidden flex-col overflow-hidden bg-zone-header p-9 lg:flex">
        <FlowLines />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-[52%] animate-glow-pulse rounded-full bg-[radial-gradient(circle,rgba(124,58,237,.25),transparent_65%)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%]">
          <AiOrb state="listening" size={340} variant="dark" />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,.35)]">
            Z
          </span>
          <span className="text-md font-bold text-on-dark">Project Zero</span>
        </Link>

        <div className="relative z-10 mt-auto">
          <p className="max-w-sm text-2xl font-extrabold leading-snug tracking-tight text-on-dark">
            {headline}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-on-dark-muted">{subline}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-2xs font-semibold text-on-dark-muted backdrop-blur-sm"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center bg-cream p-6 sm:p-10">
        <div className="w-full max-w-md animate-fade-up rounded-lg border border-line/80 bg-card p-7 shadow-lift sm:p-9">
          {children}
        </div>
      </section>
    </main>
  );
}

export function SsoButtons() {
  return (
    <div className="mt-6 grid grid-cols-3 gap-2.5">
      {["Google", "Microsoft", "GitHub"].map((provider) => (
        <button
          key={provider}
          type="button"
          className="rounded-lg border border-line bg-cream py-2.5 text-xs font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-card"
        >
          {provider}
        </button>
      ))}
    </div>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="my-5 flex items-center gap-3 text-2xs uppercase tracking-widest text-faint">
      <span className="h-px flex-1 bg-line" />
      {label}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export function Field({
  label,
  type,
  placeholder,
  autoComplete,
}: {
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-xs font-semibold text-ink">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow placeholder:text-faint focus:border-accent focus:bg-card focus:shadow-[0_0_0_3px_rgba(124,58,237,.12)]"
      />
    </label>
  );
}

/** Primary auth action — matches the landing's solid violet CTA language. */
export function AuthSubmit({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="w-full rounded-lg bg-accent py-3 text-base font-bold text-white shadow-[0_4px_20px_rgba(124,58,237,.35),inset_0_1px_0_rgba(255,255,255,.35)] transition-all hover:-translate-y-0.5 hover:bg-accent-strong"
    >
      {children}
    </button>
  );
}
