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
import { motion, useMotionValue, animate } from "motion/react";
import clsx from "clsx";
import { useWindowSize } from "../../hooks/useWindowSize";
import { GalleryContext } from "./GalleryContext";
import type { ItemData } from "./types";
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
import { DismissButton } from "../DismissButton";

export function GalleryShell({
    items: realItems,
    children,
    initialItem,
    initialAbout = false,
}: {
    items: ItemData[];
    children?: ReactNode;
    initialItem?: string;
    initialAbout?: boolean;
}) {
    // Initial state derived from server-supplied route props so the SSR
    // HTML and the first client render agree (no `typeof window` reads
    // during render, which would otherwise cause hydration mismatches).
    const items = useMemo(() => realItems, [realItems]);
    const idToIndex = useMemo(() => {
        const map = new Map<string, number>();
        items.forEach((item, i) => map.set(item.id, i));
        return map;
    }, [items]);
    const initialIndex =
        initialItem != null ? (idToIndex.get(initialItem) ?? 0) : 0;
    const isWorkDirectNav = initialItem != null && initialIndex >= 0;

    const [open, setOpen] = useState(isWorkDirectNav);
    const [aboutOpen, setAboutOpen] = useState(initialAbout);
    const aboutDirectNavRef = useRef(initialAbout);

    const [current, setCurrent] = useState(initialIndex);
    const [showDetail, setShowDetail] = useState(isWorkDirectNav);
    const detailScrollRef = useRef<HTMLDivElement>(null);
    const { w: vw, h: vh } = useWindowSize();

    const railOffset = useMotionValue(0);
    const galleryPageX = useMotionValue(0);
    const galleryDragX = useMotionValue(0);
    const galleryDragY = useMotionValue(0);
    // openProgress is the actual value children read for the morph
    // animation. Driven via animate() so we get an onComplete callback
    // that fires when the spring has truly settled — the previous
    // useSpring + value-threshold approach left a residual visible jump
    // (~5px on mobile) when motion's restDelta-based auto-rest snapped
    // the value from the threshold to 1.
    const openProgress = useMotionValue(isWorkDirectNav ? 1 : 0);
    const openSpring = openProgress; // alias for prop compatibility

    const currentRef = useRef(initialIndex);
    const openRef = useRef(isWorkDirectNav);
    const directNavRef = useRef(isWorkDirectNav);

    const dragAxisRef = useRef<"x" | "y" | null>(null);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const didDragRef = useRef(false);
    const momentumRef = useRef<number | null>(null);
    // Tracks an in-flight scroll-to-top tween so a second close (e.g. user
    // hits Back while close is still scrolling) can cancel it rather than
    // letting two morph springs chain up. See scrollThenMorph below.
    const scrollAnimRef = useRef<ReturnType<typeof animate> | null>(null);
    const lastPointerRef = useRef({ x: 0, y: 0, t: 0 });
    const velocityRef = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const containerRectRef = useRef({
        left: 0,
        bottom: 0,
        width: 0,
        height: 0,
    });
    const [, setRectVersion] = useState(0);

    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const measure = () => {
            const r = el.getBoundingClientRect();
            const prev = containerRectRef.current;
            const sizeChanged =
                prev.height !== r.height || prev.width !== r.width;
            const positionChanged =
                prev.left !== r.left || prev.bottom !== r.bottom;
            if (!sizeChanged && !positionChanged) return;
            containerRectRef.current = {
                left: r.left,
                bottom: r.bottom,
                width: r.width,
                height: r.height,
            };
            // Position-only changes (e.g. page scroll) are read live by
            // motion's useTransform callbacks via the ref — they don't
            // need a React re-render. Only re-render on size changes,
            // which feed values consumed in GalleryItem's render body.
            if (sizeChanged) setRectVersion((v) => v + 1);
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

    // For direct nav (initialItem set), once vw resolves position the
    // page-level x offset so the correct item is centered. openProgress
    // is already at 1 from the initial-state branch.
    const directNavPositioned = useRef(false);
    useLayoutEffect(() => {
        if (!isWorkDirectNav || vw <= 0 || directNavPositioned.current) return;
        directNavPositioned.current = true;
        openProgress.jump(1);
        galleryPageX.jump(-initialIndex * vw);
        galleryDragX.jump(0);
        galleryDragY.jump(0);
    }, [vw]); // eslint-disable-line react-hooks/exhaustive-deps

    const openGallery = useCallback(
        (i: number) => {
            setCurrent(i);
            currentRef.current = i;
            setOpen(true);
            openRef.current = true;
            galleryPageX.jump(-i * vw);
            galleryDragX.jump(0);
            galleryDragY.jump(0);
            animate(openProgress, 1, {
                type: "spring",
                ...MAIN_SPRING,
                onComplete: () => {
                    if (openRef.current) setShowDetail(true);
                },
            });
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
            const cH = containerRectRef.current.height;
            const w = railItemW(items, idx, cH);
            const center = railLeftOf(items, idx, cH) + w / 2;
            const max = maxRailScroll(
                items,
                cH,
                containerRectRef.current.width,
            );
            const vpCenter = vw / 2 - containerRectRef.current.left;
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
        [railOffset, vw, vh, items],
    );

    // Two-phase close: smooth-scroll the article back to top, then run the
    // morph spring from a clean layout state. Reused by closeGallery (user
    // action) and the popstate handler (browser back). `smoothRail` lets the
    // popstate path animate the rail recenter so the user sees motion when
    // navigating back; user-initiated close jumps the rail since the user is
    // already focused on the morph.
    const scrollThenMorph = useCallback(
        (smoothRail = false) => {
            const runMorph = () => {
                setOpen(false);
                openRef.current = false;
                setShowDetail(false);
                animate(openProgress, 0, {
                    type: "spring",
                    ...MAIN_SPRING,
                });
                galleryDragX.jump(0);
                centerRailOn(currentRef.current, smoothRail);
            };
            // Cancel any in-flight scroll tween from a prior close — without
            // this, a popstate firing while user-initiated close is still
            // scrolling would chain two runMorph() invocations, launching a
            // duplicate (no-op but wasteful) morph spring.
            scrollAnimRef.current?.stop();
            scrollAnimRef.current = null;
            const startY = window.scrollY;
            if (startY > 0) {
                const scrollAnim = animate(startY, 0, {
                    duration: 0.28,
                    ease: [0.32, 0.72, 0, 1],
                    onUpdate: (v) => window.scrollTo(0, v),
                });
                scrollAnimRef.current = scrollAnim;
                scrollAnim.finished
                    .then(() => {
                        if (scrollAnimRef.current === scrollAnim) {
                            scrollAnimRef.current = null;
                            runMorph();
                        }
                    })
                    .catch(() => {});
            } else {
                runMorph();
            }
        },
        [openProgress, galleryDragX, centerRailOn],
    );

    const closeGallery = useCallback(() => {
        // Smooth-scroll the article back to the top first. Once scroll hits 0
        // the morph runs from a clean, known-good layout state. We use a
        // short tween rather than the project's spring because the spring's
        // tight restDelta produces a long settle tail (~half a second of
        // sub-pixel motion) which shows up as dead time before the morph.
        scrollThenMorph();
        if (directNavRef.current) {
            directNavRef.current = false;
            history.replaceState(null, "", "/");
        } else {
            history.back();
        }
    }, [scrollThenMorph]);

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
                scrollThenMorph(true);
            }
        };
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, [idToIndex, openGallery, scrollThenMorph]);

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
                containerRectRef.current.height,
                containerRectRef.current.width,
            );
            const cur = railOffset.get();
            if (cur < -max) railOffset.jump(-max);
            if (cur > 0) railOffset.jump(0);
        }
    }, [vw, vh, galleryPageX, galleryDragX, railOffset, items]);

    // showDetail is set true via animate's onComplete in openGallery (animated
    // open) or initialized true via useState(isWorkDirectNav) (direct nav).
    // Close paths set it false inline (closeGallery and the popstate handler).

    // Swap the home view (with the morphing rail item) for the gallery
    // detail (with the hero at its final position) once the spring is
    // close to settled. The rail-to-hero translation is ~460px on mobile,
    // so any residual error at the swap is visible — snap the spring to
    // exactly 1 so the item lands pixel-perfect on the hero. The tight
    // restDelta in MAIN_SPRING ensures we get here with a sub-pixel error.
    // showDetail is now driven by animate's onComplete (in openGallery).
    // For direct nav, the openProgress is initialized to 1 and showDetail
    // to true so we never need a threshold-based swap here.

    // Rail scroll wheel handler (only when closed — overlay handles wheel when open)
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            if (openRef.current) return;
            // Rail responds only to horizontal intent. Vertical scroll is
            // ignored so a stray trackpad gesture doesn't move the rail.
            if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
            // Block the browser's horizontal swipe-back gesture so trackpad
            // scrolls drive the rail instead of navigating history.
            e.preventDefault();
            const delta = e.deltaX;
            if (Math.abs(delta) < 1) return;
            const max = maxRailScroll(
                items,
                containerRectRef.current.height,
                containerRectRef.current.width,
            );
            const cur = railOffset.get();
            railOffset.jump(Math.max(-max, Math.min(0, cur - delta)));
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => {
            el.removeEventListener("wheel", onWheel);
        };
    }, [vw, railOffset, galleryDragX, goToPage, items]);

    const startMomentum = useCallback(
        (velocity: number) => {
            let v = velocity;
            const tick = () => {
                v *= DRAG_DECAY;
                if (Math.abs(v) < 0.5) {
                    momentumRef.current = null;
                    const max = maxRailScroll(
                        items,
                        containerRectRef.current.height,
                        containerRectRef.current.width,
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
                    containerRectRef.current.height,
                    containerRectRef.current.width,
                );
                const cur = railOffset.get();
                if (cur > 0 || cur < -max) v *= 1 - RUBBER_BAND_K;
                momentumRef.current = requestAnimationFrame(tick);
            };
            momentumRef.current = requestAnimationFrame(tick);
        },
        [railOffset, items],
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
                        containerRectRef.current.height,
                        containerRectRef.current.width,
                    );
                    const cur = railOffset.get();
                    let delta = e.movementX || 0;
                    if ((cur >= 0 && delta > 0) || (cur <= -max && delta < 0))
                        delta *= RUBBER_BAND_K;
                    railOffset.jump(cur + delta);
                }
            }
        },
        [railOffset, centerRailOn, items],
    );

    const findTappedItem = useCallback(
        (screenX: number, screenY: number, scrollOff: number) => {
            const rect = containerRef.current?.getBoundingClientRect();
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

    return (
        <GalleryContext.Provider
            value={{
                open,
                openSpring,
                openAbout,
                containerRectRef,
            }}
        >
            {/* Back button — fixed, outside both views */}
            <motion.div
                className="fixed top-6 left-6 z-53"
                style={{ opacity: openSpring }}
                onPointerDown={(e) => e.stopPropagation()}
            >
                <DismissButton
                    variant="back"
                    onClick={closeGallery}
                    pointerEventsAuto={open}
                    tabIndex={open ? 0 : -1}
                />
            </motion.div>

            {/* Home view — centered viewport, goes invisible when detail is
                active. closeGallery smooth-scrolls to 0 BEFORE flipping
                showDetail, so by the time this swaps from invisible to
                visible the document is already at scroll=0 and the morph
                spring runs from a clean layout state. */}
            <div
                className={clsx(
                    "w-full h-screen flex items-center justify-center",
                    showDetail && "invisible absolute overflow-hidden",
                )}
                inert={showDetail || undefined}
            >
                <div className="relative max-w-[80ch] w-full h-[80vh] md:h-[70vh] md:max-h-140 mx-auto px-4 flex flex-col">
                    {children}

                    {/* Rail / Gallery container */}
                    <div
                        ref={containerRef}
                        className="absolute bottom-0 inset-x-0 h-1/2 overflow-visible touch-none"
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                    >
                        {vw > 0 &&
                            items.map((item, i) => (
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
                                    // LCP: on the home rail the leftmost item is
                                    // the LCP candidate; mark a few neighbors
                                    // eager so they don't lazy-defer above the
                                    // fold. On direct nav the rail is invisible
                                    // (the GalleryDetail hero owns LCP) so we
                                    // skip priority/eager hints here entirely.
                                    priority={!isWorkDirectNav && i === 0}
                                    eager={!isWorkDirectNav && i > 0 && i < 4}
                                    entryEnabled={!isWorkDirectNav}
                                    entryDelay={0.15 + i * 0.06}
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
                        directNav={initialAbout}
                    />
                </div>
            </div>

            {/* Detail view — normal document flow, browser owns the scroll */}
            {showDetail && (
                <GalleryDetail
                    items={items}
                    current={current}
                    open={open}
                    vw={vw}
                    vh={vh}
                    openSpring={openSpring}
                    closeGallery={closeGallery}
                    scrollRef={detailScrollRef}
                />
            )}
        </GalleryContext.Provider>
    );
}
