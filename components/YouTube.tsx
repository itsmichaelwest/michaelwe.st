"use client";

import {
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import clsx from "clsx";

interface YouTubeProps {
    /** YouTube video ID (the v= param). Required. */
    id: string;
    /** Accessible title — also used as alt text on the poster. Required. */
    title: string;
    /**
     * Custom poster image. Defaults to YouTube's `maxresdefault.jpg`. Pass a
     * site-relative path (e.g. `/images/foo/poster.jpg`) for a hand-picked
     * frame.
     */
    poster?: string;
    /** Aspect ratio. Defaults to 16/9. */
    aspect?: number;
    /**
     * Whether to render the title as a visible figcaption beneath the
     * player. Defaults to `true`. Set to `false` when the surrounding copy
     * already describes the video and a duplicate caption would feel
     * redundant. The `title` prop remains required for accessibility
     * (aria-label, poster alt text) regardless of this setting.
     */
    showCaption?: boolean;
}

// Minimal subset of the YT.Player surface we use. The official @types/youtube
// package isn't worth the dep weight for this — keeping a local shape lets us
// stay strict without pulling in 200KB of unrelated globals.
interface YTPlayer {
    playVideo: () => void;
    pauseVideo: () => void;
    mute: () => void;
    unMute: () => void;
    seekTo: (seconds: number, allowSeekAhead: boolean) => void;
    getCurrentTime: () => number;
    getDuration: () => number;
    getVideoLoadedFraction: () => number;
    getVolume: () => number;
    setVolume: (v: number) => void;
    destroy: () => void;
}

interface YTNamespace {
    Player: new (
        el: HTMLElement,
        opts: {
            videoId: string;
            playerVars?: Record<string, string | number>;
            events?: {
                onReady?: () => void;
                onStateChange?: (e: { data: number }) => void;
            };
        },
    ) => YTPlayer;
    PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
}

declare global {
    interface Window {
        YT?: YTNamespace;
        onYouTubeIframeAPIReady?: () => void;
    }
}

// The IFrame API script is global — only inject it once per page load no
// matter how many videos are on the page.
let apiPromise: Promise<YTNamespace> | null = null;
function loadYouTubeAPI(): Promise<YTNamespace> {
    if (apiPromise) return apiPromise;
    apiPromise = new Promise((resolve) => {
        if (window.YT?.Player) {
            resolve(window.YT);
            return;
        }
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            prev?.();
            if (window.YT) resolve(window.YT);
        };
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        document.head.appendChild(tag);
    });
    return apiPromise;
}

function formatTime(s: number): string {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
}

const HIDE_DELAY_MS = 2500;

// YouTube video IDs are 11 chars of base64url alphabet (A-Z, a-z, 0-9, -, _).
// Validating here keeps the `id` we interpolate into iframe src and link href
// strictly alphanumeric — defence in depth against a future code path where
// the id might come from a less-trusted source (e.g. URL params).
const VALID_YT_ID = /^[A-Za-z0-9_-]{11}$/;

