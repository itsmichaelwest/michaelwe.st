import React from "react";
import LinkedIn from "../public/vectors/linkedin.svg";
import Link from "next/link";
import TwitterX from "../public/vectors/twitter-x.svg";
import clsx from "clsx";

const classes =
    "h-10 w-10 mr-2 box-content rounded-full text-primary bg-white/30 dark:bg-black/30 hover:bg-white dark:hover:bg-black ring ring-black/5 dark:ring-white/5 hover:ring-black/7 dark:hover:ring-white/7 focus-visible:outline-2 focus-visible:outline-offset-2 shadow-xs active:scale-95 transition-transform";

const svgClasses = "relative mx-2 scale-90 -left-0.5 top-1.5 fill-current";

const SocialIcons: React.FC = () => (
    <div className="flex">
        <Link
            className={clsx(
                classes,
                "hover:text-black dark:hover:text-white focus-visible:text-black dark:focus-visible:text-white focus-visible:outline-black dark:focus-visible:outline-white",
            )}
            href="https://twitter.com/itsmichaelwest"
            target="_blank"
            rel="noopener noreferrer me"
        >
            <span className="sr-only">X (formerly Twitter)</span>
            <TwitterX className="relative mx-2 scale-90 top-2 fill-current" />
        </Link>
        <Link
            className={clsx(
                classes,
                "hover:text-linkedin focus-visible:text-linkedin focus-visible:outline-linkedin",
            )}
            href="https://www.linkedin.com/in/itsmichaelwest"
            target="_blank"
            rel="noopener noreferrer"
        >
            <span className="sr-only">LinkedIn</span>
            <LinkedIn className={svgClasses} />
        </Link>
    </div>
);

export default SocialIcons;
