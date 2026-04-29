"use client";

import { useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

type LinkProps = ComponentProps<typeof Link>;

interface TransitionLinkProps extends LinkProps {
    direction?: "forward" | "back";
}

type DocWithVT = Document & {
    startViewTransition?: (cb: () => void | Promise<void>) => {
        finished: Promise<void>;
        ready: Promise<void>;
    };
};

export function TransitionLink({
    direction = "forward",
    onClick,
    ...props
}: TransitionLinkProps) {
    const router = useRouter();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;

        if (
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey ||
            e.button !== 0 ||
            (props.target && props.target !== "_self")
        ) {
            return;
        }

        const doc = document as DocWithVT;
        if (typeof doc.startViewTransition !== "function") {
            return;
        }

        e.preventDefault();

        const href =
            typeof props.href === "string"
                ? props.href
                : props.href.toString();

        const root = document.documentElement;
        root.dataset.viewTransition = direction;

        const transition = doc.startViewTransition(() => {
            flushSync(() => {
                router.push(href);
            });
        });

        transition.finished.finally(() => {
            delete root.dataset.viewTransition;
        });
    };

    return <Link {...props} onClick={handleClick} />;
}
