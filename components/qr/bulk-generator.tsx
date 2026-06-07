"use client";

import { useRef, useState } from "react";
import JSZip from "jszip";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileDown,
  Printer,
  Upload,
  Wand2,
} from "lucide-react";

import { QrTypeSelector } from "@/components/qr/qr-type-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionCard } from "@/components/ui/section-card";
import { Textarea } from "@/components/ui/textarea";
import {
  BULK_MAX_ROWS,
  bulkTemplate,
  buildBulkRows,
  type BulkRowResult,
} from "@/lib/bulk";
import { CONTENT_TYPE_LABELS } from "@/lib/constants";
import { generateQrAssets } from "@/lib/qr";
import {
  cn,
  downloadFile,
  formatTimestamp,
  slugifyFilename,
} from "@/lib/utils";
import type { QRGeneratedAssets, QRType } from "@/types/qr";

interface GeneratedItem {
  row: BulkRowResult;
  assets: QRGeneratedAssets;
}

const SIZE_OPTIONS = [256, 384, 512, 768, 1024];
const COLUMN_OPTIONS = [2, 3, 4] as const;

function filenameStem(row: BulkRowResult) {
  const slug = slugifyFilename(row.label) || "qr";
  return `${String(row.index).padStart(3, "0")}-${slug}`;
}

