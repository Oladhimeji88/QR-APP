"use client";

import { startTransition, useEffect, useState } from "react";

import { FormatChooser } from "@/components/qr/format-chooser";
import { QrForm } from "@/components/qr/qr-form";
import { QrPreview } from "@/components/qr/qr-preview";
import { ToastViewport } from "@/components/ui/toast";
import {
  DEFAULT_FORM_VALUES,
  MAX_HISTORY_ITEMS,
  RECENT_HISTORY_STORAGE_KEY,
} from "@/lib/constants";
import { buildQrPayload, buildQrSummary } from "@/lib/qr";
import type {
  QRFormValues,
  QRHistoryItem,
  QRType,
  ToastMessage,
} from "@/types/qr";

type Step = "format" | "create";

export function QrGenerator() {
  const [step, setStep] = useState<Step>("format");
  const [selectedType, setSelectedType] = useState<QRType>(DEFAULT_FORM_VALUES.type);
  const [previewValues, setPreviewValues] = useState<QRFormValues>(DEFAULT_FORM_VALUES);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [historyItems, setHistoryItems] = useState<QRHistoryItem[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    try {
      const rawHistory = window.localStorage.getItem(RECENT_HISTORY_STORAGE_KEY);

      if (!rawHistory) {
        return;
      }

      const parsed = JSON.parse(rawHistory) as QRHistoryItem[];

      if (Array.isArray(parsed)) {
        setHistoryItems(parsed);
      }
    } catch (error) {
      console.error("Unable to restore recent QR history.", error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        RECENT_HISTORY_STORAGE_KEY,
        JSON.stringify(historyItems),
      );
    } catch (error) {
      console.error("Unable to persist recent QR history.", error);
    }
  }, [historyItems]);

  function notify(toastInput: Omit<ToastMessage, "id">) {
    setToast({
      id: Date.now(),
      ...toastInput,
    });
  }

  function addToHistory(values: QRFormValues) {
    const item: QRHistoryItem = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      type: values.type,
      summary: buildQrSummary(values),
      payload: buildQrPayload(values),
      values,
    };

    setHistoryItems((current) =>
      [item, ...current.filter((entry) => entry.payload !== item.payload)].slice(
        0,
        MAX_HISTORY_ITEMS,
      ),
    );
  }

  return (
    <>
      {step === "format" ? (
        <div key="format">
          <FormatChooser
            value={selectedType}
            onSelect={(type) => {
              setSelectedType(type);
              setPreviewValues({ ...DEFAULT_FORM_VALUES, type });
              setStep("create");
            }}
          />
        </div>
      ) : (
        <div
          key="create"
          className="grid animate-fade-in-up gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]"
        >
          <QrForm
            key={selectedType}
            initialType={selectedType}
            historyItems={historyItems}
            onChangeFormat={() => setStep("format")}
            onClearHistory={() => {
              setHistoryItems([]);
              notify({
                tone: "info",
                title: "History cleared",
                description: "Recent QR generations were removed from this browser.",
              });
            }}
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

              addToHistory(values);
              notify({
                tone: "success",
                title: "QR updated",
                description: "Your latest generation is ready for preview and export.",
              });
            }}
          />
          <div className="xl:sticky xl:top-28 xl:self-start">
            <QrPreview
              values={previewValues}
              refreshNonce={refreshNonce}
              onToast={notify}
            />
          </div>
        </div>
      )}
      <ToastViewport toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
