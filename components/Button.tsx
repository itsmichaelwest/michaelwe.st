import React from "react";
import Link from "next/link";

interface ButtonProps {
    to: string;
    style?: "onPrimary" | string;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ to, style, children }) => {
    let bg: string;

    if (style === "onPrimary") {
        bg = "border-2 border-white text-white hover:bg-white hover:text-black";
    } else {
        bg =
            "border-2 border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-200 dark:hover:text-gray-700";
    }

    const classes = "px-6 py-2 inline-block transition-all";

    return (
        <Link href={to} className={`${bg} ${classes}`}>
            {children}
        </Link>
    );
};

export default Button;
