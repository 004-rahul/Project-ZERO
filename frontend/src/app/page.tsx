import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { ParticleFace } from "@/components/particle-face";

/**
 * Public landing page (Design Bible v3.1 §19.4): graphite hero with the
 * particle constellation, light feature sections, trust band, pricing, CTA.
 */

const FEATURES = [
  {
    icon: "⇄",
    title: "Connect your systems",
    body: "GitHub first, then Slack, Google Drive and Notion — one secure connector platform with OAuth, encrypted tokens, and always-visible sync health.",
  },
  {
    icon: "◈",
    title: "Organizational memory",
    body: "Everything you connect becomes permanent, versioned, searchable knowledge — context and history that never leave when people do.",
  },
  {
    icon: "✦",
    title: "Evidence-backed answers",
    body: "Ask real business questions. Every answer carries citations, sources, and an honest confidence score — never unsupported text.",
  },
  {
    icon: "⚖",
    title: "Decision Briefs",
    body: "Structured recommendations with evidence, assumptions, and reasoning — a defensible basis for action, ready for your board.",
  },
  {
    icon: "◉",
    title: "Choose your AI",
    body: "OpenAI, Azure, Anthropic, Gemini, or local models — switch providers by configuration. Your keys, your models, no lock-in.",
  },
  {
    icon: "▦",
    title: "Enterprise governance",
    body: "Hard tenant isolation, role-based access, approval workflows, and a complete audit trail on every AI request — built in.",
  },
];

const PLANS = [
  { name: "Free", price: "$0", audience: "Individuals & very small teams evaluating the platform", hot: false },
  { name: "Starter", price: "$—", audience: "Small teams adopting seriously", hot: false },
  { name: "Professional", price: "$—", audience: "Growing companies, 20–200 people", hot: true },
  { name: "Enterprise", price: "Custom", audience: "Large & regulated organizations", hot: false },
];

