import Link from "next/link";

import { BrandGlyph } from "@/components/layout/brand-glyph";
import { APP_NAME } from "@/lib/constants";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/generate", label: "Generator" },
  { href: "/bulk", label: "Bulk & print" },
  { href: "https://nextjs.org", label: "Built with Next.js" },
];

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--background)]/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--accent-strong),var(--accent-soft))] text-white shadow-[0_12px_28px_rgba(63,122,99,0.24)]">
            <BrandGlyph className="size-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-[color:var(--foreground)]">
              {APP_NAME}
            </p>
            <p className="text-sm text-[color:var(--muted-foreground)]">
              Professional QR generation with fast local rendering and export-ready assets.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[color:var(--muted-foreground)]">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition hover:text-[color:var(--foreground)]"
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
