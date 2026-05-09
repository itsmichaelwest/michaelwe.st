# Learnings

- 2026-02-21: motion@12 uses `motion/react` import path (not `framer-motion`). `layoutId`, `AnimatePresence`, `LayoutGroup` all from `motion/react`.
- 2026-03-21: Gallery full-screen view uses GalleryDetail overlay (native scroll, crisp text) + GalleryItem (image transform animation only). The overlay crossfades with GalleryItem's image during open/close transitions. Touch handlers for swipe/dismiss live on GalleryDetail's image wrapper, not GalleryItem.
- 2026-03-21: `npm run build` has a pre-existing robots.txt PageNotFoundError — unrelated to gallery code, likely Next.js 15/16 compatibility issue.
