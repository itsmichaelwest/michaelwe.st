import { format } from "date-fns";
import { TransitionLink } from "../../../components/TransitionLink";
import { WritingBody } from "./WritingBody";
import { WritingTOC } from "./WritingTOC";
import { parseCalendarDate } from "../../../lib/date";
import type { TOCHeading } from "../../../lib/rehypeWritingHeadings";

interface NeighborPost {
    slug: string;
    title: string;
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

interface WritingArticleProps {
    title: string;
    date: string;
    readingTime: number;
    content: string;
    headings: TOCHeading[];
    prev?: NeighborPost;
    next?: NeighborPost;
}

export function WritingArticle({
    title,
    date,
    readingTime,
    content,
    headings,
    prev,
    next,
}: WritingArticleProps) {
    return (
        <>
            <WritingTOC title={title} headings={headings} />
            <main className="mx-auto max-w-[80ch] px-6 py-16 md:max-w-[64ch]">
                <TransitionLink
                    href="/writing"
                    direction="back"
                    className="group mb-6 inline-flex items-center gap-1.5 font-mono text-sm text-muted transition-colors duration-200 ease-out hover:text-secondary md:hidden"
                >
                    <BackArrow />
                    Writing
                </TransitionLink>

                <header id="writing-header" className="mb-12">
                    <h1 className="text-3xl font-semibold tracking-tight text-heading text-balance">
                        {title}
                    </h1>
                    <p className="mt-3 font-mono text-sm text-muted tabular-nums">
                        {(() => {
                            const d = parseCalendarDate(date);
                            return d ? (
                                <>
                                    <time dateTime={date}>
                                        {format(d, "MMM d, yyyy")}
                                    </time>
                                    {" · "}
                                </>
                            ) : null;
                        })()}
                        {readingTime} min read
                    </p>
                </header>

            <article className="mt-12">
                <WritingBody source={content} />
            </article>

            {(prev || next) && (
                <nav className="mt-24 grid grid-cols-2 gap-6 border-t border-gray-100 dark:border-gray-800 pt-8">
                    {next && (
                        <TransitionLink
                            href={`/writing/${next.slug}`}
                            direction="forward"
                            className="group col-start-1 -mx-3 block rounded-lg px-3 py-3 transition-[background-color,transform] duration-200 ease-out hover:bg-gray-50 dark:hover:bg-gray-800/60 active:scale-[0.99] active:bg-gray-100 dark:active:bg-gray-700/60"
                        >
                            <p className="font-mono text-xs text-muted">
                                Newer
                            </p>
                            <p className="mt-1 text-sm font-medium text-heading text-balance">
                                {next.title}
                            </p>
                        </TransitionLink>
                    )}
                    {prev && (
                        <TransitionLink
                            href={`/writing/${prev.slug}`}
                            direction="forward"
                            className="group col-start-2 -mx-3 block rounded-lg px-3 py-3 text-right transition-[background-color,transform] duration-200 ease-out hover:bg-gray-50 dark:hover:bg-gray-800/60 active:scale-[0.99] active:bg-gray-100 dark:active:bg-gray-700/60"
                        >
                            <p className="font-mono text-xs text-muted">
                                Older
                            </p>
                            <p className="mt-1 text-sm font-medium text-heading text-balance">
                                {prev.title}
                            </p>
                        </TransitionLink>
                    )}
                </nav>
            )}
            </main>
        </>
    );
}
