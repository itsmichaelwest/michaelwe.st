import type { Metadata } from "next";
import { getAllPostIds, getPostData } from "../../../lib/work";
import { getGalleryItems } from "../../../lib/getGalleryProps";
import { GalleryShell } from "../../../components/Gallery";
import { HeroBio } from "../../../components/HeroBio";

// MIGRATED: Removed `export const dynamicParams = false` — incompatible with cacheComponents.
// generateStaticParams still defines the valid set; unknown IDs will 404 via file-read error.

export function generateStaticParams() {
    const allIds = getAllPostIds();
    return allIds
        .filter(({ params }) => {
            const post = getPostData(params.id);
            return !post.canonical && !post.hideFromList;
        })
        .map(({ params }) => ({ id: params.id }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const post = getPostData(id);
    const heroImage = post.heroImage
        ? `/images/${id}/${post.heroImage}`
        : undefined;

    return {
        title: `${post.title ?? id} — Michael`,
        description: post.description ?? post.category ?? "",
        alternates: {
            canonical: `/work/${id}`,
        },
        openGraph: {
            title: `${post.title ?? id} — Michael`,
            description: post.description ?? post.category ?? "",
            type: "article",
            url: `/work/${id}`,
            ...(heroImage && { images: [heroImage] }),
        },
        twitter: {
            card: heroImage ? "summary_large_image" : "summary",
            title: `${post.title ?? id} — Michael`,
            description: post.description ?? post.category ?? "",
            ...(heroImage && { images: [heroImage] }),
        },
    };
}

export default async function WorkPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const post = getPostData(id);
    const items = await getGalleryItems();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: post.title ?? id,
        description: post.description ?? post.category ?? "",
        url: `https://www.michaelwe.st/work/${id}`,
        author: { "@type": "Person", name: "Michael West" },
        ...(post.date && { datePublished: post.date }),
        ...(post.heroImage && {
            image: `https://www.michaelwe.st/images/${id}/${post.heroImage}`,
        }),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd),
                }}
            />
            <GalleryShell items={items}>
                <HeroBio />
            </GalleryShell>
        </>
    );
}
