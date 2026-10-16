import { NextResponse } from "next/server";

import {
  buildFilenameStem,
  buildQrPayload,
  generateQrPngDataUrl,
  generateQrSvgString,
} from "@/lib/qr";
import {
  formatZodIssues,
  qrApiRequestSchema,
  sanitizeFormValues,
} from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid JSON payload." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const parsed = qrApiRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed.",
          issues: formatZodIssues(parsed.error),
        },
        { status: 422, headers: { "Cache-Control": "no-store" } },
      );
    }

    const { format, ...inputValues } = parsed.data;
    const values = sanitizeFormValues(inputValues);
    const payload = buildQrPayload(values);
    const fileStem = buildFilenameStem(values);

    // For production traffic, add IP-based rate limiting at the edge or via middleware.
    if (format === "svg") {
      const svg = await generateQrSvgString(payload, values);

      return new Response(svg, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Content-Disposition": `inline; filename="${fileStem}.svg"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const dataUrl = await generateQrPngDataUrl(payload, values);

    return NextResponse.json(
      {
        format: "png",
        payload,
        fileName: `${fileStem}.png`,
        dataUrl,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("QR generation failed", error);

    return NextResponse.json(
      {
        error: "Unexpected error while generating the QR code.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
