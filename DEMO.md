# Oriel Dental Studio (Scale by Noon demo)

- Niche: Family & cosmetic dentistry         (matches www.scalebynoon.com industry id: dental)
- Market / city: US – Dallas, TX (Uptown)
- Languages: en (Spanish-speaking staff mentioned throughout)
- Live URL: https://oriel-dental-demo.vercel.app
- Repo: https://github.com/dbs-media-demos/oriel-dental-demo (public, branch main)
- Folder: DBS Media Portfolio/Demo Websites/dental
- Stack: Next.js 16.3.6, React 19.2.8, Tailwind v4, GSAP 3.15 (ScrollTrigger, SplitText), Lenis 1.3
- Palette: #F7F4EE porcelain, #EDE6DA linen, #1E2926 ink, #4E6B5C sage, #B9CBBE mist, #D8C2A3 sand, #F2D9A6 glow, #18221F night   Fonts: Fraunces (self-hosted, SOFT 100), Figtree
- Pages: 27 routes. Home, Treatments explorer + 10 treatment pages, Smile gallery, Team + 3 doctor profiles, Office tour, New patients, Insurance & financing, Membership, Reviews, FAQ, Book (multi-step), Contact, Privacy (HIPAA-aware), 404. Also sitemap.xml, robots.txt, manifest and dynamic OG images (/api/og).
- Signature features:
  - Arched-window hero: an oriel window opens on load (shutters), a WebGL "sunlight through leaves" layer drifts over the photo, and on scroll the arch widens to full-bleed with the line "Soft light. Unhurried hands. Honest prices."
  - Smile gallery: drag or arrow-key before/after sliders with an arch handle, filter tabs (whitening, veneers, aligners, implants) and a crossfade view transition. The pairs are illustrative shade simulations and labelled as such.
  - New-patient journey: pinned arch window with five chapters (book → welcome → 3D scan → plan with prices → gift). Each photo wipes up into the window as you scroll.
  - Treatment explorer: filterable cards whose photo and title morph into the detail page hero (React ViewTransition). Each treatment shows time, a comfort meter and a price range.
  - Insurance checker (accessible combobox: in-network / we'll file for you / kids' Medicaid) plus a membership savings calculator for uninsured patients.
  - Also: editorial treatment index with a cursor-following arch preview, comfort menu with a breathing cue and leaf-shadow video, horizontal pinned office-tour rail, illustrated Uptown map that draws itself in, live "Open now" badge (Dallas time), magnetic buttons, custom cursor, and a Call/Book bar on phones.
- Lighthouse (mobile, home): P 78–84 (live, varies by run) / A 100 / BP 100 / SEO 100 with indexing enabled (69 by default, because the demo is noindexed on purpose)
  - Mobile inner pages: P 83–94 (local production build and live). Desktop: P 99–100, A 100, BP 100 on home, services and team.
  - CLS 0 everywhere. Reduced-motion mode verified (no pinning, parallax, scrub or autoplay; all content visible).

- Phone pass (7 Nov 2026, production build at 375 x 812; JS, total and fonts are gzip transfer, LCP on throttled 1.6 Mbps + 4x CPU): 12 screens (was 29), reviews start on screen 3 (was 20), JS 186 KB, total 445 KB, fonts 45 KB in 2 files, LCP 1.9 s, CLS 0. Desktop (1024 px and up) unchanged.
  - Phones and touch never download GSAP or Lenis (`src/lib/motion.ts`), get no video and use their own two font files (`scripts/gen-phone-fonts.py`). Phone layout lives in the `phone` Tailwind variant and the Phones block in `globals.css`; the section order is `order-*` in `HomeContent.tsx`.
  - Serbian previews (biz.lang === "sr", our reading of Health Care Law art. 53 and the chamber's code): no smile gallery or before/after, only reviews marked `neutral`, no result counts, promises, "best" or comparisons, neutral service wording; the price list stays, with a small price tool on phones. The first screen is Serbian in the server's HTML (`useT`, `tr`), so nothing waits for Translate. Nothing that reads as a lure either: no gift step (four steps, not five), no free consultation or free first visit (the ordinary price instead), "O ordinaciji" instead of "Zašto mi".
  - Phone load: the first layout used to be the whole page in one 1.2 s task. Sections below the first screens now rest with `content-visibility` at their usual height (Phones block in `globals.css`, `RestWake.tsx`): the treatment list wakes when the browser is idle after load, the rest at the first touch, and only what's near the screen is laid out. No JS means no rest. If a section's height changes a lot, update its `--rest-h`.

## Portfolio copy
EN title: Oriel Dental Studio
EN one-liner (≤ 120 chars): A calm, light-filled dental studio site for Uptown Dallas, with an arched-window hero, smile sliders and booking in 60 seconds.
EN summary (2–3 sentences): A concept site for a family and cosmetic dentist in Uptown Dallas, designed to feel like the opposite of dental anxiety: soft daylight, slow motion and prices up front. An arched window opens into the studio, before/after sliders show each treatment, and a four-step booking flow, insurance checker and membership calculator turn visitors into new patients.
SR title: Oriel Dental Studio
SR one-liner: Smiren, svetao sajt za stomatološku ordinaciju u Dalasu: hero sa lučnim prozorom, before/after slajderi i zakazivanje za minut.
SR summary: Koncept sajt za porodičnu i estetsku stomatološku ordinaciju u Dalasu, osmišljen kao suprotnost strahu od zubara: dnevna svetlost, spori pokreti i cene unapred. Lučni prozor otvara pogled u ordinaciju, before/after slajderi prikazuju svaki tretman, a zakazivanje u četiri koraka, provera osiguranja i kalkulator članarine pretvaraju posetioce u nove pacijente.

## Screenshots
handoff/desktop-home.png, handoff/desktop-feature.png, handoff/mobile-home.png, handoff/scroll.mp4
