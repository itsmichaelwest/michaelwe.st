"use client";

import { useEffect, useRef, useState } from "react";
import { TransitionLink } from "../../../components/TransitionLink";
import type { TOCHeading } from "../../../lib/rehypeWritingHeadings";

interface WritingTOCProps {
    title: string;
    headings: TOCHeading[];
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

export function WritingTOC({ title, headings }: WritingTOCProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showTitle, setShowTitle] = useState(false);
    const idsRef = useRef<string[]>([]);

    useEffect(() => {
        idsRef.current = headings.map((h) => h.id);
    }, [headings]);

    // Track which heading is currently "active" by observing intersections
    // with a band near the top of the viewport. The most recently entered
    // heading wins; if none are intersecting we fall back to the closest
    // heading above the viewport top.
    useEffect(() => {
        if (headings.length === 0) return;

        const ids = headings.map((h) => h.id);
        const elements = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        if (elements.length === 0) return;

        const visible = new Set<string>();

        const update = () => {
            if (visible.size > 0) {
                // Pick the topmost visible heading by document order.
                const ordered = ids.find((id) => visible.has(id));
                if (ordered) setActiveId(ordered);
                return;
            }
            // Nothing in the band — find the last heading whose top is above
            // the viewport top so a section "stays" active while you scroll
            // through its body.
            let last: string | null = null;
            for (const el of elements) {
                if (el.getBoundingClientRect().top <= 120) last = el.id;
                else break;
            }
            setActiveId(last);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) visible.add(entry.target.id);
                    else visible.delete(entry.target.id);
                }
                update();
            },
            { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
        );

        elements.forEach((el) => observer.observe(el));
        update();

        return () => observer.disconnect();
    }, [headings]);

    // Fade in the post title in the sidebar once the article header has
    // scrolled out of view.
    useEffect(() => {
        const header = document.getElementById("writing-header");
        if (!header) return;
        const observer = new IntersectionObserver(
            ([entry]) => setShowTitle(!entry.isIntersecting),
            { rootMargin: "-40px 0px 0px 0px", threshold: 0 },
        );
        observer.observe(header);
        return () => observer.disconnect();
    }, []);

    const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        id: string,
    ) => {
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        const top =
            el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
        history.replaceState(null, "", `#${id}`);
    };

    return (
        <aside
            className="pointer-events-none fixed top-20 left-20 z-30 hidden w-40 min-[1200px]:block"
            aria-label="Table of contents"
        >
            <div className="pointer-events-auto">
                <TransitionLink
                    href="/writing"
                    direction="back"
                    className="group inline-flex items-center gap-1.5 font-mono text-[13px] text-muted transition-colors duration-200 ease-out hover:text-secondary"
                >
                    <BackArrow />
                    Writing
                </TransitionLink>

                {headings.length > 0 && (
                    <nav className="mt-8">
                        <p
                            className="mb-4 font-mono text-[13px] leading-tight text-muted transition-opacity duration-300 ease-out"
                            style={{ opacity: showTitle ? 1 : 0 }}
                            aria-hidden={!showTitle}
                        >
                            {title}
                        </p>
                        <ul className="flex flex-col gap-2">
                            {headings.map((h) => {
                                const isActive = h.id === activeId;
                                return (
                                    <li
                                        key={h.id}
                                        style={{
                                            paddingLeft:
                                                h.level >= 3 ? "0.75rem" : 0,
                                        }}
                                    >
                                        <a
                                            href={`#${h.id}`}
                                            onClick={(e) =>
                                                handleClick(e, h.id)
                                            }
                                            className={`block font-mono text-[13px] leading-tight tracking-tight transition-colors duration-150 ease-out hover:text-secondary ${
                                                isActive
                                                    ? "text-heading"
                                                    : "text-muted"
                                            }`}
                                        >
                                            {h.text}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                )}
            </div>
        </aside>
    );
}
