import Link from "next/link";
import {
  ArrowRight,
  Download,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_DESCRIPTION } from "@/lib/constants";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Sparkles,
    title: "Instant generation",
    description:
      "Create QR codes for text, links, email actions, phone calls, SMS, and Wi-Fi in a single polished workflow.",
  },
  {
    icon: Download,
    title: "Export in PNG or SVG",
    description:
      "Preview live, then download crisp assets with clean filenames for product, print, and event use.",
  },
  {
    icon: ShieldCheck,
    title: "Validated locally",
    description:
      "No third-party QR API dependency. Inputs are validated with Zod and generated with local app logic.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi ready",
    description:
      "Share guest networks without the typing pain, complete with encryption and hidden network support.",
  },
];

export default function MarketingPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      <section className="grid gap-10 overflow-hidden rounded-[40px] border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,255,255,0.48))] px-6 py-10 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center dark:bg-[linear-gradient(135deg,rgba(8,16,24,0.82),rgba(8,16,24,0.58))]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
            <Sparkles className="size-4 text-[color:var(--accent-strong)]" />
            Production-ready QR generator
          </div>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-balance text-5xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-6xl">
              Create QR Codes Instantly
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[color:var(--muted-foreground)]">
              {APP_DESCRIPTION}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/generate" className={buttonVariants({ size: "lg" })}>
              Start generating
              <ArrowRight className="size-5" />
            </Link>
            <Link
              href="#features"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Explore features
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_top,rgba(18,115,96,0.28),transparent_60%)] blur-2xl" />
          <Card className="relative overflow-hidden border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,248,251,0.78))] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(10,17,27,0.92),rgba(10,17,27,0.72))]">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>QR Forge Studio</CardTitle>
                  <CardDescription>
                    Live preview, validated inputs, export-ready downloads.
                  </CardDescription>
                </div>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                  Local only
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                <div className="flex items-center justify-between rounded-full border border-[color:var(--border)] bg-[color:var(--background)]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                  <span>Wi-Fi QR</span>
                  <span>Ready to share</span>
                </div>
                <div className="mx-auto rounded-[30px] bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.12)]">
                  <img
                    src="/icons/scan-grid.svg"
                    alt="Decorative QR grid preview"
                    className="h-auto w-[240px]"
                  />
                </div>
              </div>
              <div className="grid gap-3 text-sm text-[color:var(--muted-foreground)]">
                <div className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
                  <span>Output formats</span>
                  <span className="font-medium text-[color:var(--foreground)]">PNG + SVG</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
                  <span>Validation</span>
                  <span className="font-medium text-[color:var(--foreground)]">Zod + RHF</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
                  <span>Generation</span>
                  <span className="font-medium text-[color:var(--foreground)]">Local + server route</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="features" className="mt-16 space-y-6">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
            Why teams use it
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
            Built like a serious product, not a throwaway demo
          </h2>
          <p className="text-lg leading-8 text-[color:var(--muted-foreground)]">
            QR Forge combines a premium interface with type-safe validation, local QR rendering,
            and a flexible architecture that can grow into saved history, analytics, auth, and brand assets.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="h-full">
              <CardHeader>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-soft),rgba(234,88,12,0.18))] text-[color:var(--accent-strong)]">
                  <feature.icon className="size-6" />
                </span>
                <CardTitle className="pt-2">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[36px] border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(18,115,96,0.12),rgba(234,88,12,0.08))] px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
              Ready to build
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">
              Move from raw text to clean download in seconds
            </h2>
            <p className="text-lg leading-8 text-[color:var(--muted-foreground)]">
              Start with the generator, tweak size and colors, and export a code you can use in a product, menu, flyer, or onboarding flow.
            </p>
          </div>
          <Link
            href="/generate"
            className={cn(buttonVariants({ size: "lg" }), "w-full justify-center sm:w-auto")}
          >
            Open generator
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
