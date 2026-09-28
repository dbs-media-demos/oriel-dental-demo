# Oriel Dental Studio (DBS Media concept site)

A fictional family & cosmetic dental practice in Uptown Dallas, built by DBS Media as a portfolio demo. See `DEMO.md` for the handoff summary.

## Stack

Next.js 16 (App Router, Turbopack) · React 19.2 (`ViewTransition`) · Tailwind CSS v4 · GSAP 3 (ScrollTrigger, SplitText) · Lenis

## Scripts

```bash
npm install
npm run dev -- --port 4106   # local dev
npm run build && npm start   # production build (use this for Lighthouse)
npm run lint
```

## Notes

- **Noindex by default.** The demo is kept out of search engines unless `NEXT_PUBLIC_NOINDEX=false`. All other SEO (metadata, JSON-LD, sitemap, OG images) is built for real.
- **Forms send nothing.** Booking and contact forms validate and show a success state only.
- **Images:** `public/images` (Unsplash) and `public/video` (Pexels). Credits are in `public/images/SOURCES.md`. After adding or replacing photos, run `python scripts/gen-images.py` to regenerate `src/content/images.ts` (dimensions, blur placeholders, alt text).
- **Smile gallery:** the before/after pairs in `public/images/smile` are the same stock photo with a digitally simulated tooth shade. They're labelled "Illustrative" on the site.
- **Fonts:** Fraunces is self-hosted (`src/assets/fonts`) and instanced at weight 300 / SOFT 100 to keep it small. The TTFs in the same folder are only used by the `/api/og` share-image route.
