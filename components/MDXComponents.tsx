import { MDXComponents } from "next-mdx-remote-client/csr";
import Link from "next/link";
import Image from "next/image";

export const components: MDXComponents = {
    h1: ({ children }) => (
        <h1 className="text-4xl font-semibold">{children}</h1>
    ),
    h2: ({ children }) => (
        <h2 className="text-3xl font-semibold">{children}</h2>
    ),
    strong: ({ children }) => (
        <strong className="font-semibold text-black dark:text-white">
            {children}
        </strong>
    ),
    a: ({ href, children }) => (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200"
        >
            {children}
        </Link>
    ),
    img: ({ src, alt, height, width }) => (
        <figure className="my-16 space-y-4">
            <Image
                src={src}
                alt={alt}
                height={height}
                width={width}
                className="rounded-2xl shadow-xs ring ring-black/5 dark:ring-white/5"
            />
            <figcaption className="text-sm opacity-50">{alt}</figcaption>
        </figure>
    ),
    hr: () => <hr className="my-20 opacity-25" />,
};
