import Head from "next/head";
import type { FC } from "react";
import siteMetadata from "../siteMetadata";

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    type?: "website" | "article";
    canonical?: string;
    noIndex?: boolean;
}

const ensureAbsoluteUrl = (pathOrUrl?: string): string | undefined => {
    if (!pathOrUrl) return undefined;
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    const base = siteMetadata.siteURL.endsWith("/")
        ? siteMetadata.siteURL
        : `${siteMetadata.siteURL}/`;
    const trimmed = pathOrUrl.startsWith("/")
        ? pathOrUrl.substring(1)
        : pathOrUrl;
    return `${base}${trimmed}`;
};

const SEO: FC<SEOProps> = ({
    title,
    description,
    image,
    type = "website",
    canonical,
    noIndex,
}) => {
    const computedCanonical = ensureAbsoluteUrl(canonical);
    const ogImage = ensureAbsoluteUrl(image);
    const twitterHandle = siteMetadata.social?.twitter;

    return (
        <Head>
            <title>{title}</title>
            {description && <meta name="description" content={description} />}

            {computedCanonical && (
                <link rel="canonical" href={computedCanonical} />
            )}

            <meta property="og:title" content={title} />
            <meta property="og:type" content={type} />
            {description && (
                <meta property="og:description" content={description} />
            )}
            {computedCanonical && (
                <meta property="og:url" content={computedCanonical} />
            )}
            <meta property="og:site_name" content={siteMetadata.title} />
            {ogImage && <meta property="og:image" content={ogImage} />}

            <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
            {twitterHandle && (
                <meta name="twitter:site" content={twitterHandle} />
            )}
            <meta name="twitter:title" content={title} />
            {description && (
                <meta name="twitter:description" content={description} />
            )}
            {twitterHandle && (
                <meta name="twitter:creator" content={twitterHandle} />
            )}
            {ogImage && <meta name="twitter:image" content={ogImage} />}

            {noIndex && <meta name="robots" content="noindex,nofollow" />}
        </Head>
    );
};

export default SEO;
