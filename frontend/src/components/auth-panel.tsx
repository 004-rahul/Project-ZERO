import type { ReactNode } from "react";
import Link from "next/link";
import { ParticleFace } from "@/components/particle-face";

/**
 * Shared auth layout (Design Bible v3.1 §19.1): the signature face on a dark
 * graphite panel, the form on light. ANONYMITY RULE: nothing personalized may
 * render here — the platform cannot know who the user is before sign-in.
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
      <section className="relative hidden flex-col overflow-hidden bg-zone-footer p-9 lg:flex">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-[52%] animate-glow-pulse rounded-full bg-[radial-gradient(circle,rgba(124,58,237,.22),transparent_65%)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[54%]">
          <ParticleFace state="listening" size={420} />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-gradient-to-br from-accent to-accent-strong text-sm font-extrabold text-white">
            Z
          </span>
          <span className="text-md font-bold text-on-dark">Project Zero</span>
        </Link>

        <div className="relative z-10 mt-auto">
          <p className="max-w-sm text-lg font-semibold leading-snug text-on-dark">{headline}</p>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-on-dark-muted">{subline}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/15 px-3 py-1 text-2xs font-semibold text-on-dark-muted"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center bg-zone-canvas p-10">
        <div className="w-full max-w-sm animate-fade-up">{children}</div>
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
          className="rounded-md border border-line-strong bg-card py-2.5 text-xs font-semibold text-ink shadow-card transition-transform hover:-translate-y-0.5"
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
        className="w-full rounded-md border border-line-strong bg-card px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow placeholder:text-faint focus:border-accent focus:shadow-[0_0_0_3px_rgba(124,58,237,.12)]"
      />
    </label>
  );
}
