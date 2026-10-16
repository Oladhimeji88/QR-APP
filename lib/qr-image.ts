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

/**
 * Draw the logo (clipped to a circle, on a white circular plate for scan
 * reliability) onto the center of a QR PNG and return a new PNG data URL.
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
  const padding = Math.round(logoBox * 0.14);
  const center = size / 2;
  const logoRadius = logoBox / 2;
  const plateRadius = logoRadius + padding;

  // White circular plate behind the logo for scan reliability.
  ctx.beginPath();
  ctx.arc(center, center, plateRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  // Clip to a circle and draw the logo filling it.
  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, logoRadius, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(logoImage, center - logoRadius, center - logoRadius, logoBox, logoBox);
  ctx.restore();

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
  const padding = logoBox * 0.14;
  const center = span / 2;
  const logoRadius = logoBox / 2;
  const plateRadius = logoRadius + padding;
  const logoPos = center - logoRadius;
  const clipId = "qr-logo-clip";

  const overlay =
    `<circle cx="${center}" cy="${center}" r="${plateRadius}" fill="#ffffff"/>` +
    `<clipPath id="${clipId}"><circle cx="${center}" cy="${center}" r="${logoRadius}"/></clipPath>` +
    `<image x="${logoPos}" y="${logoPos}" width="${logoBox}" height="${logoBox}" ` +
    `preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})" ` +
    `href="${logoDataUrl}" xlink:href="${logoDataUrl}"/>`;

  // Ensure the xlink namespace is declared so xlink:href resolves in strict renderers.
  const withNamespace = svgString.includes("xmlns:xlink")
    ? svgString
    : svgString.replace(
        "<svg ",
        '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ',
      );

  return withNamespace.replace(/<\/svg>\s*$/, `${overlay}</svg>`);
}

/** Read an uploaded file into a data URL (used as the crop modal's source). */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read the selected file."));
    reader.readAsDataURL(file);
  });
}

/**
 * Read an uploaded image file, downscale it so the longest edge is at most
 * LOGO_MAX_DIMENSION, and return a compact PNG data URL (preserves transparency).
 */
export async function fileToLogoDataUrl(file: File): Promise<string> {
  const originalDataUrl = await fileToDataUrl(file);

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
