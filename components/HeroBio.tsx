"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import clsx from "clsx";
import Face from "../public/images/michael-face.jpg";
import { useGallery } from "./Gallery/GalleryContext";
import Link from "next/link";
import { TransitionLink } from "./TransitionLink";

interface HeroBioProps {
    showWriting?: boolean;
}

export function HeroBio({ showWriting = false }: HeroBioProps) {
    const { open, openAbout } = useGallery();
    const reducedMotion = useReducedMotion();

    return (
        <motion.div
            className={clsx(
                "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4",
                !open ? "pointer-events-auto" : "pointer-events-none",
            )}
            aria-hidden={open || undefined}
            inert={open || undefined}
            initial={
                reducedMotion
                    ? { opacity: 0 }
                    : {
                          opacity: 0,
                          scale: 0.97,
                          filter: "blur(8px)",
                      }
            }
            animate={
                reducedMotion
                    ? { opacity: open ? 0 : 1 }
                    : {
                          opacity: open ? 0 : 1,
                          scale: open ? 0.96 : 1,
                          filter: open ? "blur(4px)" : "blur(0px)",
                      }
            }
            transition={
                open
                    ? {}
                    : {
                          duration: 0.6,
                          ease: [0.23, 1, 0.32, 1],
                          delay: 0.1,
                      }
            }
        >
            <div className="space-y-6">
                <div className="flex gap-4 items-center">
                    <Image
                        className="w-10 rounded-full ring-1 ring-hairline"
                        src={Face}
                        alt="Photo of Michael"
                    />
                    <div>
                        <h1 className="text-body font-semibold text-balance">
                            Michael West
                        </h1>
                        <p className="text-body text-muted">
                            Senior Designer at Microsoft
                        </p>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-body text-pretty">
                        I currently work on Windows, where our team focuses on
                        making your PC experience more powerful and delightful
                        with AI, while also scaling new tooling across the
                        studio.{" "}
                        <button
                            className="inline link-underline-muted cursor-pointer bg-transparent border-none p-0 font-inherit"
                            onClick={() => openAbout()}
                        >
                            More
                        </button>
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-start md:items-end text-body text-muted">
                {showWriting && (
                    <TransitionLink
                        className="link-underline-muted"
                        href="/writing"
                        direction="fade"
                    >
                        Writing
                    </TransitionLink>
                )}
                <Link
                    className="link-underline-muted"
                    href="https://x.com/itsmichaelwest"
                    target="_blank"
                    rel="noopener noreferrer me"
                >
                    X
                </Link>
                <Link
                    className="link-underline-muted"
                    href="https://www.linkedin.com/in/itsmichaelwest"
                    target="_blank"
                    rel="noopener noreferrer me"
                >
                    LinkedIn
                </Link>
                <Link
                    className="link-underline-muted"
                    href="https://github.com/itsmichaelwest"
                    target="_blank"
                    rel="noopener noreferrer me"
                >
                    GitHub
                </Link>
            </div>
        </motion.div>
    );
}
