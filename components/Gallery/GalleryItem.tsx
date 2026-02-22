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

const LOREM =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

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
    noMSFT,
    officialURL,
    officialURLText,
    year,
    paras,
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

    const textScale = 1 / galScale;

    const textOpacity = useTransform(
        [galleryPageX, galleryDragX, openSpring] as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        ([pageX, dragX, progress]: number[]) => {
            const dist = Math.abs(pageX + dragX + index * vw);
            const proximity = Math.max(0, 1 - dist / (vw * 0.5));
            return proximity * progress;
        },
    );

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

    // Measure text content height for portal spacer
    const textWrapperRef = useRef<HTMLDivElement>(null);
    const [textHeight, setTextHeight] = useState(0);
    useEffect(() => {
        if (!open) return;
        const el = textWrapperRef.current;
        if (!el) return;
        const ro = new ResizeObserver(() => {
            setTextHeight(el.offsetHeight);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [open]);

    const [showPortal, setShowPortal] = useState(false);
    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(() => setShowPortal(true), 350);
            return () => clearTimeout(timer);
        }
        setShowPortal(false);
    }, [isActive]);

    // Wheel handler on window: forwards deltaY to portal scrollTop + overscroll-to-dismiss
    useEffect(() => {
        if (!showPortal) return;
        const portalEl = scrollContainerRef.current;
        if (!portalEl) return;

        let accum = 0;
        let inOverscroll = false;
        let closing = false;
        let idleTimer: ReturnType<typeof setTimeout> | null = null;

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
            e.preventDefault();

            if (closing) return;

            if (inOverscroll) {
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

            if (portalEl.scrollTop <= 0 && e.deltaY < 0) {
                inOverscroll = true;
                accum = -e.deltaY;
                galleryDragY.jump(accum);
                openProgressRaw.jump(Math.max(0, 1 - accum / (vh * 0.3)));
                resetIdle();
                return;
            }

            portalEl.scrollTop += e.deltaY;
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        return () => {
            window.removeEventListener("wheel", onWheel);
            if (idleTimer) clearTimeout(idleTimer);
        };
    }, [showPortal, vh, closeGallery, openProgressRaw, galleryDragY]);

    // Sync native scroll -> localScrollY + update custom scrollbar thumb
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
            const st = el.scrollTop;
            if (st < 0) {
                const pull = -st;
                galleryDragY.jump(pull);
                openProgressRaw.jump(Math.max(0, 1 - pull / (vh * 0.3)));
                if (pull > vh * 0.15) {
                    closeGallery();
                }
            } else {
                if (galleryDragY.get() > 0) {
                    galleryDragY.jump(0);
                    openProgressRaw.set(1);
                }
                localScrollY.jump(st);
            }
            updateThumb(el);
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [
        showPortal,
        localScrollY,
        vh,
        galleryDragY,
        openProgressRaw,
        closeGallery,
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

    // Touch scroll on text for mobile (mirrors wheel-scroll behavior on desktop)
    useEffect(() => {
        if (!isActive || !showPortal) return;
        const textEl = textWrapperRef.current;
        const portalEl = scrollContainerRef.current;
        if (!textEl || !portalEl) return;

        let startY = 0;
        let startScroll = 0;
        let scrolling = false;
        let lastY = 0;
        let lastT = 0;
        let vy = 0;
        let inOverscroll = false;
        let overscrollAccum = 0;
        let momentumRaf: number | null = null;
        let closing = false;

        const onTouchStart = (e: TouchEvent) => {
            if (momentumRaf) {
                cancelAnimationFrame(momentumRaf);
                momentumRaf = null;
            }
            const touch = e.touches[0];
            startY = touch.clientY;
            lastY = touch.clientY;
            lastT = performance.now();
            startScroll = portalEl.scrollTop;
            scrolling = false;
            inOverscroll = false;
            overscrollAccum = 0;
            vy = 0;
            closing = false;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (closing) return;
            const touch = e.touches[0];
            const dy = startY - touch.clientY; // positive = finger up = scroll down

            const now = performance.now();
            const dt = now - lastT;
            if (dt > 0) vy = (lastY - touch.clientY) / dt;
            lastY = touch.clientY;
            lastT = now;

            if (!scrolling && Math.abs(dy) > 8) {
                scrolling = true;
            }
            if (!scrolling) return;

            if (inOverscroll) {
                if (dy > 0) {
                    // Reversed direction, exit overscroll
                    inOverscroll = false;
                    overscrollAccum = 0;
                    openProgressRaw.set(1);
                    animate(galleryDragY, 0, {
                        type: "spring",
                        ...MAIN_SPRING,
                    });
                    startScroll = 0;
                    startY = touch.clientY;
                    return;
                }
                overscrollAccum = Math.max(0, -dy);
                galleryDragY.jump(overscrollAccum);
                openProgressRaw.jump(
                    Math.max(0, 1 - overscrollAccum / (vh * 0.3)),
                );
                if (overscrollAccum > vh * 0.2) {
                    closing = true;
                    closeGallery();
                }
                return;
            }

            const newScroll = startScroll + dy;
            if (newScroll <= 0 && dy < 0) {
                inOverscroll = true;
                portalEl.scrollTop = 0;
                overscrollAccum = -newScroll;
                galleryDragY.jump(overscrollAccum);
                openProgressRaw.jump(
                    Math.max(0, 1 - overscrollAccum / (vh * 0.3)),
                );
                return;
            }
            portalEl.scrollTop = newScroll;
        };

        const onTouchEnd = () => {
            if (inOverscroll && !closing) {
                if (overscrollAccum > vh * 0.15) {
                    closeGallery();
                } else {
                    openProgressRaw.set(1);
                    animate(galleryDragY, 0, {
                        type: "spring",
                        ...MAIN_SPRING,
                    });
                }
                inOverscroll = false;
                overscrollAccum = 0;
                return;
            }
            if (!scrolling) return;
            scrolling = false;
            // Momentum
            if (Math.abs(vy) > 0.3) {
                let v = vy * 16;
                const decel = () => {
                    v *= 0.95;
                    if (Math.abs(v) < 0.5) {
                        momentumRaf = null;
                        return;
                    }
                    portalEl.scrollTop += v;
                    momentumRaf = requestAnimationFrame(decel);
                };
                momentumRaf = requestAnimationFrame(decel);
            }
        };

        textEl.addEventListener("touchstart", onTouchStart, { passive: true });
        textEl.addEventListener("touchmove", onTouchMove, { passive: true });
        textEl.addEventListener("touchend", onTouchEnd, { passive: true });
        return () => {
            textEl.removeEventListener("touchstart", onTouchStart);
            textEl.removeEventListener("touchmove", onTouchMove);
            textEl.removeEventListener("touchend", onTouchEnd);
            if (momentumRaf) cancelAnimationFrame(momentumRaf);
        };
    }, [isActive, showPortal, vh, closeGallery, openProgressRaw, galleryDragY]);

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
                        alt=""
                        fill
                        className="absolute inset-0 rounded-2xl object-cover pointer-events-none"
                    />
                ) : (
                    <span className="text-8xl text-white pointer-events-none">
                        {label}
                    </span>
                )}
            </motion.div>

            {/* Text anchored to item */}
            <motion.div
                className={clsx(
                    "absolute top-full left-1/2 w-screen",
                    isActive ? "pointer-events-auto" : "pointer-events-none",
                )}
                onPointerDown={
                    isActive ? (e) => e.stopPropagation() : undefined
                }
                style={{
                    transform: `translateX(-50%) scale(${textScale})`,
                    transformOrigin: "top center",
                    opacity: textOpacity,
                }}
            >
                {open && (
                    <div
                        ref={textWrapperRef}
                        className="max-w-[80ch] mx-auto px-6 pt-16 pb-8 space-y-6"
                    >
                        <div className="space-y-2">
                            {year && (
                                <p className="text-sm text-muted">{year}</p>
                            )}
                            <h2 className="font-bold text-2xl">{title}</h2>
                            <p className="text-muted">{subtitle}</p>
                            {officialURL && (
                                <a
                                    href={officialURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 text-sm font-medium rounded-full bg-[#EEE]/80 no-underline text-[#333] hover:bg-[#DDD] transition-colors"
                                >
                                    {officialURLText ?? "View project"}
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
                        {noMSFT && <NoMSFTDisclaimer title={title} />}
                        {mdxSource && !("error" in mdxSource) ? (
                            <MDXClient {...mdxSource} components={components} />
                        ) : (
                            Array.from({ length: paras ?? 1 }, (_, j) => (
                                <p key={j}>{LOREM}</p>
                            ))
                        )}
                        <Footer />
                    </div>
                )}
            </motion.div>

            {/* Transparent portal scroll track */}
            {showPortal &&
                typeof document !== "undefined" &&
                createPortal(
                    <div
                        ref={scrollContainerRef}
                        className="gallery-portal fixed inset-0 overflow-y-auto z-[52] pointer-events-none"
                    >
                        <div
                            style={{ height: imageBottom + textHeight }}
                            className="pointer-events-none select-none"
                        />
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
