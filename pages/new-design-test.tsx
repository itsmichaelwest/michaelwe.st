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
} from "motion/react";
import Head from "next/head";
import Image from "next/image";

import Face from "../public/images/michael-face.jpg";
import clsx from "clsx";

// ── Data ──────────────────────────────────────────────────────
const ITEMS = [
    {
        color: "#e74c3c",
        label: "1",
        aspect: 1.75,
        railH: 0.12,
        title: "Item One",
        subtitle: "Lorem ipsum dolor sit amet",
        paras: 5,
    },
    {
        color: "#3498db",
        label: "2",
        aspect: 0.56,
        railH: 0.2,
        title: "Item Two",
        subtitle: "Consectetur adipiscing elit",
        paras: 1,
    },
    {
        color: "#2ecc71",
        label: "3",
        aspect: 1.0,
        railH: 0.16,
        title: "Item Three",
        subtitle: "Sed do eiusmod tempor",
        paras: 3,
    },
    {
        color: "#f39c12",
        label: "4",
        aspect: 1.33,
        railH: 0.14,
        title: "Item Four",
        subtitle: "Ut enim ad minim veniam",
        paras: 2,
    },
    {
        color: "#9b59b6",
        label: "5",
        aspect: 0.56,
        railH: 0.19,
        title: "Item Five",
        subtitle: "Quis nostrud exercitation",
        paras: 6,
    },
    {
        color: "#1abc9c",
        label: "6",
        aspect: 1.5,
        railH: 0.13,
        title: "Item Six",
        subtitle: "Duis aute irure dolor",
        paras: 1,
    },
    {
        color: "#e67e22",
        label: "7",
        aspect: 1.28,
        railH: 0.15,
        title: "Item Seven",
        subtitle: "Excepteur sint occaecat",
        paras: 4,
    },
    {
        color: "#2c3e50",
        label: "8",
        aspect: 0.75,
        railH: 0.18,
        title: "Item Eight",
        subtitle: "Sunt in culpa qui officia",
        paras: 2,
    },
    {
        color: "#c0392b",
        label: "9",
        aspect: 1.6,
        railH: 0.11,
        title: "Item Nine",
        subtitle: "Mollit anim id est laborum",
        paras: 7,
    },
    {
        color: "#16a085",
        label: "10",
        aspect: 1.0,
        railH: 0.17,
        title: "Item Ten",
        subtitle: "Nemo enim ipsam voluptatem",
        paras: 1,
    },
];

// ── Layout constants ──────────────────────────────────────────
const MAX_RAIL_H = Math.max(...ITEMS.map((item) => item.railH));
const GALLERY_H = 0.6; // gallery item height as fraction of vh
const GALLERY_PAD = 32; // px padding each side in gallery mode
const RAIL_PAD = 0; // px padding each side
const RAIL_GAP = 12; // px between items
const RAIL_BOTTOM = 0; // px inset from viewport bottom

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

function itemRailScale(i: number) {
    return ITEMS[i].railH / GALLERY_H;
}

function railItemW(i: number, vh: number) {
    return ITEMS[i].aspect * ITEMS[i].railH * vh;
}

function railLeftOf(i: number, vh: number) {
    let x = RAIL_PAD;
    for (let j = 0; j < i; j++) x += railItemW(j, vh) + RAIL_GAP;
    return x;
}

