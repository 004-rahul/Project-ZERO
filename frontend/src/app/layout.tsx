import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Zero — Enterprise Intelligence Platform",
  description:
    "Project Zero connects the tools your organization already uses, builds a permanent organizational memory, and answers business questions with evidence-backed, auditable recommendations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
