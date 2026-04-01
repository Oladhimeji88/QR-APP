"use client";

import { startTransition, useState } from "react";

import { QrForm } from "@/components/qr/qr-form";
import { QrPreview } from "@/components/qr/qr-preview";
import { DEFAULT_FORM_VALUES } from "@/lib/constants";
import type { QRFormValues } from "@/types/qr";

export function QrGenerator() {
  const [previewValues, setPreviewValues] = useState<QRFormValues>(DEFAULT_FORM_VALUES);
  const [refreshNonce, setRefreshNonce] = useState(0);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]">
      <QrForm
        onPreviewChange={(values) => {
          startTransition(() => {
            setPreviewValues(values);
          });
        }}
        onGenerate={(values) => {
          startTransition(() => {
            setPreviewValues(values);
            setRefreshNonce((current) => current + 1);
          });
        }}
      />
      <div className="xl:sticky xl:top-28 xl:self-start">
        <QrPreview values={previewValues} refreshNonce={refreshNonce} />
      </div>
    </div>
  );
}
