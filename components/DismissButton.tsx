"use client";

import { forwardRef } from "react";
import clsx from "clsx";
import { BackChevron, CloseCross } from "./icons/Glyphs";

interface DismissButtonProps {
    /**
     * "back" puts the chevron on the left and expands a label to the right
     * (used as the gallery back button). "close" puts an × on the right and
     * expands a label to the left (used by AboutModal and MDXImage lightbox).
     */
    variant: "back" | "close";
    /** Visible-on-hover label. Defaults to "Back" / "Close" per variant. */
    label?: string;
    /** Localized aria-label. Defaults to the visible label. */
    ariaLabel?: string;
    onClick?: () => void;
    /**
     * Extra classes layered on top of the base positioning + colors. Use this
     * to set position (fixed/absolute), z-index, blend mode, etc.
     */
    className?: string;
    /** Forwarded to the underlying button. Used by GalleryShell to gate focus
     *  while the gallery is closed. */
    tabIndex?: number;
    /** Used to mirror pointer-events with the button's enabled state. */
    pointerEventsAuto?: boolean;
}

const labelExpand =
    "max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,margin-left,margin-right,opacity] duration-280 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:max-w-[60px] group-hover:opacity-100";

export const DismissButton = forwardRef<HTMLButtonElement, DismissButtonProps>(
    function DismissButton(
        {
            variant,
            label,
            ariaLabel,
            onClick,
            className,
            tabIndex,
            pointerEventsAuto = true,
        },
        ref,
    ) {
        const text = label ?? (variant === "back" ? "Back" : "Close");
        return (
            <button
                ref={ref}
                type="button"
                onClick={onClick}
                tabIndex={tabIndex}
                aria-label={ariaLabel ?? text}
                className={clsx(
                    "group inline-flex h-10 items-center border-none bg-transparent p-0 text-caption text-muted transition-[color,transform] duration-200 ease-out hover:text-secondary active:scale-[0.96]",
                    pointerEventsAuto
                        ? "pointer-events-auto"
                        : "pointer-events-none",
                    className,
                )}
            >
                {variant === "back" ? (
                    <>
                        <BackChevron />
                        <span
                            className={clsx(
                                labelExpand,
                                "ml-0 group-hover:ml-1.5",
                            )}
                        >
                            {text}
                        </span>
                    </>
                ) : (
                    <>
                        <span
                            className={clsx(
                                labelExpand,
                                "mr-0 group-hover:mr-1.5",
                            )}
                        >
                            {text}
                        </span>
                        <CloseCross />
                    </>
                )}
            </button>
        );
    },
);
