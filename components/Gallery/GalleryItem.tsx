"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
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
}) {
    const { rect } = useGallery();
    const cH = rect.height;
    const naturalW = itemFullW(items, index, vh);
    const galScale = itemGalleryScale(items, index, vw, vh);
    const sRail = itemRailScale(items, index, cH, vh);
    const originOff = (naturalW * (1 - sRail)) / 2;
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
    ];
    const transformStr = useTransform(
        transformInputs as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        ([progress, rail, galPageX, galDragX, galDragY]: number[]) => {
            if (progress > 0.5) {
                const approxCenter = galPageX + galDragX + index * vw;
                if (Math.abs(approxCenter) > vw * 1.5) {
                    return `translate3d(${approxCenter}px, 0px, 0px) scale(${targetScale})`;
                }
            }

            const railX = myRailLeft - originOff + rail;
            const galX =
                index * vw +
                (vw - naturalW) / 2 -
                rect.left +
                galPageX +
                galDragX;

            const x = railX + progress * (galX - railX);
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
                onFocus={onFocusItem}
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
                        loading={isActive ? "eager" : "lazy"}
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
