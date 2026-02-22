import Head from "next/head";
import type { GetStaticPaths, GetStaticProps } from "next";
import SEO from "../../components/SEO";
import { getAllPostIds, getPostData } from "../../lib/work";
import { getGalleryItems } from "../../lib/getGalleryProps";
import { GalleryShell } from "../../components/Gallery";
import type { ItemData } from "../../components/Gallery";
import { HeroBio } from "../../components/HeroBio";

interface WorkPageProps {
    items: ItemData[];
    seo: { title: string; description: string; image: string | null; canonical: string };
}

export const getStaticPaths: GetStaticPaths = async () => {
    const allIds = getAllPostIds();
    // Exclude items with external canonical or hidden from list
    const paths = allIds.filter(({ params }) => {
        const post = getPostData(params.id);
        return !post.canonical && !post.hideFromList;
    });
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<WorkPageProps> = async ({ params }) => {
    const id = params!.id as string;
    const items = await getGalleryItems();
    const post = getPostData(id);
    const heroImage = post.heroImage
        ? `/images/${id}/${post.heroImage}`
        : null;

    return {
        props: {
            items,
            seo: {
                title: `${post.title ?? id} — Michael`,
                description: post.description ?? post.category ?? "",
                image: heroImage,
                canonical: `/work/${id}`,
            },
        },
    };
};

export default function WorkPage({ items, seo }: WorkPageProps) {
    return (
        <>
            <SEO
                title={seo.title}
                description={seo.description}
                image={seo.image ?? undefined}
                canonical={seo.canonical}
            />
            <Head>
                <style>{`
                    html, body { overflow: hidden; overscroll-behavior: none; height: 100%; }
                    @media (any-pointer: coarse) {
                        .gallery-portal { pointer-events: auto !important; touch-action: pan-y; }
                    }
                `}</style>
            </Head>
            <GalleryShell items={items}>
                <HeroBio />
            </GalleryShell>
        </>
    );
}
