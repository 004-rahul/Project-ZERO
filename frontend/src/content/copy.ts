/**
 * Landing copy. Written from what the product does, kept apart from layout
 * so words and design can change independently.
 */

export const hero = {
  eyebrow: "Organisational intelligence",
  headline: ["Your company already", "knows the answer."],
  headlineAccent: "It just can't find it.",
  sub: "Project Zero connects the systems your team already runs, builds a memory that outlives any one model, and returns decisions you can defend — with the evidence still attached.",
  primary: "Request access",
  secondary: "See how it works",
};

/** The four stages, scrubbed through in the pinned section. A real sequence. */
export const stages = [
  {
    label: "Connect",
    title: "Every system, one protocol.",
    body: "Repositories, issues, documents, threads. Connected through a standard your tools already speak — not a bespoke integration you wait a quarter for.",
  },
  {
    label: "Remember",
    title: "A memory that compounds.",
    body: "Content becomes durable organisational memory: versioned, tenant-scoped, and independent of whichever model is answering today. Switch models and it survives.",
  },
  {
    label: "Reason",
    title: "Grounded in your own content.",
    body: "Retrieval over what your organisation actually wrote, not what a model half-remembers from the internet. Every claim traces to a source you can open.",
  },
  {
    label: "Decide",
    title: "An answer you can defend.",
    body: "Recommendation first, then the evidence, the sources, and an honest confidence — including when it is low. Approve it, reject it, and the system learns which.",
  },
];

export const capabilities = [
  { k: "Provider agnostic", v: "Any model. Yours, ours, or one running on your own hardware. Switching is configuration." },
  { k: "Memory you own", v: "Export your entire organisational memory in a documented format. No lock-in you cannot walk away from." },
  { k: "Tenant isolation", v: "Enforced in the query layer, not by convention. Proven by a suite that runs on every merge." },
  { k: "Evidence on everything", v: "Sources, confidence, model, prompt version, audit trail. Attached to every answer by construction." },
  { k: "Decision queue", v: "The product opens on what needs deciding — not on an empty text box waiting for you to think of a question." },
  { k: "Built to be audited", v: "Who asked what, what was retrieved, what was answered, who approved it. Searchable and permanent." },
];

export const integrations = [
  "GitHub", "Slack", "Notion", "Google Drive", "Gmail", "Jira",
  "Confluence", "Linear", "Figma", "Postgres", "Outlook", "Teams",
];

export const evidence = {
  eyebrow: "The trust layer",
  title: "Answers that survive the question \u201chow do you know?\u201d",
  body: "An assistant that cannot show its work is a liability in a room where the decision has to be defended. Every response carries what it used and how sure it is.",
  items: [
    { k: "Sources", v: "Every claim links to the exact document, file, or thread it came from." },
    { k: "Confidence", v: "Stated honestly, including low — a hedged answer beats a confident wrong one." },
    { k: "Provenance", v: "Which model, which prompt version, which retrieval snapshot." },
    { k: "Approval", v: "High-risk recommendations wait for a human. Always." },
  ],
};

export const cta = {
  title: ["Stop rediscovering", "what you already decided."],
  body: "We are onboarding a small number of design partners — engineering-led teams of 20 to 200 who feel this every week.",
  action: "Request access",
  note: "No credit card. We will ask about your stack before we ask for anything else.",
};

export const nav = {
  links: [
    { label: "How it works", href: "#how" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Trust", href: "#trust" },
  ],
  cta: "Request access",
};
