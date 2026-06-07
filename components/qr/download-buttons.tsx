"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  generateQrPngDataUrl,
  generateQrSvgString,
  buildFilenameStem,
} from "@/lib/qr";
import { downloadFile, formatTimestamp } from "@/lib/utils";
import type { QRFormValues, QRGeneratedAssets, ToastMessage } from "@/types/qr";

interface DownloadButtonsProps {
  assets: QRGeneratedAssets | null;
  values: QRFormValues | null;
  onToast: (toast: Omit<ToastMessage, "id">) => void;
}

async function requestQrFromApi(values: QRFormValues, format: "png" | "svg") {
  const response = await fetch("/api/qr", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...values,
      format,
    }),
  });

  if (!response.ok) {
    throw new Error("API generation failed");
  }

  if (format === "svg") {
    return {
      format,
      svg: await response.text(),
    };
  }

  const payload = (await response.json()) as { dataUrl?: string };

  if (!payload.dataUrl) {
    throw new Error("Invalid PNG payload");
  }

  return {
    format,
    dataUrl: payload.dataUrl,
  };
}

export function DownloadButtons({ assets, values, onToast }: DownloadButtonsProps) {
  const isDisabled = !assets || !values;

  function buildFileName(extension: "png" | "svg") {
    if (!values) {
      return `pubbleradar-${formatTimestamp()}.${extension}`;
    }

    return `${buildFilenameStem(values)}-${formatTimestamp()}.${extension}`;
  }

  async function handleDownload(format: "png" | "svg") {
    if (!assets || !values) {
      return;
    }

    try {
      const apiResult = await requestQrFromApi(values, format);

      if (apiResult.format === "svg") {
        downloadFile({
          content: apiResult.svg,
          fileName: buildFileName("svg"),
          mimeType: "image/svg+xml;charset=utf-8",
        });
      } else {
        downloadFile({
          content: apiResult.dataUrl,
          fileName: buildFileName("png"),
          mimeType: "image/png",
          isDataUrl: true,
        });
      }

      onToast({
        tone: "success",
        title: `Downloaded ${format.toUpperCase()}`,
        description: "Your QR file is ready in the browser downloads.",
      });
    } catch (error) {
      try {
        if (format === "svg") {
          const svgString = await generateQrSvgString(assets.payload, values);
          downloadFile({
            content: svgString,
            fileName: buildFileName("svg"),
            mimeType: "image/svg+xml;charset=utf-8",
          });
        } else {
          const dataUrl = await generateQrPngDataUrl(assets.payload, values);
          downloadFile({
            content: dataUrl,
            fileName: buildFileName("png"),
            mimeType: "image/png",
            isDataUrl: true,
          });
        }

        onToast({
          tone: "info",
          title: "Downloaded with client fallback",
          description: "We used a local render because the API was unavailable.",
        });
      } catch (fallbackError) {
        console.error(error, fallbackError);
        onToast({
          tone: "error",
          title: "Download failed",
          description: "Please try again. The QR could not be generated.",
        });
      }
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button
        variant="primary"
        className="w-full"
        disabled={isDisabled}
        onClick={() => void handleDownload("png")}
      >
        <Download className="size-4" />
        Download PNG
      </Button>
      <Button
        variant="outline"
        className="w-full"
        disabled={isDisabled}
        onClick={() => void handleDownload("svg")}
      >
        <Download className="size-4" />
        Download SVG
      </Button>
    </div>
  );
}
