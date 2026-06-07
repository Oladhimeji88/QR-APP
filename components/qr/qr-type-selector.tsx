"use client";

import type { ComponentType } from "react";
import {
  AlignLeft,
  Link2,
  Mail,
  MessageSquareText,
  Phone,
  Wifi,
} from "lucide-react";

import { QR_TYPE_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { QRType } from "@/types/qr";

const iconMap: Record<QRType, ComponentType<{ className?: string }>> = {
  text: AlignLeft,
  url: Link2,
  email: Mail,
  phone: Phone,
  sms: MessageSquareText,
  wifi: Wifi,
};

interface QrTypeSelectorProps {
  value: QRType;
  onChange: (type: QRType) => void;
}

export function QrTypeSelector({ value, onChange }: QrTypeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" role="radiogroup" aria-label="QR content type">
      {QR_TYPE_OPTIONS.map((option) => {
        const Icon = iconMap[option.value];
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "group rounded-[24px] border p-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]",
              isActive
                ? "border-transparent bg-[linear-gradient(180deg,var(--surface-tint),transparent)] shadow-[inset_0_0_0_1px_rgba(63,122,99,0.18),0_18px_40px_rgba(63,122,99,0.14)]"
                : "border-[color:var(--border)] bg-[color:var(--surface)] hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-strong)]",
            )}
          >
            <span
              className={cn(
                "mb-4 inline-flex size-11 items-center justify-center rounded-2xl border",
                isActive
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-[color:var(--border)] bg-white/70 text-[color:var(--muted-foreground)] dark:bg-white/5",
              )}
            >
              <Icon className="size-5" />
            </span>
            <span className="block text-sm font-semibold text-[color:var(--foreground)]">
              {option.label}
            </span>
            <span className="mt-1 block text-sm leading-6 text-[color:var(--muted-foreground)]">
              {option.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
