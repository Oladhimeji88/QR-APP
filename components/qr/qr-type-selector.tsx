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
  animateIn?: boolean;
}

export function QrTypeSelector({ value, onChange, animateIn = false }: QrTypeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" role="radiogroup" aria-label="QR content type">
      {QR_TYPE_OPTIONS.map((option, index) => {
        const Icon = iconMap[option.value];
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            style={animateIn ? { animationDelay: `${index * 60}ms` } : undefined}
            className={cn(
              "group border p-4 text-left transition duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]",
              animateIn && "animate-fade-in-up",
              isActive
                ? "border-[color:var(--accent-strong)]/40 bg-[color:var(--surface-tint)] text-[color:var(--accent-strong)] shadow-[0_18px_40px_rgba(99,212,113,0.16)]"
                : "border-[color:var(--border)] bg-[color:var(--surface)] hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-strong)] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]",
            )}
          >
            <span className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl border border-transparent bg-[#105C2B] text-white">

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
