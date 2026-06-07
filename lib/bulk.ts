import { DEFAULT_FORM_VALUES } from "@/lib/constants";
import { buildQrSummary } from "@/lib/qr";
import { sanitizeFormValues, qrFormSchema, formatZodIssues } from "@/lib/validation";
import type { QRFormValues, QRStyleOptions, QRType, WifiEncryption } from "@/types/qr";

export const BULK_MAX_ROWS = 250;

export interface BulkRowResult {
  /** 1-based position in the source data (excludes the header row). */
  index: number;
  label: string;
  values: QRFormValues | null;
  status: "valid" | "invalid";
  errors: string[];
  summary: string;
}

export interface BulkParseResult {
  rows: BulkRowResult[];
  /** Set when the header row is missing a required column for the type. */
  headerError: string | null;
  truncated: boolean;
}

interface ColumnSpec {
  /** Canonical field key, used in templates and messages. */
  key: string;
  aliases: string[];
  required: boolean;
}

/**
 * Header columns accepted per QR type. The first alias is the canonical name
 * shown in the downloadable template; the rest are convenience synonyms.
 */
export const BULK_COLUMNS: Record<QRType, ColumnSpec[]> = {
  text: [
    { key: "content", aliases: ["content", "text", "value"], required: true },
    { key: "label", aliases: ["label", "name", "filename"], required: false },
  ],
  url: [
    { key: "url", aliases: ["url", "link"], required: true },
    { key: "label", aliases: ["label", "name", "filename"], required: false },
  ],
  email: [
    { key: "email", aliases: ["email", "to", "recipient"], required: true },
    { key: "subject", aliases: ["subject"], required: false },
    { key: "body", aliases: ["body", "message"], required: false },
    { key: "label", aliases: ["label", "name", "filename"], required: false },
  ],
  phone: [
    { key: "phone", aliases: ["phone", "number", "tel"], required: true },
    { key: "label", aliases: ["label", "name", "filename"], required: false },
  ],
  sms: [
    { key: "number", aliases: ["number", "phone", "to"], required: true },
    { key: "message", aliases: ["message", "text", "body"], required: true },
    { key: "label", aliases: ["label", "name", "filename"], required: false },
  ],
  wifi: [
    { key: "ssid", aliases: ["ssid", "network", "name"], required: true },
    { key: "password", aliases: ["password", "pass"], required: false },
    {
      key: "encryption",
      aliases: ["encryption", "security", "auth"],
      required: false,
    },
    { key: "hidden", aliases: ["hidden"], required: false },
    { key: "label", aliases: ["label", "filename"], required: false },
  ],
};

/** RFC-4180-ish CSV parser: handles quoted fields, escaped quotes, and CRLF. */
export function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += char;
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }

    if (char === "\n" || char === "\r") {
      // Treat \r, \n, and \r\n as a single row break.
      if (char === "\r" && input[i + 1] === "\n") {
        i += 1;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
      continue;
    }

    field += char;
    i += 1;
  }

  // Flush the trailing field/row if the file did not end with a newline.
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // Drop fully empty rows (e.g. blank trailing lines).
  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ""));
}

function resolveColumns(type: QRType, header: string[]) {
  const normalized = header.map((h) => h.trim().toLowerCase());
  const map: Record<string, number> = {};

  for (const spec of BULK_COLUMNS[type]) {
    const found = spec.aliases
      .map((alias) => normalized.indexOf(alias))
      .find((index) => index !== -1);
    if (found !== undefined) {
      map[spec.key] = found;
    }
  }

  return map;
}

function cell(row: string[], index: number | undefined) {
  if (index === undefined) return "";
  return (row[index] ?? "").trim();
}

function parseEncryption(value: string): WifiEncryption {
  const v = value.trim().toLowerCase();
  if (v === "wep") return "WEP";
  if (v === "none" || v === "open" || v === "nopass") return "none";
  return "WPA";
}

function isTruthy(value: string) {
  return ["true", "yes", "1", "y"].includes(value.trim().toLowerCase());
}

function rowToValues(
  type: QRType,
  row: string[],
  columns: Record<string, number>,
  style: QRStyleOptions,
): QRFormValues {
  const base: QRFormValues = {
    ...DEFAULT_FORM_VALUES,
    ...style,
    type,
  };

  switch (type) {
    case "text":
      return { ...base, text: cell(row, columns.content) };
    case "url":
      return { ...base, url: cell(row, columns.url) };
    case "email":
      return {
        ...base,
        email: cell(row, columns.email),
        emailSubject: cell(row, columns.subject),
        emailBody: cell(row, columns.body),
      };
    case "phone":
      return { ...base, phone: cell(row, columns.phone) };
    case "sms":
      return {
        ...base,
        smsNumber: cell(row, columns.number),
        smsMessage: cell(row, columns.message),
      };
    case "wifi":
      return {
        ...base,
        wifiSsid: cell(row, columns.ssid),
        wifiPassword: cell(row, columns.password),
        wifiEncryption: parseEncryption(cell(row, columns.encryption)),
        wifiHidden: isTruthy(cell(row, columns.hidden)),
      };
    default:
      return base;
  }
}

export function buildBulkRows(
  type: QRType,
  csvText: string,
  style: QRStyleOptions,
): BulkParseResult {
  const matrix = parseCsv(csvText);

  if (matrix.length === 0) {
    return { rows: [], headerError: "Add a header row and at least one data row.", truncated: false };
  }

  const [header, ...dataRows] = matrix;
  const columns = resolveColumns(type, header);

  const missing = BULK_COLUMNS[type]
    .filter((spec) => spec.required && columns[spec.key] === undefined)
    .map((spec) => spec.key);

  if (missing.length > 0) {
    return {
      rows: [],
      headerError: `Missing required column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}. Use the template as a starting point.`,
      truncated: false,
    };
  }

  const truncated = dataRows.length > BULK_MAX_ROWS;
  const limited = dataRows.slice(0, BULK_MAX_ROWS);

  const rows: BulkRowResult[] = limited.map((row, i) => {
    const values = rowToValues(type, row, columns, style);
    const sanitized = sanitizeFormValues(values);
    const result = qrFormSchema.safeParse(sanitized);
    const labelRaw = cell(row, columns.label);

    if (!result.success) {
      return {
        index: i + 1,
        label: labelRaw || buildQrSummary(values),
        values: null,
        status: "invalid",
        errors: formatZodIssues(result.error).map((issue) => issue.message),
        summary: buildQrSummary(values),
      };
    }

    return {
      index: i + 1,
      label: labelRaw || buildQrSummary(result.data),
      values: result.data,
      status: "valid",
      errors: [],
      summary: buildQrSummary(result.data),
    };
  });

  return { rows, headerError: null, truncated };
}

/** A ready-to-edit CSV template for the selected type. */
export function bulkTemplate(type: QRType): string {
  const header = BULK_COLUMNS[type].map((spec) => spec.aliases[0]).join(",");

  const samples: Record<QRType, string[]> = {
    text: ["Visitor pass — front desk,front-desk"],
    url: ["https://example.com/launch,launch-page", "https://example.com/menu,menu"],
    email: ["hello@example.com,Hello there,Thanks for connecting!,welcome-email"],
    phone: ["+14155550123,sales-line"],
    sms: ["+14155550123,Reply YES to confirm,confirm-sms"],
    wifi: ["Guest WiFi,SuperSecret123,WPA,false,guest-network"],
  };

  return [header, ...samples[type]].join("\n");
}
