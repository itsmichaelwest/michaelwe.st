"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { motion, useReducedMotion, type MotionValue } from "motion/react";
import Image from "next/image";
import { MDXClient } from "next-mdx-remote-client";
import { components } from "../MDXComponents";
import NoMSFTDisclaimer from "../NoMSFTDisclaimer";
import Footer from "../Footer";
import type { ItemData } from "./types";

const STAGGER_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

function ContentStagger({
    reducedMotion,
    index,
    children,
}: {
    reducedMotion: boolean;
    index: number;
    children: ReactNode;
}) {
    if (reducedMotion) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                {children}
            </motion.div>
        );
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.35,
                ease: STAGGER_EASE,
                delay: 0.05 + index * 0.08,
            }}
        >
            {children}
        </motion.div>
    );
}

export function GalleryDetail({
    items,
    current,
    scrollRef,
}: {
    items: ItemData[];
    current: number;
    open: boolean;
    vw: number;
    vh: number;
    openSpring: MotionValue<number>;
    closeGallery: () => void;
    scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
    const item = items[current];
    const reducedMotion = useReducedMotion();
    const aspect = item.aspect;

    // Scroll to top on mount and page change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [current]);

    // Memoize the MDXClient element so it's not rebuilt on every parent
    // re-render. MDXClient calls runSync() each render, which returns a
    // brand-new Content component reference — without memoization, any
    // re-render of GalleryDetail (resize, state churn) unmounts and remounts
    // the entire MDX subtree, restarting MDXImage's blur-up transition and
    // visually flashing every image.
    const mdxContent = useMemo(() => {
        if (!item.mdxSource || "error" in item.mdxSource) return null;
        return <MDXClient {...item.mdxSource} components={components} />;
    }, [item.mdxSource]);

    return (
        <div
            ref={scrollRef}
            className="min-h-screen bg-white dark:bg-[#0a0a0a] overflow-x-clip"
            style={{ "--aspect": String(aspect) } as React.CSSProperties}
        >
            {/* Hero image — top-anchored on mobile (80px), vertically
                centered in the first viewport on md+ via a CSS-only
                margin-top. Sized purely in CSS so the box reserves its
                exact footprint before the image loads or useWindowSize
                resolves. The wrapper takes (vh + heroH) / 2 of vertical
                space, leaving the bottom of the first viewport showing a
                peek of the article header below. */}
            <div
                className="relative mx-auto mt-20 rounded-2xl ring ring-black/10 dark:ring-white/10 select-none overflow-hidden w-[calc(100vw-40px)] md:mt-[var(--hero-mt)] md:w-[min(calc(60vh*var(--aspect)),calc(100vw-64px))]"
                style={
                    {
                        "--hero-mt":
                            "max(0px, calc((100vh - min(60vh, calc((100vw - 64px) / var(--aspect)))) / 2))",
                        aspectRatio: String(aspect),
                        background: !item.img
                            ? (item.color ?? undefined)
                            : undefined,
                    } as React.CSSProperties
                }
            >
                {item.img ? (
                    <Image
                        src={item.img}
                        alt={item.imgAlt ?? ""}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                        priority
                        className="object-cover pointer-events-none"
                    />
                ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-8xl text-white pointer-events-none">
                        {item.label}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="max-w-[80ch] mx-auto px-6 pt-16 pb-8 space-y-6">
                <ContentStagger reducedMotion={!!reducedMotion} index={0}>
                    <div className="space-y-2">
                        {item.year && (
                            <p className="font-mono text-sm text-muted tabular-nums">
                                {item.year}
                            </p>
                        )}
                        <h2 className="font-semibold tracking-tight text-2xl text-balance">
                            {item.title}
                        </h2>
                        <p className="text-muted text-pretty">{item.subtitle}</p>
                    </div>
                </ContentStagger>
                {item.officialURL && (
                    <ContentStagger reducedMotion={!!reducedMotion} index={1}>
                        <a
                            href={item.officialURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-sm font-medium rounded-full bg-gray-100/80 dark:bg-gray-800 no-underline text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-[0.97] transition-[background-color,transform] duration-200 ease-out"
                        >
                            {item.officialURLText ?? "View project"}
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                            >
                                <path
                                    d="M3.5 2.5H9.5V8.5M9.5 2.5L2.5 9.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </a>
                    </ContentStagger>
                )}
                {item.noMSFT && (
                    <ContentStagger reducedMotion={!!reducedMotion} index={2}>
                        <NoMSFTDisclaimer title={item.title} />
                    </ContentStagger>
                )}
                <ContentStagger
                    reducedMotion={!!reducedMotion}
                    index={item.noMSFT ? 3 : 2}
                >
                    {mdxContent}
                </ContentStagger>
                <Footer />
            </div>
        </div>
    );
}
