import { FadeIn } from "@/components/fade-in";
import { CountUp } from "@/components/landing/count-up";
import { CustomCursor } from "@/components/landing/cursor";
import { GlossyButton } from "@/components/landing/glossy-button";
import { Hero } from "@/components/landing/hero";
import { LiveDemo } from "@/components/landing/live-demo";
import { Marquee } from "@/components/landing/marquee";
import { LandingNav } from "@/components/landing/nav";
import { ScrollStory } from "@/components/landing/scroll-story";
import { TiltCard } from "@/components/landing/tilt-card";

/**
 * Public landing page (Design Bible §19.4 v3.2 — Aurora): the living
 * Organism hero with a left-aligned headline, connector marquee, pinned
 * scroll story, in-page live demo (try before connecting anything),
 * glossy 3D capability bento, trust strip, and a closing CTA.
 * Anonymous by rule (§19.1). Aurora glows drift behind every section —
 * the page is never flat black.
 */

const FEATURES: { icon: string; title: string; body: string; wide?: boolean }[] = [
  { icon: "✦", title: "Evidence-backed answers", body: "Citations and an honest confidence score on every claim.", wide: true },
  { icon: "◈", title: "Permanent memory", body: "Knowledge that never leaves." },
  { icon: "⚖", title: "Decision briefs", body: "Recommendations you can defend." },
  { icon: "⇄", title: "Connect systems", body: "One secure connector platform." },
  { icon: "◉", title: "Your AI, your keys", body: "OpenAI, Anthropic, Azure, local." },
  { icon: "▦", title: "Governance built in", body: "Roles, approvals, and a full audit trail on every request.", wide: true },
];

const TRUST = [
  { icon: "⛨", title: "Hard tenant isolation", body: "Provable, tested, permanent." },
  { icon: "⚿", title: "Your data & keys", body: "Export anytime. No lock-in." },
  { icon: "☰", title: "Everything audited", body: "Every request, inspectable." },
  { icon: "✓", title: "Humans decide", body: "AI recommends. You approve." },
];

const STATS: { end: number; suffix: string; label: string }[] = [
  { end: 5, suffix: " min", label: "to first answer" },
  { end: 100, suffix: "%", label: "of answers cited" },
  { end: 0, suffix: "", label: "vendor lock-in" },
];

const FOOTER_COLS: { head: string; links: string[] }[] = [
  { head: "Product", links: ["Live demo", "How it works", "Capabilities", "Pricing"] },
  { head: "Security", links: ["Trust Center", "Tenant isolation", "Audit trail", "DPA"] },
  { head: "Company", links: ["About", "Contact", "Privacy", "Terms"] },
];

function Kicker({ children }: { children: string }) {
  return (
    <p className="text-center text-2xs font-extrabold uppercase tracking-[.24em] text-aurora-bright">
      {children}
    </p>
  );
}

function Divider() {
  return (
    <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  );
}

