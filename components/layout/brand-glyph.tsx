import type { SVGProps } from "react";

/**
 * pubbleRadar brand mark — QR finder squares fused with a radar sweep.
 * Uses `currentColor`, so set the color via a parent `text-*` class.
 */
export function BrandGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* QR finder squares */}
      <g fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="8" height="8" rx="2.5" />
        <rect x="21" y="3" width="8" height="8" rx="2.5" />
        <rect x="3" y="21" width="8" height="8" rx="2.5" />
      </g>
      <g fill="currentColor">
        <rect x="6" y="6" width="2" height="2" rx="0.6" />
        <rect x="24" y="6" width="2" height="2" rx="0.6" />
        <rect x="6" y="24" width="2" height="2" rx="0.6" />
      </g>

      {/* Radar sweep */}
      <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <path d="M14 25 A11 11 0 0 1 25 14" strokeOpacity={0.55} />
        <path d="M18 25 A7 7 0 0 1 25 18" strokeOpacity={0.8} />
        <path d="M25 25 L16.5 16.5" />
      </g>
      <circle cx="25" cy="25" r="1.8" fill="currentColor" />
      <circle cx="18.7" cy="18.7" r="1.5" fill="currentColor" />
    </svg>
  );
}
