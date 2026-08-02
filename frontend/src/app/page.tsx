import { FadeIn } from "@/components/fade-in";
import { CountUp } from "@/components/landing/count-up";
import { GlossyButton } from "@/components/landing/glossy-button";
import { Hero } from "@/components/landing/hero";
import {
  IconBrief,
  IconChevron,
  IconCite,
  IconKey,
  IconLink,
  IconMemory,
  IconShield,
  IconUsers,
  IconZap,
} from "@/components/landing/icons";
import { LiveDemo } from "@/components/landing/live-demo";
import { LandingNav } from "@/components/landing/nav";
import { HoverCard } from "@/components/landing/hover-card";

/**
 * Public landing page (Design Bible §19.4 v3.5 — light, screenshot-led).
 * Section order is fixed: Hero → Social proof → Features → How it works
 * (live demo embedded) → Pricing → Testimonials → FAQ → CTA → Footer.
 * White/soft-gray alternating bands, ink text, violet accent, 12px radius,
 * outline icons, realistic copy, no gradients. Anonymous by rule (§19.1).
 */

const WORDMARKS = ["Kestrel Labs", "Norhaven", "Arcline", "Bluefield Ops", "Station", "Mode & Co"];

const PROOF_STATS: { end: number; suffix: string; label: string }[] = [
  { end: 5, suffix: " min", label: "median time to first cited answer" },
  { end: 100, suffix: "%", label: "of answers carry citations" },
  { end: 40, suffix: "+ hrs", label: "saved per team, per month, in pilots" },
];

const FEATURES = [
  {
    icon: IconCite,
    title: "Evidence-backed answers",
    body: "Every claim carries citations to the exact pull request, thread, or document — plus an honest confidence score.",
    wide: true,
  },
  {
    icon: IconMemory,
    title: "Permanent memory",
    body: "Decisions, context and history stay searchable long after people move on.",
  },
  {
    icon: IconBrief,
    title: "Decision briefs",
    body: "Board-ready recommendations with evidence, assumptions and reasoning attached.",
  },
  {
    icon: IconLink,
    title: "5-minute connectors",
    body: "OAuth in, read-only, revocable — across your code, chat, docs and knowledge tools.",
  },
  {
    icon: IconKey,
    title: "Your AI, your keys",
    body: "OpenAI, Anthropic, Azure or local models. Switch by configuration, never migration.",
  },
  {
    icon: IconShield,
    title: "Governance built in",
    body: "Role-based access, approval workflows and a complete audit trail on every AI request.",
    wide: true,
  },
];

const STEPS = [
  {
    n: "01",
    icon: IconLink,
    title: "Connect",
    body: "Link the work apps your team already uses. OAuth, read-only, revocable any second.",
  },
  {
    n: "02",
    icon: IconMemory,
    title: "Remember",
    body: "Zero builds a permanent, versioned memory of everything your team knows.",
  },
  {
    n: "03",
    icon: IconZap,
    title: "Ask",
    body: "Get cited, confidence-scored answers in seconds. Try it right here — no signup.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    per: "forever",
    audience: "For evaluating with your own data.",
    points: ["1 workspace", "2 connectors", "100 questions / month"],
    hot: false,
    cta: "Start free",
  },
  {
    name: "Starter",
    price: "$29",
    per: "per user / month",
    audience: "For small teams getting serious.",
    points: ["Unlimited questions", "4 connectors", "Email support"],
    hot: false,
    cta: "Choose Starter",
  },
  {
    name: "Professional",
    price: "$79",
    per: "per user / month",
    audience: "For growing companies.",
    points: ["Everything in Starter", "Decision briefs", "Approval workflows", "Priority support"],
    hot: true,
    cta: "Choose Professional",
  },
  {
    name: "Enterprise",
    price: "Custom",
    per: "annual agreement",
    audience: "For regulated organizations.",
    points: ["SSO / SAML", "Region pinning", "Custom retention", "Dedicated support"],
    hot: false,
    cta: "Talk to sales",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We stopped asking “who remembers why we did this?” The citations sold our CTO in a single meeting.",
    name: "Maya R.",
    role: "VP Engineering, logistics platform · 140 people",
  },
  {
    quote:
      "First tool that answered a board question with sources I could actually verify before presenting.",
    name: "Daniel K.",
    role: "COO, fintech scale-up · 90 people",
  },
  {
    quote:
      "Onboarding new engineers got two weeks faster. The organizational memory does the explaining now.",
    name: "Priya S.",
    role: "Head of Platform, e-commerce group · 300 people",
  },
];

