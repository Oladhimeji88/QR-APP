import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BrandGlyph } from "@/components/layout/brand-glyph";
import { buttonVariants } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/generate", label: "Generator" },
  { href: "/bulk", label: "Bulk & print" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--background)]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-strong),var(--accent-soft))] text-[color:var(--foreground)] shadow-[0_18px_40px_rgba(99,212,113,0.28)]">
            <BrandGlyph className="size-6" />
          </span>
          <span className="block text-lg font-semibold tracking-tight text-[color:var(--foreground)]">
            {APP_NAME}
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
