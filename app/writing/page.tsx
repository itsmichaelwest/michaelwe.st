import Link from "next/link";
import { format } from "date-fns";
import { getSortedWritingData } from "../../lib/writing";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Writing — Michael",
    description: "Thoughts on design, engineering, and the things I'm building.",
};

export default function WritingPage() {
    const posts = getSortedWritingData();

    return (
        <main className="mx-auto max-w-2xl px-6 py-16">
            <header className="mb-12">
                <Link
                    href="/"
                    className="text-sm text-muted hover:underline"
                >
                    &larr; Home
                </Link>
                <h1 className="mt-4 text-3xl font-semibold">Writing</h1>
            </header>

            {posts.length === 0 ? (
                <p className="text-muted">Nothing here yet.</p>
            ) : (
                <ul className="space-y-6">
                    {posts.map((post) => (
                        <li key={post.slug}>
                            <Link
                                href={`/writing/${post.slug}`}
                                className="group block"
                            >
                                <h2 className="font-medium group-hover:underline">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-muted">
                                    {post.date &&
                                        format(
                                            new Date(post.date),
                                            "MMMM d, yyyy",
                                        )}
                                    {" · "}
                                    {post.readingTime} min read
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
