import type { Metadata } from "next";
import { getGalleryItems } from "../lib/getGalleryProps";
import { GalleryShell } from "../components/Gallery";
import { HeroBio } from "../components/HeroBio";

export const metadata: Metadata = {
    title: "Michael",
    description: "Michael is designing things.",
};

export default async function Home() {
    const items = await getGalleryItems();
    return (
        <GalleryShell items={items}>
            <HeroBio />
        </GalleryShell>
    );
}
