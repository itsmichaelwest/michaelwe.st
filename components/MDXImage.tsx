"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface MDXImageProps {
    src: string;
    alt?: string;
    height?: number | string;
    width?: number | string;
}

export function MDXImage({ src, alt = "", height, width }: MDXImageProps) {
    const [loaded, setLoaded] = useState(false);
    const fallbackRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (fallbackRef.current?.complete) setLoaded(true);
    }, []);

    const animClasses = clsx(
        "rounded-xl ring ring-black/5 dark:ring-white/10 transition-[filter,opacity] duration-700 ease-out",
        loaded
            ? "opacity-100 blur-0"
            : "opacity-0 blur-md scale-[1.01]",
    );

    if (height && width) {
        return (
            <figure className="my-16 space-y-4">
                <Image
                    ref={fallbackRef}
                    src={src}
                    alt={alt}
                    height={Number(height)}
                    width={Number(width)}
                    sizes="(max-width: 768px) 100vw, min(80ch, 100vw)"
                    className={animClasses}
                    onLoad={() => setLoaded(true)}
                />
                {alt && (
                    <figcaption className="text-sm opacity-50">{alt}</figcaption>
                )}
            </figure>
        );
    }

    return (
        <figure className="my-16 space-y-4">
            <div className="relative w-full aspect-video">
                <Image
                    ref={fallbackRef}
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 100vw, min(80ch, 100vw)"
                    className={clsx(animClasses, "object-contain")}
                    onLoad={() => setLoaded(true)}
                />
            </div>
            {alt && (
                <figcaption className="text-sm opacity-50">{alt}</figcaption>
            )}
        </figure>
    );
}
