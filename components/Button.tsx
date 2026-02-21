import React from "react";
import Link from "next/link";
import clsx from "clsx";

interface ButtonProps {
    to: string;
    style?: "onPrimary" | string;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ to, style, children }) => {
    let bg: string;

    if (style === "onPrimary") {
        bg =
            "border-2 border-white text-primary dark:text-primary hover:bg-white hover:text-black";
    } else {
        bg =
            "bg-linear-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:bg-none hover:bg-gray-50 dark:hover:bg-gray-800 ring ring-black/5 dark:ring-white/5 text-secondary hover:text-heading dark:text-secondary dark:hover:text-primary";
    }

    const classes =
        "px-6 py-2 inline-block rounded-xl shadow-xs hover:shadow opacity-100 active:opacity-75 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 transition-transform";

    return (
        <Link href={to} className={clsx(bg, classes)}>
            {children}
        </Link>
    );
};

export default Button;
