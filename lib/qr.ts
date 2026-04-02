import QRCode from "qrcode";

import { CONTENT_TYPE_LABELS, MAX_SUMMARY_LENGTH } from "@/lib/constants";
import { slugifyFilename, truncate } from "@/lib/utils";
import { sanitizeFormValues } from "@/lib/validation";
import type {
  QRFormValues,
  QRGeneratedAssets,
  QRStyleOptions,
} from "@/types/qr";

function escapeWifiValue(value: string) {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

function escapeMatmsgValue(value: string) {
  return value.replace(/([\\;:])/g, "\\$1");
}

function normalizePhoneForPayload(value: string) {
  const trimmed = value.trim();
  const hasPlusPrefix = trimmed.startsWith("+");
  const digitsOnly = trimmed.replace(/\D/g, "");

  return hasPlusPrefix ? `+${digitsOnly}` : digitsOnly;
}

function getRenderOptions(options: QRStyleOptions) {
  return {
    errorCorrectionLevel: "H" as const,
    width: options.size,
    margin: options.margin,
    color: {
      dark: options.foreground,
      light: options.background,
    },
  };
}

export function buildQrPayload(input: QRFormValues) {
  const values = sanitizeFormValues(input);

  switch (values.type) {
    case "text":
      return values.text;
    case "url":
      return values.url;
    case "email":
      return `MATMSG:TO:${escapeMatmsgValue(values.email)};SUB:${escapeMatmsgValue(
        values.emailSubject,
      )};BODY:${escapeMatmsgValue(values.emailBody)};;`;
    case "phone":
      return `TEL:${normalizePhoneForPayload(values.phone)}`;
    case "sms":
      return `SMSTO:${normalizePhoneForPayload(values.smsNumber)}:${values.smsMessage}`;
    case "wifi": {
      const encryption =
        values.wifiEncryption === "none" ? "nopass" : values.wifiEncryption;
      const password = values.wifiEncryption === "none" ? "" : values.wifiPassword;

      return `WIFI:T:${encryption};S:${escapeWifiValue(
        values.wifiSsid,
      )};P:${escapeWifiValue(password)};H:${String(
        values.wifiHidden,
      )};;`;
    }
    default:
      return values.text;
  }
}

export function buildQrSummary(input: QRFormValues) {
  const values = sanitizeFormValues(input);

  switch (values.type) {
    case "text":
      return truncate(values.text.trim() || "Plain text", MAX_SUMMARY_LENGTH);
    case "url":
      return truncate(values.url, MAX_SUMMARY_LENGTH);
    case "email":
      return truncate(values.email, MAX_SUMMARY_LENGTH);
    case "phone":
      return truncate(values.phone, MAX_SUMMARY_LENGTH);
    case "sms":
      return truncate(
        `${values.smsNumber} - ${values.smsMessage}`,
        MAX_SUMMARY_LENGTH,
      );
    case "wifi":
      return truncate(
        `${values.wifiSsid} - ${values.wifiEncryption === "none" ? "Open network" : values.wifiEncryption}`,
        MAX_SUMMARY_LENGTH,
      );
    default:
      return "QR code";
  }
}

export function buildFilenameStem(values: QRFormValues) {
  const summarySlug = slugifyFilename(buildQrSummary(values));
  const typeSlug = slugifyFilename(CONTENT_TYPE_LABELS[values.type]);

  return `qr-forge-${typeSlug}${summarySlug ? `-${summarySlug}` : ""}`;
}

export async function generateQrPngDataUrl(
  payload: string,
  options: QRStyleOptions,
) {
  return QRCode.toDataURL(payload, {
    ...getRenderOptions(options),
    type: "image/png",
  });
}

export async function generateQrSvgString(
  payload: string,
  options: QRStyleOptions,
) {
  return QRCode.toString(payload, {
    ...getRenderOptions(options),
    type: "svg",
  });
}

export async function generateQrAssets(
  values: QRFormValues,
): Promise<QRGeneratedAssets> {
  const payload = buildQrPayload(values);
  const renderOptions = {
    size: values.size,
    margin: values.margin,
    foreground: values.foreground,
    background: values.background,
  };

  const [pngDataUrl, svgString] = await Promise.all([
    generateQrPngDataUrl(payload, renderOptions),
    generateQrSvgString(payload, renderOptions),
  ]);

  return {
    payload,
    pngDataUrl,
    svgString,
    summary: buildQrSummary(values),
    typeLabel: CONTENT_TYPE_LABELS[values.type],
  };
}
