import { motion } from "motion/react";
import Image from "next/image";
import clsx from "clsx";
import Face from "../public/images/michael-face.jpg";
import { useGallery } from "./Gallery/GalleryContext";

export function HeroBio() {
    const { open, openAbout } = useGallery();

    return (
        <motion.div
            className={clsx(
                "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4",
                !open
                    ? "pointer-events-auto"
                    : "pointer-events-none",
            )}
            animate={{
                opacity: open ? 0 : 1,
                filter: open ? "blur(4px)" : "blur(0px)",
            }}
        >
            <div className="space-y-4">
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
            <p>
                Hello
            </p>
            </div>

            <div className="flex items-start justify-start lg:justify-end">
                <button
                    className="underline cursor-pointer bg-transparent border-none p-0 font-inherit text-inherit"
                    onClick={() => openAbout()}
                >
                    About
                </button>
            </div>
        </motion.div>
    );
}