export function YouTube({
    id,
    title,
    poster,
    aspect = 16 / 9,
    showCaption = true,
}: YouTubeProps) {
    const reducedMotion = useReducedMotion();
    const reactId = useId();
    const playerHostId = `yt-host-${reactId.replace(/[:]/g, "")}`;
    const isValidId = VALID_YT_ID.test(id);

    const [active, setActive] = useState(false);
    const [ready, setReady] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setVolumeState] = useState(100);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [loadedFraction, setLoadedFraction] = useState(0);
    const [controlsVisible, setControlsVisible] = useState(true);
    const [scrubbing, setScrubbing] = useState(false);
    const [scrubFraction, setScrubFraction] = useState(0);

    const playerRef = useRef<YTPlayer | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrubBarRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const hideTimerRef = useRef<number | null>(null);

    const posterSrc =
        poster ?? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

    // ── Mount the player when the user activates the facade ─────────────
    useEffect(() => {
        if (!active) return;
        let cancelled = false;
        loadYouTubeAPI().then((YT) => {
            if (cancelled) return;
            const host = document.getElementById(playerHostId);
            if (!host) return;
            playerRef.current = new YT.Player(host, {
                videoId: id,
                playerVars: {
                    // Hide native chrome — we render our own.
                    controls: 0,
                    // Required for inline playback on iOS Safari.
                    playsinline: 1,
                    // No related videos at the end (or restrict to the same
                    // channel — YT removed the cross-channel option in 2018).
                    rel: 0,
                    modestbranding: 1,
                    // Disable keyboard so the iframe doesn't steal Space etc.
                    // — we handle keys at the wrapper level.
                    disablekb: 1,
                    autoplay: 1,
                    enablejsapi: 1,
                    origin:
                        typeof window !== "undefined"
                            ? window.location.origin
                            : "",
                },
                events: {
                    onReady: () => {
                        if (cancelled) return;
                        setReady(true);
                        const d = playerRef.current?.getDuration() ?? 0;
                        setDuration(d);
                        const v = playerRef.current?.getVolume() ?? 100;
                        setVolumeState(v);
                    },
                    onStateChange: (e) => {
                        if (cancelled) return;
                        // 1 = playing, 2 = paused, 0 = ended
                        if (e.data === 1) {
                            setPlaying(true);
                            // duration becomes accurate here for some videos
                            const d = playerRef.current?.getDuration() ?? 0;
                            if (d > 0) setDuration(d);
                        } else if (e.data === 2 || e.data === 0) {
                            setPlaying(false);
                        }
                    },
                },
            });
        });
        return () => {
            cancelled = true;
            playerRef.current?.destroy();
            playerRef.current = null;
        };
    }, [active, id, playerHostId]);

    // ── Polling loop while playing for currentTime + buffered ──────────
    useEffect(() => {
        if (!playing) return;
        const tick = () => {
            const p = playerRef.current;
            if (p) {
                if (!scrubbing) setCurrentTime(p.getCurrentTime());
                setLoadedFraction(p.getVideoLoadedFraction());
            }
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        };
    }, [playing, scrubbing]);

    // ── Auto-hide controls during playback ─────────────────────────────
    const showControls = useCallback(() => {
        setControlsVisible(true);
        if (hideTimerRef.current != null) {
            window.clearTimeout(hideTimerRef.current);
        }
        if (playing && !scrubbing) {
            hideTimerRef.current = window.setTimeout(() => {
                setControlsVisible(false);
            }, HIDE_DELAY_MS);
        }
    }, [playing, scrubbing]);

    useEffect(() => {
        showControls();
        return () => {
            if (hideTimerRef.current != null) {
                window.clearTimeout(hideTimerRef.current);
            }
        };
    }, [showControls]);

    // ── Action handlers ────────────────────────────────────────────────
    const togglePlay = useCallback(() => {
        const p = playerRef.current;
        if (!p) return;
        if (playing) p.pauseVideo();
        else p.playVideo();
    }, [playing]);

    const toggleMute = useCallback(() => {
        const p = playerRef.current;
        if (!p) return;
        if (muted) {
            p.unMute();
            setMuted(false);
            // If we were muted with the volume already at 0, bump up to
            // something audible so unmute actually produces sound.
            if (volume === 0) {
                p.setVolume(50);
                setVolumeState(50);
            }
        } else {
            p.mute();
            setMuted(true);
        }
    }, [muted, volume]);

    const changeVolume = useCallback(
        (next: number) => {
            const p = playerRef.current;
            if (!p) return;
            const clamped = Math.max(0, Math.min(100, next));
            p.setVolume(clamped);
            setVolumeState(clamped);
            // Slider drives mute state too: any non-zero value unmutes, 0 mutes.
            if (clamped === 0 && !muted) {
                p.mute();
                setMuted(true);
            } else if (clamped > 0 && muted) {
                p.unMute();
                setMuted(false);
            }
        },
        [muted],
    );

    const toggleFullscreen = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;
        if (document.fullscreenElement) {
            document.exitFullscreen?.();
        } else {
            el.requestFullscreen?.();
        }
    }, []);

    // ── Scrub bar pointer handling ─────────────────────────────────────
    const fractionFromPointer = useCallback((clientX: number): number => {
        const bar = scrubBarRef.current;
        if (!bar) return 0;
        const rect = bar.getBoundingClientRect();
        return Math.max(
            0,
            Math.min(1, (clientX - rect.left) / rect.width),
        );
    }, []);

    const onScrubPointerDown = useCallback(
        (e: ReactPointerEvent<HTMLDivElement>) => {
            e.preventDefault();
            const target = e.currentTarget;
            target.setPointerCapture(e.pointerId);
            const f = fractionFromPointer(e.clientX);
            setScrubbing(true);
            setScrubFraction(f);
        },
        [fractionFromPointer],
    );

    const onScrubPointerMove = useCallback(
        (e: ReactPointerEvent<HTMLDivElement>) => {
            if (!scrubbing) return;
            setScrubFraction(fractionFromPointer(e.clientX));
        },
        [scrubbing, fractionFromPointer],
    );

    const onScrubPointerUp = useCallback(
        (e: ReactPointerEvent<HTMLDivElement>) => {
            if (!scrubbing) return;
            const target = e.currentTarget;
            target.releasePointerCapture(e.pointerId);
            const p = playerRef.current;
            if (p && duration > 0) {
                const t = scrubFraction * duration;
                p.seekTo(t, true);
                setCurrentTime(t);
            }
            setScrubbing(false);
        },
        [scrubbing, scrubFraction, duration],
    );

    // ── Keyboard shortcuts ─────────────────────────────────────────────
    useEffect(() => {
        if (!active) return;
        const onKey = (e: KeyboardEvent) => {
            const el = containerRef.current;
            if (!el) return;
            // Only handle keys when our player is the focused area.
            if (!el.contains(document.activeElement) && document.activeElement !== el) {
                return;
            }
            const p = playerRef.current;
            if (!p) return;
            switch (e.key) {
                case " ":
                case "k":
                case "K":
                    e.preventDefault();
                    togglePlay();
                    break;
                case "m":
                case "M":
                    e.preventDefault();
                    toggleMute();
                    break;
                case "f":
                case "F":
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    p.seekTo(Math.max(0, p.getCurrentTime() - 5), true);
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    p.seekTo(
                        Math.min(duration, p.getCurrentTime() + 5),
                        true,
                    );
                    break;
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [active, togglePlay, toggleMute, toggleFullscreen, duration]);

    const displayedFraction = scrubbing
        ? scrubFraction
        : duration > 0
          ? currentTime / duration
          : 0;
    const displayedTime = scrubbing
        ? scrubFraction * duration
        : currentTime;

    // All hooks have run by this point — safe to bail out on an invalid id.
    // Done as a render-time check (not an early return at the top) to stay
    // compliant with the rules-of-hooks.
    if (!isValidId) {
        if (process.env.NODE_ENV !== "production") {
            console.error(
                `[YouTube] Invalid video id: "${id}". Expected 11 chars of [A-Za-z0-9_-].`,
            );
        }
        return null;
    }

    return (
        <figure className="my-16">
            <div
                ref={containerRef}
                tabIndex={active ? 0 : -1}
                className="relative w-full overflow-hidden rounded-xl ring ring-black/10 bg-black select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:ring-white/10 [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:h-full [&>iframe]:w-full"
                style={{ aspectRatio: String(aspect) }}
                onPointerMove={showControls}
                onPointerLeave={() => {
                    if (playing && !scrubbing) setControlsVisible(false);
                }}
            >
                {/* Facade: poster + play button until first interaction */}
                {!active && (
                    <button
                        type="button"
                        aria-label={`Play video: ${title}`}
                        onClick={() => setActive(true)}
                        className="group absolute inset-0 cursor-pointer border-none bg-transparent p-0"
                    >
                        <Image
                            src={posterSrc}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, min(80ch, 100vw)"
                            className="object-cover"
                            unoptimized={posterSrc.startsWith("https://")}
                        />
                        <span
                            aria-hidden="true"
                            className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-200 group-hover:bg-black/20"
                        >
                            <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 shadow-lg backdrop-blur-sm transition-transform duration-200 ease-out group-hover:scale-105 group-active:scale-95">
                                <PlayGlyph className="ml-1 h-6 w-6 text-black" />
                            </span>
                        </span>
                    </button>
                )}

                {/* Placeholder element that YT.Player REPLACES with its own
                    iframe — the className here vanishes after replacement.
                    Iframe sizing is handled via the [&>iframe]:* arbitrary
                    selectors on the outer container (which survives) because
                    YT defaults the iframe to its own 640×360 dimensions
                    otherwise. */}
                {active && <div id={playerHostId} />}

                {/* Click-shield over the iframe. YouTube re-injects branding
                    (channel name, big center play/pause, share button, YT
                    logo) on any pointer activity inside the iframe — even
                    with controls=0 + modestbranding=1. Catching all pointer
                    events here means the iframe never sees hover/click, so
                    none of that chrome ever appears. Click toggles play;
                    pointermove bubbles up to the container so the auto-hide
                    timer still works. */}
                {active && (
                    <div
                        aria-hidden="true"
                        onClick={togglePlay}
                        className="absolute inset-0 cursor-pointer"
                    />
                )}

                {/* Custom controls overlay — only after the player is ready */}
                {active && (
                    <AnimatePresence>
                        {controlsVisible && (
                            <motion.div
                                initial={
                                    reducedMotion
                                        ? { opacity: 0 }
                                        : { opacity: 0, y: 8 }
                                }
                                animate={{ opacity: 1, y: 0 }}
                                exit={
                                    reducedMotion
                                        ? { opacity: 0 }
                                        : { opacity: 0, y: 8 }
                                }
                                transition={{
                                    duration: 0.18,
                                    ease: [0.32, 0.72, 0, 1],
                                }}
                                className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10"
                            >
                                {/* Scrub bar — hover/scrub-aware */}
                                <div
                                    ref={scrubBarRef}
                                    role="slider"
                                    aria-label="Seek"
                                    aria-valuemin={0}
                                    aria-valuemax={duration || 0}
                                    aria-valuenow={currentTime}
                                    tabIndex={0}
                                    onPointerDown={onScrubPointerDown}
                                    onPointerMove={onScrubPointerMove}
                                    onPointerUp={onScrubPointerUp}
                                    onPointerCancel={onScrubPointerUp}
                                    className="group/scrub pointer-events-auto relative flex h-4 cursor-pointer items-center"
                                >
                                    <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/25 transition-[height] duration-150 ease-out group-hover/scrub:h-[5px]">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-white/35"
                                            style={{
                                                width: `${loadedFraction * 100}%`,
                                            }}
                                        />
                                        <div
                                            className="absolute inset-y-0 left-0 bg-white"
                                            style={{
                                                width: `${displayedFraction * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Bottom row */}
                                <div className="pointer-events-auto flex items-center gap-3 text-white">
                                    <ControlButton
                                        onClick={togglePlay}
                                        ariaLabel={playing ? "Pause" : "Play"}
                                        disabled={!ready}
                                    >
                                        {playing ? (
                                            <PauseGlyph className="h-4 w-4" />
                                        ) : (
                                            <PlayGlyph className="ml-[1px] h-4 w-4" />
                                        )}
                                    </ControlButton>

                                    <span className="text-caption tabular-nums opacity-90">
                                        {formatTime(displayedTime)}
                                        <span className="opacity-50">
                                            {" / "}
                                        </span>
                                        {formatTime(duration)}
                                    </span>

                                    <span className="flex-1" />

                                    <VolumeControl
                                        muted={muted}
                                        volume={volume}
                                        ready={ready}
                                        onToggleMute={toggleMute}
                                        onVolumeChange={changeVolume}
                                    />

                                    <a
                                        href={`https://www.youtube.com/watch?v=${id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Watch on YouTube"
                                        className="grid h-8 w-8 place-items-center rounded-full text-white/80 no-underline transition-colors hover:bg-white/10 hover:text-white"
                                    >
                                        <ExternalGlyph className="h-3.5 w-3.5" />
                                    </a>

                                    <ControlButton
                                        onClick={toggleFullscreen}
                                        ariaLabel="Fullscreen"
                                    >
                                        <FullscreenGlyph className="h-4 w-4" />
                                    </ControlButton>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
            {title && showCaption && (
                <figcaption className="text-caption text-muted text-pretty mt-2">
                    {title}
                </figcaption>
            )}
        </figure>
    );
}

// ── Sub-components ─────────────────────────────────────────────────────

interface ControlButtonProps {
    onClick: () => void;
    ariaLabel: string;
    disabled?: boolean;
    children: React.ReactNode;
}

function ControlButton({
    onClick,
    ariaLabel,
    disabled,
    children,
}: ControlButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={clsx(
                "grid h-8 w-8 place-items-center rounded-full border-none bg-transparent p-0 text-white/85 transition-[color,background-color,transform] duration-150 ease-out",
                "hover:bg-white/10 hover:text-white active:scale-[0.94]",
                "disabled:cursor-not-allowed disabled:opacity-40",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
            )}
        >
            {children}
        </button>
    );
}

interface VolumeControlProps {
    muted: boolean;
    volume: number;
    ready: boolean;
    onToggleMute: () => void;
    onVolumeChange: (next: number) => void;
}

// Mute button paired with a slider that reveals on hover/focus-within.
// The slider sits to the LEFT of the mute icon so it grows toward the row's
// flex spacer — keeping the icon column stable. Range input is styled with
// arbitrary Tailwind selectors so it inherits the player's white-on-glass
// palette without a global stylesheet.
function VolumeControl({
    muted,
    volume,
    ready,
    onToggleMute,
    onVolumeChange,
}: VolumeControlProps) {
    // When muted, the slider shows 0; the displayed value is decoupled from
    // the underlying volume so dragging out of mute reveals the prior level.
    const displayed = muted ? 0 : volume;
    return (
        <div className="group/volume flex items-center">
            <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={displayed}
                aria-label="Volume"
                disabled={!ready}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className={clsx(
                    "h-1 cursor-pointer appearance-none rounded-full bg-white/25 outline-none",
                    "w-0 opacity-0 transition-[width,opacity,margin] duration-200 ease-out",
                    "group-hover/volume:mr-2 group-hover/volume:w-20 group-hover/volume:opacity-100",
                    "group-focus-within/volume:mr-2 group-focus-within/volume:w-20 group-focus-within/volume:opacity-100",
                    "disabled:cursor-not-allowed disabled:opacity-40",
                    // WebKit thumb
                    "[&::-webkit-slider-thumb]:appearance-none",
                    "[&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3",
                    "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white",
                    "[&::-webkit-slider-thumb]:border-0",
                    // Firefox thumb
                    "[&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3",
                    "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white",
                    "[&::-moz-range-thumb]:border-0",
                    // Focus ring on the slider itself
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                )}
            />
            <ControlButton
                onClick={onToggleMute}
                ariaLabel={muted ? "Unmute" : "Mute"}
                disabled={!ready}
            >
                {muted ? (
                    <MuteGlyph className="h-4 w-4" />
                ) : (
                    <SoundGlyph className="h-4 w-4" />
                )}
            </ControlButton>
        </div>
    );
}

// ── Glyphs ─────────────────────────────────────────────────────────────

interface GlyphProps {
    className?: string;
}

function PlayGlyph({ className }: GlyphProps) {
    return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
            <path d="M3.5 2.5v11l10-5.5z" />
        </svg>
    );
}

function PauseGlyph({ className }: GlyphProps) {
    return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
            <rect x="3.5" y="2.5" width="3" height="11" rx="0.5" />
            <rect x="9.5" y="2.5" width="3" height="11" rx="0.5" />
        </svg>
    );
}

function SoundGlyph({ className }: GlyphProps) {
    return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
            <path d="M2.5 6v4h2l3 2.5v-9L4.5 6h-2z" fill="currentColor" />
            <path d="M10.5 5.5a3.5 3.5 0 0 1 0 5" />
            <path d="M12.5 3.5a6 6 0 0 1 0 9" />
        </svg>
    );
}

function MuteGlyph({ className }: GlyphProps) {
    return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
            <path d="M2.5 6v4h2l3 2.5v-9L4.5 6h-2z" fill="currentColor" />
            <path d="M10 6l4 4M14 6l-4 4" />
        </svg>
    );
}

function FullscreenGlyph({ className }: GlyphProps) {
    return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
            <path d="M2.5 6V2.5H6M14 6V2.5H10.5M2.5 10v3.5H6M14 10v3.5H10.5" />
        </svg>
    );
}

function ExternalGlyph({ className }: GlyphProps) {
    return (
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
            <path d="M3.5 2.5H9.5V8.5M9.5 2.5L2.5 9.5" />
        </svg>
    );
}
