import { visit } from "unist-util-visit";

export interface TOCHeading {
    id: string;
    text: string;
    level: number;
}

function slugify(text: string): string {
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
        const c = child as { type?: string; value?: string; children?: unknown[] };
        if (c.type === "text" && typeof c.value === "string") out += c.value;
        else if (c.children) out += nodeToText(c);
    }
    return out;
}

/**
 * Adds stable ids to h1/h2/h3 elements and collects them into the provided
 * array so the writing layout can render a sidebar table of contents.
 */
export function rehypeWritingHeadings(headings: TOCHeading[]) {
    return () => {
        const used = new Map<string, number>();
        return (tree: Parameters<typeof visit>[0]) => {
            visit(tree, "element", (node: any) => {
                // eslint-disable-line @typescript-eslint/no-explicit-any
                const tag = node.tagName as string | undefined;
                if (!tag || !/^h[1-3]$/.test(tag)) return;

                const text = nodeToText(node).trim();
                if (!text) return;

                let base = slugify(text);
                if (!base) return;

                const count = used.get(base) ?? 0;
                const id = count === 0 ? base : `${base}-${count}`;
                used.set(base, count + 1);

                node.properties = node.properties ?? {};
                if (!node.properties.id) node.properties.id = id;

                headings.push({
                    id: node.properties.id as string,
                    text,
                    level: Number(tag[1]),
                });
            });
        };
    };
}
