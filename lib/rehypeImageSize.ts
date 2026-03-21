import path from "path";
import { readFileSync } from "fs";
import { imageSize } from "image-size";
import { visit } from "unist-util-visit";

/**
 * Rehype plugin that resolves width/height for local images at build time.
 * Reads dimensions from public/ so next/image always gets explicit props.
 */
export function rehypeImageSize() {
    return (tree: Parameters<typeof visit>[0]) => {
        visit(tree, "element", (node: any) => {
            // eslint-disable-line @typescript-eslint/no-explicit-any
            if (node.tagName !== "img") return;
            const src = node.properties?.src as string | undefined;
            if (!src || !src.startsWith("/")) return;
            if (node.properties?.width && node.properties?.height) return;

            try {
                const filePath = path.join(process.cwd(), "public", src);
                const buf = readFileSync(filePath);
                const dims = imageSize(buf);
                if (dims.width && dims.height) {
                    node.properties!.width = dims.width;
                    node.properties!.height = dims.height;
                }
            } catch {
                // Image not found on disk — skip silently
            }
        });
    };
}
