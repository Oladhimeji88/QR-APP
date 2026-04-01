import type { QRFormValues, QRType, WifiEncryption } from "@/types/qr";

export const APP_NAME = "QR Forge";

export const APP_DESCRIPTION =
  "Generate, preview, and download clean QR codes for text, links, contact actions, and Wi-Fi in seconds.";

export const CONTENT_TYPE_LABELS: Record<QRType, string> = {
  text: "Plain text",
  url: "URL",
  email: "Email",
  phone: "Phone",
  sms: "SMS",
  wifi: "Wi-Fi",
};

export const QR_TYPE_OPTIONS = [
  {
    value: "text" as const,
    label: "Plain text",
    description: "Encode a message, short note, or any free-form content.",
  },
  {
    value: "url" as const,
    label: "URL",
    description: "Send someone straight to a website or landing page.",
  },
  {
    value: "email" as const,
    label: "Email",
    description: "Pre-fill an email recipient, subject line, and message body.",
  },
  {
    value: "phone" as const,
    label: "Phone",
    description: "Launch a phone call with one quick scan.",
  },
  {
    value: "sms" as const,
    label: "SMS",
    description: "Open a text message draft with the message already filled in.",
  },
  {
    value: "wifi" as const,
    label: "Wi-Fi",
    description: "Let guests join a network without typing the password by hand.",
  },
] satisfies Array<{ value: QRType; label: string; description: string }>;

export const WIFI_ENCRYPTION_OPTIONS = [
  {
    value: "WPA" as const,
    label: "WPA / WPA2",
  },
  {
    value: "WEP" as const,
    label: "WEP",
  },
  {
    value: "none" as const,
    label: "None",
  },
] satisfies Array<{ value: WifiEncryption; label: string }>;

export const QR_SIZE_RANGE = {
  min: 256,
  max: 2048,
  step: 64,
};

export const QR_MARGIN_RANGE = {
  min: 0,
  max: 8,
  step: 1,
};

export const DEFAULT_FORM_VALUES: QRFormValues = {
  type: "url",
  text: "",
  url: "",
  email: "",
  emailSubject: "",
  emailBody: "",
  phone: "",
  smsNumber: "",
  smsMessage: "",
  wifiSsid: "",
  wifiPassword: "",
  wifiEncryption: "WPA",
  wifiHidden: false,
  size: 896,
  margin: 2,
  foreground: "#111827",
  background: "#ffffff",
};

export const DEFAULT_SCAN_TIP =
  "Test with your camera before printing to make sure contrast and margin feel right.";

export const MAX_SUMMARY_LENGTH = 72;
