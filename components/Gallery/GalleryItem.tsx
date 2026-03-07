"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    motion,
    useMotionValue,
    useTransform,
    animate,
    type MotionValue,
} from "motion/react";
import Image from "next/image";
import { createPortal } from "react-dom";
import clsx from "clsx";
import type { SerializeResult } from "next-mdx-remote-client/serialize";
import { MDXClient } from "next-mdx-remote-client";
import { components } from "../MDXComponents";
import NoMSFTDisclaimer from "../NoMSFTDisclaimer";
import Footer from "../Footer";
import type { ItemData } from "./types";
import {
    GALLERY_H,
    MAIN_SPRING,
    PAGE_SPRING,
    GALLERY_PAGE_THRESHOLD,
    GALLERY_DISMISS_VELOCITY,
    RUBBER_BAND_K,
} from "./constants";
import {
    itemFullW,
    itemGalleryScale,
    itemRailScale,
    railLeftOf,
} from "./utils";


export function GalleryItem({
    index,
    items,
    itemCount,
    current,
    color,
    label,
    title,
    subtitle,
    img,
    imgAlt,
    noMSFT,
    officialURL,
    officialURLText,
    year,
    mdxSource,
    open,
    vw,
    vh,
    openSpring,
    railScroll,
    galleryPageX,
    galleryDragX,
    galleryDragY,
    closeGallery,
    goToPage,
    openProgressRaw,
    dragOnImageRef,
    containerRectRef,
}: {
    index: number;
    items: ItemData[];
    itemCount: number;
    current: number;
    color?: string;
    label?: string;
    title: string;
    subtitle: string;
    img?: string;
    imgAlt?: string;
    noMSFT?: boolean;
    officialURL?: string;
    officialURLText?: string;
    year?: string;
    paras?: number;
    mdxSource?: SerializeResult;
    open: boolean;
    vw: number;
    vh: number;
    openSpring: MotionValue<number>;
    railScroll: MotionValue<number>;
    galleryPageX: MotionValue<number>;
    galleryDragX: MotionValue<number>;
    galleryDragY: MotionValue<number>;
    closeGallery: () => void;
    goToPage: (i: number) => void;
    openProgressRaw: MotionValue<number>;
    dragOnImageRef: React.MutableRefObject<boolean>;
    containerRectRef: React.RefObject<{
        left: number;
        bottom: number;
        height: number;
    }>;
}) {
    const cH = containerRectRef.current.height;
    const naturalW = itemFullW(items, index, vh);
    const galScale = itemGalleryScale(items, index, vw, vh);
    const sRail = itemRailScale(items, index, cH, vh);
    const originOff = (naturalW * (1 - sRail)) / 2;
    const myRailLeft = railLeftOf(items, index, cH);
    const isActive = open && index === current;
    const isNearby = !open || Math.abs(index - current) <= 1;

    const localScrollY = useMotionValue(0);
    useEffect(() => {
        if (!isActive) localScrollY.jump(0);
    }, [isActive, localScrollY]);

    const transformInputs = [
        openSpring,
        railScroll,
        galleryPageX,
        galleryDragX,
        galleryDragY,
        localScrollY,
    ];
    const transformStr = useTransform(
        transformInputs as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        ([progress, rail, galPageX, galDragX, galDragY, sY]: number[]) => {
            if (progress > 0.5) {
                const approxCenter = galPageX + galDragX + index * vw;
                if (Math.abs(approxCenter) > vw * 1.5) {
                    return `translate3d(${approxCenter}px, 0px, 0px) scale(${galScale})`;
                }
            }

            const rect = containerRectRef.current;
            const railX = myRailLeft - originOff + rail;
            const galX =
                index * vw +
                (vw - naturalW) / 2 -
                rect.left +
                galPageX +
                galDragX;

            const x = railX + progress * (galX - railX);
            const scale = sRail + progress * (galScale - sRail);
            const visualH = GALLERY_H * vh * scale;
            const nudge = rect.bottom - (vh + visualH) / 2;
            const y = galDragY * progress - sY * progress - progress * nudge;
            return `translate3d(${x}px, ${y}px, 0px) scale(${scale})`;
        },
    );

    // Portal text opacity: fades smoothly with spring on normal close,
    // fades fast with rawProgress² during dismiss drag to avoid z-order conflict
    const portalTextOpacity = useTransform(
        [galleryPageX, galleryDragX, openSpring, openProgressRaw, galleryDragY] as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        ([pageX, dragX, springProgress, rawProgress, dragY]: number[]) => {
            const dist = Math.abs(pageX + dragX + index * vw);
            const proximity = Math.max(0, 1 - dist / (vw * 0.5));
            if (dragY > 0) {
                // Dismiss drag: fade fast with rawProgress² so text clears
                // before the image moves down over it
                return proximity * springProgress * rawProgress * rawProgress;
            }
            // Normal open/close: smooth spring-animated fade
            return proximity * springProgress;
        },
    );

    // Portal text scale: scales in concert with the image during open/close
    const portalTextScale = useTransform(openSpring, (progress) => {
        const currentScale = sRail + progress * (galScale - sRail);
        return currentScale / galScale;
    });

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const scrollbarIdleRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const imageBottom = (vh + GALLERY_H * vh * galScale) / 2;

    // Touch gesture on image for mobile swipe/dismiss
    const imageElRef = useRef<HTMLDivElement>(null);
    const imageSwipeRef = useRef<{
        startX: number;
        startY: number;
        axis: "x" | "y" | null;
        lastX: number;
        lastT: number;
        vx: number;
    } | null>(null);

    const textWrapperRef = useRef<HTMLDivElement>(null);

    const [showPortal, setShowPortal] = useState(false);
    useEffect(() => {
        if (isActive) {
            setShowPortal(true);
            return;
        }
        // Delay unmount to allow close/page-change animation to complete
        const timer = setTimeout(() => setShowPortal(false), 500);
        return () => clearTimeout(timer);
    }, [isActive]);

    // Desktop wheel: native scroll on text, overscroll-to-dismiss, horizontal page nav
    useEffect(() => {
        if (!showPortal) return;
        const portalEl = scrollContainerRef.current;
        if (!portalEl) return;

        let accum = 0;
        let inOverscroll = false;
        let closing = false;
        let idleTimer: ReturnType<typeof setTimeout> | null = null;

        // Horizontal navigation state
        let hAccum = 0;
        let hActive = false;
        let hNavigated = false;
        let hIdleTimer: ReturnType<typeof setTimeout> | null = null;

        const resetIdle = () => {
            if (idleTimer) clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                if (!inOverscroll || closing) return;
                inOverscroll = false;
                accum = 0;
                openProgressRaw.set(1);
                animate(galleryDragY, 0, {
                    type: "spring",
                    ...MAIN_SPRING,
                });
            }, 150);
        };

        const onWheel = (e: WheelEvent) => {
            if (closing) return;

            const isOnText =
                textWrapperRef.current?.contains(e.target as Node) ?? false;

            // --- Overscroll-to-dismiss (any cursor position) ---
            if (inOverscroll) {
                e.preventDefault();
                if (e.deltaY > 2) {
                    inOverscroll = false;
                    accum = 0;
                    openProgressRaw.set(1);
                    animate(galleryDragY, 0, {
                        type: "spring",
                        ...MAIN_SPRING,
                    });
                    return;
                }
                accum = Math.max(0, accum - e.deltaY);
                galleryDragY.jump(accum);
                openProgressRaw.jump(Math.max(0, 1 - accum / (vh * 0.3)));
                if (accum > vh * 0.2) {
                    closing = true;
                    inOverscroll = false;
                    closeGallery();
                    return;
                }
                resetIdle();
                return;
            }

            if (portalEl.scrollTop <= 0 && e.deltaY < -1) {
                e.preventDefault();
                inOverscroll = true;
                accum = -e.deltaY;
                galleryDragY.jump(accum);
                openProgressRaw.jump(Math.max(0, 1 - accum / (vh * 0.3)));
                resetIdle();
                return;
            }

            // --- Horizontal page navigation (on text area) ---
            // When cursor is over the container area, GalleryShell handles this
            if (isOnText) {
                const absX = Math.abs(e.deltaX);
                const absY = Math.abs(e.deltaY);
                if (hActive || (absX > absY && absX > 1)) {
                    e.preventDefault();
                    hActive = true;

                    let delta = -e.deltaX;
                    const isFirst = index === 0;
                    const isLast = index === itemCount - 1;
                    if (
                        (isFirst && hAccum + delta > 0) ||
                        (isLast && hAccum + delta < 0)
                    )
                        delta *= RUBBER_BAND_K;
                    hAccum += delta;
                    galleryDragX.jump(hAccum);

                    const threshold = vw * GALLERY_PAGE_THRESHOLD;
                    if (hAccum < -threshold) {
                        hNavigated = true;
                        goToPage(index + 1);
                    } else if (hAccum > threshold) {
                        hNavigated = true;
                        goToPage(index - 1);
                    }

                    if (hIdleTimer) clearTimeout(hIdleTimer);
                    hIdleTimer = setTimeout(
                        () => {
                            if (!hNavigated) {
                                animate(galleryDragX, 0, {
                                    type: "spring",
                                    ...PAGE_SPRING,
                                });
                            }
                            hActive = false;
                            hAccum = 0;
                            hNavigated = false;
                        },
                        hNavigated ? 500 : 150,
                    );
                    return;
                }

                // Vertical scroll on text — let native scroll handle it
                return;
            }

            // --- Cursor over image/spacer — forward vertical to portal ---
            if (Math.abs(e.deltaY) > 1) {
                e.preventDefault();
                portalEl.scrollTop += e.deltaY;
            }
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        return () => {
            window.removeEventListener("wheel", onWheel);
            if (idleTimer) clearTimeout(idleTimer);
            if (hIdleTimer) clearTimeout(hIdleTimer);
        };
    }, [
        showPortal,
        vh,
        vw,
        index,
        itemCount,
        closeGallery,
        openProgressRaw,
        galleryDragY,
        galleryDragX,
        goToPage,
    ]);

    // Sync portal scroll → localScrollY + update custom scrollbar thumb
    const updateThumb = useCallback((el: HTMLElement) => {
        const thumb = thumbRef.current;
        if (!thumb) return;
        const { scrollTop, scrollHeight, clientHeight } = el;
        const maxScroll = scrollHeight - clientHeight;
        if (maxScroll <= 0) {
            delete thumb.dataset.scrolling;
            return;
        }
        const ratio = scrollTop / maxScroll;
        const thumbH = Math.max(
            40,
            (clientHeight / scrollHeight) * clientHeight,
        );
        const thumbY = ratio * (clientHeight - thumbH);
        thumb.style.height = `${thumbH}px`;
        thumb.style.transform = `translateY(${thumbY}px)`;
        thumb.dataset.scrolling = "true";
        if (scrollbarIdleRef.current) clearTimeout(scrollbarIdleRef.current);
        scrollbarIdleRef.current = setTimeout(() => {
            if (thumbRef.current) delete thumbRef.current.dataset.scrolling;
        }, 1200);
    }, []);

    useEffect(() => {
        if (!showPortal) return;
        const el = scrollContainerRef.current;
        if (!el) return;
        const onScroll = () => {
            const st = Math.max(0, el.scrollTop);
            if (galleryDragY.get() > 0) {
                galleryDragY.jump(0);
                openProgressRaw.set(1);
            }
            localScrollY.jump(st);
            updateThumb(el);
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [
        showPortal,
        localScrollY,
        galleryDragY,
        openProgressRaw,
        updateThumb,
    ]);

    // Touch swipe/dismiss on image for mobile (native touch events have implicit capture)
    useEffect(() => {
        if (!isActive) return;
        const el = imageElRef.current;
        if (!el) return;

        const onTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            imageSwipeRef.current = {
                startX: touch.clientX,
                startY: touch.clientY,
                axis: null,
                lastX: touch.clientX,
                lastT: performance.now(),
                vx: 0,
            };
        };

        const onTouchMove = (e: TouchEvent) => {
            const ref = imageSwipeRef.current;
            if (!ref) return;
            const touch = e.touches[0];
            const dx = touch.clientX - ref.startX;
            const dy = touch.clientY - ref.startY;

            const now = performance.now();
            const dt = now - ref.lastT;
            if (dt > 0) ref.vx = (touch.clientX - ref.lastX) / dt;
            ref.lastX = touch.clientX;
            ref.lastT = now;

            if (!ref.axis) {
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5)
                    ref.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
                else return;
            }

            if (ref.axis === "x") {
                let offsetX = dx;
                if (
                    (index === 0 && dx > 0) ||
                    (index === itemCount - 1 && dx < 0)
                )
                    offsetX *= RUBBER_BAND_K;
                galleryDragX.jump(offsetX);
            } else if (ref.axis === "y" && dy > 0) {
                galleryDragY.jump(dy);
                openProgressRaw.jump(1 - Math.min(dy / (vh * 0.3), 1));
            }
        };

        const onTouchEnd = (e: TouchEvent) => {
            const ref = imageSwipeRef.current;
            if (!ref) return;
            imageSwipeRef.current = null;
            if (!ref.axis) return;
            const touch = e.changedTouches[0];
            const dx = touch.clientX - ref.startX;
            const dy = touch.clientY - ref.startY;

            if (ref.axis === "x") {
                const threshold = vw * GALLERY_PAGE_THRESHOLD;
                if (dx < -threshold || ref.vx < -GALLERY_DISMISS_VELOCITY)
                    goToPage(index + 1);
                else if (dx > threshold || ref.vx > GALLERY_DISMISS_VELOCITY)
                    goToPage(index - 1);
                else
                    animate(galleryDragX, 0, {
                        type: "spring",
                        ...PAGE_SPRING,
                    });
            } else if (ref.axis === "y") {
                if (dy > vh * 0.2) {
                    closeGallery();
                } else {
                    openProgressRaw.set(1);
                    animate(galleryDragY, 0, {
                        type: "spring",
                        ...MAIN_SPRING,
                    });
                }
            }
        };

        const onTouchCancel = () => {
            const ref = imageSwipeRef.current;
            if (!ref) return;
            imageSwipeRef.current = null;
            if (ref.axis === "x") {
                animate(galleryDragX, 0, { type: "spring", ...PAGE_SPRING });
            } else if (ref.axis === "y") {
                openProgressRaw.set(1);
                animate(galleryDragY, 0, { type: "spring", ...MAIN_SPRING });
            }
        };

        el.addEventListener("touchstart", onTouchStart, { passive: true });
        el.addEventListener("touchmove", onTouchMove, { passive: true });
        el.addEventListener("touchend", onTouchEnd, { passive: true });
        el.addEventListener("touchcancel", onTouchCancel, { passive: true });
        return () => {
            el.removeEventListener("touchstart", onTouchStart);
            el.removeEventListener("touchmove", onTouchMove);
            el.removeEventListener("touchend", onTouchEnd);
            el.removeEventListener("touchcancel", onTouchCancel);
        };
    }, [
        isActive,
        index,
        itemCount,
        vw,
        vh,
        galleryDragX,
        galleryDragY,
        openProgressRaw,
        goToPage,
        closeGallery,
    ]);

    return (
        <motion.div
            className={clsx(
                "absolute bottom-0 left-0 overflow-visible",
                isNearby && "will-change-transform",
                isActive ? "z-2" : "z-1",
            )}
            style={{
                width: naturalW,
                height: GALLERY_H * vh,
                transformOrigin: "center bottom",
                transform: transformStr,
            }}
        >
            {/* Image / color box */}
            <motion.div
                ref={imageElRef}
                className="absolute inset-0 rounded-2xl ring ring-black/10 cursor-pointer select-none"
                onPointerDown={(e) => {
                    // Skip for touch on active item — handled by native touch handler
                    if (e.pointerType === "touch" && isActive) return;
                    dragOnImageRef.current = true;
                }}
                style={{
                    background: !img && color,
                }}
            >
                {img ? (
                    <Image
                        src={img}
                        alt={imgAlt ?? ""}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                        loading={isActive ? "eager" : "lazy"}
                        className="absolute inset-0 rounded-2xl object-cover pointer-events-none"
                    />
                ) : (
                    <span className="text-8xl text-white pointer-events-none">
                        {label}
                    </span>
                )}
            </motion.div>

            {/* Portal scroll container with real text content */}
            {showPortal &&
                typeof document !== "undefined" &&
                createPortal(
                    <div
                        ref={scrollContainerRef}
                        className="gallery-portal fixed inset-0 overflow-y-auto z-[52]"
                        style={{ pointerEvents: "none" }}
                    >
                        {/* Spacer for image area */}
                        <div
                            style={{ height: imageBottom }}
                            className="pointer-events-none select-none"
                        />

                        {/* Real text content — selectable, with working links */}
                        <motion.div
                            ref={textWrapperRef}
                            style={{
                                touchAction: "pan-y",
                                opacity: portalTextOpacity,
                                scale: portalTextScale,
                                transformOrigin: "top center",
                                pointerEvents: isActive ? "auto" : "none",
                            }}
                        >
                            <div className="max-w-[80ch] mx-auto px-6 pt-16 pb-8 space-y-6">
                                <div className="space-y-2">
                                    {year && (
                                        <p className="text-sm text-muted">
                                            {year}
                                        </p>
                                    )}
                                    <h2 className="font-bold text-2xl">
                                        {title}
                                    </h2>
                                    <p className="text-muted">{subtitle}</p>
                                    {officialURL && (
                                        <a
                                            href={officialURL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 text-sm font-medium rounded-full bg-[#EEE]/80 no-underline text-[#333] hover:bg-[#DDD] transition-colors"
                                        >
                                            {officialURLText ??
                                                "View project"}
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
                                {noMSFT && (
                                    <NoMSFTDisclaimer title={title} />
                                )}
                                {mdxSource &&
                                    !("error" in mdxSource) && (
                                        <MDXClient
                                            {...mdxSource}
                                            components={components}
                                        />
                                    )}
                                <Footer />
                            </div>
                        </motion.div>
                    </div>,
                    document.body,
                )}

            {/* Custom scrollbar (hover devices only, replaces hidden native one) */}
            {showPortal &&
                typeof document !== "undefined" &&
                createPortal(
                    <div
                        className="group/sb fixed top-0 right-0.5 bottom-0 w-2.5 z-[53] py-2 hidden [@media(hover:hover)]:flex items-start"
                        onPointerEnter={() => {
                            const el = scrollContainerRef.current;
                            if (el) updateThumb(el);
                        }}
                        onPointerDown={(e) => {
                            // Track click: jump scroll to position
                            e.stopPropagation();
                            const el = scrollContainerRef.current;
                            if (!el) return;
                            const { scrollHeight, clientHeight } = el;
                            const maxScroll = scrollHeight - clientHeight;
                            const ratio = e.clientY / clientHeight;
                            el.scrollTop = ratio * maxScroll;
                        }}
                    >
                        <div
                            ref={thumbRef}
                            className="w-1.5 rounded-full bg-black/30 opacity-0 group-hover/sb:opacity-100 data-[scrolling]:opacity-100 transition-opacity duration-300 cursor-grab active:cursor-grabbing active:bg-black/50"
                            style={{ height: 40 }}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                (e.target as HTMLElement).setPointerCapture(
                                    e.pointerId,
                                );
                                const startY = e.clientY;
                                const el = scrollContainerRef.current;
                                if (!el) return;
                                const startScroll = el.scrollTop;
                                const { scrollHeight, clientHeight } = el;
                                const maxScroll = scrollHeight - clientHeight;
                                const thumbH = Math.max(
                                    40,
                                    (clientHeight / scrollHeight) *
                                        clientHeight,
                                );
                                const onMove = (me: PointerEvent) => {
                                    const dy = me.clientY - startY;
                                    el.scrollTop =
                                        startScroll +
                                        (dy / (clientHeight - thumbH)) *
                                            maxScroll;
                                };
                                const onUp = () => {
                                    window.removeEventListener(
                                        "pointermove",
                                        onMove,
                                    );
                                    window.removeEventListener(
                                        "pointerup",
                                        onUp,
                                    );
                                };
                                window.addEventListener("pointermove", onMove);
                                window.addEventListener("pointerup", onUp);
                            }}
                        />
                    </div>,
                    document.body,
                )}
        </motion.div>
    );
}