export default function LandingPage() {
  return (
    <main className="bg-zone-footer">
      {/* nav */}
      <header className="sticky top-0 z-50 flex items-center gap-8 border-b border-white/10 bg-zone-footer/80 px-8 py-4 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-gradient-to-br from-accent to-accent-strong text-sm font-extrabold text-white">
            Z
          </span>
          <span className="text-md font-bold text-on-dark">Project Zero</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-6 text-sm text-on-dark-muted md:flex">
          <span>Product</span>
          <span>Security</span>
          <span>Pricing</span>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded border border-white/20 px-4 py-2 text-sm font-semibold text-on-dark"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded bg-gradient-to-br from-accent to-accent-strong px-4 py-2 text-sm font-semibold text-white shadow-accent-glow"
          >
            Get started free
          </Link>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden px-8 pb-16 pt-20 text-center">
        <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[600px] w-[900px] -translate-x-1/2 animate-glow-pulse rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,.28),rgba(124,58,237,.06)_55%,transparent_70%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-[-30px] flex justify-center opacity-80">
          <ParticleFace state="idle" size={480} />
        </div>

        <div className="relative animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-bright/35 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent-bright">
            ✦ Enterprise Intelligence Platform
          </span>
        </div>
        <h1 className="relative mx-auto mt-6 max-w-4xl animate-fade-up text-4xl font-extrabold text-on-dark [animation-delay:.12s]">
          Your organization&apos;s knowledge,
          <br />
          turned into{" "}
          <em className="bg-gradient-to-r from-accent-bright via-accent to-[#c4b5fd] bg-clip-text not-italic text-transparent">
            decisions you can defend
          </em>
        </h1>
        <p className="relative mx-auto mt-5 max-w-2xl animate-fade-up text-md leading-relaxed text-on-dark-muted [animation-delay:.24s]">
          Project Zero connects the tools you already use, builds a permanent organizational memory,
          and answers business questions with evidence-backed, auditable recommendations — powered by
          the AI provider you choose.
        </p>
        <div className="relative mt-8 flex animate-fade-up justify-center gap-4 [animation-delay:.36s]">
          <Link
            href="/register"
            className="rounded-md bg-gradient-to-br from-accent to-accent-strong px-6 py-3 text-base font-semibold text-white shadow-accent-glow"
          >
            Start free — connect GitHub
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-white/20 px-6 py-3 text-base font-semibold text-on-dark"
          >
            Watch 3-min demo
          </Link>
        </div>
        <p className="relative mt-6 animate-fade-up text-xs text-on-dark-muted/70 [animation-delay:.48s]">
          No credit card required · <b className="text-on-dark-muted">Your data stays yours</b> ·
          Provider-agnostic AI · Full audit trail
        </p>
      </section>

      {/* features */}
      <section className="bg-zone-canvas px-8 py-18 pb-16 pt-16">
        <FadeIn>
          <p className="text-center text-2xs font-bold uppercase tracking-widest text-accent-strong">
            What Project Zero does
          </p>
          <h2 className="mt-3 text-center text-3xl font-extrabold text-ink">
            One intelligence layer over every tool you use
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-md text-muted">
            Not another chatbot. Not another dashboard. A platform that understands your whole
            organization and shows its work on every answer.
          </p>
        </FadeIn>
        <div className="mx-auto mt-11 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.06}>
              <div className="h-full rounded-xl border border-line bg-card p-6 shadow-card transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-lg text-accent-strong">
                  {feature.icon}
                </div>
                <h3 className="text-md font-bold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* trust band */}
      <section className="bg-zone-header px-8 py-16">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          <FadeIn>
            <h2 className="text-3xl font-extrabold leading-tight text-on-dark">
              Trust isn&apos;t a feature.
              <br />
              It&apos;s the <em className="not-italic text-accent-bright">architecture</em>.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-on-dark-muted">
              Project Zero was designed for enterprise security review from day one — because we&apos;re
              asking you to trust us with your organization&apos;s most sensitive asset: everything it knows.
            </p>
          </FadeIn>
          <ul className="space-y-1">
            {[
              ["Hard tenant isolation", "Your data, embeddings, and memory are isolated by construction — provably, with a permanent test suite."],
              ["You own your data & keys", "Bring your own AI provider credentials. Configurable retention and region. Export anytime."],
              ["Every action audited", "Who asked, what was retrieved, which model, which prompt version — inspectable on every response."],
              ["Human-in-the-loop", "No autonomous action without approval. AI recommends; your people decide."],
            ].map(([title, body], index) => (
              <FadeIn key={title} delay={index * 0.08}>
                <li className="flex gap-3 border-b border-white/10 py-3 last:border-b-0">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-2xs text-accent-bright">
                    ✓
                  </span>
                  <span className="text-sm font-medium text-on-dark">
                    {title}
                    <span className="mt-0.5 block text-xs font-normal text-on-dark-muted">{body}</span>
                  </span>
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      {/* pricing */}
      <section className="bg-zone-canvas px-8 py-16">
        <FadeIn>
          <p className="text-center text-2xs font-bold uppercase tracking-widest text-accent-strong">Pricing</p>
          <h2 className="mt-3 text-center text-3xl font-extrabold text-ink">
            Start free. Scale when it proves itself.
          </h2>
        </FadeIn>
        <div className="mx-auto mt-11 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, index) => (
            <FadeIn key={plan.name} delay={index * 0.06}>
              <div
                className={`relative h-full rounded-xl bg-card p-6 shadow-card transition-transform duration-300 hover:-translate-y-1.5 ${
                  plan.hot ? "border-2 border-accent" : "border border-line"
                }`}
              >
                {plan.hot && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-accent to-accent-strong px-3 py-1 text-2xs font-bold uppercase tracking-wider text-white">
                    Most popular
                  </span>
                )}
                <h3 className="text-sm font-bold text-ink">{plan.name}</h3>
                <p className="mt-3 text-2xl font-extrabold text-ink">{plan.price}</p>
                <p className="mt-2 text-xs text-muted">{plan.audience}</p>
                <Link
                  href="/register"
                  className={`mt-5 block rounded-md py-2.5 text-center text-sm font-semibold ${
                    plan.hot
                      ? "bg-gradient-to-br from-accent to-accent-strong text-white shadow-accent-glow"
                      : "bg-accent/10 text-accent-strong"
                  }`}
                >
                  {plan.name === "Enterprise" ? "Talk to us" : `Choose ${plan.name}`}
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA + footer */}
      <section className="relative overflow-hidden px-8 py-20 text-center">
        <div className="pointer-events-none absolute bottom-[-260px] left-1/2 h-[500px] w-[900px] -translate-x-1/2 animate-glow-pulse rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,.3),transparent_65%)]" />
        <FadeIn>
          <h2 className="relative text-3xl font-extrabold text-on-dark">
            See your organization <em className="not-italic text-accent-bright">think</em>
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-base text-on-dark-muted">
            Connect GitHub in five minutes and ask your first real question. The answer comes with proof.
          </p>
          <div className="relative mt-8 flex justify-center gap-4">
            <Link
              href="/register"
              className="rounded-md bg-gradient-to-br from-accent to-accent-strong px-6 py-3 text-base font-semibold text-white shadow-accent-glow"
            >
              Start free
            </Link>
          </div>
        </FadeIn>
      </section>

      <footer className="border-t border-white/10 px-8 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-xs text-on-dark-muted/70 md:flex-row">
          <span>© 2026 Project Zero. All rights reserved.</span>
          <span>Privacy · Terms · DPA · Trust Center</span>
        </div>
      </footer>
    </main>
  );
}
