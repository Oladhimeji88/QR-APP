"use client";

import { Clock3, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import { CONTENT_TYPE_LABELS } from "@/lib/constants";
import { truncate } from "@/lib/utils";
import type { QRFormValues, QRHistoryItem } from "@/types/qr";

interface RecentHistoryProps {
  items: QRHistoryItem[];
  onSelect: (values: QRFormValues) => void;
  onClear: () => void;
}

export function RecentHistory({
  items,
  onSelect,
  onClear,
}: RecentHistoryProps) {
  return (
    <SectionCard
      title="Recent history"
      description="Jump back into your latest generated QR codes without retyping everything."
      action={
        items.length ? (
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        ) : null
      }
    >
      {items.length ? (
        <div className="space-y-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.values)}
              className="flex w-full flex-col gap-3 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-left transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[color:var(--foreground)]">
                  {CONTENT_TYPE_LABELS[item.type]}
                </p>
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  {truncate(item.summary, 80)}
                </p>
                <p className="font-mono text-xs text-[color:var(--muted-foreground)]">
                  {truncate(item.payload, 80)}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                <Clock3 className="size-3.5" />
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-[color:var(--border-strong)] bg-[color:var(--surface)]/70 p-5 text-sm leading-6 text-[color:var(--muted-foreground)]">
          <p className="flex items-start gap-3">
            <RotateCcw className="mt-1 size-4 shrink-0 text-[color:var(--accent-strong)]" />
            Your recent QR generations will appear here after you use the Generate QR button.
          </p>
        </div>
      )}
    </SectionCard>
  );
}
