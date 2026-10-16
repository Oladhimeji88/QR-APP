"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/generate", label: "Generator" },
  { href: "/bulk", label: "Bulk & print" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--background)]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <Image
            src="/pubbleradar.png"
            alt={`${APP_NAME} logo`}
            width={44}
            height={44}
            priority
            className="size-11 rounded-lg object-contain"
          />
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

          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)] transition hover:border-[color:var(--border-strong)] md:hidden"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <nav className="border-t border-[color:var(--border)] bg-[color:var(--background)]/95 px-6 py-4 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[color:var(--muted-foreground)] transition hover:bg-[color:var(--surface)] hover:text-[color:var(--foreground)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/generate"
              onClick={() => setIsOpen(false)}
              className={cn(buttonVariants({ size: "default" }), "mt-2 w-full justify-center")}
            >
              Launch App
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
