import Link from "next/link";
import type { MDXComponents } from "next-mdx-remote-client/rsc";
import { MDXImage } from "./MDXImage";
import { YouTube } from "./YouTube";

// MDX content uses `#` as the top-level heading. The article shell renders the
// post title as <h1>, so the rehype pipeline shifts content headings down by
// one (h1→h2, h2→h3, h3→h4). Only h2-h4 ever reach this map.
export const components: MDXComponents = {
    h2: ({ children, id }) => (
        <h2
            id={id}
            className="scroll-mt-24 text-h2 font-semibold text-balance mt-12 mb-3"
        >
            {children}
        </h2>
    ),
    h3: ({ children, id }) => (
        <h3
            id={id}
            className="scroll-mt-24 text-h3 font-semibold text-heading mt-8 mb-2"
        >
            {children}
        </h3>
    ),
    h4: ({ children, id }) => (
        <h4
            id={id}
            className="scroll-mt-24 text-body font-semibold text-heading mt-6 mb-2"
        >
            {children}
        </h4>
    ),
    p: ({ children }) => (
        <p className="my-6 text-body text-secondary text-pretty">
            {children}
        </p>
    ),
    strong: ({ children }) => (
        <strong className="font-semibold text-heading">
            {children}
        </strong>
    ),
    blockquote: ({ children }) => (
        <blockquote className="my-8 border-l border-hairline pl-6 text-secondary">
            {children}
        </blockquote>
    ),
    ul: ({ children }) => (
        <ul className="my-6 ml-4 list-disc space-y-2 text-body text-secondary">
            {children}
        </ul>
    ),
    ol: ({ children }) => (
        <ol className="my-6 ml-4 list-decimal space-y-2 text-body text-secondary">
            {children}
        </ol>
    ),
    li: ({ children }) => <li className="pl-1">{children}</li>,
    code: ({ children }) => (
        <code className="font-mono text-[0.875em] bg-black/5 dark:bg-white/8 px-1.5 py-0.5 rounded">
            {children}
        </code>
    ),
    pre: ({ children }) => (
        <pre className="my-8 overflow-x-auto rounded-lg bg-black/5 dark:bg-white/5 p-4 font-mono text-caption leading-relaxed">
            {children}
        </pre>
    ),
    a: ({ href = "", children }) => {
        const isExternal = /^https?:\/\//i.test(href);
        const isInPage = href.startsWith("#");
        const isInternal = href.startsWith("/") || isInPage;
        const isMail = href.startsWith("mailto:") || href.startsWith("tel:");
        if (!isExternal && !isInternal && !isMail) {
            // Drop unsafe protocols (e.g. javascript:) — render as plain text.
            return <span>{children}</span>;
        }
        const linkClass =
            "link-underline";
        if (isExternal) {
            return (
                <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                >
                    {children}
                </Link>
            );
        }
        return (
            <Link href={href} className={linkClass}>
                {children}
            </Link>
        );
    },
    img: ({ src, alt, height, width }) => (
        <MDXImage src={src} alt={alt} height={height} width={width} />
    ),
    // Custom MDX-only tag — usage: <YouTube id="..." title="..." />.
    // Cast required because next-mdx-remote-client's MDXComponents type is
    // narrowed to known HTML tags + a small set of MDX primitives.
    YouTube: YouTube as MDXComponents["img"],
    hr: () => (
        <hr className="my-12 border-gray-100 dark:border-gray-800" />
    ),
};
