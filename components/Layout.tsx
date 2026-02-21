import Head from "next/head";
import Footer from "./Footer";
import Header from "./Header";
import type { FC, ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => (
    <>
        <Head>
            <link rel="icon" href="/favicon.ico" />
            <link rel="me" href="https://mastodon.social/@michaelwest" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <meta name="view-transition" content="same-origin" />
        </Head>
        <Header />
        <main>{children}</main>
        <Footer />
    </>
);

export default Layout;
