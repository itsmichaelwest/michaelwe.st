"use client";

import { useState } from "react";
import { format } from "date-fns";
import { TransitionLink } from "../../components/TransitionLink";
import type { IWritingPost } from "../../lib/writing";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const DURATION = 280;

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

function HomeBackLinkFixed() {
    const [hovered, setHovered] = useState(false);
    return (
        <aside
            className="fixed top-16 left-6 z-30 hidden md:block"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <TransitionLink
                href="/"
                direction="fade"
                className="inline-flex h-9 items-center font-mono text-[13px] text-muted transition-colors duration-200 ease-out hover:text-secondary"
            >
                <BackArrow />
                <span
                    className="overflow-hidden whitespace-nowrap"
                    style={{
                        maxWidth: hovered ? 80 : 0,
                        marginLeft: hovered ? 6 : 0,
                        opacity: hovered ? 1 : 0,
                        transition: `max-width ${DURATION}ms ${EASE}, margin-left ${DURATION}ms ${EASE}, opacity ${DURATION}ms ${EASE}`,
                    }}
                >
                    Home
                </span>
            </TransitionLink>
        </aside>
    );
}

export function WritingList({ posts }: { posts: IWritingPost[] }) {
    const groups = groupByYear(posts);

    return (
        <>
            <HomeBackLinkFixed />
            <main className="mx-auto max-w-[80ch] px-6 py-16 md:max-w-[64ch]">
                <TransitionLink
                    href="/"
                    direction="fade"
                    className="group mb-6 inline-flex items-center gap-1.5 font-mono text-sm text-muted transition-colors duration-200 ease-out hover:text-secondary md:hidden"
                >
                    <span className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5">
                        <BackArrow />
                    </span>
                    Home
                </TransitionLink>

                <h1 className="text-3xl font-semibold tracking-tight text-heading">
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
                                            className="group block -mx-3 rounded-lg px-3 py-4 transition-[background-color,transform] duration-200 ease-out hover:bg-gray-50 dark:hover:bg-gray-800/60 active:scale-[0.99] active:bg-gray-100 dark:active:bg-gray-700/60"
                                        >
                                            <h3 className="font-medium text-heading text-balance">
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
        </>
    );
}