function maxRailScroll(vh: number, containerWidth: number) {
    let total = RAIL_PAD * 2;
    for (let i = 0; i < ITEMS.length; i++) {
        total += railItemW(i, vh);
        if (i < ITEMS.length - 1) total += RAIL_GAP;
    }
    return Math.max(0, total - containerWidth);
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
    const galleryScrollY = useMotionValue(0);

    const openProgress = useMotionValue(0);
    const openSpring = useSpring(openProgress, MAIN_SPRING);

    const currentRef = useRef(0);
    const openRef = useRef(false);
    const scrollMaxRef = useRef(0);

    const dragAxisRef = useRef<"x" | "y" | null>(null);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const didDragRef = useRef(false);
    const momentumRef = useRef<number | null>(null);
    const lastPointerRef = useRef({ x: 0, y: 0, t: 0 });
    const velocityRef = useRef({ x: 0, y: 0 });
    const dragOnImageRef = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const containerRectRef = useRef({ left: 0, bottom: 0, width: 0 });

    // Measure container rect every render — stays fresh regardless of layout
    useLayoutEffect(() => {
        if (containerRef.current) {
            const r = containerRef.current.getBoundingClientRect();
            containerRectRef.current = {
                left: r.left,
                bottom: r.bottom,
                width: r.width,
            };
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
            galleryScrollY.jump(0);
        },
        [
            openProgress,
            galleryPageX,
            galleryDragX,
            galleryDragY,
            galleryScrollY,
            vw,
        ],
    );

    const centerRailOn = useCallback(
        (idx: number) => {
            if (vw <= 0 || vh <= 0) return;
            const w = railItemW(idx, vh);
            const center = railLeftOf(idx, vh) + w / 2;
            const max = maxRailScroll(vh, containerRectRef.current.width);
            const vpCenter = vw / 2 - containerRectRef.current.left;
            railOffset.jump(Math.max(-max, Math.min(0, vpCenter - center)));
        },
        [railOffset, vw, vh],
    );

    const closeGallery = useCallback(() => {
        setOpen(false);
        openRef.current = false;
        openProgress.set(0);
        galleryDragX.jump(0);
        animate(galleryDragY, 0, { type: "spring", ...MAIN_SPRING });
        galleryScrollY.jump(0);
        centerRailOn(currentRef.current);
    }, [
        openProgress,
        galleryDragX,
        galleryDragY,
        galleryScrollY,
        centerRailOn,
    ]);

    const goToPage = useCallback(
        (i: number) => {
            const clamped = Math.max(0, Math.min(i, ITEMS.length - 1));
            setCurrent(clamped);
            currentRef.current = clamped;
            const drag = galleryDragX.get();
            galleryPageX.jump(galleryPageX.get() + drag);
            galleryDragX.jump(0);
            animate(galleryScrollY, 0, { type: "spring", ...PAGE_SPRING });
            animate(galleryPageX, -clamped * vw, {
                type: "spring",
                ...PAGE_SPRING,
            });
        },
        [galleryPageX, galleryDragX, galleryScrollY, vw],
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
            galleryScrollY.jump(0);
        } else {
            const max = maxRailScroll(vh, containerRectRef.current.width);
            const cur = railOffset.get();
            if (cur < -max) railOffset.jump(-max);
            if (cur > 0) railOffset.jump(0);
        }
    }, [vw, vh, galleryPageX, galleryDragX, galleryScrollY, railOffset]);

    const startMomentum = useCallback(
        (velocity: number) => {
            let v = velocity;
            const tick = () => {
                v *= DRAG_DECAY;
                if (Math.abs(v) < 0.5) {
                    momentumRef.current = null;
                    const max = maxRailScroll(
                        vh,
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
                const max = maxRailScroll(vh, containerRectRef.current.width);
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
                if (dragAxisRef.current === "x") {
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
                    } else if (!dragOnImageRef.current) {
                        // Drag on text area → scroll content
                        const max = scrollMaxRef.current;
                        const next = Math.max(
                            0,
                            Math.min(
                                max,
                                galleryScrollY.get() - (e.movementY || 0),
                            ),
                        );
                        galleryScrollY.jump(next);
                    }
                }
            } else {
                if (dragAxisRef.current === "x") {
                    const max = maxRailScroll(
                        vh,
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
            const left = railLeftOf(i, vh) + scrollOff;
            const w = railItemW(i, vh);
            const itemTop = rect.height - ITEMS[i].railH * vh;
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
                if (dragAxisRef.current === "x") {
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
            </Head>

            <div className="relative max-w-[80ch] w-full h-[50vh] mx-auto px-4 flex flex-col">
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

                {/* Rail / Gallery container */}
                <div
                    ref={containerRef}
                    className={clsx(
                        "absolute bottom-0 overflow-visible touch-none",
                        open ? "z-51" : "z-auto",
                    )}
                    style={{
                        height: MAX_RAIL_H * vh,
                        marginBottom: RAIL_BOTTOM,
                    }}
                    onPointerDownCapture={() => {
                        dragOnImageRef.current = false;
                    }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onWheel={(e) => {
                        if (openRef.current) {
                            // Gallery: scroll text content
                            const max = scrollMaxRef.current;
                            const next = Math.max(
                                0,
                                Math.min(max, galleryScrollY.get() + e.deltaY),
                            );
                            galleryScrollY.jump(next);
                        } else {
                            // Rail: horizontal scroll (trackpad deltaX or mousewheel deltaY)
                            const delta =
                                Math.abs(e.deltaX) > Math.abs(e.deltaY)
                                    ? e.deltaX
                                    : e.deltaY;
                            const max = maxRailScroll(
                                vh,
                                containerRectRef.current.width,
                            );
                            const cur = railOffset.get();
                            railOffset.jump(
                                Math.max(-max, Math.min(0, cur - delta)),
                            );
                        }
                    }}
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
                            aspect={item.aspect}
                            paras={item.paras}
                            open={open}
                            vw={vw}
                            vh={vh}
                            openSpring={openSpring}
                            railScroll={railOffset}
                            galleryPageX={galleryPageX}
                            galleryDragX={galleryDragX}
                            galleryDragY={galleryDragY}
                            galleryScrollY={galleryScrollY}
                            scrollMaxRef={scrollMaxRef}
                            dragOnImageRef={dragOnImageRef}
                            containerRectRef={containerRectRef}
                        />
                    ))}

                    {/* Back button — fades in/out with gallery */}
                    <motion.button
                        className={clsx(
                            "fixed top-6 left-6 z-10 size-10 flex items-center justify-center p-0 rounded-full bg-black/6 backdrop-blur-2xl border-none cursor-pointer",
                            open
                                ? "pointer-events-auto"
                                : "pointer-events-none",
                        )}
                        style={{
                            opacity: openSpring,
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={closeGallery}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                        >
                            <path
                                d="M11 3L5 9L11 15"
                                stroke="#333"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </motion.button>

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
    aspect,
    paras,
    open,
    vw,
    vh,
    openSpring,
    railScroll,
    galleryPageX,
    galleryDragX,
    galleryDragY,
    galleryScrollY,
    scrollMaxRef,
    dragOnImageRef,
    containerRectRef,
}: {
    index: number;
    current: number;
    color: string;
    label: string;
    title: string;
    subtitle: string;
    aspect: number;
    paras: number;
    open: boolean;
    vw: number;
    vh: number;
    openSpring: ReturnType<typeof useSpring>;
    railScroll: ReturnType<typeof useMotionValue>;
    galleryPageX: ReturnType<typeof useMotionValue>;
    galleryDragX: ReturnType<typeof useMotionValue>;
    galleryDragY: ReturnType<typeof useMotionValue>;
    galleryScrollY: ReturnType<typeof useMotionValue>;
    scrollMaxRef: React.MutableRefObject<number>;
    dragOnImageRef: React.MutableRefObject<boolean>;
    containerRectRef: React.RefObject<{ left: number; bottom: number }>;
}) {
    const naturalW = itemFullW(index, vh);
    const galScale = itemGalleryScale(index, vw, vh);
    const sRail = itemRailScale(index);
    const originOff = (naturalW * (1 - sRail)) / 2;
    const myRailLeft = railLeftOf(index, vh);
    const isActive = open && index === current;

    const transformInputs = [
        openSpring,
        railScroll,
        galleryPageX,
        galleryDragX,
        galleryDragY,
        galleryScrollY,
    ];
    const transform = useTransform(
        transformInputs as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        ([progress, rail, galPageX, galDragX, galDragY, sY]: number[]) => {
            const rect = containerRectRef.current;
            const railX = myRailLeft - originOff + rail;
            // Gallery X: center in viewport, compensating for container offset
            const galX =
                index * vw +
                (vw - naturalW) / 2 -
                rect.left +
                galPageX +
                galDragX;

            const x = railX + progress * (galX - railX);
            const scale = sRail + progress * (galScale - sRail);
            // Center vertically: measured from container bottom to viewport center
            const visualH = GALLERY_H * vh * scale;
            const nudge = rect.bottom - (vh + visualH) / 2;
            const y = galDragY * progress - sY * progress - progress * nudge;
            const radius = 12 * (1 - progress);
            return { x, y, scale, radius };
        },
    );

    const transformStr = useTransform(transform, (t) => {
        const { x, y, scale } = t as {
            x: number;
            y: number;
            scale: number;
            radius: number;
        };
        return `translate3d(${x}px, ${y}px, 0px) scale(${scale})`;
    });

    const borderRadius = useTransform(transform, (t) => {
        return `${(t as { radius: number }).radius}px`;
    });

    // Static counter-scale: compensates for galScale so text is 1:1 at full gallery,
    // but scales naturally with the wrapper during open/close/dismiss transitions
    const textScale = 1 / galScale;

    // Text opacity: fades with open spring AND proximity to center (for page swipes)
    const textOpacity = useTransform(
        [galleryPageX, galleryDragX, openSpring],
        ([pageX, dragX, progress]: number[]) => {
            const dist = Math.abs(pageX + dragX + index * vw);
            const proximity = Math.max(0, 1 - dist / (vw * 0.5));
            return proximity * progress;
        },
    );

    // Measure text panel height using offsetHeight (immune to ancestor transforms)
    const galNudge =
        containerRectRef.current.bottom - (vh + GALLERY_H * vh * galScale) / 2;
    const textMeasureRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (!node) {
                scrollMaxRef.current = 0;
                return;
            }
            scrollMaxRef.current = Math.max(0, node.offsetHeight - galNudge);
        },
        [scrollMaxRef, galNudge],
    );

    return (
        <motion.div
            className={clsx(
                "absolute bottom-0 left-0 overflow-visible will-change-transform",
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
                className="absolute inset-0 overflow-hidden cursor-pointer"
                onPointerDown={() => {
                    dragOnImageRef.current = true;
                }}
                style={{
                    background: color,
                    borderRadius,
                }}
            >
                <span className="text-8xl text-white select-none pointer-events-none">
                    {label}
                </span>
            </motion.div>

            {/* Text panel — opacity from open spring × proximity to center */}
            <motion.div
                className="absolute top-full left-1/2 w-screen pointer-events-none"
                style={{
                    transform: `translateX(-50%) scale(${textScale})`,
                    transformOrigin: "top center",
                    opacity: textOpacity,
                }}
            >
                <div
                    ref={index === current ? textMeasureRef : undefined}
                    className="max-w-[80ch] mx-auto px-6 pt-12 pb-8 space-y-6"
                >
                    <div className="space-y-2">
                        <h2 className="font-bold text-2xl">{title}</h2>
                        <p className="text-muted">{subtitle}</p>
                    </div>
                    {Array.from({ length: paras }, (_, j) => (
                        <p key={j}>{LOREM}</p>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
