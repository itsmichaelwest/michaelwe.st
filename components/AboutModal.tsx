import { useEffect } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import Button from "./Button";
import { MAIN_SPRING } from "./Gallery/constants";

import PortraitTall from "../public/images/michael-portrait-tall.jpg";

interface AboutModalProps {
    open: boolean;
    onClose: () => void;
    directNav: boolean;
}

export function AboutModal({ open, onClose, directNav }: AboutModalProps) {
    const aboutProgress = useMotionValue(directNav ? 1 : 0);
    const aboutSpring = useSpring(aboutProgress, MAIN_SPRING);
    const contentScale = useTransform(aboutSpring, [0, 1], [0.97, 1]);
    const backdropBlur = useTransform(aboutSpring, (v) => `blur(${v * 4}px)`);
    const backdropBg = useTransform(aboutSpring, [0, 1], ["rgb(255 255 255 / 0)", "rgb(255 255 255 / 0.95)"]);

    useEffect(() => {
        if (directNav) {
            aboutProgress.jump(1);
            aboutSpring.jump(1);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        aboutProgress.set(open ? 1 : 0);
    }, [open, aboutProgress]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (open && e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    return (
        <>
            {/* Backdrop */}
            <motion.div
                className={clsx(
                    "fixed inset-0 z-[60]",
                    open ? "pointer-events-auto" : "pointer-events-none",
                )}
                style={{ backgroundColor: backdropBg, backdropFilter: backdropBlur }}
                onClick={onClose}
            />

            {/* Content panel */}
            <motion.div
                className={clsx(
                    "fixed inset-0 lg:absolute lg:inset-0 z-150 overflow-y-auto lg:overflow-hidden",
                    open ? "pointer-events-auto" : "pointer-events-none",
                )}
                style={{ opacity: aboutSpring, scale: contentScale }}
            >
                <article className="w-full lg:h-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 px-4 pt-32 pb-16 lg:pt-0 lg:pb-0">
                        <div className="relative lg:h-full lg:min-h-0">
                            <Image
                                className="lg:absolute lg:inset-0 lg:h-full lg:w-full lg:object-cover"
                                src={PortraitTall}
                                alt="Photo of Michael"
                            />
                        </div>
                        <section className="space-y-8 lg:overflow-y-auto lg:h-full">
                                <p>
                                    I&apos;m a self-taught designer with an engineering
                                    background, specializing in simple and effortless
                                    experiences for both the devices we use today and the
                                    ones we&apos;ll use in the future. Crafting high-quality
                                    products that people love to use is my passion, and I
                                    work tirelessly to achieve that goal.
                                </p>
                                <p>
                                    Using the medium of motion and rapid prototyping I bring
                                    these experiences to life, visualizing the smallest
                                    interactions to entire user journeys. I strongly believe
                                    in open design, and encourage co-creation that can help
                                    deliver a better solution for users.
                                </p>
                                <p>
                                    Accessibility and inclusion sit at the center of my
                                    process — technology should empower everyone and nobody
                                    should be left with a subpar experience.
                                </p>
                                <p>
                                    I&apos;m currently a Senior Designer at{" "}
                                    <Link href="https://www.microsoft.com/">Microsoft</Link>
                                    , where I currently work on Windows AI.
                                </p>
                                <p>
                                    Previously a Design Intern at Microsoft, where I was
                                    involved with products used by millions of people around
                                    the world. Check them out:{" "}
                                    <Link
                                        href="/work/surface-duo"
                                        className="font-medium text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200"
                                    >
                                        Surface Duo
                                    </Link>
                                    ,{" "}
                                    <Link
                                        href="/work/swiftkey-design-system"
                                        className="font-medium text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200"
                                    >
                                        SwiftKey
                                    </Link>
                                    ,{" "}
                                    <Link
                                        href="/work/fluent-icons"
                                        className="font-medium text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200"
                                    >
                                        Fluent Icons
                                    </Link>
                                    . Before that, I worked independently on critically
                                    acclaimed concepts both by myself and friends.
                                </p>
                                <p>BSc Computer Science graduate — First Class Honours.</p>
                                <p>
                                    Awarded 2018-19{" "}
                                    <Link
                                        href="https://mvp.microsoft.com/"
                                        className="font-medium text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200"
                                    >
                                        Microsoft MVP
                                    </Link>{" "}
                                    (Most Valuable Professional) for Windows Design.
                                </p>
                            <Button to="/files/mw-resume-jan2022.pdf">
                                Download résumé
                            </Button>
                        </section>
                    </article>
            </motion.div>

            {/* Close button */}
            <motion.button
                className={clsx(
                    "fixed top-4 right-4 z-200 size-10 flex items-center justify-center rounded-full bg-[#EEE]/80 backdrop-blur-2xl border-none cursor-pointer",
                    open ? "pointer-events-auto" : "pointer-events-none",
                )}
                style={{ opacity: aboutSpring }}
                onClick={onClose}
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                        d="M4 4L14 14M14 4L4 14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </motion.button>
        </>
    );
}
