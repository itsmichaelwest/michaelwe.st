"use client";

import { useEffect } from "react";
import {
    motion,
    useMotionValue,
    useTransform,
    useReducedMotion,
    animate,
    type MotionValue,
} from "motion/react";
import Image from "next/image";
import clsx from "clsx";
import type { ItemData } from "./types";
import { GALLERY_H } from "./constants";
import { useGallery } from "./GalleryContext";
import {
    itemFullW,
    itemGalleryScale,
    itemRailScale,
    railLeftOf,
} from "./utils";

const ENTRY_X_OFFSET = 140;
const ENTRY_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

export function GalleryItem({
    index,
    items,
    current,
    color,
    label,
    img,
    imgAlt,
    open,
    vw,
    vh,
    openSpring,
    railScroll,
    galleryPageX,
    galleryDragX,
    galleryDragY,
    dragOnImageRef,
    onActivate,
    onFocusItem,
    title,
    priority = false,
    eager = false,
    entryEnabled = false,
    entryDelay = 0,
}: {
    index: number;
    items: ItemData[];
    current: number;
    color?: string;
    label?: string;
    img?: string;
    imgAlt?: string;
    open: boolean;
    vw: number;
    vh: number;
    openSpring: MotionValue<number>;
    railScroll: MotionValue<number>;
    galleryPageX: MotionValue<number>;
    galleryDragX: MotionValue<number>;
    galleryDragY: MotionValue<number>;
    dragOnImageRef: React.MutableRefObject<boolean>;
    onActivate: () => void;
    onFocusItem: () => void;
    title: string;
    priority?: boolean;
    eager?: boolean;
    entryEnabled?: boolean;
    entryDelay?: number;
}) {
    const reducedMotion = useReducedMotion();
    // entry: 0 = fully offset/transparent, 1 = settled. Disabled on direct
    // /work/[id] nav (rail is hidden behind the detail view) and under
    // reduced motion.
    const shouldAnimateIn = entryEnabled && !reducedMotion;
    const entry = useMotionValue(shouldAnimateIn ? 0 : 1);

    useEffect(() => {
        if (!shouldAnimateIn) {
            entry.jump(1);
            return;
        }
        const controls = animate(entry, 1, {
            duration: 0.55,
            ease: ENTRY_EASE,
            delay: entryDelay,
        });
        return () => controls.stop();
    }, [shouldAnimateIn, entryDelay, entry]);

    const entryFilter = useTransform(
        entry,
        (v) => `blur(${(1 - v) * 4}px)`,
    );
    const { containerRectRef } = useGallery();
    const cH = containerRectRef.current.height;
    const naturalW = itemFullW(items, index, vh);
    const galScale = itemGalleryScale(items, index, vw, vh);
    // Render-phase reads of cH are safe: GalleryShell's ResizeObserver
    // bumps setRectVersion on change, re-rendering this component.
    // eslint-disable-next-line react-hooks/refs
    const sRail = itemRailScale(items, index, cH, vh);
    const originOff = (naturalW * (1 - sRail)) / 2;
    // eslint-disable-next-line react-hooks/refs
    const myRailLeft = railLeftOf(items, index, cH);
    const isActive = open && index === current;
    const isNearby = !open || Math.abs(index - current) <= 1;

    // On mobile, match GalleryDetail's layout: wider image, top-anchored
    const isMobile = vw < 768;
    const targetScale = isMobile ? Math.min(1, (vw - 40) / naturalW) : galScale;

    // Compensate border-radius and ring for current scale so they
    // appear the same size at rail and fullscreen.
    const borderRadius = useTransform(openSpring, (progress) => {
        const scale = sRail + progress * (targetScale - sRail);
        return 16 / scale;
    });
    const ringBoxShadow = useTransform(openSpring, (progress) => {
        const scale = sRail + progress * (targetScale - sRail);
        return `0 0 0 ${1 / scale}px rgba(0,0,0,0.1)`;
    });

    const transformInputs = [
        openSpring,
        railScroll,
        galleryPageX,
        galleryDragX,
        galleryDragY,
        entry,
    ];
    const transformStr = useTransform(
        transformInputs as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        ([progress, rail, galPageX, galDragX, galDragY, entryV]: number[]) => {
            // Entry slide-in only applies while on the rail. By the time the
            // gallery is opening (progress > 0), entry has settled to 1 in
            // practice, but multiplying by (1 - progress) is cheap insurance.
            const entryX = (1 - entryV) * ENTRY_X_OFFSET * (1 - progress);

            if (progress > 0.5) {
                const approxCenter = galPageX + galDragX + index * vw;
                if (Math.abs(approxCenter) > vw * 1.5) {
                    return `translate3d(${approxCenter}px, 0px, 0px) scale(${targetScale})`;
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

            const x = railX + progress * (galX - railX) + entryX;
            const scale = sRail + progress * (targetScale - sRail);
            const visualH = GALLERY_H * vh * scale;
            // Desktop: center vertically. Mobile: anchor at top (80px margin).
            const nudge = isMobile
                ? rect.bottom - visualH - 80
                : rect.bottom - (vh + visualH) / 2;
            const y = galDragY * progress - progress * nudge;
            return `translate3d(${x}px, ${y}px, 0px) scale(${scale})`;
        },
    );

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
                opacity: entry,
                filter: entryFilter,
            }}
        >
            {/* Image / color box */}
            <motion.div
                role="button"
                tabIndex={open ? -1 : 0}
                aria-label={title}
                className="absolute inset-0 cursor-pointer select-none overflow-hidden outline-none focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
                onPointerDown={(e) => {
                    if (e.pointerType === "touch" && isActive) return;
                    dragOnImageRef.current = true;
                }}
                onFocus={(e) => {
                    // Only auto-scroll on keyboard focus. Without this gate,
                    // tapping an off-center item moves focus, animates the
                    // rail, and the items shift out from under the click —
                    // the wrong item (or none) gets opened on pointerup.
                    if (e.target.matches(":focus-visible")) onFocusItem();
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onActivate();
                    }
                }}
                style={{
                    background: !img ? color : undefined,
                    borderRadius,
                    boxShadow: ringBoxShadow,
                }}
            >
                {img ? (
                    <Image
                        src={img}
                        alt={imgAlt ?? ""}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                        // priority and loading are mutually exclusive in
                        // next/image — priority implies eager + high fetch
                        // priority + a preload link.
                        {...(priority
                            ? { priority: true }
                            : { loading: isActive || eager ? "eager" : "lazy" })}
                        className="absolute inset-0 object-cover pointer-events-none"
                    />
                ) : (
                    <span className="text-8xl text-white pointer-events-none">
                        {label}
                    </span>
                )}
            </motion.div>
        </motion.div>
    );
}
