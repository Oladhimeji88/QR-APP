import type { Metadata } from "next";
import { ShieldCheck, Sparkles, Zap } from "lucide-react";

import { QrGenerator } from "@/components/qr/qr-generator";

export const metadata: Metadata = {
  title: "Generate",
  description: "Build, preview, and download custom QR codes in PNG or SVG.",
};

const highlights = [
  {
    icon: Zap,
    title: "Live preview",
    description: "Updates automatically as soon as the current fields are valid.",
  },
  {
    icon: ShieldCheck,
    title: "Validated inputs",
    description: "Human-readable errors keep invalid URLs, emails, and Wi-Fi details from shipping.",
  },
  {
    icon: Sparkles,
    title: "Export-ready",
    description: "Download crisp PNG and SVG assets without reloading the page.",
  },
];

export default function GeneratePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      <section className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)] lg:items-end">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
              QR generator
            </p>
            <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
              Build a polished QR code and download it in seconds
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[color:var(--muted-foreground)]">
              Enter plain text, links, email actions, phone numbers, SMS templates, or Wi-Fi credentials. Preview live, then export a clean PNG or SVG.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-soft),rgba(63,122,99,0.18))] text-[color:var(--accent-strong)]">
                  <item.icon className="size-5" />
                </span>
                <h2 className="mt-4 text-base font-semibold text-[color:var(--foreground)]">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <QrGenerator />
      </section>
    </div>
  );
}
