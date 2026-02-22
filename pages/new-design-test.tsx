import {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
    useRef,
} from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    animate,
    type MotionValue,
} from "motion/react";
import Head from "next/head";
import Image from "next/image";
import { createPortal } from "react-dom";
import Face from "../public/images/michael-face.jpg";
import clsx from "clsx";

// ── Data ──────────────────────────────────────────────────────
const ITEMS = [
    {
        color: "#e74c3c",
        label: "1",
        aspect: 1680 / 1279,
        railH: 0.8,
        title: "Item One",
        subtitle: "Lorem ipsum dolor sit amet",
        paras: 5,
    },
    {
        color: "#3498db",
        label: "2",
        aspect: 0.56,
        railH: 1.0,
        title: "Item Two",
        subtitle: "Consectetur adipiscing elit",
        paras: 1,
    },
    {
        color: "#2ecc71",
        label: "3",
        aspect: 1.0,
        railH: 0.8,
        title: "Item Three",
        subtitle: "Sed do eiusmod tempor",
        paras: 3,
    },
    {
        color: "#f39c12",
        label: "4",
        aspect: 1.33,
        railH: 0.7,
        title: "Item Four",
        subtitle: "Ut enim ad minim veniam",
        paras: 2,
    },
    {
        color: "#9b59b6",
        label: "5",
        aspect: 0.56,
        railH: 0.95,
        title: "Item Five",
        subtitle: "Quis nostrud exercitation",
        paras: 6,
    },
    {
        color: "#1abc9c",
        label: "6",
        aspect: 1.5,
        railH: 0.65,
        title: "Item Six",
        subtitle: "Duis aute irure dolor",
        paras: 1,
    },
    {
        color: "#e67e22",
        label: "7",
        aspect: 1.28,
        railH: 0.75,
        title: "Item Seven",
        subtitle: "Excepteur sint occaecat",
        paras: 4,
    },
    {
        color: "#2c3e50",
        label: "8",
        aspect: 0.75,
        railH: 0.9,
        title: "Item Eight",
        subtitle: "Sunt in culpa qui officia",
        paras: 2,
    },
    {
        color: "#c0392b",
        label: "9",
        aspect: 1.6,
        railH: 0.55,
        title: "Item Nine",
        subtitle: "Mollit anim id est laborum",
        paras: 7,
    },
    {
        color: "#16a085",
        label: "10",
        aspect: 1.0,
        railH: 0.85,
        title: "Item Ten",
        subtitle: "Nemo enim ipsam voluptatem",
        paras: 1,
    },
];

// ── Layout constants ──────────────────────────────────────────
const GALLERY_H = 0.6; // gallery item height as fraction of vh
const GALLERY_PAD = 32; // px padding each side in gallery mode
const RAIL_PAD = 16; // px padding each side (matches parent's px-4)
const RAIL_GAP = 64; // px between items

// ── Spring configs ───────────────────────────────────────────
const MAIN_SPRING = { stiffness: 300, damping: 35 };
const PAGE_SPRING = { stiffness: 450, damping: 50 };

// ── Drag thresholds ──────────────────────────────────────────
const DRAG_UP_VELOCITY_THRESHOLD = 0.1;
const DRAG_UP_DISTANCE_RATIO = 0.5;
const GALLERY_PAGE_THRESHOLD = 0.33;
const GALLERY_DISMISS_VELOCITY = 0.1;
const RUBBER_BAND_K = 0.5;
const DRAG_DECAY = 0.96;

// ── Per-item sizing ──────────────────────────────────────────
// Wrapper is always "natural" uncapped size; gallery scale adjusts for narrow vp
function itemFullW(i: number, vh: number) {
    return GALLERY_H * vh * ITEMS[i].aspect;
}

function itemGalleryScale(i: number, vw: number, vh: number) {
    return Math.min(1, (vw - GALLERY_PAD * 2) / itemFullW(i, vh));
}

function itemRailScale(i: number, containerH: number, vh: number) {
    return (ITEMS[i].railH * containerH) / (GALLERY_H * vh);
}

function railItemW(i: number, containerH: number) {
    return ITEMS[i].aspect * ITEMS[i].railH * containerH;
}

function railLeftOf(i: number, containerH: number) {
    let x = RAIL_PAD;
    for (let j = 0; j < i; j++) x += railItemW(j, containerH) + RAIL_GAP;
    return x;
}

