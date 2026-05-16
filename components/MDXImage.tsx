"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
    motion,
    animate,
    AnimatePresence,
    useMotionValue,
    useReducedMotion,
    useTransform,
    type Transition,
} from "motion/react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { DismissButton } from "./DismissButton";

interface MDXImageProps {
    src: string;
    alt?: string;
    height?: number | string;
    width?: number | string;
}

// Padding (px) around the fitted lightbox image so it never touches the
// viewport edges or sits under the close button.
const VIEWPORT_PAD = 64;
// Spring config used for the morph-from-trigger and the zoom-in animation.
// Same family as the rest of the site so the lightbox feels like the same
// physics system.
const MORPH_SPRING: Transition = {
    type: "spring",
    stiffness: 280,
    damping: 32,
    mass: 0.6,
};
// Drag elasticity at the edges (0 = hard wall, 1 = no resistance). 0.18 gives
// a noticeable rubber-band but the image never escapes the screen.
const DRAG_ELASTIC = 0.18;

export function MDXImage({ src, alt = "", height, width }: MDXImageProps) {
    const [loaded, setLoaded] = useState(false);
    const [open, setOpen] = useState(false);
    const [zoomed, setZoomed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [viewport, setViewport] = useState({ w: 0, h: 0 });
    const fallbackRef = useRef<HTMLImageElement>(null);
    const reducedMotion = useReducedMotion();
    const id = useId();
    const layoutId = `mdx-image-${id}`;

    const triggerRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const lightboxRef = useRef<HTMLDivElement>(null);
    // Continuous zoom scale. 1 = fitted, fitMetrics.scale = "comfortable
    // double-click zoom level", capped at fitMetrics.naturalMax which maps a
    // single image pixel to a single device pixel. The user can pinch/wheel
    // anywhere in this range; click toggles between the two anchor values.
    const scaleMV = useMotionValue(1);
    // Pan transforms inside the zoomed view.
    const panX = useMotionValue(0);
    const panY = useMotionValue(0);
    // Set true when motion's drag begins, used by onTap below to suppress the
    // tap event that fires immediately after a dragend.
    const didPanRef = useRef(false);
    // Captured on pointerdown so onTap (which has no usable event coords on
    // some Motion versions) can compute a zoom-anchor relative to the
    // tapped point. Using clientX/Y from the native event is robust.
    const tapPointRef = useRef<{ x: number; y: number } | null>(null);

    // Canonical "render after mount" pattern — needed so the portal target
    // (document.body) is only used on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        // The Image's `onLoad` doesn't fire when the browser has the image
        // cached, so we mirror its `complete` flag once after mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (fallbackRef.current?.complete) setLoaded(true);
    }, []);

    // Keep viewport size in sync with window resize so drag constraints stay
    // accurate when the user resizes the browser mid-zoom.
    useEffect(() => {
        const measure = () =>
            setViewport({ w: window.innerWidth, h: window.innerHeight });
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    // Mount-once popstate listener that mirrors `open` to whether the
    // current history entry is the one we pushed. This makes BOTH back and
    // forward work: back leaves our pushed entry and we close; forward
    // returns to that entry and we reopen. Without this, closing via the
    // back button left a stale forward stub that did nothing on click.
    useEffect(() => {
        const onPop = () => {
            const atLightbox =
                (history.state as { mdxLightbox?: string } | null)
                    ?.mdxLightbox === layoutId;
            setOpen(atLightbox);
        };
        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, [layoutId]);

    useEffect(() => {
        if (!open) {
            // Animate (don't snap) scale + pan back to neutral so the
            // motion-driven transforms settle in lockstep with
            // AnimatePresence's layout morph back to the trigger. Snapping
            // here causes a visible "first unzoom, then morph" two-stage
            // close. We also nudge `zoomed` false so any wrappers reading
            // it (cursor, drag enable) stop reflecting the zoomed state
            // immediately.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setZoomed(false);
            // Capture controls so the animations are stopped if the
            // component unmounts (or `open` flips again) before they
            // settle — without this, an unmount mid-close would orphan
            // three animation timers per lightbox close.
            const scaleAnim = animate(scaleMV, 1, MORPH_SPRING);
            const panXAnim = animate(panX, 0, MORPH_SPRING);
            const panYAnim = animate(panY, 0, MORPH_SPRING);
            return () => {
                scaleAnim.stop();
                panXAnim.stop();
                panYAnim.stop();
            };
        }
        const previouslyFocused =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
        const triggerNode = triggerRef.current;
        closeRef.current?.focus();
        // Push a transient history entry so the browser back button (and
        // mobile swipe-back) closes the lightbox. Skip if we're already at
        // the entry — happens when forward-navigation triggered the open
        // via the mount-once popstate listener above.
        const atLightbox =
            (history.state as { mdxLightbox?: string } | null)
                ?.mdxLightbox === layoutId;
        if (!atLightbox) {
            history.pushState({ mdxLightbox: layoutId }, "");
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            // Stop propagation so GalleryShell's window-level Esc handler
            // doesn't ALSO close the gallery detail view behind us.
            e.stopPropagation();
            // Use the document-level capture-phase listener too just in case
            // some ancestor re-dispatches.
            e.stopImmediatePropagation();
            setOpen(false);
        };
        // capture: true so we run before window-level handlers in
        // GalleryShell. stopPropagation then prevents bubbling.
        document.addEventListener("keydown", onKey, { capture: true });
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey, { capture: true });
            document.body.style.overflow = prevOverflow;
            // If the current history entry is still ours, the close was
            // user-initiated (button / Esc / backdrop tap) — consume the
            // pushed entry by going back. If popstate already moved us off
            // the entry, the marker check is false and we leave history
            // alone (the user has already navigated).
            const stillAtLightbox =
                (history.state as { mdxLightbox?: string } | null)
                    ?.mdxLightbox === layoutId;
            if (stillAtLightbox) {
                history.back();
            }
            const target = previouslyFocused ?? triggerNode;
            target?.focus({ preventScroll: true });
        };
    }, [open, panX, panY, scaleMV, layoutId]);

    // When leaving zoom mode via click-unzoom, the click handler animates
    // panX/Y to zero alongside the scale animation. The close path's cleanup
    // does the same. No standalone effect needed here.

    const ringClasses = "rounded-xl ring ring-black/10 dark:ring-white/10";
    const loadClasses = clsx(
        "transition-[filter,opacity] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
        loaded ? "opacity-100 blur-0" : "opacity-0 blur-md scale-[1.01]",
    );

    const layoutTransition: Transition = reducedMotion
        ? { duration: 0 }
        : MORPH_SPRING;

    const hasIntrinsic = Boolean(height && width);
    const aspect = hasIntrinsic
        ? Number(width) / Number(height)
        : 16 / 9;
    const aspectRatioStyle = `${hasIntrinsic ? width : 16} / ${hasIntrinsic ? height : 9}`;

    // Compute the fitted lightbox dimensions (the image's render size when
    // scale=1), the click-zoom anchor scale, the natural-pixel max scale,
    // and the pan-bound formula given a current scale. All derived in JS so
    // the constraints we hand to motion are accurate.
    const fitMetrics = useMemo(() => {
        const vw = viewport.w;
        const vh = viewport.h;
        if (!vw || !vh) {
            return {
                fitW: 0,
                fitH: 0,
                scale: 1,
                naturalMax: 1,
                boundFor: () => ({ x: 0, y: 0 }),
            };
        }
        const availW = vw - VIEWPORT_PAD * 2;
        const availH = vh - VIEWPORT_PAD * 2;
        // Image is fitted to the available box while preserving aspect ratio.
        const fitW = Math.min(availW, availH * aspect);
        const fitH = fitW / aspect;
        // Natural-pixel max: 1 image px = 1 device px. Capped at 4x so an
        // unusually large source doesn't make pinch-zoom feel infinite.
        const naturalW = hasIntrinsic ? Number(width) : fitW;
        const naturalMax = Math.min(4, Math.max(1, naturalW / fitW));
        // Click-toggle anchor: comfortable middle zoom. Floor of 1.6 so the
        // jump always reads as "now zoomed", ceiling of naturalMax.
        const scale = Math.min(naturalMax, Math.max(1.6, naturalMax * 0.7));
        // Pan bound for any scale value.
        const boundFor = (s: number) => {
            const scaledW = fitW * s;
            const scaledH = fitH * s;
            return {
                x: Math.max(0, (scaledW - vw + VIEWPORT_PAD * 2) / 2),
                y: Math.max(0, (scaledH - vh + VIEWPORT_PAD * 2) / 2),
            };
        };
        return { fitW, fitH, scale, naturalMax, boundFor };
    }, [viewport.w, viewport.h, aspect, hasIntrinsic, width]);

    const dragConstraints = useMemo(
        () => {
            const b = fitMetrics.boundFor(zoomed ? fitMetrics.scale : 1);
            return {
                left: -b.x,
                right: b.x,
                top: -b.y,
                bottom: b.y,
            };
        },
        [fitMetrics, zoomed],
    );

    // Drive scale animation from the boolean `zoomed` toggle. Click-zoom is
    // the only thing that flips this — wheel-zoom updates scaleMV directly.
    useEffect(() => {
        const target = zoomed ? fitMetrics.scale : 1;
        const controls = animate(scaleMV, target, MORPH_SPRING);
        return () => controls.stop();
    }, [zoomed, fitMetrics.scale, scaleMV]);

    // Block wheel scroll from falling through to the article/gallery
    // underneath. body { overflow: hidden } handles the page itself but the
    // gallery detail uses its own overflow container, so we explicitly eat
    // wheel events on the lightbox. We do NOT translate them into zoom —
    // the prior wheel-to-zoom behavior felt jittery on trackpads.
    useEffect(() => {
        if (!open) return;
        const el = lightboxRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => e.preventDefault();
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [open]);

    // Pinch-to-zoom for touch devices. We track up to 2 active pointers; on
    // the second pointerdown we capture the initial distance + centroid +
    // scale + pan, then on each pointermove with both still active we
    // recompute the new distance and update scaleMV (with the same
    // rubber-band as wheel) plus pan so the centroid stays under the
    // fingers. This deliberately runs alongside Motion's `drag` — when
    // pinching we set a flag that suppresses drag's tap so a quick pinch
    // doesn't accidentally toggle click-zoom.
    useEffect(() => {
        if (!open) return;
        const el = lightboxRef.current;
        if (!el) return;
        const RUBBER = 0.3;
        const MIN = 1;
        const pointers = new Map<number, { x: number; y: number }>();
        let pinchStart: {
            dist: number;
            cx: number;
            cy: number;
            scale: number;
            panX: number;
            panY: number;
        } | null = null;
        const onPointerDown = (e: PointerEvent) => {
            if (e.pointerType !== "touch") return;
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pointers.size === 2) {
                const [a, b] = Array.from(pointers.values());
                pinchStart = {
                    dist: Math.hypot(b.x - a.x, b.y - a.y),
                    cx: (a.x + b.x) / 2,
                    cy: (a.y + b.y) / 2,
                    scale: scaleMV.get(),
                    panX: panX.get(),
                    panY: panY.get(),
                };
                didPanRef.current = true;
            }
        };
        const onPointerMove = (e: PointerEvent) => {
            if (!pointers.has(e.pointerId)) return;
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pointers.size !== 2 || !pinchStart) return;
            e.preventDefault();
            const [a, b] = Array.from(pointers.values());
            const dist = Math.hypot(b.x - a.x, b.y - a.y);
            const ratio = dist / pinchStart.dist;
            let next = pinchStart.scale * ratio;
            const max = fitMetrics.naturalMax;
            if (next > max) next = max + (next - max) * RUBBER;
            if (next < MIN) next = MIN - (MIN - next) * RUBBER;
            scaleMV.set(next);
            // Keep the original centroid (in image-space) anchored under the
            // current centroid (in viewport-space).
            const lb = el.getBoundingClientRect();
            const imgCx = lb.left + lb.width / 2;
            const imgCy = lb.top + lb.height / 2;
            const ix = (pinchStart.cx - imgCx - pinchStart.panX) /
                pinchStart.scale;
            const iy = (pinchStart.cy - imgCy - pinchStart.panY) /
                pinchStart.scale;
            const newCx = (a.x + b.x) / 2;
            const newCy = (a.y + b.y) / 2;
            panX.set(newCx - imgCx - ix * next);
            panY.set(newCy - imgCy - iy * next);
            setZoomed(next > 1.05);
        };
        const onPointerEnd = (e: PointerEvent) => {
            if (!pointers.has(e.pointerId)) return;
            pointers.delete(e.pointerId);
            if (pointers.size < 2 && pinchStart) {
                pinchStart = null;
                // Snap scale back into bounds, then clamp pan to the new
                // bounds at that scale.
                const cur = scaleMV.get();
                const max = fitMetrics.naturalMax;
                const clamped = Math.max(MIN, Math.min(max, cur));
                if (cur !== clamped) {
                    animate(scaleMV, clamped, MORPH_SPRING);
                }
                if (clamped <= 1.001) setZoomed(false);
                const b = fitMetrics.boundFor(clamped);
                const cx = panX.get();
                const cy = panY.get();
                const nx = Math.max(-b.x, Math.min(b.x, cx));
                const ny = Math.max(-b.y, Math.min(b.y, cy));
                if (nx !== cx) animate(panX, nx, MORPH_SPRING);
                if (ny !== cy) animate(panY, ny, MORPH_SPRING);
            }
        };
        el.addEventListener("pointerdown", onPointerDown);
        el.addEventListener("pointermove", onPointerMove, { passive: false });
        el.addEventListener("pointerup", onPointerEnd);
        el.addEventListener("pointercancel", onPointerEnd);
        return () => {
            el.removeEventListener("pointerdown", onPointerDown);
            el.removeEventListener("pointermove", onPointerMove);
            el.removeEventListener("pointerup", onPointerEnd);
            el.removeEventListener("pointercancel", onPointerEnd);
        };
    }, [open, fitMetrics, scaleMV, panX, panY]);

    // Border-radius + hairline width compensate for the current scale so the
    // visual stroke / corner stays constant (12px / 1px) regardless of zoom
    // level (click or wheel).
    const compensatedRadius = useTransform(scaleMV, (s) => 12 / s);
    const compensatedShadow = useTransform(
        scaleMV,
        (s) => `0 0 0 ${1 / s}px rgb(0 0 0 / 0.1)`,
    );

    return (
        <figure className="my-16 space-y-4">
            <motion.div
                ref={triggerRef}
                role="button"
                tabIndex={0}
                onClick={() => setOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpen(true);
                    }
                }}
                layoutId={layoutId}
                transition={layoutTransition}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                style={{ aspectRatio: aspectRatioStyle }}
                className="relative block w-full cursor-zoom-in"
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
            </motion.div>

            {alt && (
                <figcaption className="text-caption text-muted text-pretty mt-2">
                    {alt}
                </figcaption>
            )}

            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {open && (
                            <div
                                role="dialog"
                                aria-modal="true"
                                aria-label={alt || "Image"}
                            >
                                <motion.div
                                    key="mdx-scrim"
                                    className="fixed inset-0 z-[99]"
                                    initial={{
                                        backgroundColor: "oklch(0 0 0 / 0)",
                                        backdropFilter: "blur(0px)",
                                    }}
                                    animate={{
                                        backgroundColor:
                                            "oklch(0 0 0 / 0.6)",
                                        backdropFilter: "blur(16px)",
                                    }}
                                    exit={{
                                        backgroundColor: "oklch(0 0 0 / 0)",
                                        backdropFilter: "blur(0px)",
                                    }}
                                    transition={{
                                        duration: 0.35,
                                        ease: "easeOut",
                                    }}
                                    onClick={() => setOpen(false)}
                                    aria-hidden="true"
                                />

                                {/* Lightbox container — morphs from the
                                    inline trigger via shared layoutId. The
                                    rounded corners + overflow:hidden live on
                                    this outer wrapper so the inner scaling
                                    motion.div is clipped by them during
                                    zoom. We render this only once viewport
                                    has measured (fitW > 0) so the morph
                                    starts from a real sized destination
                                    rather than 0×0. */}
                                {fitMetrics.fitW > 0 && (
                                    <motion.div
                                        key="mdx-lightbox"
                                        ref={lightboxRef}
                                        layoutId={layoutId}
                                        drag={zoomed}
                                        dragConstraints={dragConstraints}
                                        dragElastic={DRAG_ELASTIC}
                                        dragMomentum
                                        dragTransition={{
                                            power: 0.25,
                                            timeConstant: 220,
                                            bounceStiffness: 320,
                                            bounceDamping: 28,
                                        }}
                                        onDragStart={() => {
                                            didPanRef.current = true;
                                        }}
                                        onPointerDownCapture={(e) => {
                                            // Capture the native pointer
                                            // position so onTap below can
                                            // anchor the click-zoom on this
                                            // exact point. Motion's `info`
                                            // for onTap doesn't reliably
                                            // expose the original pointer
                                            // coords across versions.
                                            tapPointRef.current = {
                                                x: e.clientX,
                                                y: e.clientY,
                                            };
                                        }}
                                        transition={layoutTransition}
                                        style={{
                                            width: fitMetrics.fitW,
                                            height: fitMetrics.fitH,
                                            x: panX,
                                            y: panY,
                                            scale: scaleMV,
                                            borderRadius: compensatedRadius,
                                            boxShadow: compensatedShadow,
                                            touchAction: "none",
                                        }}
                                        onTap={() => {
                                            if (didPanRef.current) {
                                                didPanRef.current = false;
                                                return;
                                            }
                                            const next = zoomed
                                                ? 1
                                                : fitMetrics.scale;
                                            if (zoomed) {
                                                // Click-unzoom: glide pan
                                                // back to the center along
                                                // with the scale animation.
                                                animate(
                                                    panX,
                                                    0,
                                                    MORPH_SPRING,
                                                );
                                                animate(
                                                    panY,
                                                    0,
                                                    MORPH_SPRING,
                                                );
                                            } else {
                                                const lb = lightboxRef.current;
                                                const tap = tapPointRef.current;
                                                if (lb && tap) {
                                                    const r =
                                                        lb.getBoundingClientRect();
                                                    // Click position relative
                                                    // to the image's center,
                                                    // in pre-zoom pixels.
                                                    const cx =
                                                        tap.x -
                                                        (r.left + r.width / 2);
                                                    const cy =
                                                        tap.y -
                                                        (r.top + r.height / 2);
                                                    // After scaling by `next`
                                                    // that pixel ends up
                                                    // (next-1)*c further from
                                                    // the image center. Pan
                                                    // by the negative of that
                                                    // delta to keep it under
                                                    // the cursor.
                                                    let nx = -(next - 1) * cx;
                                                    let ny = -(next - 1) * cy;
                                                    const b =
                                                        fitMetrics.boundFor(
                                                            next,
                                                        );
                                                    nx = Math.max(
                                                        -b.x,
                                                        Math.min(b.x, nx),
                                                    );
                                                    ny = Math.max(
                                                        -b.y,
                                                        Math.min(b.y, ny),
                                                    );
                                                    animate(
                                                        panX,
                                                        nx,
                                                        MORPH_SPRING,
                                                    );
                                                    animate(
                                                        panY,
                                                        ny,
                                                        MORPH_SPRING,
                                                    );
                                                }
                                            }
                                            setZoomed(!zoomed);
                                        }}
                                        className={clsx(
                                            "fixed top-1/2 left-1/2 z-[100] -translate-x-1/2 -translate-y-1/2 overflow-hidden select-none",
                                            zoomed
                                                ? "cursor-grab active:cursor-grabbing"
                                                : "cursor-zoom-in",
                                        )}
                                    >
                                        <Image
                                            src={src}
                                            alt={alt}
                                            fill
                                            sizes={
                                                zoomed ? "100vw" : "95vw"
                                            }
                                            quality={
                                                zoomed ? 95 : undefined
                                            }
                                            draggable={false}
                                            priority
                                            className="pointer-events-none object-cover"
                                        />
                                    </motion.div>
                                )}

                                {/* Close button — same visual + behavior as
                                    AboutModal's close button.
                                    mix-blend-difference keeps the glyph
                                    legible against any pixel color. */}
                                <motion.div
                                    key="mdx-lightbox-close"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: 0.2,
                                        ease: "easeOut",
                                    }}
                                    className="fixed top-6 right-6 z-[110] mix-blend-difference"
                                >
                                    <DismissButton
                                        ref={closeRef}
                                        variant="close"
                                        onClick={() => setOpen(false)}
                                    />
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </figure>
    );
}
