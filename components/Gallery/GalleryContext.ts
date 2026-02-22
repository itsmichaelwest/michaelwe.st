"use client";

import { createContext, useContext } from "react";
import type { MotionValue } from "motion/react";

interface GalleryContextValue {
    open: boolean;
    openSpring: MotionValue<number>;
    aboutOpen: boolean;
    openAbout: () => void;
    closeAbout: () => void;
}

export const GalleryContext = createContext<GalleryContextValue | null>(null);

export function useGallery() {
    const ctx = useContext(GalleryContext);
    if (!ctx) throw new Error("useGallery must be used within GalleryShell");
    return ctx;
}
