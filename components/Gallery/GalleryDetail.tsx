"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { MDXClient } from "next-mdx-remote-client";
import { components } from "../MDXComponents";
import NoMSFTDisclaimer from "../NoMSFTDisclaimer";
import Footer from "../Footer";
import type { ItemData } from "./types";
import { GALLERY_H } from "./constants";
import { itemFullW, itemGalleryScale } from "./utils";

export function GalleryDetail({
    items,
    current,
    vw,
    vh,
    scrollRef,
}: {
    items: ItemData[];
    current: number;
    vw: number;
    vh: number;
    scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
    const item = items[current];
    const reducedMotion = useReducedMotion();

    const isMobile = vw < 768;

    // Image dimensions matching GalleryItem's fullscreen position
    const naturalW = itemFullW(items, current, vh);
    const galScale = itemGalleryScale(items, current, vw, vh);
    const imageWidth = isMobile ? vw - 40 : naturalW * galScale;
    const imageHeight = GALLERY_H * vh * galScale;
    // Center vertically on desktop, anchor to top on mobile
    const imageMarginTop = isMobile ? 80 : (vh - imageHeight) / 2;

    // Scroll to top on mount and page change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [current]);

    return (
        <div ref={scrollRef} className="min-h-screen bg-white overflow-x-hidden">
            {/* Hero image */}
            <div
                className="relative mx-auto rounded-2xl ring ring-black/10 select-none overflow-hidden"
                style={{
                    width: imageWidth,
                    height: imageHeight,
                    marginTop: imageMarginTop,
                    background: !item.img
                        ? (item.color ?? undefined)
                        : undefined,
                }}
            >
                {item.img ? (
                    <Image
                        src={item.img}
                        alt={item.imgAlt ?? ""}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                        className="object-cover pointer-events-none"
                    />
                ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-8xl text-white pointer-events-none">
                        {item.label}
                    </span>
                )}
            </div>

            {/* Content */}
            <motion.div
                className="max-w-[80ch] mx-auto px-6 pt-16 pb-8 space-y-6"
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
            >
                <div className="space-y-2">
                    {item.year && (
                        <p className="text-sm text-muted">{item.year}</p>
                    )}
                    <h2 className="font-bold text-2xl text-balance">
                        {item.title}
                    </h2>
                    <p className="text-muted text-pretty">{item.subtitle}</p>
                    {item.officialURL && (
                        <a
                            href={item.officialURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 text-sm font-medium rounded-full bg-[#EEE]/80 no-underline text-[#333] hover:bg-[#DDD] transition-colors"
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
                    )}
                </div>
                {item.noMSFT && <NoMSFTDisclaimer title={item.title} />}
                {item.mdxSource && !("error" in item.mdxSource) && (
                    <MDXClient {...item.mdxSource} components={components} />
                )}
                <Footer />
            </motion.div>
        </div>
    );
}
