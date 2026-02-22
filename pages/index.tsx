import Head from "next/head";
import type { GetStaticProps } from "next";
import SEO from "../components/SEO";
import { getSortedWorkData } from "../lib/work";
import {
    serialize,
    type SerializeOptions,
} from "next-mdx-remote-client/serialize";
import rehypeUnwrapImages from "rehype-unwrap-images";
import rehypeImgSize from "rehype-img-size";
import { GalleryShell } from "../components/Gallery";
import type { ItemData } from "../components/Gallery";
import { HeroBio } from "../components/HeroBio";

export const getStaticProps: GetStaticProps = async () => {
    const posts = getSortedWorkData().filter((p) => !p.hideFromList);
    const mdxOptions: SerializeOptions = {
        disableImports: true,
        mdxOptions: {
            rehypePlugins: [
                rehypeUnwrapImages,
                [rehypeImgSize, { dir: "public" }],
            ],
        },
        parseFrontmatter: true,
    };

    const items: ItemData[] = await Promise.all(
        posts.map(async (p) => {
            const mdxSource = await serialize({
                source: p.content,
                options: mdxOptions,
            });
            return {
                id: p.id,
                title: p.title ?? p.id,
                subtitle: p.description ?? p.category ?? "",
                aspect: p.heroAspectRatio ?? 1.0,
                railH: 0.8,
                img: p.heroImage
                    ? `/images/${p.id}/${p.heroImage}`
                    : undefined,
                canonical: p.canonical ?? null,
                noMSFT: p.noMSFT ?? false,
                year: p.date ? new Date(p.date).getFullYear().toString() : undefined,
                mdxSource,
            };
        }),
    );
    return { props: { items } };
};

export default function Home({ items }: { items: ItemData[] }) {
    return (
        <>
            <SEO title="Michael" description="Michael is designing things." />
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
