"use client";

import { QrTypeSelector } from "@/components/qr/qr-type-selector";
import type { QRType } from "@/types/qr";

interface FormatChooserProps {
  value: QRType;
  onSelect: (type: QRType) => void;
}

export function FormatChooser({ value, onSelect }: FormatChooserProps) {
  return (
    <div className="animate-fade-in-up border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-10">
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
          Step 1 of 2
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-3xl">
          What do you want to share?
        </h2>
        <p className="text-[color:var(--muted-foreground)]">
          Choose a format to begin — you can change it at any time.
        </p>
      </div>
      <div className="mt-8">
        <QrTypeSelector value={value} onChange={onSelect} animateIn />
      </div>
    </div>
  );
}
