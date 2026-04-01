"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildFilenameStem } from "@/lib/qr";
import { downloadFile, formatTimestamp } from "@/lib/utils";
import type { QRFormValues, QRGeneratedAssets } from "@/types/qr";

interface DownloadButtonsProps {
  assets: QRGeneratedAssets | null;
  values: QRFormValues | null;
}

export function DownloadButtons({ assets, values }: DownloadButtonsProps) {
  const isDisabled = !assets || !values;

  function buildFileName(extension: "png" | "svg") {
    if (!values) {
      return `qr-forge-${formatTimestamp()}.${extension}`;
    }

    return `${buildFilenameStem(values)}-${formatTimestamp()}.${extension}`;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button
        variant="primary"
        className="w-full"
        disabled={isDisabled}
        onClick={() => {
          if (!assets) {
            return;
          }

          downloadFile({
            content: assets.pngDataUrl,
            fileName: buildFileName("png"),
            mimeType: "image/png",
            isDataUrl: true,
          });
        }}
      >
        <Download className="size-4" />
        Download PNG
      </Button>
      <Button
        variant="outline"
        className="w-full"
        disabled={isDisabled}
        onClick={() => {
          if (!assets) {
            return;
          }

          downloadFile({
            content: assets.svgString,
            fileName: buildFileName("svg"),
            mimeType: "image/svg+xml;charset=utf-8",
          });
        }}
      >
        <Download className="size-4" />
        Download SVG
      </Button>
    </div>
  );
}
