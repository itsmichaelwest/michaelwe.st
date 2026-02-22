import { motion } from "motion/react";
import Image from "next/image";
import clsx from "clsx";
import Face from "../public/images/michael-face.jpg";
import { useGallery } from "./Gallery/GalleryContext";

export function HeroBio() {
    const { open } = useGallery();

    return (
        <motion.div
            className={clsx(
                "flex flex-col gap-4 transition-opacity duration-200",
                !open
                    ? "pointer-events-auto"
                    : "pointer-events-none",
            )}
            animate={{
                opacity: open ? 0 : 1,
                filter: open ? "blur(4px)" : "blur(0px)",
            }}
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
        </motion.div>
    );
}
