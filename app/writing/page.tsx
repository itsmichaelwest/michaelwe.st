import { notFound } from "next/navigation";
import { getSortedWritingData, hasWritingPosts } from "../../lib/writing";
import { WritingList } from "./WritingList";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Writing — Michael",
    description: "Thoughts on design, engineering, and the things I'm building.",
};

export default function WritingPage() {
    if (!hasWritingPosts()) notFound();

    const posts = getSortedWritingData();

    return <WritingList posts={posts} />;
}