export default function LandingPage() {
  return (
    <main className="relative bg-void text-on-dark">
      {/* ambient aurora — the page is never flat black */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 -top-52 h-[720px] w-[720px] animate-drift-1 rounded-full bg-[radial-gradient(circle,rgba(192,132,252,.22),transparent_70%)] blur-3xl motion-reduce:animate-none" />
        <div className="absolute -right-36 top-[34%] h-[640px] w-[640px] animate-drift-2 rounded-full bg-[radial-gradient(circle,rgba(228,95,188,.18),transparent_70%)] blur-3xl motion-reduce:animate-none" />
        <div className="absolute bottom-[-280px] left-1/3 h-[780px] w-[780px] animate-drift-3 rounded-full bg-[radial-gradient(circle,rgba(242,166,90,.14),transparent_70%)] blur-3xl motion-reduce:animate-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:3px_3px] opacity-40" />
      </div>

      <div className="relative z-10">
        <CustomCursor />
        <LandingNav />

        <Hero />

        <Marquee />

        <div id="story">
          <ScrollStory />
        </div>

        <Divider />

        <section id="demo" className="px-6 pb-20 pt-16">
          <FadeIn>
            <Kicker>Live demo</Kicker>
            <h2 className="mt-3 text-center text-3xl font-black tracking-tight md:text-4xl">
              Now you try.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[min(1000px,100%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(197,95,214,.1),transparent_65%)]"
              />
              <LiveDemo />
            </div>
            <p className="mt-5 text-center text-xs text-on-dark-muted/60">
              Synthetic sample workspace — connect your real tools in minutes.
            </p>
          </FadeIn>
        </section>

        <Divider />

        <section id="caps" className="px-6 py-20">
          <FadeIn>
            <Kicker>Capabilities</Kicker>
            <h2 className="mt-3 text-center text-3xl font-black tracking-tight md:text-4xl">
              One intelligence layer. Every tool.
            </h2>
          </FadeIn>
          <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, index) => (
              <FadeIn
                key={feature.title}
                delay={index * 0.06}
                className={`h-full [perspective:1200px] ${feature.wide ? "lg:col-span-2" : ""}`}
              >
                <TiltCard className="h-full">
                  <div className="mb-4 flex h-11 w-11 [transform:translateZ(34px)] items-center justify-center rounded-lg bg-white/[.09] text-xl text-aurora-bright shadow-[inset_0_1px_0_rgba(255,255,255,.15)]">
                    {feature.icon}
                  </div>
                  <h3 className="[transform:translateZ(26px)] text-lg font-extrabold">{feature.title}</h3>
                  <p className="mt-1.5 [transform:translateZ(18px)] text-base text-on-dark-muted">
                    {feature.body}
                  </p>
                </TiltCard>
              </FadeIn>
            ))}
          </div>
          <div className="mt-16 flex flex-wrap justify-center gap-x-20 gap-y-8 text-center">
            {STATS.map((stat, index) => (
              <FadeIn key={stat.label} delay={index * 0.08}>
                <p className="bg-gradient-to-r from-aurora-violet to-aurora-amber bg-clip-text text-4xl font-black tracking-tight text-transparent">
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs uppercase tracking-[.08em] text-on-dark-muted/60">
                  {stat.label}
                </p>
              </FadeIn>
            ))}
          </div>
        </section>

        <Divider />

        <section id="trust" className="px-6 py-20">
          <FadeIn>
            <Kicker>Security</Kicker>
            <h2 className="mt-3 text-center text-3xl font-black tracking-tight md:text-4xl">
              Trust is the architecture.
            </h2>
          </FadeIn>
          <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.07} className="h-full">
                <div className="h-full rounded-xl border border-white/10 bg-white/[.04] p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.1)] backdrop-blur-xl transition-colors duration-300 hover:border-aurora-bright/40">
                  <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/[.09] text-lg text-aurora-bright shadow-[inset_0_1px_0_rgba(255,255,255,.15)]">
                    {item.icon}
                  </div>
                  <h3 className="text-md font-bold">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-on-dark-muted">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden px-6 py-24 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[-300px] left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(197,95,214,.22),transparent_65%)]"
          />
          <FadeIn>
            <h2 className="text-4xl font-black tracking-tight">
              See your organization{" "}
              <em className="animate-gradient-x bg-gradient-to-r from-aurora-violet via-aurora-magenta to-aurora-amber bg-[length:200%_auto] bg-clip-text not-italic text-transparent motion-reduce:animate-none">
                think.
              </em>
            </h2>
            <div className="mt-9 flex justify-center gap-3.5">
              <GlossyButton href="/register">Start free</GlossyButton>
              <GlossyButton href="#demo" variant="ghost">
                Replay the demo ↑
              </GlossyButton>
            </div>
          </FadeIn>
        </section>

        <footer className="border-t border-white/[.08] px-6 pb-10 pt-14">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 md:grid-cols-5">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-aurora-strong to-aurora-pink text-sm font-black text-white shadow-[inset_0_1px_0_rgba(255,255,255,.35)]">
                  Z
                </span>
                <span className="text-md font-bold">Project Zero</span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-on-dark-muted">
                The intelligence layer over the tools you already use. Every answer with proof.
              </p>
            </div>
            {FOOTER_COLS.map((col) => (
              <div key={col.head}>
                <h4 className="text-2xs font-extrabold uppercase tracking-[.18em] text-on-dark-muted/70">
                  {col.head}
                </h4>
                <ul className="mt-4 space-y-2.5 text-sm text-on-dark-muted">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="transition-colors hover:text-on-dark">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/[.07] pt-6 text-xs text-on-dark-muted/60 md:flex-row">
            <span>© 2026 Project Zero. All rights reserved.</span>
            <span>Privacy · Terms · DPA · Trust Center</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
