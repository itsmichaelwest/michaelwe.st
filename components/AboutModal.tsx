"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import Button from "./Button";
import { MAIN_SPRING } from "./Gallery/constants";

const CLOSE_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

import PortraitTall from "../public/images/michael-portrait-tall.jpg";

interface AboutModalProps {
    open: boolean;
    onClose: () => void;
    directNav: boolean;
}

export function AboutModal({ open, onClose, directNav }: AboutModalProps) {
    const aboutSpring = useMotionValue(directNav ? 1 : 0);
    const contentScale = useTransform(aboutSpring, [0, 1], [0.97, 1]);
    const backdropBlur = useTransform(aboutSpring, (v) => `blur(${v * 4}px)`);
    const backdropBg = useTransform(
        aboutSpring,
        (v) => `rgb(var(--backdrop-rgb) / ${v * 0.95})`,
    );

    useEffect(() => {
        if (directNav) {
            aboutSpring.jump(1);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        // Asymmetric enter/exit: spring open for that "settle" feel, tween
        // closed so dismissal lands quickly and predictably.
        if (open) {
            animate(aboutSpring, 1, { type: "spring", ...MAIN_SPRING });
        } else {
            animate(aboutSpring, 0, { duration: 0.2, ease: CLOSE_EASE });
        }
    }, [open, aboutSpring]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (open && e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    const [scrollMask, setScrollMask] = useState<
        "none" | "bottom" | "top" | "both"
    >("none");

    const updateMask = useCallback((el: HTMLElement) => {
        const top = el.scrollTop > 2;
        const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 2;
        setScrollMask(
            top && bottom ? "both" : top ? "top" : bottom ? "bottom" : "none",
        );
    }, []);

    const sectionRef = useCallback(
        (el: HTMLElement | null) => {
            if (!el) return;
            const handler = () => updateMask(el);
            updateMask(el);
            el.addEventListener("scroll", handler, { passive: true });
            return () => el.removeEventListener("scroll", handler);
        },
        [updateMask],
    );

    const maskImage =
        scrollMask === "both"
            ? "linear-gradient(to bottom, transparent, black 32px, black calc(100% - 32px), transparent)"
            : scrollMask === "top"
              ? "linear-gradient(to bottom, transparent, black 32px)"
              : scrollMask === "bottom"
                ? "linear-gradient(to bottom, black calc(100% - 32px), transparent)"
                : undefined;

    return (
        <>
            {/* Backdrop */}
            <motion.div
                className={clsx(
                    "fixed inset-0 z-[60]",
                    open ? "pointer-events-auto" : "pointer-events-none",
                )}
                style={{
                    backgroundColor: backdropBg,
                    backdropFilter: backdropBlur,
                }}
                onClick={onClose}
            />

            {/* Content panel */}
            <motion.div
                className={clsx(
                    "fixed inset-0 md:absolute md:inset-0 z-150 overflow-y-auto md:overflow-hidden",
                    open ? "pointer-events-auto" : "pointer-events-none",
                )}
                style={{ opacity: aboutSpring, scale: contentScale }}
            >
                <article className="w-full md:h-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 px-4 pt-24 pb-16 md:pt-0 md:pb-0">
                    <div className="relative rounded-xl ring ring-black/10 dark:ring-white/10 overflow-hidden md:h-full">
                        <Image
                            className="w-full h-auto md:h-full md:w-full md:object-cover"
                            src={PortraitTall}
                            alt="Photo of Michael"
                        />
                    </div>
                    <section
                        ref={sectionRef}
                        className="space-y-8 md:overflow-y-auto md:h-full"
                        style={{ maskImage, WebkitMaskImage: maskImage }}
                    >
                        <p>
                            I&apos;m a self-taught designer with an engineering
                            background, specializing in simple and effortless
                            experiences for both the devices we use today and
                            the ones we&apos;ll use in the future. Crafting
                            high-quality products that people love to use is my
                            passion, and I work tirelessly to achieve that goal.
                        </p>
                        <p>
                            Using the medium of motion and rapid prototyping I
                            bring these experiences to life, visualizing the
                            smallest interactions to entire user journeys. I
                            strongly believe in open design, and encourage
                            co-creation that can help deliver a better solution
                            for users.
                        </p>
                        <p>
                            Accessibility and inclusion sit at the center of my
                            process — technology should empower everyone and
                            nobody should be left with a subpar experience.
                        </p>
                        <p>
                            I&apos;m currently a Senior Designer at{" "}
                            <Link href="https://www.microsoft.com/">
                                Microsoft
                            </Link>
                            , where I currently work on Windows AI.
                        </p>
                        <p>
                            Previously a Design Intern at Microsoft, where I was
                            involved with products used by millions of people
                            around the world. Check them out:{" "}
                            <Link
                                href="/work/surface-duo"
                                className="font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Surface Duo
                            </Link>
                            ,{" "}
                            <Link
                                href="/work/swiftkey-design-system"
                                className="font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                SwiftKey
                            </Link>
                            ,{" "}
                            <Link
                                href="/work/fluent-icons"
                                className="font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Fluent Icons
                            </Link>
                            . Before that, I worked independently on critically
                            acclaimed concepts both by myself and friends.
                        </p>
                        <p>
                            BSc Computer Science graduate — First Class Honours.
                        </p>
                        <p>
                            Awarded 2018-19{" "}
                            <Link
                                href="https://mvp.microsoft.com/"
                                className="font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Microsoft MVP
                            </Link>{" "}
                            (Most Valuable Professional) for Windows Design.
                        </p>
                        <Button
                            className="m-px"
                            to="/files/mw-resume-jan2022.pdf"
                        >
                            Download résumé
                        </Button>
                    </section>
                </article>
            </motion.div>

            {/* Close button */}
            <motion.button
                className={clsx(
                    "group fixed top-6 right-6 z-200 inline-flex h-9 items-center border-none bg-transparent p-0 font-mono text-[13px] text-muted transition-[color,transform] duration-200 ease-out hover:text-secondary active:scale-[0.96]",
                    open ? "pointer-events-auto" : "pointer-events-none",
                )}
                aria-label="Close"
                style={{ opacity: aboutSpring }}
                onClick={onClose}
            >
                <span className="mr-0 max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,margin-right,opacity] duration-280 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:mr-1.5 group-hover:max-w-[60px] group-hover:opacity-100">
                    Close
                </span>
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M3 3L9 9M9 3L3 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            </motion.button>
        </>
    );
}
