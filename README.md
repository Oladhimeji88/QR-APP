# QR Forge

QR Forge is a production-ready QR code generator built with Next.js App Router. It supports text, URLs, email, phone, SMS, and Wi-Fi QR codes, generates previews instantly, and downloads high-quality PNG or SVG files without using third-party QR APIs.

## Features

- Multiple QR types: text, URL, email, phone, SMS, Wi-Fi
- Live preview with debounced updates
- PNG + SVG downloads
- Copy-to-clipboard payload
- Open-link action for URL QR codes
- Preset sizes: Small, Medium, Large, Print
- Preset themes: Classic, Dark, Brand Blue
- Recent generation history in localStorage
- Toast notifications for export events
- Client-side download fallback if API fails
- Fully validated inputs with Zod + React Hook Form
- Accessible, responsive, and mobile-friendly UI

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS (v4)
- React Hook Form + Zod
- `qrcode` (node-qrcode) for generation
- Lucide React icons

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the dev server:

```bash
pnpm dev
```

Open `http://localhost:3000` to view the app.

## Scripts

- `pnpm dev` Start development server
- `pnpm build` Build for production
- `pnpm start` Start production server
- `pnpm lint` Run ESLint
- `pnpm format` Format with Prettier
- `pnpm format:check` Check formatting

## API Route

`POST /api/qr` accepts JSON and returns either PNG data URLs or SVG markup based on the `format` field. All inputs are validated with Zod and sanitized before rendering. Add rate limiting at the edge or middleware for production scale.

## Deployment (Vercel)

1. Push the repo to GitHub.
2. Import into Vercel.
3. Use the default build settings (`pnpm install`, `pnpm build`).
4. Deploy.

No environment variables are required for the base app.

## Project Structure

```
app/
  (marketing)/page.tsx
  api/qr/route.ts
  generate/page.tsx
  layout.tsx
  globals.css
  icon.svg
components/
  layout/
  qr/
  ui/
lib/
  constants.ts
  qr.ts
  utils.ts
  validation.ts
types/
  qr.ts
public/
  icons/
```

## Future Improvements

- Saved QR collections with tags
- Branded QR templates and logos
- Usage analytics and share links
- Authentication and team workspaces
- Bulk CSV import/export

