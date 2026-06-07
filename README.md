# pubbleRadar

pubbleRadar is a production-ready QR code generator built with Next.js App Router. It supports text, URLs, email, phone, SMS, and Wi-Fi QR codes, generates previews instantly, and downloads high-quality PNG or SVG files without using third-party QR APIs.

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

## Prerequisites

- **Node.js 18.18+** (Node 20 LTS recommended)
- **pnpm 10+** — install with `npm install -g pnpm` or `corepack enable pnpm`

Check your versions:

```bash
node -v
pnpm -v
```

## Launch the Project

From the project root (`QR APP`):

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start the development server**

   ```bash
   pnpm dev
   ```

3. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000) in your browser. The page hot-reloads as you edit files.

### Run a production build locally

```bash
pnpm build   # compile an optimized production build
pnpm start   # serve the build at http://localhost:3000
```

## How to Use

1. From the landing page, click **Start generating** (or open **/generate** directly).
2. **Choose a content type** — Text, URL, Email, Phone, SMS, or Wi-Fi. Each type shows a tailored, validated form.
3. **Fill in the details.** Inputs are validated live; helpful messages appear if something is missing or malformed.
4. **Customize the look** — pick a size preset (Small / Medium / Large / Print) or set a custom size and margin, and choose a theme or custom foreground/background colors.
5. **Watch the live preview** update as you type.
6. **Export** the result:
   - **Download PNG** for raster use (web, slides, social).
   - **Download SVG** for scalable/print use (signage, large format).
   - **Copy payload** to copy the underlying encoded text.
   - For URL codes, use **Open link** to test the destination.
7. Recent generations are saved locally and appear under **Recent history** for quick reuse.

> Tip: Always test-scan with a phone camera before printing to confirm contrast and margin feel right.

## Scripts

- `pnpm dev` — Start development server
- `pnpm build` — Build for production
- `pnpm start` — Start production server
- `pnpm lint` — Run ESLint
- `pnpm format` — Format with Prettier
- `pnpm format:check` — Check formatting

## API Route

`POST /api/qr` accepts JSON and returns either PNG data URLs or SVG markup based on the `format` field. All inputs are validated with Zod and sanitized before rendering. Add rate limiting at the edge or middleware for production scale.

## Deployment (Vercel)

1. Push the repo to GitHub.
2. Import into Vercel.
3. Use the default build settings (`pnpm install`, `pnpm build`).
4. Deploy.

No environment variables are required for the base app.

## Project Structure

```text
app/
  (marketing)/page.tsx   # Landing page
  api/qr/route.ts        # QR generation API route
  generate/page.tsx      # Generator app
  layout.tsx             # Root layout (nav, footer, fonts)
  globals.css            # Design tokens + global styles
  icon.svg
components/
  layout/                # Navbar, footer
  qr/                    # Form, preview, downloads, history
  ui/                    # Reusable UI primitives
lib/
  constants.ts           # App name, presets, defaults
  qr.ts                  # QR payload + filename helpers
  utils.ts
  validation.ts          # Zod schemas
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
