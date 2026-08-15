/**
 * Landing copy.
 *
 * Written from what the product does, not carried over from anything. Kept
 * separate from layout so the words and the design can change independently.
 */

export const hero = {
  eyebrow: "Organisational intelligence",
  headline: ["Your company already", "knows the answer.", "It just can't find it."],
  sub: "Project Zero connects the systems your team already uses, builds a memory that outlives any one model, and hands you decisions you can defend — with the evidence attached.",
  primary: "Request access",
  secondary: "See how it works",
};

/** The four stages of the pipeline. A real sequence, so it is numbered. */
export const pipeline = [
  { id: "connect", label: "Connect", note: "The tools you already run" },
  { id: "remember", label: "Remember", note: "Memory that compounds" },
  { id: "reason", label: "Reason", note: "Grounded in your own content" },
  { id: "decide", label: "Decide", note: "Evidence, sources, confidence" },
];

export const nav = {
  links: [
    { label: "Product", href: "#product" },
    { label: "How it works", href: "#how" },
    { label: "Trust", href: "#trust" },
    { label: "Pricing", href: "#pricing" },
  ],
  cta: "Request access",
};
