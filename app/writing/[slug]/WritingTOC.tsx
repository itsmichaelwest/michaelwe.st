"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { TransitionLink } from "../../../components/TransitionLink";
import type { TOCHeading } from "../../../lib/rehypeWritingHeadings";

interface WritingTOCProps {
    title: string;
    headings: TOCHeading[];
}

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const DURATION = 280;

type Mode = "wide" | "mid" | "below";

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

function tickWidth(level: number, isActive: boolean): number {
    if (isActive) return 22;
    if (level >= 3) return 8;
    return 14;
}

export function WritingTOC({ title, headings }: WritingTOCProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [pastHeader, setPastHeader] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [mode, setMode] = useState<Mode>("wide");
    const reducedMotion = useReducedMotion();
    const animDuration = reducedMotion ? 0 : DURATION;
    const transitionTriple = (delay = 0) =>
        `max-width ${animDuration}ms ${EASE} ${delay}ms, margin-left ${animDuration}ms ${EASE} ${delay}ms, opacity ${animDuration}ms ${EASE} ${delay}ms`;

    // Detect viewport mode. Wide >= 1280 keeps labels always visible.
    // Mid 768–1280 shows the collapsed minimap and expands on hover.
    // Below 768 the sidebar is hidden entirely (handled via CSS) and the
    // article renders an inline back link instead.
    useEffect(() => {
        const wide = window.matchMedia("(min-width: 1280px)");
        const mid = window.matchMedia("(min-width: 768px)");
        const update = () =>
            setMode(wide.matches ? "wide" : mid.matches ? "mid" : "below");
        update();
        wide.addEventListener("change", update);
        mid.addEventListener("change", update);
        return () => {
            wide.removeEventListener("change", update);
            mid.removeEventListener("change", update);
        };
    }, []);

    // Active section tracking via IntersectionObserver. Picks the lowest
    // heading currently inside the active band so a later section overtakes
    // an earlier one as soon as it enters; falls back to the closest heading
    // above the band when nothing is in view.
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
                let chosen: string | null = null;
                for (const id of ids) if (visible.has(id)) chosen = id;
                if (chosen) setActiveId(chosen);
                return;
            }
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

    // Reveal the post title in the sidebar once the article header has
    // scrolled out of view.
    useEffect(() => {
        const header = document.getElementById("writing-header");
        if (!header) return;
        const observer = new IntersectionObserver(
            ([entry]) => setPastHeader(!entry.isIntersecting),
            { rootMargin: "-40px 0px 0px 0px", threshold: 0 },
        );
        observer.observe(header);
        return () => observer.disconnect();
    }, []);

    const open = mode === "wide" || (mode === "mid" && hovered);
    const showFade = mode === "mid" && open;
    const showTitle = pastHeader && open;
    const showNav = mode !== "below" && headings.length > 0;

    const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        id: string,
    ) => {
        // Let the browser handle modifier clicks (open in new tab/window).
        if (
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey ||
            e.button !== 0
        ) {
            return;
        }
        e.preventDefault();
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
            top,
            behavior: reducedMotion ? "auto" : "smooth",
        });
        history.replaceState(null, "", `#${id}`);
        // Move keyboard focus to the heading so subsequent Tabs land in the
        // article body, not back inside the TOC.
        const previousTabIndex = el.getAttribute("tabindex");
        el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
        if (previousTabIndex === null) {
            // Clean up so the heading isn't permanently focusable.
            const cleanup = () => el.removeAttribute("tabindex");
            el.addEventListener("blur", cleanup, { once: true });
        }
    };

    return (
        <>
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-y-0 left-0 z-20 hidden md:block"
                style={{
                    width: 360,
                    background: "rgb(var(--backdrop-rgb))",
                    WebkitMaskImage:
                        "linear-gradient(to right, black 0%, black 65%, transparent 100%)",
                    maskImage:
                        "linear-gradient(to right, black 0%, black 65%, transparent 100%)",
                    opacity: showFade ? 1 : 0,
                    transition: `opacity ${animDuration}ms ${EASE}`,
                }}
            />
            <aside
                onMouseEnter={() => mode === "mid" && setHovered(true)}
                onMouseLeave={() => mode === "mid" && setHovered(false)}
                onFocusCapture={() =>
                    mode === "mid" && setHovered(true)
                }
                onBlurCapture={(e) => {
                    if (
                        mode === "mid" &&
                        !e.currentTarget.contains(
                            e.relatedTarget as Node | null,
                        )
                    ) {
                        setHovered(false);
                    }
                }}
                className="fixed top-16 left-6 z-30 hidden flex-col items-start md:flex"
            >
                <TransitionLink
                    href="/writing"
                    direction="back"
                    className="inline-flex h-9 items-center font-mono text-[13px] text-muted transition-colors duration-200 ease-out hover:text-secondary"
                >
                    <BackArrow />
                    <span
                        className="overflow-hidden whitespace-nowrap"
                        style={{
                            maxWidth: open ? 80 : 0,
                            marginLeft: open ? 6 : 0,
                            opacity: open ? 1 : 0,
                            transition: transitionTriple(),
                        }}
                    >
                        Writing
                    </span>
                </TransitionLink>

                {showNav && (
                    <nav className="mt-7" aria-label="Table of contents">
                        <p
                            className="font-mono text-[13px] leading-tight text-muted whitespace-nowrap overflow-hidden"
                            style={{
                                opacity: showTitle ? 1 : 0,
                                maxHeight: pastHeader ? 32 : 0,
                                marginBottom: pastHeader ? 14 : 0,
                                transition: `opacity ${animDuration}ms ${EASE}, max-height ${animDuration}ms ${EASE}, margin-bottom ${animDuration}ms ${EASE}`,
                                pointerEvents: showTitle ? "auto" : "none",
                            }}
                            aria-hidden={!showTitle}
                        >
                            {title}
                        </p>

                        <ul className="flex flex-col">
                            {headings.map((h, i) => {
                                const isActive = h.id === activeId;
                                const delay = open ? i * 18 : 0;
                                return (
                                    <li key={h.id}>
                                        <a
                                            href={`#${h.id}`}
                                            onClick={(e) =>
                                                handleClick(e, h.id)
                                            }
                                            aria-current={
                                                isActive
                                                    ? "location"
                                                    : undefined
                                            }
                                            className={`flex items-center py-[5px] ${
                                                isActive
                                                    ? "text-heading"
                                                    : "text-muted"
                                            }`}
                                            style={{
                                                paddingLeft:
                                                    h.level >= 3 ? 8 : 0,
                                                transition: `color 200ms ease-out`,
                                            }}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="block shrink-0 rounded-full bg-current"
                                                style={{
                                                    width: tickWidth(
                                                        h.level,
                                                        isActive,
                                                    ),
                                                    height: 1.5,
                                                    opacity: isActive
                                                        ? 1
                                                        : 0.55,
                                                    transition: `width ${animDuration}ms ${EASE}, opacity ${animDuration}ms ${EASE}`,
                                                }}
                                            />
                                            <span
                                                className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[13px] leading-tight tracking-tight"
                                                style={{
                                                    maxWidth: open ? 220 : 0,
                                                    marginLeft: open ? 12 : 0,
                                                    opacity: open ? 1 : 0,
                                                    transition:
                                                        transitionTriple(
                                                            delay,
                                                        ),
                                                }}
                                            >
                                                {h.text}
                                            </span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                )}
            </aside>
        </>
    );
}
