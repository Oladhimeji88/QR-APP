import Link from "next/link";
import { ArrowRight, Sparkles, QrCode } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/generate", label: "Generator" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--background)]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-strong),var(--accent-soft))] text-white shadow-[0_18px_40px_rgba(18,115,96,0.28)]">
            <QrCode className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
              Local QR Studio
            </span>
            <span className="block text-lg font-semibold tracking-tight text-[color:var(--foreground)]">
              {APP_NAME}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] p-1.5 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[color:var(--muted-foreground)] transition hover:text-[color:var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 md:inline-flex dark:text-emerald-300">
            <Sparkles className="size-3.5" />
            Generated locally
          </span>
          <Link
            href="/generate"
            className={cn(buttonVariants({ size: "default" }), "hidden sm:inline-flex")}
          >
            Launch App
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
