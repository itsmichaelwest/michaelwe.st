"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState, useSyncExternalStore } from "react";
import {
    motion,
    AnimatePresence,
    useReducedMotion,
    type Transition,
} from "motion/react";
import { createPortal } from "react-dom";
import clsx from "clsx";

interface MDXImageProps {
    src: string;
    alt?: string;
    height?: number | string;
    width?: number | string;
}

const subscribeNoop = () => () => {};

export function MDXImage({ src, alt = "", height, width }: MDXImageProps) {
    const [loaded, setLoaded] = useState(false);
    const [lightboxLoaded, setLightboxLoaded] = useState(false);
    const [open, setOpen] = useState(false);
    // Defer portal rendering until after hydration. SSR/first-client render
    // returns false to keep markup identical; subsequent renders return true.
    const mounted = useSyncExternalStore(
        subscribeNoop,
        () => true,
        () => false,
    );
    const reducedMotion = useReducedMotion();
    const id = useId();
    const layoutId = `mdx-image-${id}`;

    // Callback refs handle the "image was cached and already complete before
    // onLoad fired" case without needing a setState-in-effect.
    const fallbackRef = useCallback((el: HTMLImageElement | null) => {
        if (el && el.complete) setLoaded(true);
    }, []);
    const lightboxRef = useCallback((el: HTMLImageElement | null) => {
        if (el && el.complete) setLightboxLoaded(true);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [open]);

    const ringClasses = "rounded-xl ring ring-black/5 dark:ring-white/10";
    const loadClasses = clsx(
        "transition-[filter,opacity] duration-700 ease-out",
        loaded ? "opacity-100 blur-0" : "opacity-0 blur-md scale-[1.01]",
    );
    const lightboxLoadClasses = clsx(
        "transition-[filter,opacity] duration-500 ease-out",
        lightboxLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md",
    );

    const layoutTransition: Transition = reducedMotion
        ? { duration: 0 }
        : { type: "spring", stiffness: 280, damping: 32, mass: 0.6 };

    const hasIntrinsic = Boolean(height && width);
    const aspect = hasIntrinsic
        ? Number(width) / Number(height)
        : 16 / 9;
    const aspectRatioStyle = `${hasIntrinsic ? width : 16} / ${hasIntrinsic ? height : 9}`;

    return (
        <figure className="my-16 space-y-4">
            <motion.button
                type="button"
                onClick={() => setOpen(true)}
                layoutId={layoutId}
                transition={layoutTransition}
                style={{ aspectRatio: aspectRatioStyle }}
                className="relative block w-full cursor-zoom-in appearance-none p-0 border-0 bg-transparent"
                aria-label={
                    alt ? `View full size: ${alt}` : "View full size"
                }
            >
                <Image
                    ref={fallbackRef}
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 100vw, min(80ch, 100vw)"
                    className={clsx(
                        ringClasses,
                        loadClasses,
                        "object-cover",
                    )}
                    onLoad={() => setLoaded(true)}
                />
            </motion.button>

            {alt && (
                <figcaption className="text-sm opacity-50">{alt}</figcaption>
            )}

            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {open && (
                            <>
                                <motion.div
                                    key="mdx-scrim"
                                    className="fixed inset-0 z-[99]"
                                    initial={{
                                        backgroundColor:
                                            "rgb(0 0 0 / 0)",
                                        backdropFilter: "blur(0px)",
                                    }}
                                    animate={{
                                        backgroundColor:
                                            "rgb(0 0 0 / 0.6)",
                                        backdropFilter: "blur(16px)",
                                    }}
                                    exit={{
                                        backgroundColor:
                                            "rgb(0 0 0 / 0)",
                                        backdropFilter: "blur(0px)",
                                    }}
                                    transition={{
                                        duration: 0.35,
                                        ease: "easeOut",
                                    }}
                                    onClick={() => setOpen(false)}
                                />
                                <motion.button
                                    key="mdx-lightbox"
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    layoutId={layoutId}
                                    transition={layoutTransition}
                                    style={{
                                        aspectRatio: aspectRatioStyle,
                                        width: `min(95vw, calc(92vh * ${aspect}))`,
                                    }}
                                    className="fixed top-1/2 left-1/2 z-[100] -translate-x-1/2 -translate-y-1/2 cursor-zoom-out appearance-none p-0 border-0 bg-transparent"
                                    aria-label="Close image"
                                >
                                    <Image
                                        ref={lightboxRef}
                                        src={src}
                                        alt={alt}
                                        fill
                                        sizes="95vw"
                                        className={clsx(
                                            "rounded-xl object-cover",
                                            lightboxLoadClasses,
                                        )}
                                        onLoad={() =>
                                            setLightboxLoaded(true)
                                        }
                                    />
                                </motion.button>
                            </>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </figure>
    );
}
