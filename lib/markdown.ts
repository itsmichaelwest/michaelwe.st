import { getSortedWorkData, getPostData, type IPostData } from "./work";
import siteMetadata from "../siteMetadata";

const SITE_URL = siteMetadata.siteURL.replace(/\/$/, "");

function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

export function markdownResponse(markdown: string): Response {
    return new Response(markdown, {
        headers: {
            "content-type": "text/markdown; charset=utf-8",
            "x-markdown-tokens": String(estimateTokens(markdown)),
            vary: "Accept",
        },
    });
}

function absolutizeImages(markdown: string): string {
    return markdown.replace(
        /(!\[[^\]]*\]\()(\/[^)\s]+)(\))/g,
        (_m, pre, path, post) => `${pre}${SITE_URL}${path}${post}`,
    );
}

function formatMeta(post: IPostData): string {
    return [post.category, post.date].filter(Boolean).join(" • ");
}

function formatItemEntry(post: IPostData): string[] {
    const href = post.canonical ?? `${SITE_URL}/work/${post.id}`;
    const lines: string[] = [];
    lines.push(`### [${post.title ?? post.id}](${href})`);
    lines.push("");
    const meta = formatMeta(post);
    if (meta) {
        lines.push(`_${meta}_`);
        lines.push("");
    }
    if (post.description) {
        lines.push(post.description);
        lines.push("");
    }
    return lines;
}

export function homeMarkdown(): string {
    const items = getSortedWorkData().filter((p) => !p.hideFromList);
    const lines: string[] = [
        "# Michael West",
        "",
        "Senior Designer at Microsoft. Designer, engineer, builder.",
        "",
        "I currently work on Windows, where our team focuses on making your PC experience more powerful and delightful with AI, while also scaling new tooling across the studio.",
        "",
        "## Links",
        "",
        `- [About](${SITE_URL}/about)`,
        "- [X](https://x.com/itsmichaelwest)",
        "- [LinkedIn](https://www.linkedin.com/in/itsmichaelwest)",
        "- [GitHub](https://github.com/itsmichaelwest)",
        "",
        "## Work",
        "",
    ];
    for (const item of items) {
        lines.push(...formatItemEntry(item));
    }
    return lines.join("\n");
}

export function aboutMarkdown(): string {
    return [
        "# About Michael West",
        "",
        "I'm a self-taught designer with an engineering background, specializing in simple and effortless experiences for both the devices we use today and the ones we'll use in the future. Crafting high-quality products that people love to use is my passion, and I work tirelessly to achieve that goal.",
        "",
        "Using the medium of motion and rapid prototyping I bring these experiences to life, visualizing the smallest interactions to entire user journeys. I strongly believe in open design, and encourage co-creation that can help deliver a better solution for users.",
        "",
        "Accessibility and inclusion sit at the center of my process — technology should empower everyone and nobody should be left with a subpar experience.",
        "",
        "I'm currently a Senior Designer at [Microsoft](https://www.microsoft.com/), where I currently work on Windows AI.",
        "",
        `Previously a Design Intern at Microsoft, where I was involved with products used by millions of people around the world. Check them out: [Surface Duo](${SITE_URL}/work/surface-duo), [SwiftKey](${SITE_URL}/work/swiftkey-design-system), [Fluent Icons](${SITE_URL}/work/fluent-icons). Before that, I worked independently on critically acclaimed concepts both by myself and friends.`,
        "",
        "BSc Computer Science graduate — First Class Honours.",
        "",
        "Awarded 2018-19 [Microsoft MVP](https://mvp.microsoft.com/) (Most Valuable Professional) for Windows Design.",
        "",
        `[Download résumé](${SITE_URL}/files/mw-resume-jan2022.pdf)`,
        "",
        "## Links",
        "",
        "- [X](https://x.com/itsmichaelwest)",
        "- [LinkedIn](https://www.linkedin.com/in/itsmichaelwest)",
        "- [GitHub](https://github.com/itsmichaelwest)",
    ].join("\n");
}

export function workMarkdown(id: string): string {
    const post = getPostData(id);
    const lines: string[] = [];
    lines.push(`# ${post.title ?? id}`);
    lines.push("");
    if (post.description) {
        lines.push(`> ${post.description}`);
        lines.push("");
    }
    const meta = formatMeta(post);
    if (meta) {
        lines.push(`_${meta}_`);
        lines.push("");
    }
    if (post.heroImage) {
        const alt = post.heroImageAlt ?? post.title ?? id;
        lines.push(`![${alt}](${SITE_URL}/images/${id}/${post.heroImage})`);
        lines.push("");
    }
    if (post.officialURL) {
        lines.push(
            `[${post.officialURLText ?? "View project"}](${post.officialURL})`,
        );
        lines.push("");
    }
    if (post.canonical) {
        lines.push(`**Canonical URL:** ${post.canonical}`);
        lines.push("");
    }
    lines.push(absolutizeImages(post.content));
    return lines.join("\n");
}
