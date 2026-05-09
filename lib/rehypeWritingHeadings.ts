import { visit } from "unist-util-visit";

export interface TOCHeading {
    id: string;
    text: string;
    level: number;
}

export function slugify(text: string): string {
    return text
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function nodeToText(node: { children?: unknown[] }): string {
    let out = "";
    for (const child of node.children ?? []) {
        const c = child as {
            type?: string;
            value?: string;
            children?: unknown[];
        };
        if (c.type === "text" && typeof c.value === "string") out += c.value;
        else if (c.children) out += nodeToText(c);
    }
    return out;
}

// Lightweight markdown heading scan for the TOC. Avoids running the full MDX
// pipeline twice. Mirrors the slug + collision logic of the rehype pass so the
// generated ids match between the TOC links and the rendered article.
export function collectMarkdownHeadings(content: string): TOCHeading[] {
    const lines = content.split(/\r?\n/);
    const headings: TOCHeading[] = [];
    const used = new Map<string, number>();
    let inFence = false;
    let fenceMarker = "";
    for (const raw of lines) {
        const line = raw.replace(/\t/g, "    ");
        const fence = line.match(/^(?:\s{0,3})(`{3,}|~{3,})/);
        if (fence) {
            const marker = fence[1][0];
            if (!inFence) {
                inFence = true;
                fenceMarker = marker;
            } else if (marker === fenceMarker) {
                inFence = false;
                fenceMarker = "";
            }
            continue;
        }
        if (inFence) continue;
        const m = line.match(/^\s{0,3}(#{1,3})\s+(.+?)(?:\s+#+\s*)?$/);
        if (!m) continue;
        const level = m[1].length;
        const text = m[2].trim();
        if (!text) continue;
        const base = slugify(text);
        if (!base) continue;
        const count = used.get(base) ?? 0;
        const id = count === 0 ? base : `${base}-${count}`;
        used.set(base, count + 1);
        headings.push({ id, text, level });
    }
    return headings;
}

interface ElementNode {
    type: "element";
    tagName?: string;
    properties?: Record<string, unknown> & { id?: string };
    children?: unknown[];
}

// Rehype plugin that:
// - Shifts h1/h2/h3 down by one (h1→h2, etc.) so the page only has one h1
//   (the article title rendered by the page shell).
// - Adds stable ids for in-page anchors. Pre-walks the tree first so explicit
//   ids set in MDX never collide with auto-generated ones.
export function rehypeWritingHeadings() {
    return () => {
        return (tree: Parameters<typeof visit>[0]) => {
            const used = new Map<string, number>();
            visit(tree, "element", (node: ElementNode) => {
                const id = node.properties?.id;
                if (typeof id === "string" && id) {
                    used.set(id, (used.get(id) ?? 0) + 1);
                }
            });

            visit(tree, "element", (node: ElementNode) => {
                const tag = node.tagName;
                if (!tag || !/^h[1-3]$/.test(tag)) return;

                const sourceLevel = Number(tag[1]);
                const shiftedLevel = sourceLevel + 1;
                node.tagName = `h${shiftedLevel}`;

                node.properties = node.properties ?? {};
                if (node.properties.id) return;

                const text = nodeToText(node).trim();
                if (!text) return;
                const base = slugify(text);
                if (!base) return;

                let candidate = base;
                let count = used.get(base) ?? 0;
                while (used.has(candidate) && count > 0) {
                    candidate = `${base}-${count}`;
                    count += 1;
                }
                if (used.has(candidate)) {
                    candidate = `${base}-${count}`;
                }
                used.set(base, (used.get(base) ?? 0) + 1);
                used.set(candidate, (used.get(candidate) ?? 0) + 1);
                node.properties.id = candidate;
            });
        };
    };
}
