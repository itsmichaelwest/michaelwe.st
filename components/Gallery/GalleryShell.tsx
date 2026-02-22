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
    useSpring,
    animate,
} from "motion/react";
import clsx from "clsx";
import { useWindowSize } from "../../hooks/useWindowSize";
import { GalleryContext } from "./GalleryContext";
import type { ItemData } from "./types";
import { SAMPLE_ITEMS } from "./types";
import {
    GALLERY_H,
    MAIN_SPRING,
    PAGE_SPRING,
    DRAG_UP_VELOCITY_THRESHOLD,
    DRAG_UP_DISTANCE_RATIO,
    GALLERY_PAGE_THRESHOLD,
    GALLERY_DISMISS_VELOCITY,
    RUBBER_BAND_K,
    DRAG_DECAY,
} from "./constants";
import {
    railItemW,
    railLeftOf,
    maxRailScroll,
} from "./utils";
import { GalleryItem } from "./GalleryItem";
import { AboutModal } from "../AboutModal";

export function GalleryShell({ items: realItems, children }: { items: ItemData[]; children?: ReactNode }) {
    const isDirectNav = typeof window !== "undefined" &&
        /^(?:\/en)?\/work\/.+$/.test(window.location.pathname);
    const isAboutDirectNav = typeof window !== "undefined" &&
        window.location.pathname === "/about";
    const [open, setOpen] = useState(isDirectNav);
    const [aboutOpen, setAboutOpen] = useState(isAboutDirectNav);
    const aboutDirectNavRef = useRef(isAboutDirectNav);
    const [current, setCurrent] = useState(0);
    const { w: vw, h: vh } = useWindowSize();
    const items = useMemo(
        () => process.env.NODE_ENV === "production"
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
    const containerRef = useRef<HTMLDivElement>(null);
    const containerRectRef = useRef({
        left: 0,
        bottom: 0,
        width: 0,
        height: 0,
    });
    const [, setRectVersion] = useState(0);

    useLayoutEffect(() => {
        if (containerRef.current) {
            const r = containerRef.current.getBoundingClientRect();
            const prev = containerRectRef.current;
            containerRectRef.current = {
                left: r.left,
                bottom: r.bottom,
                width: r.width,
                height: r.height,
            };
            if (
                prev.height !== r.height ||
                prev.width !== r.width ||
                prev.left !== r.left ||
                prev.bottom !== r.bottom
            ) {
                setRectVersion((v) => v + 1);
            }
        }
    });

    // Direct navigation — wait for vw so positions are correct before first paint
    const directNavChecked = useRef(false);
    useLayoutEffect(() => {
        if (vw <= 0 || directNavChecked.current) return;
        directNavChecked.current = true;
        const match = window.location.pathname.match(/^(?:\/en)?\/work\/(.+)$/);
        if (!match) return;
        const idx = idToIndex.get(match[1]);
        if (idx == null) return;
        directNavRef.current = true;
        setCurrent(idx);
        currentRef.current = idx;
        setOpen(true);
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
            if (!/^s\d+$/.test(id) && window.location.pathname !== `/work/${id}`) {
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
            const max = maxRailScroll(items, cH, containerRectRef.current.width);
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

    const closeGallery = useCallback(() => {
        setOpen(false);
        openRef.current = false;
        openProgress.set(0);
        galleryDragX.jump(0);
        centerRailOn(currentRef.current, true);
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

            const match = window.location.pathname.match(/^(?:\/en)?\/work\/(.+)$/);
            if (match) {
                const idx = idToIndex.get(match[1]);
                if (idx != null && !openRef.current) openGallery(idx);
            } else if (openRef.current) {
                setOpen(false);
                openRef.current = false;
                openProgress.set(0);
                galleryDragX.jump(0);
                centerRailOn(currentRef.current, true);
            }
        };
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, [idToIndex, openGallery, openProgress, galleryDragX, centerRailOn]);

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

    // Non-passive wheel: rail scroll (closed) + horizontal gallery swipe (open)
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let hAccum = 0;
        let hActive = false;
        let navigated = false;
        let idleTimer: ReturnType<typeof setTimeout> | null = null;

        const onWheel = (e: WheelEvent) => {
            if (!openRef.current) {
                hActive = false;
                hAccum = 0;
                navigated = false;
                const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY)
                    ? e.deltaX
                    : e.deltaY;
                if (Math.abs(delta) < 1) return;
                const max = maxRailScroll(
                    items,
                    containerRectRef.current.height,
                    containerRectRef.current.width,
                );
                const cur = railOffset.get();
                railOffset.jump(
                    Math.max(-max, Math.min(0, cur - delta)),
                );
                return;
            }

            if (navigated) {
                e.preventDefault();
                e.stopPropagation();
                if (idleTimer) clearTimeout(idleTimer);
                idleTimer = setTimeout(() => {
                    hActive = false;
                    hAccum = 0;
                    navigated = false;
                }, 300);
                return;
            }

            if (
                hActive ||
                (Math.abs(e.deltaX) > Math.abs(e.deltaY) &&
                    Math.abs(e.deltaX) > 1)
            ) {
                e.preventDefault();
                e.stopPropagation();

                hActive = true;

                let delta = -e.deltaX;
                const isFirst = currentRef.current === 0;
                const isLast = currentRef.current === items.length - 1;
                if (
                    (isFirst && hAccum + delta > 0) ||
                    (isLast && hAccum + delta < 0)
                ) {
                    delta *= RUBBER_BAND_K;
                }
                hAccum += delta;
                galleryDragX.jump(hAccum);

                const threshold = vw * GALLERY_PAGE_THRESHOLD;
                if (hAccum < -threshold) {
                    navigated = true;
                    goToPage(currentRef.current + 1);
                } else if (hAccum > threshold) {
                    navigated = true;
                    goToPage(currentRef.current - 1);
                }

                if (idleTimer) clearTimeout(idleTimer);
                idleTimer = setTimeout(
                    () => {
                        if (!navigated) {
                            animate(galleryDragX, 0, {
                                type: "spring",
                                ...PAGE_SPRING,
                            });
                        }
                        hActive = false;
                        hAccum = 0;
                        navigated = false;
                    },
                    navigated ? 500 : 150,
                );
                return;
            }
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => {
            el.removeEventListener("wheel", onWheel);
            if (idleTimer) clearTimeout(idleTimer);
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
        [railOffset, vw, vh, items],
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

            if (openRef.current) {
                if (dragAxisRef.current === "x" && dragOnImageRef.current) {
                    let offsetX = dx;
                    const isFirst = currentRef.current === 0;
                    const isLast = currentRef.current === items.length - 1;
                    if ((isFirst && dx > 0) || (isLast && dx < 0))
                        offsetX = dx * RUBBER_BAND_K;
                    galleryDragX.jump(offsetX);
                }
                if (dragAxisRef.current === "y") {
                    if (dragOnImageRef.current && dy > 0) {
                        galleryDragY.jump(dy);
                        openProgress.jump(1 - Math.min(dy / (vh * 0.3), 1));
                    }
                }
            } else {
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
                if (dragAxisRef.current === "y" && dy < 0) {
                    openProgress.jump(Math.min(Math.abs(dy) / (vh * 0.3), 1));
                }
            }
        },
        [
            galleryDragX,
            galleryDragY,
            openProgress,
            railOffset,
            vw,
            vh,
            centerRailOn,
            items,
        ],
    );

    function findTappedItem(
        screenX: number,
        screenY: number,
        scrollOff: number,
    ) {
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
    }

    const onPointerUp = useCallback(
        (e: React.PointerEvent) => {
            if (!isDraggingRef.current) return;
            isDraggingRef.current = false;
            const dx = e.clientX - dragStartRef.current.x;
            const dy = e.clientY - dragStartRef.current.y;
            const vx = velocityRef.current.x;
            const vy = velocityRef.current.y;

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
            } else if (openRef.current) {
                if (dragAxisRef.current === "x" && dragOnImageRef.current) {
                    const threshold = vw * GALLERY_PAGE_THRESHOLD;
                    if (dx < -threshold || vx < -DRAG_UP_VELOCITY_THRESHOLD)
                        goToPage(currentRef.current + 1);
                    else if (dx > threshold || vx > DRAG_UP_VELOCITY_THRESHOLD)
                        goToPage(currentRef.current - 1);
                    else
                        animate(galleryDragX, 0, {
                            type: "spring",
                            ...PAGE_SPRING,
                        });
                } else if (dragAxisRef.current === "y") {
                    if (dragOnImageRef.current) {
                        if (dy > vh * 0.2 || vy > GALLERY_DISMISS_VELOCITY) {
                            closeGallery();
                        } else {
                            openProgress.set(1);
                            animate(galleryDragY, 0, {
                                type: "spring",
                                ...MAIN_SPRING,
                            });
                        }
                    }
                }
            } else {
                if (dragAxisRef.current === "x") {
                    startMomentum(vx * 16);
                } else if (dragAxisRef.current === "y" && dy < 0) {
                    const prog = Math.abs(dy) / (vh * 0.3);
                    if (
                        prog > DRAG_UP_DISTANCE_RATIO ||
                        Math.abs(vy) > DRAG_UP_VELOCITY_THRESHOLD
                    ) {
                        const nearest = findTappedItem(
                            dragStartRef.current.x,
                            dragStartRef.current.y,
                            railOffset.get(),
                        );
                        if (nearest >= 0) {
                            const canonical = items[nearest].canonical;
                            if (canonical) {
                                openProgress.set(0);
                                window.open(canonical, "_blank", "noopener");
                            } else {
                                openGallery(nearest);
                            }
                        }
                    } else {
                        openProgress.set(0);
                    }
                } else {
                    openProgress.set(0);
                }
            }
            dragAxisRef.current = null;
        },
        [
            vw,
            vh,
            goToPage,
            closeGallery,
            openGallery,
            openProgress,
            galleryDragX,
            galleryDragY,
            startMomentum,
            railOffset,
        ],
    );

    if (!vw) return <div />;

    return (
        <GalleryContext.Provider value={{ open, openSpring, aboutOpen, openAbout, closeAbout }}>
            <div className="relative max-w-[80ch] w-full h-[60vh] mx-auto px-4 flex flex-col">
                {children}

                {/* Back button */}
                <motion.button
                    className={clsx(
                        "fixed top-4 left-4 z-[53] size-10 flex items-center justify-center p-0 rounded-full bg-[#EEE]/80 backdrop-blur-2xl border-none cursor-pointer",
                        open
                            ? "pointer-events-auto"
                            : "pointer-events-none",
                    )}
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

                {/* Rail / Gallery container */}
                <div
                    ref={containerRef}
                    className={clsx(
                        "absolute bottom-0 inset-x-0 h-1/2 md:h-7/12 overflow-visible touch-none",
                        open ? "z-51" : "z-auto",
                    )}
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
                            itemCount={items.length}
                            current={current}
                            color={item.color}
                            label={item.label}
                            title={item.title}
                            subtitle={item.subtitle}
                            img={item.img}
                            noMSFT={item.noMSFT}
                            year={item.year}
                            paras={item.paras}
                            mdxSource={item.mdxSource}
                            open={open}
                            vw={vw}
                            vh={vh}
                            openSpring={openSpring}
                            railScroll={railOffset}
                            galleryPageX={galleryPageX}
                            galleryDragX={galleryDragX}
                            galleryDragY={galleryDragY}
                            closeGallery={closeGallery}
                            goToPage={goToPage}
                            openProgressRaw={openProgress}
                            dragOnImageRef={dragOnImageRef}
                            containerRectRef={containerRectRef}
                        />
                    ))}

                    {/* Gallery backdrop */}
                    <motion.div
                        className={clsx(
                            "fixed inset-0 z-0",
                            open
                                ? "pointer-events-auto"
                                : "pointer-events-none",
                        )}
                        style={{
                            opacity: openSpring,
                        }}
                    />
                </div>
                <AboutModal open={aboutOpen} onClose={closeAbout} directNav={isAboutDirectNav} />
            </div>
        </GalleryContext.Provider>

    );
}
