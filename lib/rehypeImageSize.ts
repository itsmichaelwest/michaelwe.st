import path from "path";
import { readFileSync } from "fs";
import { imageSize } from "image-size";
import { visit } from "unist-util-visit";

interface ImageElementNode {
    type: "element";
    tagName?: string;
    properties?: {
        src?: string;
        width?: number;
        height?: number;
    };
}

// Rehype plugin that resolves width/height for local images at build time.
// Reads dimensions from public/ so next/image always gets explicit props.
export function rehypeImageSize() {
    return (tree: Parameters<typeof visit>[0]) => {
        visit(tree, "element", (node: ImageElementNode) => {
            if (node.tagName !== "img") return;
            const src = node.properties?.src;
            if (!src || !src.startsWith("/")) return;
            if (node.properties?.width && node.properties?.height) return;

            try {
                const filePath = path.join(process.cwd(), "public", src);
                const buf = readFileSync(filePath);
                const dims = imageSize(buf);
                if (dims.width && dims.height) {
                    node.properties = node.properties ?? {};
                    node.properties.width = dims.width;
                    node.properties.height = dims.height;
                }
            } catch {
                // Image not found on disk — skip silently
            }
        });
    };
}
