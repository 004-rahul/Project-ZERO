import {
  IconBrief,
  IconCite,
  IconKey,
  IconLink,
  IconMemory,
  IconShield,
  IconZap,
} from "./icons";

/**
 * Landing copy — single source for every section (Design Bible §19.4).
 * Content is fixed by the founder brief; only presentation changes.
 */

export const WORDMARKS = [
  "Kestrel Labs",
  "Norhaven",
  "Arcline",
  "Bluefield Ops",
  "Station",
  "Mode & Co",
];

export const INTEGRATION_CATEGORIES = [
  "Code",
  "Chat",
  "Docs",
  "Knowledge",
  "Tickets",
  "Cloud drives",
];

export const PROOF_STATS: { end: number; suffix: string; label: string }[] = [
  { end: 5, suffix: " min", label: "median time to first cited answer" },
  { end: 100, suffix: "%", label: "of answers carry citations" },
  { end: 40, suffix: "+ hrs", label: "saved per team, per month, in pilots" },
];

export const HERO_PROOF = [
  "Free plan — no credit card",
  "5-minute setup",
  "Your keys, your models",
];

export const FEATURES = [
  {
    icon: IconCite,
    tone: "text-accent",
    title: "Evidence-backed answers",
    body: "Every claim carries citations to the exact pull request, thread, or document — plus an honest confidence score.",
  },
  {
    icon: IconMemory,
    tone: "text-knowledge-dark",
    title: "Permanent memory",
    body: "Decisions, context and history stay searchable long after people move on.",
  },
  {
    icon: IconBrief,
    tone: "text-success",
    title: "Decision briefs",
    body: "Board-ready recommendations with evidence, assumptions and reasoning attached.",
  },
  {
    icon: IconLink,
    tone: "text-warning",
    title: "5-minute connectors",
    body: "OAuth in, read-only, revocable — across your code, chat, docs and knowledge tools.",
  },
  {
    icon: IconKey,
    tone: "text-accent",
    title: "Your AI, your keys",
    body: "OpenAI, Anthropic, Azure or local models. Switch by configuration, never migration.",
  },
  {
    icon: IconShield,
    tone: "text-knowledge-dark",
    title: "Governance built in",
    body: "Role-based access, approval workflows and a complete audit trail on every AI request.",
  },
];

export const STEPS = [
  {
    n: "01",
    icon: IconLink,
    title: "Connect",
    body: "Link the work apps your team already uses. OAuth, read-only, revocable any second.",
    meta: ["OAuth handshake", "Read-only scopes", "Revoke anytime"],
  },
  {
    n: "02",
    icon: IconMemory,
    title: "Remember",
    body: "Zero builds a permanent, versioned memory of everything your team knows.",
    meta: ["Versioned index", "Entity graph", "Tenant-isolated"],
  },
  {
    n: "03",
    icon: IconZap,
    title: "Ask",
    body: "Get cited, confidence-scored answers in seconds. Try it right here — no signup.",
    meta: ["Evidence retrieval", "Confidence scoring", "Full audit trail"],
  },
];

export const PLANS = [
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

export const TESTIMONIALS = [
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

export const FAQS = [
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

export const FOOTER_COLS: { head: string; links: string[] }[] = [
  { head: "Product", links: ["Features", "Integrations", "Pricing", "FAQ"] },
  { head: "Security", links: ["Trust Center", "Tenant isolation", "Audit trail", "DPA"] },
  { head: "Company", links: ["About", "Contact", "Privacy", "Terms"] },
];

export interface DemoScene {
  q: string;
  ev: [string, string][];
  a: string;
  conf: number;
}

export const DEMO_SCENES: DemoScene[] = [
  {
    q: "What did we decide about the mobile rewrite?",
    ev: [
      ["GitHub", "PR #482 — RFC: mobile rewrite"],
      ["Slack", "#eng-mobile — decision thread"],
      ["Drive", "Mobile Strategy v2.pdf"],
    ],
    a: "Approved on May 12 — React Native over Flutter, two-phase rollout starting Q4. Owned by the platform team.",
    conf: 87,
  },
  {
    q: "Why did Q3 shipping delays spike?",
    ev: [
      ["Jira", "OPS-1291 — webhook incident"],
      ["Slack", "#ops-alerts — Aug 4"],
      ["Notion", "Q3 operations retro"],
    ],
    a: "Root cause: the carrier API migration on Aug 4 silently dropped webhook events. Backlog cleared Sep 2.",
    conf: 78,
  },
  {
    q: "Who knows our billing system best?",
    ev: [
      ["GitHub", "billing-service contributors"],
      ["GitHub", "review history"],
      ["Slack", "#billing activity"],
    ],
    a: "Daniel R. — 61% of billing-service commits and reviewer on 9 of the last 10 billing pull requests.",
    conf: 92,
  },
];
