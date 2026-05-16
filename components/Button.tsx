import React from "react";
import Link from "next/link";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
    /** Anchor target. The component renders as a Next `<Link>`. */
    to: string;
    children: React.ReactNode;
    /**
     * Visual style. Defaults to `secondary` (the existing pill on a hairline
     * ring) so existing call sites continue to render identically.
     * - `primary`: solid inverse fill — black-on-light, white-on-dark. Use
     *   sparingly for the single most important action on a screen.
     * - `secondary`: subtle surface with a 1px hairline ring. The workhorse.
     * - `ghost`: transparent until hover. For tertiary actions in dense UI.
     */
    variant?: ButtonVariant;
    /** sm = 32px, md = 40px, lg = 48px tall. Defaults to `md`. */
    size?: ButtonSize;
    className?: string;
}

const base =
    "inline-flex items-center justify-center gap-1.5 rounded-full font-medium select-none " +
    "transition-[scale,color,background-color,box-shadow] duration-200 ease-out " +
    "active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-caption",
    md: "h-10 px-4 text-caption",
    lg: "h-12 px-5 text-body",
};

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-bg-inverse text-fg-inverse hover:bg-bg-inverse-hover",
    secondary:
        "text-heading bg-surface ring-1 ring-hairline hover:bg-surface-hover",
    ghost: "text-heading hover:bg-surface",
};

const Button: React.FC<ButtonProps> = ({
    to,
    children,
    variant = "secondary",
    size = "md",
    className,
}) => (
    <Link
        href={to}
        className={clsx(
            base,
            sizeClasses[size],
            variantClasses[variant],
            className,
        )}
    >
        {children}
    </Link>
);

export default Button;
