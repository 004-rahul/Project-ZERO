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
 * glossy 3D capability cards, and a closing CTA. Anonymous by rule (§19.1).
 */

const FEATURES = [
  { icon: "✦", title: "Evidence-backed answers", body: "Citations on every claim." },
  { icon: "◈", title: "Permanent memory", body: "Knowledge that never leaves." },
  { icon: "⚖", title: "Decision briefs", body: "Recommendations you can defend." },
  { icon: "⇄", title: "Connect systems", body: "One secure connector platform." },
  { icon: "◉", title: "Your AI, your keys", body: "OpenAI, Anthropic, Azure, local." },
  { icon: "▦", title: "Governance built in", body: "Roles, approvals, audit trail." },
];

const STATS: { end: number; suffix: string; label: string }[] = [
  { end: 5, suffix: " min", label: "to first answer" },
  { end: 100, suffix: "%", label: "of answers cited" },
  { end: 0, suffix: "", label: "vendor lock-in" },
];

function Kicker({ children }: { children: string }) {
  return (
    <p className="text-center text-2xs font-extrabold uppercase tracking-[.24em] text-aurora-bright">
      {children}
    </p>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-void text-on-dark">
      <CustomCursor />
      <LandingNav />

      <Hero />

      <Marquee />

      <div id="story">
        <ScrollStory />
      </div>

      <section id="demo" className="px-6 pb-24 pt-10">
        <FadeIn>
          <Kicker>Live demo</Kicker>
          <h2 className="mt-3 text-center text-3xl font-black tracking-tight md:text-4xl">
            Now you try.
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <LiveDemo />
          <p className="mt-5 text-center text-xs text-on-dark-muted/60">
            Synthetic sample workspace — connect your real tools in minutes.
          </p>
        </FadeIn>
      </section>

      <section id="caps" className="px-6 pb-28">
        <FadeIn>
          <Kicker>Capabilities</Kicker>
          <h2 className="mt-3 text-center text-3xl font-black tracking-tight md:text-4xl">
            One intelligence layer. Every tool.
          </h2>
        </FadeIn>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.06} className="h-full [perspective:1200px]">
              <TiltCard className="h-full">
                <div className="mb-4 flex h-10 w-10 [transform:translateZ(34px)] items-center justify-center rounded-lg bg-white/[.09] text-lg text-aurora-bright shadow-[inset_0_1px_0_rgba(255,255,255,.15)]">
                  {feature.icon}
                </div>
                <h3 className="[transform:translateZ(26px)] text-md font-extrabold">{feature.title}</h3>
                <p className="mt-1.5 [transform:translateZ(18px)] text-sm text-on-dark-muted">
                  {feature.body}
                </p>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap justify-center gap-x-16 gap-y-8 text-center">
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

      <section className="px-6 pb-32 pt-8 text-center">
        <FadeIn>
          <h2 className="text-4xl font-black tracking-tight">
            See your organization{" "}
            <em className="animate-gradient-x bg-gradient-to-r from-aurora-violet via-aurora-magenta to-aurora-amber bg-[length:200%_auto] bg-clip-text not-italic text-transparent motion-reduce:animate-none">
              think.
            </em>
          </h2>
          <div className="mt-9 flex justify-center">
            <GlossyButton href="/register">Start free</GlossyButton>
          </div>
        </FadeIn>
      </section>

      <footer className="border-t border-white/[.08] px-8 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-xs text-on-dark-muted/60 md:flex-row">
          <span>© 2026 Project Zero. All rights reserved.</span>
          <span>Privacy · Terms · DPA · Trust Center</span>
        </div>
      </footer>
    </main>
  );
}
