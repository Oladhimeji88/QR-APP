"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ImagePlus,
  Paintbrush,
  RefreshCcw,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { RecentHistory } from "@/components/qr/recent-history";
import { Button } from "@/components/ui/button";
import { FieldHint } from "@/components/ui/field-hint";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionCard } from "@/components/ui/section-card";
import { Textarea } from "@/components/ui/textarea";
import { ValidationMessage } from "@/components/ui/validation-message";
import {
  CONTENT_TYPE_LABELS,
  DEFAULT_FORM_VALUES,
  EXAMPLE_INPUTS,
  LOGO_MAX_UPLOAD_BYTES,
  QR_MARGIN_RANGE,
  QR_SIZE_PRESETS,
  QR_SIZE_RANGE,
  WIFI_ENCRYPTION_OPTIONS,
} from "@/lib/constants";
import { LogoCropModal } from "@/components/qr/logo-crop-modal";
import { fileToDataUrl } from "@/lib/qr-image";
import { qrFormSchema, sanitizeFormValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { QRFormValues, QRHistoryItem, QRType } from "@/types/qr";

interface QrFormProps {
  initialType: QRType;
  historyItems: QRHistoryItem[];
  onClearHistory: () => void;
  onChangeFormat: () => void;
  onPreviewChange: (values: QRFormValues) => void;
  onGenerate: (values: QRFormValues) => void;
}

export function QrForm({
  initialType,
  historyItems,
  onClearHistory,
  onChangeFormat,
  onPreviewChange,
  onGenerate,
}: QrFormProps) {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<QRFormValues>({
    resolver: zodResolver(qrFormSchema),
    defaultValues: { ...DEFAULT_FORM_VALUES, type: initialType },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const values = useWatch({ control }) as QRFormValues;
  const selectedType =
    useWatch({ control, name: "type" }) ?? DEFAULT_FORM_VALUES.type;
  const logo = useWatch({ control, name: "logo" }) ?? "";
  const wifiEncryption =
    useWatch({ control, name: "wifiEncryption" }) ??
    DEFAULT_FORM_VALUES.wifiEncryption;

  const activeSizeId =
    QR_SIZE_PRESETS.find((preset) => preset.size === values.size)?.id ?? null;

  const emitPreviewChange = useCallback((nextValues: QRFormValues) => {
    onPreviewChange(nextValues);
  }, [onPreviewChange]);

  useEffect(() => {
    emitPreviewChange(values);
  }, [emitPreviewChange, values]);

  const handleFormSubmit = handleSubmit((submittedValues) => {
    onGenerate(sanitizeFormValues(submittedValues));
  });

  async function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
    if (!file) {
      return;
    }

    setLogoError(null);

    if (!file.type.startsWith("image/")) {
      setLogoError("Choose an image file (PNG, JPG, or SVG).");
      return;
    }

    if (file.size > LOGO_MAX_UPLOAD_BYTES) {
      setLogoError("Image is too large. Pick a file under 5 MB.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setCropSrc(dataUrl);
    } catch (error) {
      console.error(error);
      setLogoError("We could not read that image. Try a different file.");
    }
  }

  function removeLogo() {
    setLogoError(null);
    setValue("logo", "", { shouldDirty: true, shouldValidate: true });
  }

  function applyExample() {
    const nextValues = sanitizeFormValues({
      ...DEFAULT_FORM_VALUES,
      ...values,
      ...EXAMPLE_INPUTS[selectedType],
      type: selectedType,
    });

    reset(nextValues);
  }

  return (
    <form className="space-y-6" onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap items-center justify-between gap-3 border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
            Format
          </span>
          <span className="border border-[color:var(--accent-strong)]/40 bg-[color:var(--surface-tint)] px-3 py-1 text-sm font-semibold text-[color:var(--accent-strong)]">
            {CONTENT_TYPE_LABELS[selectedType]}
          </span>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onChangeFormat}>
          <ArrowLeft className="size-4" />
          Change format
        </Button>
      </div>

      <SectionCard
        title="Content"
        description="Fields adapt to the selected QR type so you only see what matters."
        action={
          <Button type="button" variant="ghost" size="sm" onClick={applyExample}>
            Try example
          </Button>
        }
      >
        <div className="space-y-5">
          <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-sm leading-6 text-[color:var(--muted-foreground)]">
            Sample inputs are available for every QR type. Use one as a starting point,
            then swap in your own content.
          </div>

          {selectedType === "text" ? (
            <div className="space-y-2">
              <Label htmlFor="text">Plain text</Label>
              <Textarea
                id="text"
                placeholder="Paste or type the exact text you want encoded."
                aria-invalid={Boolean(errors.text)}
                {...register("text")}
              />
              <FieldHint>Line breaks are preserved exactly as entered.</FieldHint>
              <ValidationMessage message={errors.text?.message} />
            </div>
          ) : null}

          {selectedType === "url" ? (
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                inputMode="url"
                placeholder="https://your-site.com/offer"
                aria-invalid={Boolean(errors.url)}
                {...register("url")}
              />
              <FieldHint>Include the full protocol so the QR opens reliably.</FieldHint>
              <ValidationMessage message={errors.url?.message} />
            </div>
          ) : null}

          {selectedType === "email" ? (
            <div className="grid gap-5">
              <div className="space-y-2">
                <Label htmlFor="email">Recipient email</Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  placeholder="team@company.com"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                <ValidationMessage message={errors.email?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailSubject">Subject</Label>
                <Input
                  id="emailSubject"
                  placeholder="Welcome to pubbleRadar"
                  aria-invalid={Boolean(errors.emailSubject)}
                  {...register("emailSubject")}
                />
                <ValidationMessage message={errors.emailSubject?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailBody">Body</Label>
                <Textarea
                  id="emailBody"
                  placeholder="Thanks for reaching out. We will get back to you shortly."
                  aria-invalid={Boolean(errors.emailBody)}
                  {...register("emailBody")}
                />
                <ValidationMessage message={errors.emailBody?.message} />
              </div>
            </div>
          ) : null}

          {selectedType === "phone" ? (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                placeholder="+1 415 555 0123"
                aria-invalid={Boolean(errors.phone)}
                {...register("phone")}
              />
              <FieldHint>International format is best for broad device support.</FieldHint>
              <ValidationMessage message={errors.phone?.message} />
            </div>
          ) : null}

          {selectedType === "sms" ? (
            <div className="grid gap-5">
              <div className="space-y-2">
                <Label htmlFor="smsNumber">Phone number</Label>
                <Input
                  id="smsNumber"
                  type="tel"
                  inputMode="tel"
                  placeholder="+1 415 555 0123"
                  aria-invalid={Boolean(errors.smsNumber)}
                  {...register("smsNumber")}
                />
                <ValidationMessage message={errors.smsNumber?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smsMessage">Message</Label>
                <Textarea
                  id="smsMessage"
                  placeholder="Hi there, I would love to learn more about your product."
                  aria-invalid={Boolean(errors.smsMessage)}
                  {...register("smsMessage")}
                />
                <ValidationMessage message={errors.smsMessage?.message} />
              </div>
            </div>
          ) : null}

          {selectedType === "wifi" ? (
            <div className="grid gap-5">
              <div className="space-y-2">
                <Label htmlFor="wifiSsid">Network name (SSID)</Label>
                <Input
                  id="wifiSsid"
                  placeholder="Office Guest Wi-Fi"
                  aria-invalid={Boolean(errors.wifiSsid)}
                  {...register("wifiSsid")}
                />
                <ValidationMessage message={errors.wifiSsid?.message} />
              </div>

              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
                <div className="space-y-2">
                  <Label htmlFor="wifiPassword">Password</Label>
                  <Input
                    id="wifiPassword"
                    type={wifiEncryption === "none" ? "text" : "password"}
                    placeholder={
                      wifiEncryption === "none"
                        ? "Not required for open networks"
                        : "Enter network password"
                    }
                    aria-invalid={Boolean(errors.wifiPassword)}
                    disabled={wifiEncryption === "none"}
                    {...register("wifiPassword")}
                  />
                  <ValidationMessage message={errors.wifiPassword?.message} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wifiEncryption">Encryption</Label>
                  <select
                    id="wifiEncryption"
                    className="flex h-12 w-full rounded-2xl border border-[color:var(--border)] bg-white/80 px-4 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--border-strong)] focus:ring-4 focus:ring-[color:var(--ring-soft)]"
                    {...register("wifiEncryption")}
                  >
                    {WIFI_ENCRYPTION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center justify-between gap-4 rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-[color:var(--foreground)]">
                    Hidden network
                  </p>
                  <p className="text-sm text-[color:var(--muted-foreground)]">
                    Enable this if the SSID does not broadcast publicly.
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="size-5 rounded border-[color:var(--border-strong)] text-[color:var(--accent-strong)] focus:ring-[color:var(--ring)]"
                  {...register("wifiHidden")}
                />
              </label>
            </div>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard
        title="Appearance & export quality"
        description="Dial in colors, quiet zone margin, and output size for screens or print."
        action={
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
            <Paintbrush className="size-3.5" />
            Styling
          </span>
        }
      >
        <div className="grid gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <Label>Size preset</Label>
              <span className="rounded-full border border-[color:var(--border)] px-3 py-1 text-sm text-[color:var(--muted-foreground)]">
                {values.size}px
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {QR_SIZE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() =>
                    setValue("size", preset.size, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  className={cn(
                    "rounded-[22px] border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]",
                    activeSizeId === preset.id
                      ? "border-transparent bg-[linear-gradient(180deg,var(--surface-tint),transparent)] shadow-[inset_0_0_0_1px_rgba(99,212,113,0.18),0_18px_40px_rgba(99,212,113,0.14)]"
                      : "border-[color:var(--border)] bg-[color:var(--surface)] hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-strong)]",
                  )}
                >
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">
                    {preset.label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="foreground">Foreground color</Label>
              <div className="flex items-center gap-3 rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
                <input
                  id="foreground"
                  type="color"
                  aria-label="QR foreground color"
                  className="size-11 cursor-pointer rounded-2xl border-0 bg-transparent p-0"
                  {...register("foreground")}
                />
                <Input className="h-11 flex-1" readOnly value={values.foreground} />
              </div>
              <ValidationMessage message={errors.foreground?.message} />
            </div>

            <div className="space-y-3">
              <Label htmlFor="background">Background color</Label>
              <div className="flex items-center gap-3 rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
                <input
                  id="background"
                  type="color"
                  aria-label="QR background color"
                  className="size-11 cursor-pointer rounded-2xl border-0 bg-transparent p-0"
                  {...register("background")}
                />
                <Input className="h-11 flex-1" readOnly value={values.background} />
              </div>
              <ValidationMessage message={errors.background?.message} />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Center logo (optional)</Label>
            <div className="flex flex-col gap-4 rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:flex-row sm:items-center">
              <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border border-[color:var(--border)] bg-white">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo}
                    alt="Selected logo preview"
                    className="size-full object-cover"
                  />
                ) : (
                  <ImagePlus className="size-7 text-[color:var(--muted-foreground)]" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <ImagePlus className="size-4" />
                    {logo ? "Replace image" : "Upload image"}
                  </Button>
                  {logo ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeLogo}
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  ) : null}
                </div>
                <FieldHint>
                  Drop a logo in the center of your QR. PNG, JPG, or SVG up to 5 MB —
                  keep it simple so the code stays easy to scan.
                </FieldHint>
                <ValidationMessage message={logoError ?? errors.logo?.message} />
              </div>

              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                aria-label="Upload center logo image"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="size">Custom size</Label>
                <span className="rounded-full border border-[color:var(--border)] px-3 py-1 text-sm text-[color:var(--muted-foreground)]">
                  {values.size}px
                </span>
              </div>
              <input
                id="size"
                type="range"
                min={QR_SIZE_RANGE.min}
                max={QR_SIZE_RANGE.max}
                step={QR_SIZE_RANGE.step}
                className="w-full accent-[color:var(--accent-strong)]"
                {...register("size", { valueAsNumber: true })}
              />
              <FieldHint>Higher sizes are ideal for print and dense content.</FieldHint>
              <ValidationMessage message={errors.size?.message} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="margin">Margin</Label>
                <span className="rounded-full border border-[color:var(--border)] px-3 py-1 text-sm text-[color:var(--muted-foreground)]">
                  {values.margin}
                </span>
              </div>
              <input
                id="margin"
                type="range"
                min={QR_MARGIN_RANGE.min}
                max={QR_MARGIN_RANGE.max}
                step={QR_MARGIN_RANGE.step}
                className="w-full accent-[color:var(--accent-strong)]"
                {...register("margin", { valueAsNumber: true })}
              />
              <FieldHint>
                Add breathing room around the QR for better scan performance.
              </FieldHint>
              <ValidationMessage message={errors.margin?.message} />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Generate"
        description="Preview runs live as you type, and this button gives you a deliberate regenerate step."
        contentClassName="space-y-4"
      >
        <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-sm leading-6 text-[color:var(--muted-foreground)]">
          <p className="flex items-start gap-3">
            <Sparkles className="mt-1 size-4 shrink-0 text-[color:var(--accent-strong)]" />
            Live preview updates only when the current state passes validation, so downloads stay dependable.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" className="sm:flex-1" disabled={isSubmitting}>
            <Wand2 className="size-4" />
            Generate QR
          </Button>
          <Button
            type="button"
            variant="outline"
            className="sm:flex-1"
            onClick={() => reset(DEFAULT_FORM_VALUES)}
          >
            <RefreshCcw className="size-4" />
            Clear form
          </Button>
        </div>
      </SectionCard>

      <RecentHistory
        items={historyItems}
        onClear={onClearHistory}
        onSelect={(nextValues) => reset(nextValues)}
      />

      {cropSrc ? (
        <LogoCropModal
          src={cropSrc}
          onCancel={() => setCropSrc(null)}
          onApply={(dataUrl) => {
            setValue("logo", dataUrl, { shouldDirty: true, shouldValidate: true });
            setCropSrc(null);
          }}
        />
      ) : null}
    </form>
  );
}
