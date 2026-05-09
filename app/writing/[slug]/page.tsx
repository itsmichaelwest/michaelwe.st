import { notFound } from "next/navigation";
import {
    getAllWritingSlugs,
    getWritingPost,
    getWritingNeighbors,
} from "../../../lib/writing";
import { WritingArticle } from "./WritingArticle";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getAllWritingSlugs().map((s) => s.params);
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const post = await getWritingPost(slug);
        const title = `${post.title} — Michael`;
        return {
            title,
            description: post.description,
            alternates: {
                canonical: `/writing/${slug}`,
            },
            openGraph: {
                title,
                description: post.description,
                type: "article",
                url: `/writing/${slug}`,
                ...(post.date && { publishedTime: post.date }),
            },
            twitter: {
                card: "summary_large_image",
                title,
                description: post.description,
            },
        };
    } catch {
        return {};
    }
}

export default async function WritingPostPage({ params }: PageProps) {
    const { slug } = await params;

    let post;
    try {
        post = await getWritingPost(slug);
    } catch {
        notFound();
    }

    const neighbors = getWritingNeighbors(slug);

    return (
        <WritingArticle
            title={post.title}
            date={post.date}
            readingTime={post.readingTime}
            content={post.content}
            headings={post.headings}
            prev={neighbors.prev}
            next={neighbors.next}
        />
    );
}
