import { MDXComponents } from "next-mdx-remote-client/csr";
import Link from "next/link";
import Image from "next/image";

export const components: MDXComponents = {
    h1: ({ children }) => (
        <h1 className="text-4xl font-semibold tracking-tight text-balance mt-12 mb-4">
            {children}
        </h1>
    ),
    h2: ({ children }) => (
        <h2 className="text-3xl font-semibold tracking-tight text-balance mt-10 mb-3">
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3 className="text-lg font-semibold text-heading mt-8 mb-2">
            {children}
        </h3>
    ),
    p: ({ children }) => (
        <p className="my-6 leading-relaxed text-secondary">{children}</p>
    ),
    strong: ({ children }) => (
        <strong className="font-semibold text-black">{children}</strong>
    ),
    blockquote: ({ children }) => (
        <blockquote className="my-8 border-l-4 border-gray-200 pl-4 italic text-muted">
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
        <code className="text-sm font-medium bg-gray-50 px-1.5 py-0.5 rounded">
            {children}
        </code>
    ),
    pre: ({ children }) => (
        <pre className="my-8 overflow-x-auto rounded-lg bg-gray-50 p-4 text-sm leading-relaxed">
            {children}
        </pre>
    ),
    a: ({ href, children }) => (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-700"
        >
            {children}
        </Link>
    ),
    img: ({ src, alt, height, width }) => (
        <figure className="my-16 space-y-4">
            {height && width ? (
                <Image
                    src={src}
                    alt={alt}
                    height={height}
                    width={width}
                    sizes="(max-width: 768px) 100vw, min(80ch, 100vw)"
                    className="rounded-xl ring ring-black/5"
                />
            ) : (
                <div className="relative w-full aspect-video">
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        sizes="(max-width: 768px) 100vw, min(80ch, 100vw)"
                        className="rounded-xl ring ring-black/5 object-contain"
                    />
                </div>
            )}
            <figcaption className="text-sm opacity-50">{alt}</figcaption>
        </figure>
    ),
    hr: () => <hr className="my-12 border-gray-100" />,
};
