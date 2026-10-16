"use client";

import { useEffect } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ToastMessage } from "@/types/qr";

const toneStyles = {
  success:
    "border-[color:var(--accent-strong)]/30 bg-[color:var(--surface-tint)] text-[color:var(--accent-stronger)]",
  error:
    "border-[color:var(--accent-strong)]/45 bg-[color:var(--surface-tint)] text-[color:var(--foreground)]",
  info: "border-[color:var(--border-strong)] bg-[color:var(--surface-tint)] text-[color:var(--accent-stronger)]",
} as const;

const toneIcons = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
} as const;

interface ToastViewportProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export function ToastViewport({ toast, onDismiss }: ToastViewportProps) {
  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onDismiss();
    }, 3600);

    return () => window.clearTimeout(timeout);
  }, [onDismiss, toast]);

  if (!toast) {
    return null;
  }

  const Icon = toneIcons[toast.tone];

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-end sm:inset-x-6">
      <div
        className={cn(
          "pointer-events-auto w-full max-w-sm rounded-[24px] border px-5 py-4 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl",
          toneStyles[toast.tone],
        )}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-2xl bg-white/70 text-current">
            <Icon className="size-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.description ? (
              <p className="mt-1 text-sm leading-6 opacity-90">{toast.description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full p-1 text-current/80 transition hover:bg-white/40 hover:text-current"
            aria-label="Dismiss notification"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
