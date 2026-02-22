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
            <title key="title">{title}</title>
            {description && <meta key="description" name="description" content={description} />}

            {computedCanonical && (
                <link key="canonical" rel="canonical" href={computedCanonical} />
            )}

            <meta key="og:title" property="og:title" content={title} />
            <meta key="og:type" property="og:type" content={type} />
            {description && (
                <meta key="og:description" property="og:description" content={description} />
            )}
            {computedCanonical && (
                <meta key="og:url" property="og:url" content={computedCanonical} />
            )}
            <meta key="og:site_name" property="og:site_name" content={siteMetadata.title} />
            {ogImage && <meta key="og:image" property="og:image" content={ogImage} />}

            <meta key="twitter:card" name="twitter:card" content={image ? "summary_large_image" : "summary"} />
            {twitterHandle && (
                <meta key="twitter:site" name="twitter:site" content={twitterHandle} />
            )}
            <meta key="twitter:title" name="twitter:title" content={title} />
            {description && (
                <meta key="twitter:description" name="twitter:description" content={description} />
            )}
            {twitterHandle && (
                <meta key="twitter:creator" name="twitter:creator" content={twitterHandle} />
            )}
            {ogImage && <meta key="twitter:image" name="twitter:image" content={ogImage} />}

            {noIndex && <meta key="robots" name="robots" content="noindex,nofollow" />}
        </Head>
    );
};

export default SEO;