export function BulkGenerator() {
  const [type, setType] = useState<QRType>("url");
  const [csvText, setCsvText] = useState("");
  const [size, setSize] = useState(512);
  const [margin, setMargin] = useState(2);
  const [foreground, setForeground] = useState("#111827");
  const [background, setBackground] = useState("#ffffff");
  const [columns, setColumns] = useState<(typeof COLUMN_OPTIONS)[number]>(3);

  const [items, setItems] = useState<GeneratedItem[]>([]);
  const [invalidRows, setInvalidRows] = useState<BulkRowResult[]>([]);
  const [headerError, setHeaderError] = useState<string | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  function resetResults() {
    setItems([]);
    setInvalidRows([]);
    setHeaderError(null);
    setTruncated(false);
    setStatus(null);
  }

  function loadTemplate() {
    setCsvText(bulkTemplate(type));
    resetResults();
  }

  function downloadTemplate() {
    downloadFile({
      content: bulkTemplate(type),
      fileName: `pubbleradar-${type}-template.csv`,
      mimeType: "text/csv",
    });
  }

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setCsvText(text);
    resetResults();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleGenerate() {
    resetResults();
    setIsWorking(true);

    try {
      const parsed = buildBulkRows(type, csvText, {
        size,
        margin,
        foreground,
        background,
      });

      if (parsed.headerError) {
        setHeaderError(parsed.headerError);
        return;
      }

      if (parsed.rows.length === 0) {
        setHeaderError("No data rows found. Add at least one row beneath the header.");
        return;
      }

      const valid = parsed.rows.filter((row) => row.status === "valid");
      const invalid = parsed.rows.filter((row) => row.status === "invalid");
      setInvalidRows(invalid);
      setTruncated(parsed.truncated);

      const generated: GeneratedItem[] = [];
      setProgress({ done: 0, total: valid.length });

      for (const row of valid) {
        if (!row.values) continue;
        const assets = await generateQrAssets(row.values);
        generated.push({ row, assets });
        setProgress((current) => ({ ...current, done: current.done + 1 }));
      }

      setItems(generated);
      setStatus(
        `Generated ${generated.length} code${generated.length === 1 ? "" : "s"}` +
          (invalid.length ? ` · ${invalid.length} row${invalid.length === 1 ? "" : "s"} skipped` : ""),
      );
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong while generating. Check your CSV and try again.");
    } finally {
      setIsWorking(false);
    }
  }

  async function downloadZip(format: "png" | "svg") {
    if (items.length === 0) return;
    const zip = new JSZip();

    const manifest = [["file", "label", "type", "summary", "payload"]];

    for (const { row, assets } of items) {
      const stem = filenameStem(row);
      const fileName = `${stem}.${format}`;

      if (format === "png") {
        const base64 = assets.pngDataUrl.split(",")[1] ?? "";
        zip.file(fileName, base64, { base64: true });
      } else {
        zip.file(fileName, assets.svgString);
      }

      manifest.push([
        fileName,
        row.label,
        CONTENT_TYPE_LABELS[type],
        assets.summary,
        assets.payload,
      ]);
    }

    const manifestCsv = manifest
      .map((cells) =>
        cells
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    zip.file("manifest.csv", manifestCsv);

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pubbleradar-${type}-${format}-${formatTimestamp()}.zip`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  const hasResults = items.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
        <div className="space-y-6">
          <SectionCard
            title="Content type"
            description="Every row in your CSV becomes one QR code of this type."
          >
            <QrTypeSelector value={type} onChange={(next) => { setType(next); resetResults(); }} />
          </SectionCard>

          <SectionCard
            title="Data (CSV)"
            description="Paste rows or upload a .csv file. The first row must be the header."
            action={
              <Button type="button" variant="ghost" size="sm" onClick={loadTemplate}>
                <Wand2 className="size-4" />
                Load template
              </Button>
            }
          >
            <div className="space-y-4">
              <Textarea
                value={csvText}
                onChange={(event) => setCsvText(event.target.value)}
                placeholder={bulkTemplate(type)}
                className="min-h-44 font-mono text-xs leading-6"
                spellCheck={false}
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="size-4" />
                  Upload CSV
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={downloadTemplate}>
                  <FileDown className="size-4" />
                  Download template
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={onFileChange}
                />
                <span className="ml-auto text-xs text-[color:var(--muted-foreground)]">
                  Up to {BULK_MAX_ROWS} rows
                </span>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="Style"
          description="Applied to every code in the batch."
          className="h-fit"
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="bulk-size">Size (px)</Label>
              <select
                id="bulk-size"
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
                className="h-11 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm text-[color:var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
              >
                {SIZE_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value} × {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulk-margin">Quiet-zone margin</Label>
              <Input
                id="bulk-margin"
                type="number"
                min={0}
                max={8}
                value={margin}
                onChange={(event) => setMargin(Number(event.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="bulk-fg">Foreground</Label>
                <input
                  id="bulk-fg"
                  type="color"
                  value={foreground}
                  onChange={(event) => setForeground(event.target.value)}
                  className="h-11 w-full cursor-pointer rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulk-bg">Background</Label>
                <input
                  id="bulk-bg"
                  type="color"
                  value={background}
                  onChange={(event) => setBackground(event.target.value)}
                  className="h-11 w-full cursor-pointer rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-1"
                />
              </div>
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={handleGenerate}
              disabled={isWorking || csvText.trim().length === 0}
            >
              {isWorking
                ? `Generating ${progress.done}/${progress.total}…`
                : "Generate codes"}
            </Button>

            {headerError ? (
              <p className="flex items-start gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                {headerError}
              </p>
            ) : null}

            {status ? (
              <p className="flex items-start gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3 text-sm text-[color:var(--muted-foreground)]">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[color:var(--accent-strong)]" />
                {status}
              </p>
            ) : null}
          </div>
        </SectionCard>
      </div>

      {hasResults ? (
        <SectionCard
          title="Export"
          description="Download every code as a ZIP, or print a sheet to PDF."
          action={
            <div className="flex flex-wrap gap-2 bulk-print-hide">
              <Button type="button" variant="outline" size="sm" onClick={() => downloadZip("png")}>
                <Download className="size-4" />
                ZIP · PNG
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => downloadZip("svg")}>
                <Download className="size-4" />
                ZIP · SVG
              </Button>
              <Button type="button" size="sm" onClick={() => window.print()}>
                <Printer className="size-4" />
                Print / PDF
              </Button>
            </div>
          }
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 bulk-print-hide">
              <span className="text-sm text-[color:var(--muted-foreground)]">
                Print columns
              </span>
              {COLUMN_OPTIONS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setColumns(value)}
                  className={cn(
                    "size-9 rounded-xl border text-sm font-medium transition",
                    value === columns
                      ? "border-transparent bg-[color:var(--accent-strong)] text-white"
                      : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)] hover:border-[color:var(--border-strong)]",
                  )}
                >
                  {value}
                </button>
              ))}
              {truncated ? (
                <span className="ml-auto text-xs text-amber-600 dark:text-amber-400">
                  Limited to the first {BULK_MAX_ROWS} rows.
                </span>
              ) : null}
            </div>

            <div className="overflow-hidden rounded-[24px] border border-[color:var(--border)]">
              <div className="bulk-print-area bg-white p-8 text-slate-900">
                <div
                  className="grid gap-8"
                  style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                >
                  {items.map(({ row, assets }) => (
                    <div key={row.index} className="crop-cell flex flex-col items-center gap-2">
                      <span className="crop-mark crop-mark--tl" />
                      <span className="crop-mark crop-mark--tr" />
                      <span className="crop-mark crop-mark--bl" />
                      <span className="crop-mark crop-mark--br" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={assets.pngDataUrl}
                        alt={`QR code for ${row.label}`}
                        className="h-auto w-full max-w-[180px]"
                      />
                      <p className="w-full truncate text-center text-xs font-medium text-slate-700">
                        {row.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      ) : null}

      {invalidRows.length > 0 ? (
        <SectionCard
          title={`Skipped rows (${invalidRows.length})`}
          description="These rows did not pass validation and were not generated."
        >
          <ul className="space-y-2">
            {invalidRows.map((row) => (
              <li
                key={row.index}
                className="flex flex-col gap-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium text-[color:var(--foreground)]">
                  Row {row.index}
                  {row.label ? ` · ${row.label}` : ""}
                </span>
                <span className="text-[color:var(--muted-foreground)]">
                  {row.errors[0] ?? "Invalid input."}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
      ) : null}
    </div>
  );
}
