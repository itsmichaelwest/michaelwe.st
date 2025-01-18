const withMDX = require("@next/mdx")({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [],
        rehypePlugins: [],
        // If you use `MDXProvider`, uncomment the following line.
        providerImportSource: "@mdx-js/react",
    },
});

module.exports = withMDX({
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
});

module.exports = {
    async redirects() {
        return [
            {
                source: "/blog/2019/01/27/design-decisions-in-cortana-os",
                destination: "/work/cortana-os",
                permanent: true,
            },
            {
                source: "/projects/2019/06/12/microsoft-edge-for-ios-redesign",
                destination: "/work/edge-ios-redesign",
                permanent: true,
            },
            {
                source: "/fluent-icons",
                destination: "/work/fluent-icons",
                permanent: true,
            },
            {
                source: "/projects/2018/03/30/designing-a-new-windows-shell-introducing-fluid-desktop",
                destination: "/work/fluid-desktop",
                permanent: true,
            },
            {
                source: "/fluid-desktop",
                destination: "/work/fluid-desktop",
                permanent: true,
            },
            {
                source: "/projects/2018/11/06/microsoft-store-editorial-content",
                destination: "/work/microsoft-store-content",
                permanent: true,
            },
            {
                source: "/podcasts-app-concept",
                destination: "/work/podcasts-app-concept",
                permanent: true,
            },
            {
                source: "/projects/podcasts-app-concept",
                destination: "/work/podcasts-app-concept",
                permanent: true,
            },
            {
                source: "/project-meta",
                destination:
                    "https://www.behance.net/gallery/65838043/Project-Meta",
                permanent: true,
            },
            {
                source: "/surface-duo",
                destination: "/work/surface-duo",
                permanent: true,
            },
            {
                source: "/swiftkey-design-system",
                destination: "/work/swiftkey-design-system",
                permanent: true,
            },
            {
                source: "/w10nav",
                destination: "/work/windows-navigation",
                permanent: true,
            },
            {
                source: "/projects/redesigning-navigation-for-windows-10",
                destination: "/work/windows-navigation",
                permanent: true,
            },
            {
                source: "/projects/2018/05/29/redesigning-navigation-for-windows-10",
                destination: "/work/windows-navigation",
                permanent: true,
            },
            {
                source: "/oobe",
                destination: "/work/windows-oobe-redesign",
                permanent: true,
            },
            {
                source: "/projects/windows-oobe-redesign",
                destination: "/work/windows-oobe-redesign",
                permanent: true,
            },
            {
                source: "/projects/2018/06/16/windows-setup-experience",
                destination: "/work/windows-setup-redesign",
                permanent: true,
            },
            {
                source: "/your-phone-redesign",
                destination: "/work/your-phone-redesign",
                permanent: true,
            },
            {
                source: "/projects/2018/10/17/your-phone-redesign",
                destination: "/work/your-phone-redesign",
                permanent: true,
            },
        ];
    },
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        return config;
    },
};
