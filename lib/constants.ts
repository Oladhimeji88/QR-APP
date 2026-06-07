import type {
  QRFormValues,
  QRSizePreset,
  QRThemePreset,
  QRType,
  WifiEncryption,
} from "@/types/qr";

export const APP_NAME = "pubbleRadar";

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

export const QR_SIZE_PRESETS: QRSizePreset[] = [
  {
    id: "small",
    label: "Small",
    size: 384,
    description: "Fast digital sharing",
  },
  {
    id: "medium",
    label: "Medium",
    size: 768,
    description: "Balanced default",
  },
  {
    id: "large",
    label: "Large",
    size: 1024,
    description: "Presentations and signage",
  },
  {
    id: "print",
    label: "Print",
    size: 1536,
    description: "High-resolution export",
  },
];

export const QR_THEME_PRESETS: QRThemePreset[] = [
  {
    id: "classic",
    label: "Classic",
    description: "Black on white",
    foreground: "#111827",
    background: "#ffffff",
  },
  {
    id: "forest",
    label: "Forest",
    description: "Deep green on white",
    foreground: "#246349",
    background: "#ffffff",
  },
  {
    id: "mint",
    label: "Mint",
    description: "Green on soft mint",
    foreground: "#0f2a1e",
    background: "#eafaf2",
  },
];

export const EXAMPLE_INPUTS: Record<QRType, Partial<QRFormValues>> = {
  text: {
    text: "Bring this code to the front desk for your visitor pass.",
  },
  url: {
    url: "https://pubbleradar.dev/demo?ref=launch",
  },
  email: {
    email: "hello@pubbleradar.dev",
    emailSubject: "pubbleRadar demo request",
    emailBody: "Hi team, I would love a quick walkthrough of pubbleRadar.",
  },
  phone: {
    phone: "+14155550123",
  },
  sms: {
    smsNumber: "+14155550123",
    smsMessage: "Hi! I am interested in the pubbleRadar product demo.",
  },
  wifi: {
    wifiSsid: "pubbleRadar Guest",
    wifiPassword: "RadarGuest2026",
    wifiEncryption: "WPA",
    wifiHidden: false,
  },
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
export const MAX_HISTORY_ITEMS = 6;
export const RECENT_HISTORY_STORAGE_KEY = "pubbleradar-history";
