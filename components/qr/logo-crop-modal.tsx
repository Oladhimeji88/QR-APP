"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const WINDOW = 256; // on-screen diameter of the circular crop area
const OUTPUT = 512; // exported image size in px
const MAX_ZOOM = 3;

interface LogoCropModalProps {
  src: string;
  onCancel: () => void;
  onApply: (dataUrl: string) => void;
}

export function LogoCropModal({ src, onCancel, onApply }: LogoCropModalProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = src;
  }, [src]);

  // Scale that makes the image cover the crop circle, then apply the zoom.
  const baseScale = image ? WINDOW / Math.min(image.width, image.height) : 1;
  const dispW = image ? image.width * baseScale * zoom : 0;
  const dispH = image ? image.height * baseScale * zoom : 0;
  const maxX = Math.max(0, (dispW - WINDOW) / 2);
  const maxY = Math.max(0, (dispH - WINDOW) / 2);

  const clamp = useCallback(
    (x: number, y: number) => ({
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    }),
    [maxX, maxY],
  );

  // Keep the image covering the circle when the zoom changes.
  useEffect(() => {
    setPos((current) => clamp(current.x, current.y));
  }, [clamp]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    drag.current = {
      startX: event.clientX,
      startY: event.clientY,
      baseX: pos.x,
      baseY: pos.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const nextX = drag.current.baseX + (event.clientX - drag.current.startX);
    const nextY = drag.current.baseY + (event.clientY - drag.current.startY);
    setPos(clamp(nextX, nextY));
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    drag.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    const next = zoom - event.deltaY * 0.0015;
    setZoom(Math.min(MAX_ZOOM, Math.max(1, next)));
  }

  function handleApply() {
    if (!image) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ratio = OUTPUT / WINDOW;
    const outW = dispW * ratio;
    const outH = dispH * ratio;
    const left = (OUTPUT - outW) / 2 + pos.x * ratio;
    const top = (OUTPUT - outH) / 2 + pos.y * ratio;

    ctx.save();
    ctx.beginPath();
    ctx.arc(OUTPUT / 2, OUTPUT / 2, OUTPUT / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(image, left, top, outW, outH);
    ctx.restore();

    onApply(canvas.toDataURL("image/png"));
  }

  const imgLeft = WINDOW / 2 - dispW / 2 + pos.x;
  const imgTop = WINDOW / 2 - dispH / 2 + pos.y;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label="Crop logo"
    >
      <div
        className="w-full max-w-md rounded-[24px] border border-[color:var(--border)] bg-[color:var(--background)] p-6 shadow-[0_40px_120px_rgba(15,23,42,0.35)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-[color:var(--foreground)]">
            Crop logo
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onCancel}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-[color:var(--border)] text-[color:var(--muted-foreground)] transition hover:text-[color:var(--foreground)]"
          >
            <X className="size-4" />
          </button>
        </div>

        <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
          Drag to reposition and use the slider to zoom. The area inside the circle
          is what appears on your QR code.
        </p>

        <div className="mt-5 grid place-items-center">
          <div
            style={{ width: WINDOW, height: WINDOW }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            className="relative cursor-grab touch-none select-none overflow-hidden rounded-2xl bg-[color:var(--surface)] active:cursor-grabbing"
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                draggable={false}
                style={{ left: imgLeft, top: imgTop, width: dispW, height: dispH }}
                className="pointer-events-none absolute max-w-none"
              />
            ) : null}
            <div className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_2000px_rgba(0,0,0,0.45)]" />
            <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/80" />
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <label
            htmlFor="logo-zoom"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]"
          >
            Zoom
          </label>
          <input
            id="logo-zoom"
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full accent-[color:var(--accent-strong)]"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="button" className="sm:flex-1" onClick={handleApply} disabled={!image}>
            <Check className="size-4" />
            Apply
          </Button>
          <Button type="button" variant="outline" className="sm:flex-1" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