const FAQS = [
  {
    q: "Is our data used to train AI models?",
    a: "No. Your data stays inside your tenant, and you bring your own AI provider keys. Nothing you connect is shared across customers or used for model training.",
  },
  {
    q: "How long does setup actually take?",
    a: "About five minutes. You authorize a read-only OAuth connection to your work apps — code, chat, docs, knowledge — and ask your first question while the initial sync runs.",
  },
  {
    q: "Which AI providers are supported?",
    a: "OpenAI, Anthropic, Azure OpenAI, Gemini, or local models. Providers are switched in configuration — your prompts, memory and audit history stay put.",
  },
  {
    q: "Can we export our data and leave?",
    a: "Yes. Full export is available at any time, connectors are revocable in one click, and there is no minimum term on monthly plans.",
  },
  {
    q: "How is access controlled?",
    a: "Role-based access, hard per-workspace tenant isolation, approval workflows for sensitive actions, and a complete audit trail on every request.",
  },
];

function SectionHead({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <FadeIn>
      <p className="text-center text-2xs font-extrabold uppercase tracking-[.24em] text-accent-strong">
        {kicker}
      </p>
      <h2 className="mt-4 text-center text-3xl font-black tracking-tight text-ink md:text-4xl">
        {title}
      </h2>
      {sub && <p className="mx-auto mt-4 max-w-xl text-center text-md text-muted">{sub}</p>}
    </FadeIn>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-8 lg:px-[5vw]">{children}</div>;
}

export default function LandingPage() {
  return (
    <main className="relative text-ink">
      {/* living background — pastel washes that visibly drift, plus floating shapes */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 -top-48 h-[720px] w-[720px] animate-drift-1 rounded-full bg-accent/[.22] blur-3xl motion-reduce:animate-none" />
        <div className="absolute -right-32 top-[30%] h-[600px] w-[600px] animate-drift-2 rounded-full bg-[#EC4899]/[.15] blur-3xl motion-reduce:animate-none" />
        <div className="absolute bottom-[-240px] left-1/3 h-[720px] w-[720px] animate-drift-3 rounded-full bg-warning/[.15] blur-3xl motion-reduce:animate-none" />
        <div className="absolute left-[10%] top-[28%] h-24 w-24 animate-floaty rounded-full border-2 border-dashed border-accent/30 motion-reduce:animate-none" />
        <div
          className="absolute right-[7%] top-[16%] h-14 w-14 animate-floaty rounded-full bg-[#EC4899]/20 motion-reduce:animate-none"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="absolute bottom-[24%] right-[16%] h-20 w-20 rotate-12 animate-floaty rounded-lg border-2 border-warning/30 motion-reduce:animate-none"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="absolute bottom-[30%] left-[5%] h-10 w-10 animate-floaty rounded-full bg-accent/[.15] motion-reduce:animate-none"
          style={{ animationDelay: "-1.5s" }}
        />
        <div
          className="absolute left-[46%] top-[12%] h-8 w-8 animate-floaty rounded-full border-2 border-accent/25 motion-reduce:animate-none"
          style={{ animationDelay: "-4.5s" }}
        />
      </div>

      <div className="relative z-10">
      <LandingNav />

      {/* 1 · HERO */}
      <Hero />

      {/* 2 · SOCIAL PROOF */}
      <section
        id="integrations"
        aria-label="Social proof"
        className="border-y border-line/70 py-16"
      >
        <Shell>
          <FadeIn>
            <p className="text-center text-sm font-medium text-muted">
              Trusted in pilots by operations-heavy teams — connected to the tools they already use
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
              {WORDMARKS.map((brand) => (
                <span
                  key={brand}
                  className="text-md font-extrabold uppercase tracking-[.12em] text-faint"
                >
                  {brand}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
              {["Code", "Chat", "Docs", "Knowledge", "Tickets", "Cloud drives"].map((cat) => (
                <span
                  key={cat}
                  className="rounded-lg bg-accent/[.07] px-3.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:bg-accent/[.12] hover:text-ink"
                >
                  {cat}
                </span>
              ))}
              <span className="px-2 text-xs font-semibold text-accent-strong">
                40+ integrations — full list at launch
              </span>
            </div>
          </FadeIn>
          <div className="mt-14 grid grid-cols-12 gap-6">
            {PROOF_STATS.map((stat, index) => (
              <FadeIn key={stat.label} delay={index * 0.08} className="col-span-12 sm:col-span-4">
                <div className="rounded-lg border border-transparent bg-accent/[.06] px-6 py-8 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-white hover:shadow-lift">
                  <p className="text-4xl font-black tracking-tight text-accent-strong">
                    <CountUp end={stat.end} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-muted">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Shell>
      </section>

      {/* 3 · FEATURES */}
      <section id="features" className="py-16 md:py-24">
        <Shell>
          <SectionHead
            kicker="Features"
            title="One intelligence layer. Every tool."
            sub="Not another chatbot. A platform that understands your whole organization and shows its work on every answer."
          />
          <div className="mt-14 grid grid-cols-12 gap-6">
            {FEATURES.map((feature, index) => (
              <FadeIn
                key={feature.title}
                delay={index * 0.05}
                className={`col-span-12 h-full sm:col-span-6 ${
                  feature.wide ? "lg:col-span-6" : "lg:col-span-3"
                }`}
              >
                <HoverCard className="h-full">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <feature.icon />
                  </div>
                  <h3 className="text-lg font-extrabold text-ink">{feature.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted">{feature.body}</p>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
        </Shell>
      </section>

      {/* 4 · HOW IT WORKS (live demo embedded) */}
      <section id="how" className="border-y border-line/70 py-16 md:py-24">
        <Shell>
          <SectionHead
            kicker="How it works"
            title="Connect. Remember. Ask."
            sub="Three steps from scattered tools to cited answers — and you can try the third one right here."
          />
          <div className="mt-14 grid grid-cols-12 gap-6">
            {STEPS.map((step, index) => (
              <FadeIn key={step.n} delay={index * 0.08} className="col-span-12 md:col-span-4">
                <div className="relative h-full rounded-lg border border-transparent bg-accent/[.06] p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-white hover:shadow-lift">
                  <span className="absolute right-5 top-4 text-4xl font-black text-ink/[.06]">
                    {step.n}
                  </span>
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <step.icon />
                  </div>
                  <h3 className="text-lg font-extrabold text-ink">{step.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted">{step.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.15}>
            <LiveDemo />
            <p className="mt-4 text-center text-xs text-faint">
              Synthetic sample workspace — connect your real tools in minutes.
            </p>
          </FadeIn>
        </Shell>
      </section>

      {/* 5 · PRICING */}
      <section id="pricing" className="py-16 md:py-24">
        <Shell>
          <SectionHead
            kicker="Pricing"
            title="Start free. Scale when it proves itself."
            sub="Per-user pricing, monthly or annual. Every paid plan starts with a 14-day Professional trial."
          />
          <div className="mt-14 grid grid-cols-12 gap-6">
            {PLANS.map((plan, index) => (
              <FadeIn key={plan.name} delay={index * 0.06} className="col-span-12 sm:col-span-6 lg:col-span-3">
                <div
                  className={`relative flex h-full flex-col rounded-lg border border-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-white hover:shadow-lift ${
                    plan.hot ? "bg-accent/[.12] shadow-lift" : "bg-accent/[.06] shadow-card"
                  }`}
                >
                  {plan.hot && (
                    <span className="absolute -top-3 left-6 rounded-lg bg-accent px-3 py-1 text-2xs font-extrabold uppercase tracking-[.12em] text-white">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-sm font-extrabold uppercase tracking-[.1em] text-muted">
                    {plan.name}
                  </h3>
                  <p className="mt-4 text-3xl font-black text-ink">{plan.price}</p>
                  <p className="text-xs text-faint">{plan.per}</p>
                  <p className="mt-3 text-sm text-muted">{plan.audience}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {plan.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-muted">
                        <span className="mt-0.5 text-accent">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6L9 17l-5-5" /></svg>
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/register"
                    className={`mt-6 block rounded-lg py-2.5 text-center text-sm font-bold transition-colors ${
                      plan.hot
                        ? "bg-accent text-white shadow-accent-glow hover:bg-accent-strong"
                        : "border border-line-strong text-ink hover:border-accent hover:text-accent"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </Shell>
      </section>

      {/* 6 · TESTIMONIALS */}
      <section aria-label="Testimonials" className="border-y border-line/70 py-16 md:py-24">
        <Shell>
          <SectionHead kicker="Testimonials" title="Teams stopped losing what they know." />
          <div className="mt-14 grid grid-cols-12 gap-6">
            {TESTIMONIALS.map((t, index) => (
              <FadeIn key={t.name} delay={index * 0.08} className="col-span-12 md:col-span-4">
                <figure className="flex h-full flex-col rounded-lg border border-transparent bg-accent/[.06] p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-white hover:shadow-lift">
                  <IconUsers className="h-5 w-5 text-accent" />
                  <blockquote className="mt-4 flex-1 text-md leading-relaxed text-ink">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5 border-t border-line pt-4">
                    <p className="text-sm font-bold text-ink">{t.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{t.role}</p>
                  </figcaption>
                </figure>
              </FadeIn>
            ))}
          </div>
        </Shell>
      </section>

      {/* 7 · FAQ */}
      <section id="faq" className="py-16 md:py-24">
        <Shell>
          <SectionHead kicker="FAQ" title="Questions security teams ask first." />
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-3">
            {FAQS.map((faq, index) => (
              <FadeIn key={faq.q} delay={index * 0.05}>
                <details className="group rounded-lg border border-transparent bg-accent/[.06] shadow-card transition-all duration-300 hover:border-accent/30 open:border-accent/40 open:bg-white open:shadow-lift">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-md font-bold text-ink [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <IconChevron className="h-4 w-4 shrink-0 text-muted transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="px-6 pb-5 text-base leading-relaxed text-muted">{faq.a}</p>
                </details>
              </FadeIn>
            ))}
          </div>
        </Shell>
      </section>

      {/* 8 · CTA */}
      <section className="relative overflow-hidden border-t border-line bg-accent/[.05] py-16 text-center md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[380px] w-[760px] -translate-x-1/2 rounded-full bg-accent/10 blur-[110px]"
        />
        <Shell>
          <FadeIn>
            <h2 className="text-4xl font-black tracking-tight text-ink">
              See your organization <em className="not-italic text-accent">think.</em>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-md text-muted">
              Connect a tool in five minutes and ask your first real question — the answer comes
              with proof.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <GlossyButton href="/register">Start free</GlossyButton>
              <GlossyButton href="#how" variant="ghost">
                Replay the demo ↑
              </GlossyButton>
            </div>
          </FadeIn>
        </Shell>
      </section>

      {/* 9 · FOOTER */}
      <footer className="border-t border-line/70 bg-white/60 pb-10 pt-16 backdrop-blur-xl">
        <Shell>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-black text-white">
                  Z
                </span>
                <span className="text-md font-bold text-ink">Project Zero</span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
                The intelligence layer over the tools you already use. Every answer with proof.
              </p>
            </div>
            {[
              { head: "Product", links: ["Features", "Integrations", "Pricing", "FAQ"] },
              { head: "Security", links: ["Trust Center", "Tenant isolation", "Audit trail", "DPA"] },
              { head: "Company", links: ["About", "Contact", "Privacy", "Terms"] },
            ].map((col) => (
              <div key={col.head} className="col-span-6 md:col-span-2">
                <h4 className="text-2xs font-extrabold uppercase tracking-[.18em] text-faint">
                  {col.head}
                </h4>
                <ul className="mt-4 space-y-2.5 text-sm text-muted">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="transition-colors hover:text-ink">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-faint md:flex-row">
            <span>© 2026 Project Zero. All rights reserved.</span>
            <span>Privacy · Terms · DPA · Trust Center</span>
          </div>
        </Shell>
      </footer>
      </div>
    </main>
  );
}
