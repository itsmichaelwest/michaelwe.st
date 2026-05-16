import type { Metadata } from "next";
import Link from "next/link";
import siteMetadata from "../siteMetadata";

export const metadata: Metadata = {
    title: `Page not found - ${siteMetadata.title}`,
    description: siteMetadata.description,
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <div
            style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
            }}
            className="mx-auto mt-20 mb-32"
        >
            <h1 className="text-8xl font-bold mb-6">
                <span role="img" aria-label="Loudly crying face emoji">
                    😭
                </span>
            </h1>
            <h1 className="text-display font-semibold my-4 text-heading">
                Page not found
            </h1>
            <p className="my-2 text-body text-secondary">
                That page doesn&apos;t exist. Try going to the{" "}
                <Link href="/" className="link-underline">
                    homepage
                </Link>
                .
            </p>
            <p className="mt-2 text-eyebrow uppercase font-medium text-muted">HTTP 404</p>
        </div>
    );
}
