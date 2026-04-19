"use client";

import {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
    useRef,
    useMemo,
    type ReactNode,
} from "react";
import {
    motion,
    useMotionValue,
    useMotionValueEvent,
    useSpring,
    animate,
} from "motion/react";
import clsx from "clsx";
import { useWindowSize } from "../../hooks/useWindowSize";
import { GalleryContext, type ContainerRect } from "./GalleryContext";
import type { ItemData } from "./types";
import { SAMPLE_ITEMS } from "./types";
import {
    MAIN_SPRING,
    PAGE_SPRING,
    RUBBER_BAND_K,
    DRAG_DECAY,
} from "./constants";
import { railItemW, railLeftOf, maxRailScroll } from "./utils";
import { GalleryItem } from "./GalleryItem";
import { GalleryDetail } from "./GalleryDetail";
import { AboutModal } from "../AboutModal";

export function GalleryShell({
    items: realItems,
    children,
}: {
    items: ItemData[];
    children?: ReactNode;
}) {
    const isDirectNav =
        typeof window !== "undefined" &&
        /^\/work\/.+$/.test(window.location.pathname);
    const isAboutDirectNav =
        typeof window !== "undefined" && window.location.pathname === "/about";
    const [open, setOpen] = useState(isDirectNav);
    const [aboutOpen, setAboutOpen] = useState(isAboutDirectNav);
    const aboutDirectNavRef = useRef(isAboutDirectNav);

    const [current, setCurrent] = useState(0);
    const [showDetail, setShowDetail] = useState(isDirectNav);
    const detailScrollRef = useRef<HTMLDivElement>(null);
    const { w: vw, h: vh } = useWindowSize();
    const items = useMemo(
        () =>
            process.env.NODE_ENV === "production"
                ? realItems
                : [...realItems, ...SAMPLE_ITEMS],
        [realItems],
    );

    const idToIndex = useMemo(() => {
        const map = new Map<string, number>();
        items.forEach((item, i) => map.set(item.id, i));
        return map;
    }, [items]);

    const railOffset = useMotionValue(0);
    const galleryPageX = useMotionValue(0);
    const galleryDragX = useMotionValue(0);
    const galleryDragY = useMotionValue(0);
    const openProgress = useMotionValue(0);
    const openSpring = useSpring(openProgress, MAIN_SPRING);

    const currentRef = useRef(0);
    const openRef = useRef(isDirectNav);
    const directNavRef = useRef(isDirectNav);

    const dragAxisRef = useRef<"x" | "y" | null>(null);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const didDragRef = useRef(false);
    const momentumRef = useRef<number | null>(null);
    const lastPointerRef = useRef({ x: 0, y: 0, t: 0 });
    const velocityRef = useRef({ x: 0, y: 0 });
    const dragOnImageRef = useRef(false);
    const containerElRef = useRef<HTMLDivElement | null>(null);
    const [rect, setRect] = useState<ContainerRect>({
        left: 0,
        bottom: 0,
        width: 0,
        height: 0,
    });

    const containerRef = useCallback((el: HTMLDivElement | null) => {
        containerElRef.current = el;
        if (!el) return;
        const measure = () => {
            const r = el.getBoundingClientRect();
            setRect((prev) =>
                prev.height === r.height &&
                prev.width === r.width &&
                prev.left === r.left &&
                prev.bottom === r.bottom
                    ? prev
                    : {
                          left: r.left,
                          bottom: r.bottom,
                          width: r.width,
                          height: r.height,
                      },
            );
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        window.addEventListener("resize", measure);
        window.addEventListener("scroll", measure, { passive: true });
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", measure);
            window.removeEventListener("scroll", measure);
        };
    }, []);

    // Direct navigation — wait for vw so positions are correct before first paint
    const directNavChecked = useRef(false);
    useLayoutEffect(() => {
        if (vw <= 0 || directNavChecked.current) return;
        directNavChecked.current = true;
        const match = window.location.pathname.match(/^\/work\/(.+)$/);
        if (!match) return;
        const idx = idToIndex.get(match[1]);
        if (idx == null) return;
        directNavRef.current = true;
        /* eslint-disable react-hooks/set-state-in-effect -- initial URL-to-state hydration */
        setCurrent(idx);
        currentRef.current = idx;
        setOpen(true);
        setShowDetail(true);
        /* eslint-enable react-hooks/set-state-in-effect */
        openRef.current = true;
        openProgress.jump(1);
        openSpring.jump(1);
        galleryPageX.jump(-idx * vw);
        galleryDragX.jump(0);
        galleryDragY.jump(0);
    }, [vw]); // eslint-disable-line react-hooks/exhaustive-deps

    const openGallery = useCallback(
        (i: number) => {
            setCurrent(i);
            currentRef.current = i;
            setOpen(true);
            openRef.current = true;
            openProgress.set(1);
            galleryPageX.jump(-i * vw);
            galleryDragX.jump(0);
            galleryDragY.jump(0);
            const id = items[i].id;
            if (
                !/^s\d+$/.test(id) &&
                window.location.pathname !== `/work/${id}`
            ) {
                history.pushState({ gallery: id }, "", `/work/${id}`);
            }
        },
        [openProgress, galleryPageX, galleryDragX, galleryDragY, vw, items],
    );

    const centerRailOn = useCallback(
        (idx: number, smooth = false) => {
            if (vw <= 0 || vh <= 0) return;
            const cH = rect.height;
            const w = railItemW(items, idx, cH);
            const center = railLeftOf(items, idx, cH) + w / 2;
            const max = maxRailScroll(
                items,
                cH,
                rect.width,
            );
            const vpCenter = vw / 2 - rect.left;
            const target = Math.max(-max, Math.min(0, vpCenter - center));
            if (smooth) {
                animate(railOffset, target, {
                    type: "spring",
                    ...MAIN_SPRING,
                });
            } else {
                railOffset.jump(target);
            }
        },
        [railOffset, vw, vh, items, rect],
    );

    const closeGallery = useCallback(() => {
        window.scrollTo(0, 0);
        setOpen(false);
        setShowDetail(false);
        openRef.current = false;
        openProgress.set(0);
        galleryDragX.jump(0);
        centerRailOn(currentRef.current);
        if (directNavRef.current) {
            directNavRef.current = false;
            history.replaceState(null, "", "/");
        } else {
            history.back();
        }
    }, [openProgress, galleryDragX, centerRailOn]);

    const openAbout = useCallback(() => {
        setAboutOpen(true);
        if (window.location.pathname !== "/about") {
            history.pushState({ about: true }, "", "/about");
        }
    }, []);

    const closeAbout = useCallback(() => {
        setAboutOpen(false);
        if (aboutDirectNavRef.current) {
            aboutDirectNavRef.current = false;
            history.replaceState(null, "", "/");
        } else {
            history.back();
        }
    }, []);

    const goToPage = useCallback(
        (i: number) => {
            const clamped = Math.max(0, Math.min(i, items.length - 1));
            setCurrent(clamped);
            currentRef.current = clamped;
            const drag = galleryDragX.get();
            galleryPageX.jump(galleryPageX.get() + drag);
            galleryDragX.jump(0);
            animate(galleryPageX, -clamped * vw, {
                type: "spring",
                ...PAGE_SPRING,
            });
            if (openRef.current) {
                const id = items[clamped].id;
                if (!/^s\d+$/.test(id)) {
                    history.replaceState({ gallery: id }, "", `/work/${id}`);
                }
            }
        },
        [galleryPageX, galleryDragX, vw, items],
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (!openRef.current) return;
            if (e.key === "Escape") closeGallery();
            if (e.key === "ArrowRight") goToPage(currentRef.current + 1);
            if (e.key === "ArrowLeft") goToPage(currentRef.current - 1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [closeGallery, goToPage, closeAbout]);

    // Popstate
    useEffect(() => {
        const onPopState = () => {
            if (window.location.pathname === "/about") {
                setAboutOpen(true);
                return;
            }
            setAboutOpen(false);

            const match = window.location.pathname.match(/^\/work\/(.+)$/);
            if (match) {
                const idx = idToIndex.get(match[1]);
                if (idx != null && !openRef.current) openGallery(idx);
            } else if (openRef.current) {
                setOpen(false);
                setShowDetail(false);
                openRef.current = false;
                openProgress.set(0);
                galleryDragX.jump(0);
                centerRailOn(currentRef.current, true);
            }
        };
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, [idToIndex, openGallery, openProgress, galleryDragX, centerRailOn]);

    // Update document.title for client-side navigation
    useEffect(() => {
        if (aboutOpen) {
            document.title = "About — Michael";
        } else if (open && items[current]) {
            document.title = `${items[current].title} — Michael`;
        } else {
            document.title = "Michael";
        }
    }, [open, aboutOpen, current, items]);

    // Recalculate positions on resize
    useEffect(() => {
        if (vw <= 0 || vh <= 0) return;
        if (openRef.current) {
            galleryPageX.jump(-currentRef.current * vw);
            galleryDragX.jump(0);
        } else {
            const max = maxRailScroll(
                items,
                rect.height,
                rect.width,
            );
            const cur = railOffset.get();
            if (cur < -max) railOffset.jump(-max);
            if (cur > 0) railOffset.jump(0);
        }
    }, [vw, vh, galleryPageX, galleryDragX, railOffset, items, rect]);

    // Show overlay once the opening spring settles; close paths set showDetail
    // to false inline (see closeGallery and the popstate handler).
    useMotionValueEvent(openSpring, "change", (v) => {
        if (openRef.current && v > 0.99 && !showDetail) {
            setShowDetail(true);
        }
    });

    // Rail scroll wheel handler (only when closed — overlay handles wheel when open)
    useEffect(() => {
        const el = containerElRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            if (openRef.current) return;
            const delta =
                Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (Math.abs(delta) < 1) return;
            const max = maxRailScroll(
                items,
                rect.height,
                rect.width,
            );
            const cur = railOffset.get();
            railOffset.jump(Math.max(-max, Math.min(0, cur - delta)));
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => {
            el.removeEventListener("wheel", onWheel);
        };
    }, [vw, railOffset, galleryDragX, goToPage, items, rect]);

    const startMomentum = useCallback(
        (velocity: number) => {
            let v = velocity;
            const tick = () => {
                v *= DRAG_DECAY;
                if (Math.abs(v) < 0.5) {
                    momentumRef.current = null;
                    const max = maxRailScroll(
                        items,
                        rect.height,
                        rect.width,
                    );
                    const cur = railOffset.get();
                    if (cur > 0)
                        animate(railOffset, 0, {
                            type: "spring",
                            ...MAIN_SPRING,
                        });
                    else if (cur < -max)
                        animate(railOffset, -max, {
                            type: "spring",
                            ...MAIN_SPRING,
                        });
                    return;
                }
                railOffset.set(railOffset.get() + v);
                const max = maxRailScroll(
                    items,
                    rect.height,
                    rect.width,
                );
                const cur = railOffset.get();
                if (cur > 0 || cur < -max) v *= 1 - RUBBER_BAND_K;
                momentumRef.current = requestAnimationFrame(tick);
            };
            momentumRef.current = requestAnimationFrame(tick);
        },
        [railOffset, items, rect],
    );

    const stopMomentum = useCallback(() => {
        if (momentumRef.current !== null) {
            cancelAnimationFrame(momentumRef.current);
            momentumRef.current = null;
        }
    }, []);

    // ── Pointer handling ──────────────────────────────────────
    const onPointerDown = useCallback(
        (e: React.PointerEvent) => {
            stopMomentum();
            isDraggingRef.current = true;
            didDragRef.current = false;
            dragAxisRef.current = null;
            dragStartRef.current = { x: e.clientX, y: e.clientY };
            lastPointerRef.current = {
                x: e.clientX,
                y: e.clientY,
                t: performance.now(),
            };
            velocityRef.current = { x: 0, y: 0 };
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
        },
        [stopMomentum],
    );

    const onPointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!isDraggingRef.current) return;
            const dx = e.clientX - dragStartRef.current.x;
            const dy = e.clientY - dragStartRef.current.y;

            const now = performance.now();
            const dt = now - lastPointerRef.current.t;
            if (dt > 0) {
                velocityRef.current = {
                    x: (e.clientX - lastPointerRef.current.x) / Math.max(dt, 1),
                    y: (e.clientY - lastPointerRef.current.y) / Math.max(dt, 1),
                };
            }
            lastPointerRef.current = { x: e.clientX, y: e.clientY, t: now };

            if (!dragAxisRef.current) {
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                    dragAxisRef.current =
                        Math.abs(dx) > Math.abs(dy) ? "x" : "y";
                    didDragRef.current = true;
                    if (openRef.current && dragAxisRef.current === "y") {
                        centerRailOn(currentRef.current);
                    }
                } else {
                    return;
                }
            }

            if (!openRef.current) {
                if (dragAxisRef.current === "x") {
                    const max = maxRailScroll(
                        items,
                        rect.height,
                        rect.width,
                    );
                    const cur = railOffset.get();
                    let delta = e.movementX || 0;
                    if ((cur >= 0 && delta > 0) || (cur <= -max && delta < 0))
                        delta *= RUBBER_BAND_K;
                    railOffset.jump(cur + delta);
                }
            }
        },
        [railOffset, centerRailOn, items, rect],
    );

    const findTappedItem = useCallback(
        (screenX: number, screenY: number, scrollOff: number) => {
            const rect = containerElRef.current?.getBoundingClientRect();
            if (!rect) return -1;
            const localX = screenX - rect.left;
            const localY = screenY - rect.top;
            for (let i = 0; i < items.length; i++) {
                const left = railLeftOf(items, i, rect.height) + scrollOff;
                const w = railItemW(items, i, rect.height);
                const itemTop = rect.height * (1 - items[i].railH);
                if (localX >= left && localX <= left + w && localY >= itemTop)
                    return i;
            }
            return -1;
        },
        [items],
    );

    const onPointerUp = useCallback(
        (e: React.PointerEvent) => {
            if (!isDraggingRef.current) return;
            isDraggingRef.current = false;
            const vx = velocityRef.current.x;

            if (!didDragRef.current) {
                if (openRef.current) {
                    // do nothing
                } else {
                    const tapped = findTappedItem(
                        e.clientX,
                        e.clientY,
                        railOffset.get(),
                    );
                    if (tapped >= 0) {
                        const canonical = items[tapped].canonical;
                        if (canonical) {
                            window.open(canonical, "_blank", "noopener");
                        } else {
                            openGallery(tapped);
                        }
                    }
                }
            } else if (!openRef.current) {
                if (dragAxisRef.current === "x") {
                    startMomentum(vx * 16);
                }
            }
            dragAxisRef.current = null;
        },
        [openGallery, startMomentum, railOffset, items, findTappedItem],
    );

    if (!vw) return <div />;

    return (
        <GalleryContext.Provider
            value={{
                open,
                openSpring,
                aboutOpen,
                openAbout,
                closeAbout,
                rect,
            }}
        >
            {/* Back button — fixed, outside both views */}
            <motion.button
                className={clsx(
                    "fixed top-4 left-4 z-[53] size-10 flex items-center justify-center p-0 rounded-full bg-[#EEE]/80 backdrop-blur-2xl border-none cursor-pointer active:scale-96 transition-transform duration-100",
                    open ? "pointer-events-auto" : "pointer-events-none",
                )}
                tabIndex={open ? 0 : -1}
                aria-label="Back"
                style={{ opacity: openSpring }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={closeGallery}
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                        d="M11 3L5 9L11 15"
                        stroke="#333"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </motion.button>

            {/* Home view — centered viewport, goes invisible when detail is active */}
            <div
                className={clsx(
                    "w-full h-screen flex items-center justify-center",
                    showDetail && "invisible absolute overflow-hidden",
                )}
                inert={showDetail || undefined}
            >
                <div className="relative max-w-[80ch] w-full h-[80vh] md:h-[60vh] mx-auto px-4 flex flex-col">
                    {children}

                    {/* Rail / Gallery container */}
                    <div
                        ref={containerRef}
                        className="absolute bottom-0 inset-x-0 h-1/2 overflow-visible touch-none"
                        onPointerDownCapture={() => {
                            dragOnImageRef.current = false;
                        }}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                    >
                        {items.map((item, i) => (
                            <GalleryItem
                                key={item.id}
                                index={i}
                                items={items}
                                current={current}
                                color={item.color}
                                label={item.label}
                                title={item.title}
                                img={item.img}
                                imgAlt={item.imgAlt}
                                open={open}
                                vw={vw}
                                vh={vh}
                                openSpring={openSpring}
                                railScroll={railOffset}
                                galleryPageX={galleryPageX}
                                galleryDragX={galleryDragX}
                                galleryDragY={galleryDragY}
                                dragOnImageRef={dragOnImageRef}
                                onFocusItem={() => centerRailOn(i, true)}
                                onActivate={() => {
                                    const canonical = item.canonical;
                                    if (canonical) {
                                        window.open(
                                            canonical,
                                            "_blank",
                                            "noopener",
                                        );
                                    } else {
                                        openGallery(i);
                                    }
                                }}
                            />
                        ))}
                    </div>

                    <AboutModal
                        open={aboutOpen}
                        onClose={closeAbout}
                        directNav={isAboutDirectNav}
                    />
                </div>
            </div>

            {/* Detail view — normal document flow, browser owns the scroll */}
            {showDetail && (
                <GalleryDetail
                    items={items}
                    current={current}
                    vw={vw}
                    vh={vh}
                    scrollRef={detailScrollRef}
                />
            )}
        </GalleryContext.Provider>
    );
}
