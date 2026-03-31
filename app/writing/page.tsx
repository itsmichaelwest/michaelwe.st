import { getSortedWritingData } from "../../lib/writing";
import { WritingList } from "./WritingList";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Writing — Michael",
    description: "Thoughts on design, engineering, and the things I'm building.",
};

export default function WritingPage() {
    const posts = getSortedWritingData();

    return <WritingList posts={posts} />;
}
