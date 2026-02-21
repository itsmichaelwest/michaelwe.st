import React, { useEffect } from "react";
import Link from "next/link";
import siteMetadata from "../siteMetadata";
import { useState } from "react";
import { useRouter } from "next/router";
import useWindowSize from "../lib/useWindowSize";
import clsx from "clsx";

const Header: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false);

    const router = useRouter();

    const { width } = useWindowSize();
    const shouldShowNav = width > 640;

    const HomeLink = () => (
        <Link
            href="/"
            className="font-semibold text-primary focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4"
        >
            Michael West
        </Link>
    );

    return (
        <header className="relative z-50 py-12 flex items-center justify-between font-text tracking-tight">
            <HomeLink />
            {shouldShowNav ? (
                <nav className="flex gap-6">
                    {siteMetadata.menuLinks.map((link) => (
                        <Link
                            key={link.link}
                            href={link.link}
                            className={clsx(
                                "text-muted hover:text-heading focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-6 focus:outline-black",
                                router.pathname == link.link &&
                                    "font-bold text-heading",
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            ) : (
                <button
                    type="button"
                    className="flex items-center justify-center text-muted hover:text-primary"
                    onClick={() => setShowMenu(true)}
                >
                    <span className="sr-only">Open menu</span>
                    <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            )}
            {showMenu && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 max-w-[80ch] h-screen mx-auto px-8 py-12 space-y-12 bg-white dark:bg-black z-20"
                >
                    <div className="flex justify-between">
                        <HomeLink />
                        <button
                            type="button"
                            className="text-muted hover:text-primary"
                            onClick={() => setShowMenu(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <nav className="flex flex-col gap-4">
                        {siteMetadata.menuLinks.map((link) => (
                            <Link
                                key={link.link}
                                href={link.link}
                                className={clsx(
                                    router.pathname == link.link
                                        ? "text-primary font-bold"
                                        : "text-muted hover:text-primary",
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
