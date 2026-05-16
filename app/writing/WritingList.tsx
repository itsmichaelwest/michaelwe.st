"use client";

import { useState } from "react";
import { format } from "date-fns";
import { TransitionLink } from "../../components/TransitionLink";
import { BackChevron } from "../../components/icons/Glyphs";
import { parseCalendarDate } from "../../lib/date";
import type { IWritingPost } from "../../lib/writing";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const DURATION = 280;

interface YearGroup {
    year: number | "undated";
    posts: IWritingPost[];
}

function groupByYear(posts: IWritingPost[]): YearGroup[] {
    const groups = new Map<number | "undated", IWritingPost[]>();
    for (const post of posts) {
        const parsed = parseCalendarDate(post.date);
        const key: number | "undated" = parsed
            ? parsed.getFullYear()
            : "undated";
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(post);
    }
    return Array.from(groups.entries())
        .map(([year, posts]) => ({ year, posts }))
        .sort((a, b) => {
            if (a.year === "undated") return 1;
            if (b.year === "undated") return -1;
            return b.year - a.year;
        });
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
                className="inline-flex h-10 items-center text-caption text-muted transition-colors duration-200 ease-out hover:text-secondary"
            >
                <BackChevron />
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
                    className="group mb-6 inline-flex items-center gap-1.5 text-caption text-muted transition-colors duration-200 ease-out hover:text-secondary md:hidden"
                >
                    <span className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5">
                        <BackChevron />
                    </span>
                    Home
                </TransitionLink>

                <p className="text-eyebrow uppercase font-medium text-muted">
                    Index
                </p>
                <h1 className="mt-3 text-h1 font-semibold text-heading">
                    Writing
                </h1>

            {posts.length === 0 ? (
                <p className="mt-8 text-body text-muted">Nothing here yet.</p>
            ) : (
                <div className="mt-12 space-y-12">
                    {groups.map((group) => (
                        <section
                            key={group.year}
                            className="grid grid-cols-[auto_1fr] gap-x-8 sm:gap-x-12"
                        >
                            <h2 className="pt-5 text-eyebrow uppercase font-medium text-muted tabular-nums">
                                {group.year === "undated"
                                    ? "Undated"
                                    : group.year}
                            </h2>
                            <ul>
                                {group.posts.map((post) => (
                                    <li key={post.slug}>
                                        <TransitionLink
                                            href={`/writing/${post.slug}`}
                                            direction="forward"
                                            className="group block border-b border-hairline py-5 transition-colors duration-200 ease-out"
                                        >
                                            <h3 className="text-lead font-medium text-heading text-balance transition-colors duration-200 ease-out group-hover:text-accent">
                                                {post.title}
                                            </h3>
                                            {post.description && (
                                                <p className="mt-1 text-body text-secondary line-clamp-2">
                                                    {post.description}
                                                </p>
                                            )}
                                            <p className="mt-2 text-caption text-muted tabular-nums">
                                                {(() => {
                                                    const d =
                                                        parseCalendarDate(
                                                            post.date,
                                                        );
                                                    return d ? (
                                                        <>
                                                            <time
                                                                dateTime={
                                                                    post.date
                                                                }
                                                            >
                                                                {format(
                                                                    d,
                                                                    "MMM d",
                                                                )}
                                                            </time>
                                                            {" · "}
                                                        </>
                                                    ) : null;
                                                })()}
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
