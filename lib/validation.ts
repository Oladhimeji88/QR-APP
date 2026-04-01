import { z } from "zod";

import { QR_MARGIN_RANGE, QR_SIZE_RANGE } from "@/lib/constants";
import type { QRFormValues } from "@/types/qr";
import { QR_DOWNLOAD_FORMATS, QR_TYPES, WIFI_ENCRYPTIONS } from "@/types/qr";

const hexColorSchema = z
  .string()
  .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, "Enter a valid hex color.");

function hasValidPhoneShape(value: string) {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (!/^\+?[0-9()\-\s]{7,20}$/.test(trimmed)) {
    return false;
  }

  return digits.length >= 7 && digits.length <= 15;
}

export function sanitizeFormValues(values: QRFormValues): QRFormValues {
  return {
    ...values,
    url: values.url.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    smsNumber: values.smsNumber.trim(),
    wifiSsid: values.wifiSsid.trim(),
    wifiPassword: values.wifiPassword.trim(),
  };
}

export const qrFormSchema = z
  .object({
    type: z.enum(QR_TYPES),
    text: z
      .string()
      .max(3000, "Keep plain text under 3000 characters for dependable scanning."),
    url: z.string().max(2048, "URLs should stay under 2048 characters."),
    email: z.string().max(320, "Email addresses should stay under 320 characters."),
    emailSubject: z
      .string()
      .max(160, "Keep subject lines under 160 characters."),
    emailBody: z
      .string()
      .max(1200, "Keep email body copy under 1200 characters."),
    phone: z.string().max(32, "Phone numbers should stay short and readable."),
    smsNumber: z.string().max(32, "Phone numbers should stay short and readable."),
    smsMessage: z
      .string()
      .max(480, "Keep SMS copy under 480 characters."),
    wifiSsid: z.string().max(64, "SSID should stay under 64 characters."),
    wifiPassword: z
      .string()
      .max(64, "Wi-Fi passwords should stay under 64 characters."),
    wifiEncryption: z.enum(WIFI_ENCRYPTIONS),
    wifiHidden: z.boolean(),
    size: z
      .number({ invalid_type_error: "Choose a QR size." })
      .int("QR size must be a whole number.")
      .min(QR_SIZE_RANGE.min)
      .max(QR_SIZE_RANGE.max),
    margin: z
      .number({ invalid_type_error: "Choose a quiet-zone margin." })
      .int("Margin must be a whole number.")
      .min(QR_MARGIN_RANGE.min)
      .max(QR_MARGIN_RANGE.max),
    foreground: hexColorSchema,
    background: hexColorSchema,
  })
  .superRefine((values, ctx) => {
    const sanitized = sanitizeFormValues(values);

    switch (sanitized.type) {
      case "text":
        if (!sanitized.text.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["text"],
            message: "Enter the text you want to turn into a QR code.",
          });
        }
        break;
      case "url":
        if (!sanitized.url) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["url"],
            message: "Enter a URL to encode.",
          });
          break;
        }

        if (!z.string().url().safeParse(sanitized.url).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["url"],
            message: "Enter a full valid URL, including http:// or https://.",
          });
        }
        break;
      case "email":
        if (!sanitized.email) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["email"],
            message: "Enter a valid email address.",
          });
          break;
        }

        if (!z.email().safeParse(sanitized.email).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["email"],
            message: "Enter a valid email address.",
          });
        }
        break;
      case "phone":
        if (!sanitized.phone) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["phone"],
            message: "Enter a phone number.",
          });
          break;
        }

        if (!hasValidPhoneShape(sanitized.phone)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["phone"],
            message: "Enter a real phone number with at least 7 digits.",
          });
        }
        break;
      case "sms":
        if (!sanitized.smsNumber) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["smsNumber"],
            message: "Enter the destination phone number.",
          });
        } else if (!hasValidPhoneShape(sanitized.smsNumber)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["smsNumber"],
            message: "Enter a real phone number with at least 7 digits.",
          });
        }

        if (!sanitized.smsMessage.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["smsMessage"],
            message: "Add the message you want to prefill.",
          });
        }
        break;
      case "wifi":
        if (!sanitized.wifiSsid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["wifiSsid"],
            message: "Wi-Fi SSID is required.",
          });
        }

        if (
          sanitized.wifiEncryption !== "none" &&
          !sanitized.wifiPassword.trim()
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["wifiPassword"],
            message: "Password is required unless encryption is set to None.",
          });
        }
        break;
      default:
        break;
    }
  });

export const qrApiRequestSchema = qrFormSchema.extend({
  format: z.enum(QR_DOWNLOAD_FORMATS),
});

export function formatZodIssues(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}
