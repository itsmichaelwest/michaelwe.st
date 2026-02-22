import Head from "next/head";
import type { GetStaticProps } from "next";
import SEO from "../components/SEO";
import { getGalleryItems } from "../lib/getGalleryProps";
import { GalleryShell } from "../components/Gallery";
import type { ItemData } from "../components/Gallery";
import { HeroBio } from "../components/HeroBio";

export const getStaticProps: GetStaticProps = async () => {
    const items = await getGalleryItems();
    return { props: { items } };
};

export default function AboutPage({ items }: { items: ItemData[] }) {
    return (
        <>
            <SEO
                title="About — Michael"
                description="About Michael West"
                canonical="/about"
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
