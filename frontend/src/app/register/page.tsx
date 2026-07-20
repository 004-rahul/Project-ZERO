import Link from "next/link";
import { AuthPanel, Divider, Field, SsoButtons } from "@/components/auth-panel";

export const metadata = { title: "Create your account — Project Zero" };

const STEPS = ["Account", "Organization", "Connect tools"];

export default function RegisterPage() {
  return (
    <AuthPanel
      headline={
        <>
          Give your organization a <em className="not-italic text-accent-bright">memory</em>.
        </>
      }
      subline="Set up in about 5 minutes · free to start · no credit card required."
      badges={["Free to start", "Your data stays yours", "Cancel anytime"]}
    >
      <h1 className="text-xl font-extrabold text-ink">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted">
        Step 1 of 3 — then create your organization and connect your first tool.
      </p>

      {/* Onboarding journey indicator (Product Bible §9.2) */}
      <ol className="mb-6 mt-5 flex">
        {STEPS.map((step, index) => (
          <li key={step} className="relative flex-1 text-center">
            {index > 0 && (
              <span
                className={`absolute -left-1/2 top-2.5 h-0.5 w-full ${index === 0 ? "" : "bg-line"}`}
                aria-hidden
              />
            )}
            <span
              className={`relative z-10 mx-auto flex h-6 w-6 items-center justify-center rounded-full text-2xs font-bold ${
                index === 0
                  ? "bg-accent text-white"
                  : "border-2 border-line-strong bg-card text-faint"
              }`}
            >
              {index + 1}
            </span>
            <span
              className={`mt-1.5 block text-2xs font-semibold ${
                index === 0 ? "text-accent-strong" : "text-faint"
              }`}
            >
              {step}
            </span>
          </li>
        ))}
      </ol>

      <SsoButtons />
      <Divider label="or with email" />

      {/* Real registration arrives with Epic 1 (Sprint 4); the form contract is final. */}
      <form>
        <Field label="Full name" type="text" placeholder="Your name" autoComplete="name" />
        <Field label="Work email" type="email" placeholder="you@company.com" autoComplete="email" />
        <Field
          label="Password"
          type="password"
          placeholder="Minimum 12 characters"
          autoComplete="new-password"
        />
        <label className="mb-5 flex items-center gap-2 text-xs text-muted">
          <input type="checkbox" className="accent-[#7C3AED]" /> I agree to the{" "}
          <span className="font-semibold text-accent-strong">Terms</span> &{" "}
          <span className="font-semibold text-accent-strong">Privacy Policy</span>
        </label>
        <button
          type="submit"
          className="w-full rounded-md bg-gradient-to-br from-accent to-accent-strong py-3 text-base font-bold text-white shadow-accent-glow transition-transform hover:-translate-y-0.5"
        >
          Continue →
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-accent-strong">
          Sign in
        </Link>
      </p>
    </AuthPanel>
  );
}
