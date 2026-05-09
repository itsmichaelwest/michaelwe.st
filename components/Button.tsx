import React from "react";
import Link from "next/link";
import clsx from "clsx";

interface ButtonProps {
    className: string;
    to: string;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ className, to, children }) => (
    <Link
        href={to}
        className={clsx(
            "inline-flex items-center gap-1.5 px-4 py-2 rounded-full ring ring-black/10 dark:ring-white/15 font-mono text-sm font-medium text-heading hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-[transform,background-color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2",
            className,
        )}
    >
        {children}
    </Link>
);

export default Button;
