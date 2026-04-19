"use client";

import { createContext, useContext } from "react";
import type { MotionValue } from "motion/react";

export interface ContainerRect {
    left: number;
    bottom: number;
    width: number;
    height: number;
}

interface GalleryContextValue {
    open: boolean;
    openSpring: MotionValue<number>;
    aboutOpen: boolean;
    openAbout: () => void;
    closeAbout: () => void;
    rect: ContainerRect;
}

export const GalleryContext = createContext<GalleryContextValue | null>(null);

export function useGallery() {
    const ctx = useContext(GalleryContext);
    if (!ctx) throw new Error("useGallery must be used within GalleryShell");
    return ctx;
}
