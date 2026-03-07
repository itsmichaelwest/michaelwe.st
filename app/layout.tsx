import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import siteMetadata from "../siteMetadata";
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
        <html lang="en">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd),
                    }}
                />
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                            html, body { overflow: hidden; overscroll-behavior: none; height: 100%; }
                        `,
                    }}
                />
            </head>
            <body>
                <div
                    className={`w-screen h-screen flex items-center justify-center overflow-visible ${inter.className} ${inter.variable} font-sans`}
                >
                    {children}
                </div>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
