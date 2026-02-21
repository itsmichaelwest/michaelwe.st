import { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../styles/global.css";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <div
            className={`${inter.className} ${inter.variable} font-sans max-w-[80ch] px-8 mx-auto`}
        >
            <Component {...pageProps} />
            <Analytics />
            <SpeedInsights />
        </div>
    );
};

export default App;
