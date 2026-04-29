"use client";

import { format } from "date-fns";
import { TransitionLink } from "../../../components/TransitionLink";
import { WritingBody } from "./WritingBody";
import type { SerializeResult } from "next-mdx-remote-client/serialize";

interface NeighborPost {
    slug: string;
    title: string;
}

interface WritingArticleProps {
    title: string;
    date: string;
    readingTime: number;
    mdxSource: SerializeResult;
    prev?: NeighborPost;
    next?: NeighborPost;
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

export function WritingArticle({
    title,
    date,
    readingTime,
    mdxSource,
    prev,
    next,
}: WritingArticleProps) {
    return (
        <main className="mx-auto max-w-[80ch] px-6 py-16">
            <TransitionLink
                href="/writing"
                direction="back"
                className="group inline-flex items-center gap-1.5 font-mono text-sm text-muted transition-colors duration-200 ease-out hover:text-secondary active:scale-[0.97]"
            >
                <BackArrow />
                Writing
            </TransitionLink>

            <header className="mt-8 mb-12">
                <h1 className="font-mono text-3xl font-semibold tracking-tight text-heading text-balance">
                    {title}
                </h1>
                <p className="mt-3 font-mono text-sm text-muted tabular-nums">
                    {date && (
                        <time dateTime={date}>
                            {format(new Date(date), "MMM d, yyyy")}
                        </time>
                    )}
                    {" · "}
                    {readingTime} min read
                </p>
            </header>

            <article className="mt-12">
                <WritingBody source={mdxSource} />
            </article>

            {(prev || next) && (
                <nav className="mt-24 grid grid-cols-2 gap-6 border-t border-gray-100 pt-8">
                    {next && (
                        <TransitionLink
                            href={`/writing/${next.slug}`}
                            direction="forward"
                            className="group col-start-1 -mx-3 block rounded-lg px-3 py-3 transition-[background-color,transform] duration-200 ease-out hover:bg-gray-50 active:scale-[0.99] active:bg-gray-100"
                        >
                            <p className="font-mono text-xs text-muted">
                                Newer
                            </p>
                            <p className="mt-1 font-mono text-sm font-medium text-heading text-balance">
                                {next.title}
                            </p>
                        </TransitionLink>
                    )}
                    {prev && (
                        <TransitionLink
                            href={`/writing/${prev.slug}`}
                            direction="forward"
                            className="group col-start-2 -mx-3 block rounded-lg px-3 py-3 text-right transition-[background-color,transform] duration-200 ease-out hover:bg-gray-50 active:scale-[0.99] active:bg-gray-100"
                        >
                            <p className="font-mono text-xs text-muted">
                                Older
                            </p>
                            <p className="mt-1 font-mono text-sm font-medium text-heading text-balance">
                                {prev.title}
                            </p>
                        </TransitionLink>
                    )}
                </nav>
            )}
        </main>
    );
}
