"use client";

import { useEffect } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ToastMessage } from "@/types/qr";

const toneStyles = {
  success:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-950 dark:text-emerald-50",
  error:
    "border-rose-500/25 bg-rose-500/10 text-rose-950 dark:text-rose-50",
  info: "border-sky-500/25 bg-sky-500/10 text-sky-950 dark:text-sky-50",
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
          <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-2xl bg-white/70 text-current dark:bg-white/10">
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
            className="rounded-full p-1 text-current/80 transition hover:bg-white/40 hover:text-current dark:hover:bg-white/10"
            aria-label="Dismiss notification"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
