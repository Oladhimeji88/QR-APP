import { LOGO_MAX_DIMENSION, LOGO_SIZE_RATIO } from "@/lib/constants";

/**
 * Client-only helpers for embedding a center logo into generated QR codes.
 * PNG compositing uses a canvas; SVG embedding is pure string injection so it
 * works for both the live preview and downloads without a server round-trip.
 */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image."));
    image.src = src;
  });
}

/** Scale (width, height) to fit inside a square box while keeping aspect ratio. */
function containInside(width: number, height: number, box: number) {
  if (width <= 0 || height <= 0) {
    return { width: box, height: box };
  }

  const scale = Math.min(box / width, box / height);
  return { width: width * scale, height: height * scale };
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

/**
 * Draw the logo (with a white rounded plate behind it for scan reliability)
 * onto the center of a QR PNG and return a new PNG data URL.
 */
export async function embedLogoInPng(
  qrPngDataUrl: string,
  logoDataUrl: string,
  size: number,
): Promise<string> {
  const [qrImage, logoImage] = await Promise.all([
    loadImage(qrPngDataUrl),
    loadImage(logoDataUrl),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return qrPngDataUrl;
  }

  ctx.drawImage(qrImage, 0, 0, size, size);

  const logoBox = Math.round(size * LOGO_SIZE_RATIO);
  const padding = Math.round(logoBox * 0.16);
  const plate = logoBox + padding * 2;
  const plateX = Math.round((size - plate) / 2);
  const plateY = Math.round((size - plate) / 2);

  ctx.fillStyle = "#ffffff";
  roundedRectPath(ctx, plateX, plateY, plate, plate, Math.round(plate * 0.2));
  ctx.fill();

  const fitted = containInside(logoImage.width, logoImage.height, logoBox);
  ctx.drawImage(
    logoImage,
    Math.round((size - fitted.width) / 2),
    Math.round((size - fitted.height) / 2),
    Math.round(fitted.width),
    Math.round(fitted.height),
  );

  return canvas.toDataURL("image/png");
}

/**
 * Inject a centered white plate + logo image into a QR SVG string. Coordinates
 * are derived from the SVG viewBox so this scales with any export size.
 */
export function embedLogoInSvg(svgString: string, logoDataUrl: string): string {
  const viewBoxMatch = svgString.match(
    /viewBox=["']0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)["']/,
  );
  const span = viewBoxMatch ? Number(viewBoxMatch[1]) : 0;
  if (!span) {
    return svgString;
  }

  const logoBox = span * LOGO_SIZE_RATIO;
  const padding = logoBox * 0.16;
  const plate = logoBox + padding * 2;
  const platePos = (span - plate) / 2;
  const logoPos = (span - logoBox) / 2;
  const radius = plate * 0.2;

  const overlay =
    `<rect x="${platePos}" y="${platePos}" width="${plate}" height="${plate}" ` +
    `rx="${radius}" ry="${radius}" fill="#ffffff"/>` +
    `<image x="${logoPos}" y="${logoPos}" width="${logoBox}" height="${logoBox}" ` +
    `preserveAspectRatio="xMidYMid meet" href="${logoDataUrl}" ` +
    `xlink:href="${logoDataUrl}"/>`;

  return svgString.replace(/<\/svg>\s*$/, `${overlay}</svg>`);
}

/**
 * Read an uploaded image file, downscale it so the longest edge is at most
 * LOGO_MAX_DIMENSION, and return a compact PNG data URL (preserves transparency).
 */
export async function fileToLogoDataUrl(file: File): Promise<string> {
  const originalDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read the selected file."));
    reader.readAsDataURL(file);
  });

  const image = await loadImage(originalDataUrl);
  const longestEdge = Math.max(image.width, image.height);

  if (longestEdge <= LOGO_MAX_DIMENSION) {
    return originalDataUrl;
  }

  const scale = LOGO_MAX_DIMENSION / longestEdge;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return originalDataUrl;
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}
