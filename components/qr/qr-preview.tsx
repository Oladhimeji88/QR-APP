"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  ScanLine,
} from "lucide-react";

import { DownloadButtons } from "@/components/qr/download-buttons";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import { DEFAULT_SCAN_TIP } from "@/lib/constants";
import { generateQrAssets } from "@/lib/qr";
import { qrFormSchema, sanitizeFormValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { QRFormValues, QRPreviewState, ToastMessage } from "@/types/qr";

interface QrPreviewProps {
  values: QRFormValues;
  refreshNonce: number;
  onToast: (toast: Omit<ToastMessage, "id">) => void;
}

function hasDraftInput(values: QRFormValues) {
  const sanitized = sanitizeFormValues(values);

  switch (sanitized.type) {
    case "text":
      return Boolean(sanitized.text.trim());
    case "url":
      return Boolean(sanitized.url);
    case "email":
      return Boolean(
        sanitized.email ||
          sanitized.emailSubject.trim() ||
          sanitized.emailBody.trim(),
      );
    case "phone":
      return Boolean(sanitized.phone);
    case "sms":
      return Boolean(sanitized.smsNumber || sanitized.smsMessage.trim());
    case "wifi":
      return Boolean(
        sanitized.wifiSsid ||
          sanitized.wifiPassword ||
          sanitized.wifiEncryption === "none",
      );
    default:
      return false;
  }
}

export function QrPreview({ values, refreshNonce, onToast }: QrPreviewProps) {
  const [debouncedValues, setDebouncedValues] = useState(values);
  const [preview, setPreview] = useState<QRPreviewState>({
    status: "idle",
    data: null,
    message: "Choose a content type and add your data to see a live preview.",
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValues(values);
    }, 280);

    return () => window.clearTimeout(timeout);
  }, [values]);

  const runPreview = useCallback(async (sourceValues: QRFormValues) => {
    const sanitized = sanitizeFormValues(sourceValues);
    const validation = qrFormSchema.safeParse(sanitized);

    if (!validation.success) {
      setPreview({
        status: "idle",
        data: null,
        message: hasDraftInput(sanitized)
          ? "Preview updates automatically once the current fields are valid."
          : "Start with a QR type, drop in the example content, or paste your own data.",
      });
      return;
    }

    setPreview((current) => ({
      status: "loading",
      data: current.data,
      message: "Rendering preview...",
    }));

    try {
      const assets = await generateQrAssets(validation.data);
      setPreview({
        status: "ready",
        data: assets,
      });
    } catch (error) {
      console.error(error);
      setPreview({
        status: "error",
        data: null,
        message:
          "We could not render this QR code. Double-check the input and try again.",
      });
    }
  }, []);

  useEffect(() => {
    void runPreview(debouncedValues);
  }, [debouncedValues, runPreview]);

  useEffect(() => {
    void runPreview(values);
  }, [refreshNonce, runPreview, values]);

  async function handleCopyPayload(payload: string) {
    try {
      await navigator.clipboard.writeText(payload);
      onToast({
        tone: "success",
        title: "Payload copied",
        description: "The encoded text is now in your clipboard.",
      });
    } catch (error) {
      console.error(error);
      onToast({
        tone: "error",
        title: "Copy failed",
        description: "Please copy the payload manually from the preview.",
      });
    }
  }

  function handleOpenLink(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const previewData = preview.data;
  const isUrlType = values.type === "url" && previewData?.payload;

  return (
    <div className="space-y-6">
      <SectionCard
        title="Live preview"
        description="Your QR updates automatically on valid changes and stays ready for export."
      >
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[linear-gradient(180deg,var(--surface),transparent)] p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(18,115,96,0.12),transparent_52%)]" />
            <div className="absolute inset-x-8 top-8 h-px bg-[linear-gradient(90deg,transparent,rgba(18,115,96,0.28),transparent)]" />

            <div className="relative">
              {previewData ? (
                <div className="space-y-5">
                  <div className="mx-auto flex max-w-sm items-center justify-between rounded-full border border-[color:var(--border)] bg-[color:var(--background)]/90 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                    <span>{previewData.typeLabel}</span>
                    <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="size-3.5" />
                      Ready
                    </span>
                  </div>

                  <div className="mx-auto grid max-w-sm place-items-center rounded-[32px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,248,251,0.84))] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(10,15,26,0.82))]">
                    <img
                      src={previewData.pngDataUrl}
                      alt={`${previewData.typeLabel} QR code preview`}
                      className={cn(
                        "h-auto w-full max-w-[320px] rounded-2xl",
                        preview.status === "loading" ? "opacity-80" : "",
                      )}
                    />
                  </div>

                  <div className="grid gap-4 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--background)]/85 p-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                        Encoded summary
                      </p>
                      <p className="text-base font-medium text-[color:var(--foreground)]">
                        {previewData.summary}
                      </p>
                      <p className="font-mono text-xs leading-6 text-[color:var(--muted-foreground)]">
                        {previewData.payload}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void handleCopyPayload(previewData.payload)}
                      >
                        <Copy className="size-4" />
                        Copy payload
                      </Button>
                      {isUrlType ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenLink(previewData.payload)}
                        >
                          <ExternalLink className="size-4" />
                          Open link
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : preview.status === "error" ? (
                <div className="grid min-h-[420px] place-items-center rounded-[28px] border border-dashed border-rose-300 bg-rose-50/80 p-8 text-center dark:bg-rose-950/10">
                  <div className="max-w-sm space-y-4">
                    <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600">
                      <AlertTriangle className="size-7" />
                    </span>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
                        Preview unavailable
                      </h3>
                      <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
                        {preview.message}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid min-h-[420px] place-items-center rounded-[28px] border border-dashed border-[color:var(--border-strong)] bg-[color:var(--surface)]/70 p-8 text-center">
                  <div className="max-w-sm space-y-4">
                    <span className="mx-auto inline-flex size-16 items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,var(--accent-soft),rgba(18,115,96,0.1))] text-[color:var(--accent-strong)]">
                      <ScanLine className="size-8" />
                    </span>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-[color:var(--foreground)]">
                        Welcome to pubbleRadar
                      </h3>
                      <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
                        {preview.message}
                      </p>
                      <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
                        Tip: Use the Try example button to instantly populate fields for the selected QR type.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
            <p className="text-sm font-medium text-[color:var(--foreground)]">Scan tip</p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted-foreground)]">
              {DEFAULT_SCAN_TIP}
            </p>
          </div>

          <DownloadButtons
            assets={preview.status === "ready" || preview.status === "loading" ? previewData : null}
            values={preview.status === "ready" || preview.status === "loading" ? values : null}
            onToast={onToast}
          />
        </div>
      </SectionCard>
    </div>
  );
}
