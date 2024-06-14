/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
        },
        fontFamily: {
            display: ["Inter", "sans-serif"],
            sans: ["Inter", "sans-serif"],
            emoji: [
                "sans-serif",
                "Apple Color Emoji",
                "Segoe UI Emoji",
                "Segoe UI Symbol",
                "Noto Color Emoji",
            ],
        },
        extend: {
            backgroundColor: ["active"],
            boxShadow: ["active"],
            scale: ["group-hover"],
            colors: {
                blue: {
                    DEFAULT: "#3591f3",
                    900: "#26419f",
                    800: "#2c60bf",
                    700: "#3071d1",
                    600: "#3383e5",
                    500: "#3591f3",
                    400: "#4ba1f6",
                    300: "#68b1f7",
                    200: "#92c7fa",
                    100: "#bcdcfc ",
                    50: "#e3f1fd",
                },
                gray: {
                    900: "#212121",
                    800: "#333333",
                    700: "#3c3c3c",
                    600: "#666666",
                    500: "#A6A6A6",
                    400: "#c8c8c8",
                    300: "#d0d0d0",
                    200: "#dadada",
                    100: "#eaeaea",
                    50: "#f4f4f4",
                },
                twitter: {
                    DEFAULT: "#1da1f2",
                },
                mastodon: {
                    DEFAULT: "#595aff",
                },
                linkedin: {
                    DEFAULT: "#0073b1",
                },
                dribbble: {
                    DEFAULT: "#ea4c89",
                },
                behance: {
                    DEFAULT: "#1769ff",
                },
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme("colors.gray.900"),
                        strong: {
                            color: theme("colors.gray.900"),
                        },
                        a: {
                            color: theme("colors.blue.500"),
                            textDecoration: "none",
                            "&:hover": {
                                color: theme("colors.blue.700"),
                                textDecoration: "none",
                            },
                        },
                        h2: {
                            color: theme("colors.gray.800"),
                        },
                        h4: {
                            color: theme("colors.gray.800"),
                        },
                        figure: {
                            margin: "6rem 0 6rem -30%",
                            width: "160%",
                            position: "relative",
                            display: "block",
                            "@media (max-width: 1536px)": {
                                margin: "6rem 0 6rem -20%",
                                width: "140%",
                            },
                            "@media (max-width: 1024px)": {
                                margin: "6rem 0 6rem 0",
                                width: "100%",
                            },
                            figcaption: {
                                color: theme("colors.gray.500"),
                            },
                        },
                    },
                },
                dark: {
                    css: {
                        color: theme("colors.gray.100"),
                        strong: {
                            color: theme("colors.gray.100"),
                        },
                        a: {
                            color: theme("colors.blue.500"),
                            textDecoration: "none",
                            "&:hover": {
                                color: theme("colors.blue.300"),
                                textDecoration: "none",
                            },
                        },
                        h2: {
                            color: theme("colors.gray.200"),
                        },
                        h4: {
                            color: theme("colors.gray.200"),
                        },
                        figure: {
                            margin: "6rem 0 6rem -30%",
                            width: "160%",
                            position: "relative",
                            display: "block",
                            "@media (max-width: 1536px)": {
                                margin: "6rem 0 6rem -20%",
                                width: "140%",
                            },
                            "@media (max-width: 1024px)": {
                                margin: "6rem 0 6rem 0",
                                width: "100%",
                            },
                            figcaption: {
                                color: theme("colors.gray.500"),
                            },
                        },
                    },
                },
            }),
        },
    },
    variants: {
        typography: ["dark"],
        extend: {},
    },
    plugins: [require("@tailwindcss/typography")],
};
