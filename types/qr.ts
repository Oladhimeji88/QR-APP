export const QR_TYPES = ["text", "url", "email", "phone", "sms", "wifi"] as const;

export type QRType = (typeof QR_TYPES)[number];

export const WIFI_ENCRYPTIONS = ["WPA", "WEP", "none"] as const;

export type WifiEncryption = (typeof WIFI_ENCRYPTIONS)[number];

export const QR_DOWNLOAD_FORMATS = ["png", "svg"] as const;

export type QRDownloadFormat = (typeof QR_DOWNLOAD_FORMATS)[number];

export interface QRStyleOptions {
  size: number;
  margin: number;
  foreground: string;
  background: string;
}

export interface QRFormValues extends QRStyleOptions {
  type: QRType;
  text: string;
  url: string;
  email: string;
  emailSubject: string;
  emailBody: string;
  phone: string;
  smsNumber: string;
  smsMessage: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiEncryption: WifiEncryption;
  wifiHidden: boolean;
}

export interface QRRequestPayload extends QRFormValues {
  format: QRDownloadFormat;
}

export interface QRGeneratedAssets {
  payload: string;
  pngDataUrl: string;
  svgString: string;
  summary: string;
  typeLabel: string;
}

export interface QRPreviewState {
  status: "idle" | "loading" | "ready" | "error";
  data: QRGeneratedAssets | null;
  message?: string;
}

export interface QRHistoryItem {
  id: string;
  createdAt: string;
  type: QRType;
  summary: string;
  payload: string;
  values: QRFormValues;
}

export interface QRSizePreset {
  id: string;
  label: string;
  size: number;
  description: string;
}

export interface QRThemePreset {
  id: string;
  label: string;
  description: string;
  foreground: string;
  background: string;
}

export interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  tone: "success" | "error" | "info";
}
