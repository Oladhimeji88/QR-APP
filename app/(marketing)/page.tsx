import Link from "next/link";
import {
  ArrowRight,
  Check,
  Download,
  Link2,
  Mail,
  MessageSquare,
  Phone,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Type,
  Wifi,
  Zap,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FloatingDecor } from "@/components/marketing/floating-decor";
import { HeroImage } from "@/components/marketing/hero-image";
import { HeroVideo } from "@/components/marketing/hero-video";
import { Reveal } from "@/components/ui/reveal";
import { APP_DESCRIPTION } from "@/lib/constants";
import { cn } from "@/lib/utils";

const stats = [
  { value: "6", label: "Content types" },
  { value: "2", label: "Export formats" },
  { value: "100%", label: "Local rendering" },
  { value: "0", label: "Third-party APIs" },
];

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

const contentTypes = [
  { icon: Type, label: "Text", description: "Notes & messages" },
  { icon: Link2, label: "URL", description: "Links & pages" },
  { icon: Mail, label: "Email", description: "Pre-filled mail" },
  { icon: Phone, label: "Phone", description: "Tap to call" },
  { icon: MessageSquare, label: "SMS", description: "Draft messages" },
  { icon: Wifi, label: "Wi-Fi", description: "One-scan join" },
];

const steps = [
  {
    step: "01",
    title: "Pick a content type",
    description:
      "Choose from text, URL, email, phone, SMS, or Wi-Fi. Each type gets a tailored, validated form.",
  },
  {
    step: "02",
    title: "Customize and preview",
    description:
      "Adjust size, margin, and colors while a live preview updates instantly to match your output.",
  },
  {
    step: "03",
    title: "Download and ship",
    description:
      "Export a crisp PNG or scalable SVG with a clean filename, ready for product, print, or signage.",
  },
];

const trustPoints = [
  "No sign-up required",
  "Type-safe with Zod",
  "Works offline",
];

export default function MarketingPage() {
  return (
    <div className="relative pb-24">
      <FloatingDecor />
      {/* Hero — full width */}
      <section className="relative w-full overflow-hidden border-b border-[color:var(--border)] bg-[linear-gradient(135deg,#ffffff,rgba(240,248,244,0.7))] px-6 pt-0 pb-16 sm:px-10 sm:pt-0 sm:pb-20">
        <HeroVideo />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
        <div className="animate-fade-in-up space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[color:var(--accent-strong)] opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-[color:var(--accent-strong)]" />
            </span>
            Production-ready QR generator
          </div>

          <div className="space-y-5">
            <h1 className="max-w-4xl text-balance text-7xl font-black leading-[1.0] tracking-tighter text-[color:var(--foreground)] sm:text-8xl">
              Create QR codes{" "}
              <span className="bg-[linear-gradient(120deg,var(--accent-strong),var(--accent-soft))] bg-clip-text text-transparent">
                instantly
              </span>
            </h1>
            <p className="max-w-2xl text-xl leading-9 text-[color:var(--muted-foreground)]">
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

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
            {trustPoints.map((point) => (
              <li
                key={point}
                className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--muted-foreground)]"
              >
                <span className="grid size-5 place-items-center rounded-full bg-[color:var(--surface-tint)] text-[color:var(--accent-strong)]">
                  <Check className="size-3.5" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative animate-scale-in [animation-delay:140ms]">
          <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_top,rgba(99,212,113,0.28),transparent_60%)] blur-2xl" />
          <HeroImage />
        </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pt-16">
      {/* Stats */}
      <section className="mt-6">
        <dl className="grid grid-cols-2 gap-4 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-8 backdrop-blur sm:grid-cols-4 sm:px-10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
                {stat.value}
              </dd>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                {stat.label}
              </p>
            </div>
          ))}
        </dl>
      </section>

      {/* Supported content types */}
      <section className="mt-20 space-y-8">
        <div className="flex flex-col gap-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
            One tool, every format
          </p>
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
            Encode anything your audience needs to scan
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {contentTypes.map((type, index) => (
            <Reveal key={type.label} delay={index * 60} className="h-full">
              <div className="group flex h-full flex-col items-center gap-3 border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-6 text-center transition duration-200 hover:-translate-y-1 hover:border-[color:var(--border-strong)] hover:shadow-[0_18px_48px_rgba(15,23,42,0.1)]">
                <span className="grid size-12 place-items-center bg-[color:var(--surface-tint)] text-[color:var(--accent-strong)] transition duration-200 group-hover:scale-105">
                  <type.icon className="size-6" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">
                    {type.label}
                  </p>
                  <p className="text-xs text-[color:var(--muted-foreground)]">
                    {type.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mt-20 space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
            Why teams use it
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
            Built like a serious product, not a throwaway demo
          </h2>
          <p className="text-lg leading-8 text-[color:var(--muted-foreground)]">
            pubbleRadar combines a premium interface with type-safe validation, local
            QR rendering, and a flexible architecture that can grow into saved
            history, analytics, auth, and brand assets.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 80} className="h-full">
              <Card className="group h-full transition duration-200 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(15,23,42,0.12)]">
                <CardHeader>
                  <span className="inline-flex size-12 items-center justify-center bg-[linear-gradient(135deg,var(--accent-soft),rgba(99,212,113,0.18))] text-[color:var(--accent-strong)] transition duration-200 group-hover:scale-105">
                    <feature.icon className="size-6" />
                  </span>
                  <CardTitle className="pt-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-20 space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
            How it works
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
            From raw input to a clean download in three steps
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((item, index) => (
            <Reveal key={item.step} delay={index * 90} className="relative h-full">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-3xl font-semibold text-[color:var(--accent-strong)]">
                      {item.step}
                    </span>
                    {index < steps.length - 1 && (
                      <span className="hidden flex-1 border-t border-dashed border-[color:var(--border-strong)] md:block" />
                    )}
                  </div>
                  <CardTitle className="pt-2">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-20 overflow-hidden rounded-[56px] border border-white/10 bg-[linear-gradient(135deg,#16271d,#0f1c15)] px-6 py-12 sm:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
              <Zap className="size-4" />
              Ready to build
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Move from raw text to clean download in seconds
            </h2>
            <p className="text-lg leading-8 text-white/75">
              Start with the generator, tweak size and colors, and export a code
              you can use in a product, menu, flyer, or onboarding flow.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/generate"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full justify-center text-white sm:w-auto",
              )}
            >
              Open generator
              <ArrowRight className="size-5" />
            </Link>
            <span className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white/75">
              <ScanLine className="size-4 text-[color:var(--accent-strong)]" />
              No account needed
            </span>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
