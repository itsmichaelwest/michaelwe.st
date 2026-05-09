import { MDXComponents } from "next-mdx-remote-client/csr";
import Link from "next/link";
import { MDXImage } from "./MDXImage";

export const components: MDXComponents = {
    h1: ({ children, id }) => (
        <h1
            id={id}
            className="scroll-mt-24 text-4xl font-semibold tracking-tight text-balance mt-12 mb-4"
        >
            {children}
        </h1>
    ),
    h2: ({ children, id }) => (
        <h2
            id={id}
            className="scroll-mt-24 text-3xl font-semibold tracking-tight text-balance mt-10 mb-3"
        >
            {children}
        </h2>
    ),
    h3: ({ children, id }) => (
        <h3
            id={id}
            className="scroll-mt-24 text-lg font-semibold text-heading mt-8 mb-2"
        >
            {children}
        </h3>
    ),
    p: ({ children }) => (
        <p className="my-6 leading-relaxed text-secondary">{children}</p>
    ),
    strong: ({ children }) => (
        <strong className="font-semibold text-black dark:text-white">
            {children}
        </strong>
    ),
    blockquote: ({ children }) => (
        <blockquote className="my-8 border-l-4 border-gray-200 dark:border-gray-700 pl-4 italic text-muted">
            {children}
        </blockquote>
    ),
    ul: ({ children }) => (
        <ul className="my-6 ml-4 list-disc space-y-2 leading-relaxed text-secondary">
            {children}
        </ul>
    ),
    ol: ({ children }) => (
        <ol className="my-6 ml-4 list-decimal space-y-2 leading-relaxed text-secondary">
            {children}
        </ol>
    ),
    li: ({ children }) => <li className="pl-1">{children}</li>,
    code: ({ children }) => (
        <code className="text-sm font-medium bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded">
            {children}
        </code>
    ),
    pre: ({ children }) => (
        <pre className="my-8 overflow-x-auto rounded-lg bg-gray-50 dark:bg-gray-800 p-4 text-sm leading-relaxed">
            {children}
        </pre>
    ),
    a: ({ href, children }) => (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
            {children}
        </Link>
    ),
    img: ({ src, alt, height, width }) => (
        <MDXImage src={src} alt={alt} height={height} width={width} />
    ),
    hr: () => (
        <hr className="my-12 border-gray-100 dark:border-gray-800" />
    ),
};
