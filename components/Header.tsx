import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MichaelPic from "../public/images/michael-face.jpg";
import siteMetadata from "../siteMetadata";
import { useState } from "react";
import { useRouter } from "next/router";
import useWindowSize from "../lib/useWindowSize";

const Header: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false);
    const classes =
        "flex px-8 md:px-16 my-16 z-10 font-text items-center justify-between h-8";

    function toggleMenu(): void {
        setShowMenu(!showMenu);
        if (showMenu) {
            document.body.style.overflow = "visible";
        } else {
            window.scrollTo(0, 0);
            document.body.style.overflow = "hidden";
        }
    }

    function restoreScroll(): void {
        document.body.style.overflow = "visible";
        setShowMenu(false);
    }

    const router = useRouter();

    const { width } = useWindowSize();
    useEffect(() => {
        if (width > 640 && showMenu) restoreScroll();
    }, [width, showMenu]);

    return (
        <header
            className={
                !showMenu ? classes : `${classes} bg-white dark:bg-black`
            }
        >
            <Link
                href="/"
                className="flex items-center text-xl font-semibold tracking-tight text-gray-800 dark:text-gray-200 hover:text-gray-500 dark:hover-text-gray-600 transition-colors"
            >
                <span className="flex-initial h-8 w-8 rounded-full mr-3 shadow-md overflow-hidden">
                    <Image
                        src={MichaelPic}
                        alt="Photo of Michael West"
                        width={32}
                        height={32}
                        style={{
                            WebkitMaskImage:
                                "-webkit-radial-gradient(white,black)",
                        }}
                    />
                </span>
                {process.env.NODE_ENV === "development"
                    ? "Michael.dev"
                    : "Michael"}
            </Link>
            <div>
                <nav className="hidden float-right sm:flex flex-row gap-8">
                    {siteMetadata.menuLinks.map((link) => (
                        <Link
                            key={link.link}
                            href={link.link}
                            className={`text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors ${router.pathname == link.link && "font-bold"}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
                <div className="float-right -my-1 sm:hidden">
                    <button
                        type="button"
                        className="border border-gray-200 dark:border-gray-800 p-2 inline-flex items-center justify-center text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-none transition-all"
                        onClick={toggleMenu}
                    >
                        {!showMenu ? (
                            <div>
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
                            </div>
                        ) : (
                            <div>
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
                            </div>
                        )}
                    </button>
                </div>
            </div>
            {showMenu && (
                <div className="absolute top-40 inset-0 h-screen bg-white dark:bg-black z-20">
                    <nav>
                        {siteMetadata.menuLinks.map((link) => (
                            <Link
                                key={link.link}
                                href={link.link}
                                className={`block w-100 h-full px-8 py-4 text-gray-900 dark:text-gray-100 hover:bg-gray-700 hover:text-white ${router.pathname == link.link && "font-bold bg-gray-400 dark:bg-gray-600"}`}
                                onClick={restoreScroll}
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
