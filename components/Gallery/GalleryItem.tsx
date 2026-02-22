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

    const textRef = useRef<HTMLDivElement>(null);
    const [textHeight, setTextHeight] = useState(0);
    useEffect(() => {
        const el = textRef.current;
        if (!el) return;
        const update = () => setTextHeight(el.offsetHeight);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const imageBottom = (vh + GALLERY_H * vh * galScale) / 2;

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
                openProgressRaw.jump(
                    Math.max(0, 1 - accum / (vh * 0.3)),
                );
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
                openProgressRaw.jump(
                    Math.max(0, 1 - accum / (vh * 0.3)),
                );
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

    // Sync native scroll -> localScrollY; detect iOS negative scrollTop for dismiss
    useEffect(() => {
        if (!showPortal) return;
        const el = scrollContainerRef.current;
        if (!el) return;
        const onScroll = () => {
            const st = el.scrollTop;
            if (st < 0) {
                const pull = -st;
                galleryDragY.jump(pull);
                openProgressRaw.jump(
                    Math.max(0, 1 - pull / (vh * 0.3)),
                );
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
    ]);

    // Touch horizontal swipe on portal for page navigation (mobile)
    const portalSwipeRef = useRef<{
        startX: number;
        active: boolean;
        lastX: number;
        lastT: number;
        vx: number;
    } | null>(null);

    const onPortalPointerDown = useCallback(
        (e: React.PointerEvent) => {
            if (e.pointerType !== "touch") return;
            e.stopPropagation();
            const scrolled = scrollContainerRef.current?.scrollTop ?? 0;
            if (e.clientY > imageBottom - scrolled) return;
            portalSwipeRef.current = {
                startX: e.clientX,
                active: false,
                lastX: e.clientX,
                lastT: performance.now(),
                vx: 0,
            };
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
        },
        [imageBottom],
    );

    const onPortalPointerMove = useCallback(
        (e: React.PointerEvent) => {
            e.stopPropagation();
            const ref = portalSwipeRef.current;
            if (!ref) return;
            const dx = e.clientX - ref.startX;

            const now = performance.now();
            const dt = now - ref.lastT;
            if (dt > 0) ref.vx = (e.clientX - ref.lastX) / dt;
            ref.lastX = e.clientX;
            ref.lastT = now;

            if (!ref.active) {
                if (Math.abs(dx) > 5) {
                    ref.active = true;
                } else return;
            }
            let offsetX = dx;
            const isFirst = index === 0;
            const isLast = index === itemCount - 1;
            if ((isFirst && dx > 0) || (isLast && dx < 0))
                offsetX *= RUBBER_BAND_K;
            galleryDragX.jump(offsetX);
        },
        [galleryDragX, index, itemCount],
    );

    const onPortalPointerUp = useCallback(
        (e: React.PointerEvent) => {
            e.stopPropagation();
            const ref = portalSwipeRef.current;
            if (!ref?.active) {
                portalSwipeRef.current = null;
                return;
            }
            const dx = e.clientX - ref.startX;
            const vx = ref.vx;
            portalSwipeRef.current = null;
            const threshold = vw * GALLERY_PAGE_THRESHOLD;
            if (dx < -threshold || vx < -GALLERY_DISMISS_VELOCITY)
                goToPage(index + 1);
            else if (dx > threshold || vx > GALLERY_DISMISS_VELOCITY)
                goToPage(index - 1);
            else
                animate(galleryDragX, 0, {
                    type: "spring",
                    ...PAGE_SPRING,
                });
        },
        [vw, goToPage, index, galleryDragX],
    );

    const onPortalPointerCancel = useCallback((e: React.PointerEvent) => {
        e.stopPropagation();
        if (portalSwipeRef.current?.active) {
            animate(galleryDragX, 0, { type: "spring", ...PAGE_SPRING });
        }
        portalSwipeRef.current = null;
    }, [galleryDragX]);

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
                className="absolute inset-0 cursor-pointer"
                onPointerDown={() => {
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
                        className="absolute inset-0 object-cover select-none pointer-events-none"
                    />
                ) : (
                    <span className="text-8xl text-white select-none pointer-events-none">
                        {label}
                    </span>
                )}
            </motion.div>

            {/* Text anchored to item */}
            <motion.div
                ref={textRef}
                className={clsx(
                    "absolute top-full left-1/2 w-screen",
                    isActive ? "pointer-events-auto" : "pointer-events-none",
                )}
                onPointerDown={isActive ? (e) => e.stopPropagation() : undefined}
                style={{
                    transform: `translateX(-50%) scale(${textScale})`,
                    transformOrigin: "top center",
                    opacity: textOpacity,
                }}
            >
                <div className="max-w-[80ch] mx-auto px-6 pt-16 pb-8 space-y-6">
                    <div className="space-y-2">
                        {year && (
                            <p className="text-sm text-muted">{year}</p>
                        )}
                        <h2 className="font-bold text-2xl">{title}</h2>
                        <p className="text-muted">{subtitle}</p>
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
            </motion.div>

            {/* Transparent portal scroll track */}
            {showPortal &&
                typeof document !== "undefined" &&
                createPortal(
                    <div
                        ref={scrollContainerRef}
                        className="gallery-portal fixed inset-0 overflow-y-auto z-[52] pointer-events-none"
                        onPointerDown={onPortalPointerDown}
                        onPointerMove={onPortalPointerMove}
                        onPointerUp={onPortalPointerUp}
                        onPointerCancel={onPortalPointerCancel}
                    >
                        <div
                            style={{ height: imageBottom + textHeight }}
                            className="pointer-events-none"
                        />
                    </div>,
                    document.body,
                )}
        </motion.div>
    );
}
