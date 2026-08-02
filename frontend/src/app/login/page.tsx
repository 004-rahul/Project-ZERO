import Link from "next/link";
import { AuthPanel, AuthSubmit, Divider, Field, SsoButtons } from "@/components/auth-panel";

export const metadata = { title: "Sign in — Project Zero" };

export default function LoginPage() {
  return (
    <AuthPanel
      headline={
        <>
          Decisions you can <em className="not-italic text-accent-bright">defend</em>.
        </>
      }
      subline="Evidence-backed answers from the tools your organization already uses — with sources, confidence, and a full audit trail."
      badges={["Tenant-isolated", "Audit on every answer", "Provider-agnostic"]}
    >
      <h1 className="text-xl font-extrabold text-ink">Sign in</h1>
      <p className="mt-1.5 text-sm text-muted">Continue to your organization&apos;s workspace.</p>

      <SsoButtons />
      <Divider label="or with email" />

      {/* Real authentication arrives with Epic 1 (Sprint 4); the form contract is final. */}
      <form>
        <Field label="Work email" type="email" placeholder="you@company.com" autoComplete="email" />
        <Field label="Password" type="password" placeholder="••••••••••" autoComplete="current-password" />
        <div className="mb-5 flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-muted">
            <input type="checkbox" defaultChecked className="accent-[#7C3AED]" /> Remember this device
          </label>
          <span className="font-semibold text-accent-strong">Forgot password?</span>
        </div>
        <AuthSubmit>Sign in →</AuthSubmit>
      </form>

      <p className="mt-5 text-center text-xs text-muted">
        New to Project Zero?{" "}
        <Link href="/register" className="font-bold text-accent-strong">
          Create your organization
        </Link>
      </p>
    </AuthPanel>
  );
}
