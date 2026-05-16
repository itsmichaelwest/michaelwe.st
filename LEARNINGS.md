# Learnings

- 2026-02-21: motion@12 uses `motion/react` import path (not `framer-motion`). `layoutId`, `AnimatePresence`, `LayoutGroup` all from `motion/react`.
- 2026-03-21: Gallery full-screen view uses GalleryDetail overlay (native scroll, crisp text) + GalleryItem (image transform animation only). The overlay crossfades with GalleryItem's image during open/close transitions. Touch handlers for swipe/dismiss live on GalleryDetail's image wrapper, not GalleryItem.
- 2026-03-21: `npm run build` has a pre-existing robots.txt PageNotFoundError — unrelated to gallery code, likely Next.js 15/16 compatibility issue.
- 2026-05-15: Design tokens — `--color-accent` and `--color-hairline` in `styles/global.css` use `light-dark()` so a single value works in both schemes. Tailwind v4 generates `text-accent`, `decoration-accent`, `ring-[--color-hairline]` etc automatically from `@theme`. Do not introduce raw `text-blue-*` or `shadow*` utilities for chrome.
- 2026-05-15: Rail wheel handler in `GalleryShell.tsx` only acts on horizontal wheel deltas; vertical is ignored. `overscroll-behavior-x: contain` on html/body backs this up to fully block browser back-swipe.
- 2026-05-15: Type ramp lives in `styles/global.css` as Tailwind v4 size tokens (`--text-eyebrow|caption|body|lead|h3|h2|h1|display`) with line-height + letter-spacing pinned per size. Use `text-h1`/`text-body`/etc rather than composing `text-3xl tracking-tight` ad-hoc.
- 2026-05-15: Inter v4 is loaded via `next/font/google` with `axes: ["opsz"]`. Body defaults to opsz 14; `h1`, `h2`, and `.font-feat-display` get opsz 28 (the "Display" cut). cv11 + ss03 features applied site-wide. Mono is reserved for code/pre only.
