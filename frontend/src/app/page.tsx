/**
 * Public landing page — INTENTIONALLY EMPTY.
 *
 * The previous landing was deleted in full (all section components, the UI kit
 * and the motion layer) along with its written specification in Design Bible
 * §19.4, which is now cleared. There is deliberately no approved composition to
 * rebuild from: the specification was the reason successive redesigns kept
 * producing the same page.
 *
 * Copy and content survive in `landing/content.ts` and are unchanged.
 * The Deep Teal / Ice Cyan theme tokens survive in `tailwind.config.ts`.
 *
 * Do not reconstruct the old layout from git history.
 */
export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 text-ink">
      <div className="max-w-md">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-black text-void">
          Z
        </span>
        <h1 className="mt-6 text-2xl font-black tracking-tight">Project Zero</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Landing design cleared. Awaiting a new direction.
        </p>
      </div>
    </main>
  );
}
