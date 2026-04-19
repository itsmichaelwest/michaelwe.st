# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Commands

```bash
pnpm dev          # Dev server at localhost:3000
pnpm build        # Production build
pnpm start        # Serve production build
pnpm lint         # ESLint (next/core-web-vitals + next/typescript)
```

No test framework is configured. Git LFS is used for images in `content/work/`.

## Architecture

Static portfolio site built with Next.js 16 (App Router), deployed on Vercel. All pages are fully static (SSG) — no ISR, no `"use cache"`, no runtime revalidation. Content only changes on deploy.

### Content pipeline

```
content/work/*.md          → gray-matter parses YAML frontmatter + MDX body
lib/work.ts                → getSortedWorkData() reads/sorts all posts
lib/getGalleryProps.ts     → getGalleryItems() serializes MDX via next-mdx-remote-client
app/page.tsx               → passes ItemData[] to GalleryShell
GalleryItem                → renders MDXClient with custom component mapping (MDXComponents.tsx)
```

Frontmatter fields: `title`, `description`, `category`, `date`, `heroImage`, `heroAspectRatio`, `heroImageAlt`, `officialURL`, `officialURLText`, `noMSFT`, `hideFromList`, `canonical`.

### Gallery system (the core UI)

The entire site is a single interactive gallery. Key components in `components/Gallery/`:

- **GalleryShell** (`"use client"`): Master controller for rail scroll, gallery pagination, keyboard/wheel/pointer drag, and URL history (`pushState`/`replaceState`). Includes SAMPLE_ITEMS for dev-only testing (filtered out via `NODE_ENV` check).
- **GalleryItem** (`"use client"`): Renders thumbnail (rail), full-size image (gallery), and text content via a portal to `document.body`. Handles touch swipe/dismiss.
- **constants.ts**: Spring configs (`MAIN_SPRING`, `PAGE_SPRING`), drag thresholds, layout ratios.
- **utils.ts**: Layout math — `itemFullW()`, `itemGalleryScale()`, `itemRailScale()`, `railLeftOf()`.
- **GalleryContext**: Shares `open`, `openSpring`, and about-modal state.

Interaction model: closed = horizontal rail scroll with momentum; open = paginated gallery with swipe/keyboard nav; vertical drag transitions between states.

### Routing

```
/              → Home (gallery rail with all work items)
/about         → About modal overlay
/work/[id]     → Deep-link opens gallery to specific item (generateStaticParams for SSG)
```

Legacy URLs redirect via `next.config.js` (`/blog/*`, `/projects/*` → `/work/*`).

## Key conventions

- **Animation**: `motion` package v12 — import from `motion/react` (not `framer-motion`)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`; custom utilities in `styles/global.css`
- **SVGs**: Imported as React components via `@svgr/webpack`
- **Formatting**: Prettier with 4-space indentation
- **No cacheComponents**: Deliberately disabled — this is a fully static site. Do not add `"use cache"` directives or `cacheComponents: true` to next.config.js.
