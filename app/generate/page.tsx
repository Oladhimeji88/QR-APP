import type { Metadata } from "next";

import { QrGenerator } from "@/components/qr/qr-generator";

export const metadata: Metadata = {
  title: "Generate",
  description: "Build, preview, and download custom QR codes in PNG or SVG.",
};

export default function GeneratePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      <section className="space-y-8">
        <div className="animate-fade-in-up max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
            QR generator
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
            Build a polished QR code and download it in seconds
          </h1>
          <p className="text-lg leading-8 text-[color:var(--muted-foreground)]">
            Enter plain text, links, email actions, phone numbers, SMS templates, or Wi-Fi credentials. Preview live, then export a clean PNG or SVG.
          </p>
        </div>

        <QrGenerator />
      </section>
    </div>
  );
}
