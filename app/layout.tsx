import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import "@fontsource/commit-mono/400.css";
import "@fontsource/commit-mono/600.css";
import siteMetadata from "../siteMetadata";
import { hasWritingPosts } from "../lib/writing";
import "../styles/global.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: siteMetadata.title,
    description: siteMetadata.description,
    metadataBase: new URL(siteMetadata.siteURL),
    openGraph: {
        title: siteMetadata.title,
        description: siteMetadata.description,
        siteName: siteMetadata.title,
        type: "website",
    },
    twitter: {
        card: "summary",
        site: siteMetadata.social.twitter,
        creator: siteMetadata.social.twitter,
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            name: siteMetadata.title,
            url: siteMetadata.siteURL,
            description: siteMetadata.description,
        },
        {
            "@type": "Person",
            name: siteMetadata.author,
            url: siteMetadata.siteURL,
            sameAs: [
                `https://twitter.com/${siteMetadata.social.twitter.replace("@", "")}`,
            ],
        },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="antialiased">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd),
                    }}
                />
                {hasWritingPosts() && (
                    <link
                        rel="alternate"
                        type="application/rss+xml"
                        title="Michael — Writing"
                        href="/writing/feed.xml"
                    />
                )}
            </head>
            <body>
                <a
                    href="#content"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-black focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-white dark:focus:bg-white dark:focus:text-black"
                >
                    Skip to content
                </a>
                <div
                    id="content"
                    tabIndex={-1}
                    className={`overflow-x-clip outline-none ${inter.className} ${inter.variable} font-sans`}
                >
                    {children}
                </div>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
