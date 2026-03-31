import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import {
    getAllWritingSlugs,
    getWritingPost,
} from "../../../lib/writing";
import { WritingBody } from "./WritingBody";
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
        <main className="mx-auto max-w-2xl px-6 py-16">
            <Link
                href="/writing"
                className="text-sm text-muted hover:underline"
            >
                &larr; Writing
            </Link>

            <header className="mt-8 mb-12">
                <h1 className="text-3xl font-semibold text-balance">
                    {post.title}
                </h1>
                <p className="mt-2 text-sm text-muted">
                    {post.date &&
                        format(new Date(post.date), "MMMM d, yyyy")}
                    {" · "}
                    {post.readingTime} min read
                </p>
            </header>

            <article className="prose prose-neutral max-w-none">
                <WritingBody source={post.mdxSource} />
            </article>
        </main>
    );
}
