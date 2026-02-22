import type { Metadata } from "next";
import { getGalleryItems } from "../../lib/getGalleryProps";
import { GalleryShell } from "../../components/Gallery";
import { HeroBio } from "../../components/HeroBio";

export const metadata: Metadata = {
    title: "About — Michael",
    description: "About Michael West",
    alternates: {
        canonical: "/about",
    },
};

export default async function AboutPage() {
    const items = await getGalleryItems();
    return (
        <GalleryShell items={items}>
            <HeroBio />
        </GalleryShell>
    );
}
