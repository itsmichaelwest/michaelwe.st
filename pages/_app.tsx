import { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../styles/global.css";

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Component {...pageProps} />
            <Analytics />
            <SpeedInsights />
        </>
    );
};

export default App;
