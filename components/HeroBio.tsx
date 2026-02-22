"use client";

import { motion } from "motion/react";
import Image from "next/image";
import clsx from "clsx";
import Face from "../public/images/michael-face.jpg";
import { useGallery } from "./Gallery/GalleryContext";
import Link from "next/link";

export function HeroBio() {
    const { open, openAbout } = useGallery();

    return (
        <motion.div
            className={clsx(
                "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4",
                !open ? "pointer-events-auto" : "pointer-events-none",
            )}
            animate={{
                opacity: open ? 0 : 1,
                filter: open ? "blur(4px)" : "blur(0px)",
            }}
        >
            <div className="space-y-6">
                <div className="flex gap-4 items-center">
                    <Image
                        className="w-10 rounded-full shadow ring ring-black/10 dark:ring-white/5"
                        src={Face}
                        alt="Photo of Michael"
                    />
                    <div className="-space-y-1">
                        <h1 className="font-semibold">Michael West</h1>
                        <p className="font-medium text-muted">
                            Senior Designer at Microsoft
                        </p>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-muted italic">
                        Designer, engineer, builder.
                    </p>
                    <p>
                        I currently work on Windows, where our team focuses on
                        making your PC experience more powerful and delightful
                        with AI, while also scaling new tooling across the
                        studio.{" "}
                        <button
                            className="inline text-muted hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit"
                            onClick={() => openAbout()}
                        >
                            More...
                        </button>
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-start md:items-end text-muted">
                <Link
                    className="hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit text-inherit"
                    href="https://x.com/itsmichaelwest"
                    target="_blank"
                    rel="noopener noreferrer me"
                >
                    X
                </Link>
                <Link
                    className="hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit text-inherit"
                    href="https://www.linkedin.com/in/itsmichaelwest"
                    target="_blank"
                    rel="noopener noreferrer me"
                >
                    LinkedIn
                </Link>
                <Link
                    className="hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit text-inherit"
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
