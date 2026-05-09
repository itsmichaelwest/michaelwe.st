import path from "path";
import { readFileSync } from "fs";
import { imageSize } from "image-size";
import { visit } from "unist-util-visit";

interface HastElement {
    tagName?: string;
    properties?: Record<string, unknown>;
}

/**
 * Rehype plugin that resolves width/height for local images at build time.
 * Reads dimensions from public/ so next/image always gets explicit props.
 */
export function rehypeImageSize() {
    return (tree: Parameters<typeof visit>[0]) => {
        visit(tree, "element", (node) => {
            const el = node as HastElement;
            if (el.tagName !== "img") return;
            const src = el.properties?.src as string | undefined;
            if (!src || !src.startsWith("/")) return;
            if (el.properties?.width && el.properties?.height) return;

            try {
                const filePath = path.join(process.cwd(), "public", src);
                const buf = readFileSync(filePath);
                const dims = imageSize(buf);
                if (dims.width && dims.height) {
                    el.properties = el.properties ?? {};
                    el.properties.width = dims.width;
                    el.properties.height = dims.height;
                }
            } catch {
                // Image not found on disk — skip silently
            }
        });
    };
}
