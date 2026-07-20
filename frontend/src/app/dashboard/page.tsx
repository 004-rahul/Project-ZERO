import { AppShell } from "@/components/app-shell";

export const metadata = { title: "Dashboard — Project Zero" };

/**
 * Mission Control dashboard shell (Design Bible v3.1 §21). Sprint 1 delivers
 * the zoned shell and design system; live widgets land with their epics
 * (Identity → Sprint 4+, Connectors → Sprint 12, Decisions → Sprint 20).
 */
export default function DashboardPage() {
  return (
    <AppShell active="Dashboard">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Mission Control</h1>
          <p className="mt-1 text-sm text-muted">
            Platform foundation is running. Modules light up here as their epics ship.
          </p>
        </div>
        <span className="rounded-md bg-gradient-to-br from-accent to-accent-strong px-4 py-2 text-sm font-semibold text-white shadow-accent-glow">
          ✦ Ask the AI
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          ["API", "Healthy", "success"],
          ["Identity", "Epic 1 · Sprint 4", "pending"],
          ["Connectors", "Epic 5 · Sprint 11", "pending"],
          ["Decision Intelligence", "Epic 7 · Sprint 18", "pending"],
        ].map(([name, status, kind]) => (
          <div key={name} className="rounded-md border border-line bg-card p-5 shadow-card">
            <p className="text-2xs font-semibold uppercase tracking-widest text-faint">{name}</p>
            <p
              className={`mt-2 text-md font-bold ${
                kind === "success" ? "text-success" : "text-muted"
              }`}
            >
              {status}
            </p>
          </div>
        ))}
      </div>

      {/* Designed empty state (Design Bible §23): teach, never blank */}
      <div className="mt-6 rounded-xl border border-line bg-card p-10 text-center shadow-card">
        <p className="text-md font-bold text-ink">Your workspace is warming up</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Once identity and connectors ship, this is where you&apos;ll connect a system, upload a
          document, or ask your first question — and watch organizational memory build.
        </p>
      </div>
    </AppShell>
  );
}
