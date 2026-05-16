import { format } from "date-fns";
import { TransitionLink } from "../../../components/TransitionLink";
import { BackChevron } from "../../../components/icons/Glyphs";
import { WritingBody } from "./WritingBody";
import { WritingTOC } from "./WritingTOC";
import { parseCalendarDate } from "../../../lib/date";
import type { TOCHeading } from "../../../lib/rehypeWritingHeadings";

interface NeighborPost {
    slug: string;
    title: string;
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
                    className="group mb-6 inline-flex items-center gap-1.5 text-caption text-muted transition-colors duration-200 ease-out hover:text-secondary md:hidden"
                >
                    <BackChevron className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
                    Writing
                </TransitionLink>

                <header id="writing-header" className="mb-12">
                    <p className="text-eyebrow uppercase font-medium text-muted">
                        {(() => {
                            const d = parseCalendarDate(date);
                            return d ? (
                                <time dateTime={date}>
                                    {format(d, "MMMM yyyy")}
                                </time>
                            ) : (
                                "Essay"
                            );
                        })()}
                    </p>
                    <h1 className="mt-3 text-h1 font-semibold text-heading text-balance">
                        {title}
                    </h1>
                    <p className="mt-3 text-caption text-muted tabular-nums">
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
                <nav className="mt-24 grid grid-cols-2 gap-6 border-t border-hairline pt-8">
                    {next && (
                        <TransitionLink
                            href={`/writing/${next.slug}`}
                            direction="forward"
                            className="group col-start-1 block py-3 transition-colors duration-200 ease-out"
                        >
                            <p className="text-eyebrow uppercase font-medium text-muted">
                                Newer
                            </p>
                            <p className="mt-1 text-body font-medium text-heading text-balance group-hover:text-accent transition-colors duration-200 ease-out">
                                {next.title}
                            </p>
                        </TransitionLink>
                    )}
                    {prev && (
                        <TransitionLink
                            href={`/writing/${prev.slug}`}
                            direction="forward"
                            className="group col-start-2 block py-3 text-right transition-colors duration-200 ease-out"
                        >
                            <p className="text-eyebrow uppercase font-medium text-muted">
                                Older
                            </p>
                            <p className="mt-1 text-body font-medium text-heading text-balance group-hover:text-accent transition-colors duration-200 ease-out">
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
