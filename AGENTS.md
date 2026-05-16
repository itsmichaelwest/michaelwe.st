# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Commands

```bash
pnpm dev          # Dev server at localhost:3000
pnpm build        # Production build
pnpm start        # Serve production build
pnpm lint         # ESLint flat config (eslint-config-next core-web-vitals + typescript)
```

Lint is pinned to ESLint 9.x because eslint-plugin-react (transitive of eslint-config-next 16) doesn't yet support ESLint 10. Re-bump when [jsx-eslint/eslint-plugin-react#3979](https://github.com/jsx-eslint/eslint-plugin-react/pull/3979) ships.

No test framework is configured. Git LFS is used for images in `content/work/`.

## Architecture

Static portfolio site built with Next.js 16 (App Router), deployed on Vercel. All pages are fully static (SSG) — no ISR, no `"use cache"`, no runtime revalidation. Content only changes on deploy.

**One exception**: `app/writing/[slug]/opengraph-image.tsx` renders dynamically (`ƒ`). It's blocked from `generateStaticParams` by an upstream bundling bug in `@vercel/og`'s vendored opentype.js — `ltagTable` is referenced without a `var` declaration in `parseBuffer`, so any font that has an Apple `ltag` table (like Commit Mono's `.woff`) crashes at build time with `ReferenceError: ltagTable is not defined`. Vercel CDN-caches the dynamic response, so functional impact is nil. Don't add `generateStaticParams` to that route until the bug is fixed upstream.

### Content pipeline

```
content/work/*.md          → gray-matter parses YAML frontmatter + MDX body
lib/work.ts                → getSortedWorkData() reads/sorts all posts
lib/getGalleryProps.ts     → getGalleryItems() serializes MDX via next-mdx-remote-client
app/page.tsx               → passes ItemData[] to GalleryShell
GalleryItem                → renders MDXClient with custom component mapping (MDXComponents.tsx)

content/writing/*.md       → gray-matter parses frontmatter + MD body
lib/writing.ts             → getSortedWritingData(), getWritingPost() (RSC, no client serialization)
lib/rehypeWritingHeadings  → shifts h1/h2/h3 down by one (article shell owns the page h1) + collects TOC
app/writing/[slug]         → RSC render via next-mdx-remote-client/rsc; WritingTOC is the only client island
```

Frontmatter fields (work): `title`, `description`, `category`, `date`, `heroImage`, `heroAspectRatio`, `heroImageAlt`, `officialURL`, `officialURLText`, `noMSFT`, `hideFromList`, `canonical`.

Frontmatter fields (writing): `title`, `description`, `date` (ISO `yyyy-MM-dd` — parsed via `lib/date.ts` `parseCalendarDate` to avoid UTC-midnight hydration drift), `heroImage`, `heroImageAlt`. MDX content uses `#` as the top-level heading; rehype shifts it to `<h2>` so the page only has one `<h1>` (the post title).

### Gallery system (the core UI)

The entire site is a single interactive gallery. Key components in `components/Gallery/`:

- **GalleryShell** (`"use client"`): Master controller for rail scroll, gallery pagination, keyboard/wheel/pointer drag, and URL history (`pushState`/`replaceState`).
- **GalleryItem** (`"use client"`): Renders thumbnail (rail), full-size image (gallery), and text content via a portal to `document.body`. Handles touch swipe/dismiss.
- **constants.ts**: Spring configs (`MAIN_SPRING`, `PAGE_SPRING`), drag thresholds, layout ratios.
- **utils.ts**: Layout math — `itemFullW()`, `itemGalleryScale()`, `itemRailScale()`, `railLeftOf()`.
- **GalleryContext**: Shares `open`, `openSpring`, and about-modal state.

Interaction model: closed = horizontal rail scroll with momentum; open = paginated gallery with swipe/keyboard nav; vertical drag transitions between states.

### Routing

```
/                       → Home (gallery rail with all work items)
/about                  → About modal overlay
/work/[id]              → Deep-link opens gallery to specific item (SSG)
/writing                → Year-grouped post list (SSG)
/writing/[slug]         → Article (SSG, RSC MDX)
/writing/feed.xml       → RSS (force-static)
/writing/[slug]/opengraph-image  → OG card (dynamic, see exception above)
```

Legacy URLs redirect via `next.config.js` (`/blog/*`, `/projects/*` → `/work/*`).

## Key conventions

- **Animation**: `motion` package v12 — import from `motion/react` (not `framer-motion`)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`; custom utilities in `styles/global.css`
- **SVGs**: Imported as React components via `@svgr/webpack`
- **Formatting**: Prettier with 4-space indentation
- **No cacheComponents**: Deliberately disabled — this is a fully static site. Do not add `"use cache"` directives or `cacheComponents: true` to next.config.js.
