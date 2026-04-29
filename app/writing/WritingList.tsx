"use client";

import Link from "next/link";
import { format } from "date-fns";
import { TransitionLink } from "../../components/TransitionLink";
import type { IWritingPost } from "../../lib/writing";

interface YearGroup {
    year: number;
    posts: IWritingPost[];
}

function groupByYear(posts: IWritingPost[]): YearGroup[] {
    const groups = new Map<number, IWritingPost[]>();
    for (const post of posts) {
        const year = post.date
            ? new Date(post.date).getFullYear()
            : new Date().getFullYear();
        if (!groups.has(year)) groups.set(year, []);
        groups.get(year)!.push(post);
    }
    return Array.from(groups.entries())
        .map(([year, posts]) => ({ year, posts }))
        .sort((a, b) => b.year - a.year);
}

function BackArrow() {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
        >
            <path
                d="M7.5 2.5L4 6L7.5 9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function WritingList({ posts }: { posts: IWritingPost[] }) {
    const groups = groupByYear(posts);

    return (
        <main className="mx-auto max-w-[80ch] px-6 py-16">
            <Link
                href="/"
                className="group inline-flex items-center gap-1.5 font-mono text-sm text-muted transition-colors duration-200 ease-out hover:text-secondary active:scale-[0.97]"
            >
                <BackArrow />
                Home
            </Link>

            <h1 className="mt-4 font-mono text-3xl font-semibold tracking-tight text-heading">
                Writing
            </h1>

            {posts.length === 0 ? (
                <p className="mt-8 text-muted">Nothing here yet.</p>
            ) : (
                <div className="mt-12 space-y-12">
                    {groups.map((group) => (
                        <section
                            key={group.year}
                            className="grid grid-cols-[auto_1fr] gap-x-8 sm:gap-x-12"
                        >
                            <h2 className="pt-4 font-mono text-sm text-muted tabular-nums">
                                {group.year}
                            </h2>
                            <ul>
                                {group.posts.map((post) => (
                                    <li key={post.slug}>
                                        <TransitionLink
                                            href={`/writing/${post.slug}`}
                                            direction="forward"
                                            className="group block -mx-3 rounded-lg px-3 py-4 transition-[background-color,transform] duration-200 ease-out hover:bg-gray-50 active:scale-[0.99] active:bg-gray-100"
                                        >
                                            <h3 className="font-mono font-medium text-heading text-balance">
                                                {post.title}
                                            </h3>
                                            {post.description && (
                                                <p className="mt-1 text-sm text-secondary line-clamp-2">
                                                    {post.description}
                                                </p>
                                            )}
                                            <p className="mt-1 font-mono text-sm text-muted tabular-nums">
                                                {post.date && (
                                                    <time dateTime={post.date}>
                                                        {format(
                                                            new Date(post.date),
                                                            "MMM d",
                                                        )}
                                                    </time>
                                                )}
                                                {" · "}
                                                {post.readingTime} min read
                                            </p>
                                        </TransitionLink>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            )}
        </main>
    );
}
