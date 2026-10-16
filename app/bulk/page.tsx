import type { Metadata } from "next";
import { FileSpreadsheet, Layers, Printer } from "lucide-react";

import { BulkGenerator } from "@/components/qr/bulk-generator";

export const metadata: Metadata = {
  title: "Bulk & print",
  description:
    "Generate many QR codes at once from a CSV, download them as a ZIP, or print a sheet to PDF.",
};

const highlights = [
  {
    icon: FileSpreadsheet,
    title: "CSV in, codes out",
    description: "Paste or upload a spreadsheet — every row becomes its own QR code.",
  },
  {
    icon: Layers,
    title: "One ZIP download",
    description: "Export the whole batch as PNG or SVG, with a manifest mapping each file.",
  },
  {
    icon: Printer,
    title: "Print-ready sheets",
    description: "Lay codes out on A4 with crop marks, then save straight to PDF.",
  },
];

export default function BulkPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      <section className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)] lg:items-end">
          <div className="animate-fade-in-up space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">
              Bulk &amp; print
            </p>
            <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
              Generate hundreds of QR codes from a single spreadsheet
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[color:var(--muted-foreground)]">
              Drop in a CSV, generate every code locally, then download a ZIP or
              print a crop-marked sheet ready for stickers, tables, and signage.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-[#105C2B] text-white">
                  <item.icon className="size-5" />
                </span>
                <h2 className="mt-4 text-base font-bold text-[color:var(--foreground)]">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <BulkGenerator />
      </section>
    </div>
  );
}
