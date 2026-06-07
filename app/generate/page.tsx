import type { Metadata } from "next";

import { QrGenerator } from "@/components/qr/qr-generator";

export const metadata: Metadata = {
  title: "Generate",
  description: "Build, preview, and download custom QR codes in PNG or SVG.",
};

export default function GeneratePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      <section className="space-y-8">
        <QrGenerator />
      </section>
    </div>
  );
}
