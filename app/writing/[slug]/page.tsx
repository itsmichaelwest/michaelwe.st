import { notFound } from "next/navigation";
import {
    getAllWritingSlugs,
    getWritingPost,
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
        return {
            title: `${post.title} — Michael`,
            description: post.description,
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

    return (
        <WritingArticle
            title={post.title}
            date={post.date}
            readingTime={post.readingTime}
            mdxSource={post.mdxSource}
        />
    );
}