function totalRailW(containerH: number) {
    let total = RAIL_PAD * 2;
    for (let i = 0; i < ITEMS.length; i++) {
        total += railItemW(i, containerH);
        if (i < ITEMS.length - 1) total += RAIL_GAP;
    }
    return total;
}

function maxRailScroll(containerH: number, containerW: number) {
    return Math.max(0, totalRailW(containerH) - containerW);
}

// ── Hooks ─────────────────────────────────────────────────────
function useWindowSize() {
    const [size, setSize] = useState({ w: 0, h: 0 });
    useEffect(() => {
        const update = () =>
            setSize({ w: window.innerWidth, h: window.innerHeight });
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);
    return size;
}

// ── Component ─────────────────────────────────────────────────
export default function NewDesignTest() {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState(0);
    const { w: vw, h: vh } = useWindowSize();

    const railOffset = useMotionValue(0);
    const galleryPageX = useMotionValue(0);
    const galleryDragX = useMotionValue(0);
    const galleryDragY = useMotionValue(0);

    const openProgress = useMotionValue(0);
    const openSpring = useSpring(openProgress, MAIN_SPRING);

    const currentRef = useRef(0);
    const openRef = useRef(false);

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

    // Measure container rect every render. Triggers re-render on change
    // so layout-dependent values (sRail, railItemW, etc.) pick up the real dims.
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
        },
        [
            openProgress,
            galleryPageX,
            galleryDragX,
            galleryDragY,
            vw,
        ],
    );

    const centerRailOn = useCallback(
        (idx: number, smooth = false) => {
            if (vw <= 0 || vh <= 0) return;
            const cH = containerRectRef.current.height;
            const w = railItemW(idx, cH);
            const center = railLeftOf(idx, cH) + w / 2;
            const max = maxRailScroll(cH, containerRectRef.current.width);
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
        [railOffset, vw, vh],
    );

    const closeGallery = useCallback(() => {
        setOpen(false);
        openRef.current = false;
        openProgress.set(0);
        galleryDragX.jump(0);
        centerRailOn(currentRef.current, true);
    }, [openProgress, galleryDragX, centerRailOn]);

    const goToPage = useCallback(
        (i: number) => {
            const clamped = Math.max(0, Math.min(i, ITEMS.length - 1));
            setCurrent(clamped);
            currentRef.current = clamped;
            const drag = galleryDragX.get();
            galleryPageX.jump(galleryPageX.get() + drag);
            galleryDragX.jump(0);
            animate(galleryPageX, -clamped * vw, {
                type: "spring",
                ...PAGE_SPRING,
            });
        },
        [galleryPageX, galleryDragX, vw],
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
    }, [closeGallery, goToPage]);

    // Recalculate positions on resize
    useEffect(() => {
        if (vw <= 0 || vh <= 0) return;
        if (openRef.current) {
            galleryPageX.jump(-currentRef.current * vw);
            galleryDragX.jump(0);
        } else {
            const max = maxRailScroll(
                containerRectRef.current.height,
                containerRectRef.current.width,
            );
            const cur = railOffset.get();
            if (cur < -max) railOffset.jump(-max);
            if (cur > 0) railOffset.jump(0);
        }
    }, [vw, vh, galleryPageX, galleryDragX, railOffset]);

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
                // Rail horizontal scroll
                if (Math.abs(e.deltaX) < 1) return;
                const max = maxRailScroll(
                    containerRectRef.current.height,
                    containerRectRef.current.width,
                );
                const cur = railOffset.get();
                railOffset.jump(
                    Math.max(-max, Math.min(0, cur - e.deltaX)),
                );
                return;
            }

            // Eat remaining inertia after navigation — keep resetting
            // the idle timer so navigated only clears when events truly stop
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

            // Gallery: horizontal swipe for page navigation
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
                const isLast =
                    currentRef.current === ITEMS.length - 1;
                if (
                    (isFirst && hAccum + delta > 0) ||
                    (isLast && hAccum + delta < 0)
                ) {
                    delta *= RUBBER_BAND_K;
                }
                hAccum += delta;
                galleryDragX.jump(hAccum);

                // Navigate when distance crosses threshold
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
            // Vertical: let bubble to GalleryItem's window listener
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => {
            el.removeEventListener("wheel", onWheel);
            if (idleTimer) clearTimeout(idleTimer);
        };
    }, [vw, railOffset, galleryDragX, goToPage]);

    const startMomentum = useCallback(
        (velocity: number) => {
            let v = velocity;
            const tick = () => {
                v *= DRAG_DECAY;
                if (Math.abs(v) < 0.5) {
                    momentumRef.current = null;
                    const max = maxRailScroll(
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
                    containerRectRef.current.height,
                    containerRectRef.current.width,
                );
                const cur = railOffset.get();
                if (cur > 0 || cur < -max) v *= 1 - RUBBER_BAND_K;
                momentumRef.current = requestAnimationFrame(tick);
            };
            momentumRef.current = requestAnimationFrame(tick);
        },
        [railOffset, vw, vh],
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
                    const isLast = currentRef.current === ITEMS.length - 1;
                    if ((isFirst && dx > 0) || (isLast && dx < 0))
                        offsetX = dx * RUBBER_BAND_K;
                    galleryDragX.jump(offsetX);
                }
                if (dragAxisRef.current === "y") {
                    if (dragOnImageRef.current && dy > 0) {
                        // Drag down on image → dismiss gesture
                        galleryDragY.jump(dy);
                        openProgress.jump(1 - Math.min(dy / (vh * 0.3), 1));
                    }
                }
            } else {
                if (dragAxisRef.current === "x") {
                    const max = maxRailScroll(
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
        for (let i = 0; i < ITEMS.length; i++) {
            const left = railLeftOf(i, rect.height) + scrollOff;
            const w = railItemW(i, rect.height);
            const itemTop = rect.height * (1 - ITEMS[i].railH);
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
                    // do nothing — use back button or drag-to-dismiss
                } else {
                    const tapped = findTappedItem(
                        e.clientX,
                        e.clientY,
                        railOffset.get(),
                    );
                    if (tapped >= 0) openGallery(tapped);
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
                        // Release dismiss gesture
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
                    // Text scroll — no snap-back needed, already at final position
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
                        if (nearest >= 0) openGallery(nearest);
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
        <>
            <Head>
                <title>Design Test</title>
                <style>{`
                    html, body { overflow: hidden; overscroll-behavior: none; height: 100%; }
                    @media (any-pointer: coarse) {
                        .gallery-portal { pointer-events: auto !important; touch-action: pan-y; }
                    }
                `}</style>
            </Head>

            <div className="relative max-w-[80ch] w-full h-[60vh] mx-auto px-4 flex flex-col">
                {/* Max-width content area — fills space above rail */}
                <div
                    className={clsx(
                        "flex flex-col gap-4 transition-opacity duration-200",
                        !open
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none",
                    )}
                >
                    <div className="flex gap-4 items-center">
                        <Image
                            className="w-10 rounded-full shadow ring ring-black/10 dark:ring-white/5"
                            src={Face}
                            alt="Photo of Michael"
                        />
                        <div className="-space-y-1">
                            <h1 className="font-semibold">Michael</h1>
                            <p className="font-medium text-muted">
                                Senior Designer at Microsoft
                            </p>
                        </div>
                    </div>
                    <p>Hello</p>
                </div>

                {/* Back button — outside gallery container for z-index above portal */}
                <motion.button
                    className={clsx(
                        "fixed top-4 left-4 z-[53] size-10 flex items-center justify-center p-0 rounded-full bg-white/80 dark:bg-black/80 border-none cursor-pointer",
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
                        "absolute bottom-0 inset-x-0 h-8/12 overflow-visible touch-none",
                        open ? "z-51" : "z-auto",
                    )}
                    onPointerDownCapture={() => {
                        dragOnImageRef.current = false;
                    }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                >
                    {ITEMS.map((item, i) => (
                        <GalleryItem
                            key={i}
                            index={i}
                            current={current}
                            color={item.color}
                            label={item.label}
                            title={item.title}
                            subtitle={item.subtitle}
                            img={item?.img}
                            paras={item.paras}
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

                    {/* Gallery backdrop — fixed overlay inside container for events + bg */}
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

            </div>
        </>
    );
}

// ── Individual item ───────────────────────────────────────────
const LOREM =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

function GalleryItem({
    index,
    current,
    color,
    label,
    title,
    subtitle,
    img,
    paras,
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
    current: number;
    color: string;
    label: string;
    title: string;
    subtitle: string;
    img?: string;
    paras: number;
    open: boolean;
    vw: number;
    vh: number;
    openSpring: ReturnType<typeof useSpring>;
    railScroll: ReturnType<typeof useMotionValue>;
    galleryPageX: ReturnType<typeof useMotionValue>;
    galleryDragX: ReturnType<typeof useMotionValue>;
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
    const naturalW = itemFullW(index, vh);
    const galScale = itemGalleryScale(index, vw, vh);
    const sRail = itemRailScale(index, cH, vh);
    const originOff = (naturalW * (1 - sRail)) / 2;
    const myRailLeft = railLeftOf(index, cH);
    const isActive = open && index === current;
    const isNearby = !open || Math.abs(index - current) <= 1;

    // Local scroll value — only the active item updates this, so scroll
    // events don't trigger transform recomputation for the other 9 items
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
            // Short-circuit for off-screen items in gallery mode
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

    // Static counter-scale: compensates for galScale so text is 1:1 at full gallery,
    // but scales naturally with the wrapper during open/close/dismiss transitions
    const textScale = 1 / galScale;

    // Text opacity: fades with open spring AND proximity to center (for page swipes)
    const textOpacity = useTransform(
        [galleryPageX, galleryDragX, openSpring] as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        ([pageX, dragX, progress]: number[]) => {
            const dist = Math.abs(pageX + dragX + index * vw);
            const proximity = Math.max(0, 1 - dist / (vw * 0.5));
            return proximity * progress;
        },
    );

    // Measure text height for portal scroll track
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

    // Portal scroll track: transparent native scroll container
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const imageBottom = (vh + GALLERY_H * vh * galScale) / 2;

    // Delay portal mount until open animation completes
    const [showPortal, setShowPortal] = useState(false);
    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(() => setShowPortal(true), 350);
            return () => clearTimeout(timer);
        }
        setShowPortal(false);
    }, [isActive]);

    // Wheel handler on window: forwards deltaY to portal scrollTop + overscroll-to-dismiss
    // On window so it works even with pointer-events:none on the portal
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

            // At top + scrolling up → enter overscroll
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

            // Forward to portal for native scrollTop tracking + scrollbar
            portalEl.scrollTop += e.deltaY;
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        return () => {
            window.removeEventListener("wheel", onWheel);
            if (idleTimer) clearTimeout(idleTimer);
        };
    }, [showPortal, vh, closeGallery, openProgressRaw, galleryDragY]);

    // Sync native scroll → galleryScrollY; detect iOS negative scrollTop for dismiss
    useEffect(() => {
        if (!showPortal) return;
        const el = scrollContainerRef.current;
        if (!el) return;
        const onScroll = () => {
            const st = el.scrollTop;
            if (st < 0) {
                // iOS rubber-band overscroll at top → track as dismiss gesture
                const pull = -st;
                galleryDragY.jump(pull);
                openProgressRaw.jump(
                    Math.max(0, 1 - pull / (vh * 0.3)),
                );
                if (pull > vh * 0.15) {
                    closeGallery();
                }
            } else {
                // Reset dismiss state if rubber-band sprang back
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
    // touch-action: pan-y lets browser handle vertical scroll; horizontal fires pointer events
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
            // Stop React synthetic event from bubbling to container's handlers
            e.stopPropagation();
            // Only swipe on image — account for scroll offset
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

            // Track velocity
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
            const isLast = index === ITEMS.length - 1;
            if ((isFirst && dx > 0) || (isLast && dx < 0))
                offsetX *= RUBBER_BAND_K;
            galleryDragX.jump(offsetX);
        },
        [galleryDragX, index],
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
            const vx = ref.vx; // px/ms
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
            {/* Colored box */}
            <motion.div
                className="absolute inset-0 cursor-pointer"
                onPointerDown={() => {
                    dragOnImageRef.current = true;
                }}
                style={{
                    background: !img && color,
                    // borderRadius,
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

            {/* Text anchored to item — scales with wrapper during open/close/dismiss */}
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
                        <h2 className="font-bold text-2xl">{title}</h2>
                        <p className="text-muted">{subtitle}</p>
                    </div>
                    {Array.from({ length: paras }, (_, j) => (
                        <p key={j}>{LOREM}</p>
                    ))}
                </div>
            </motion.div>

            {/* Transparent portal scroll track — provides native scroll mechanics */}
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
