import Head from "next/head";
import * as React from "react";
import Layout from "../components/Layout";
import siteMetadata from "../siteMetadata";
import Link from "next/link";

const NotFound = () => (
    <Layout>
        <Head>
            <title>{`Page not found - ${siteMetadata.title}`}</title>
            <meta name="description" content={siteMetadata.description} />
            <meta property="og:title" content={siteMetadata.title} />
            <meta
                property="og:description"
                content={siteMetadata.description}
            />
            <meta property="og:site_name" content={siteMetadata.title} />
            <meta property="twitter:card" content="summary" />
            <meta
                property="twitter:site"
                content={siteMetadata.social.twitter}
            />
            <meta property="twitter:title" content={siteMetadata.title} />
            <meta
                property="twitter:description"
                content={siteMetadata.description}
            />
            <meta
                property="twitter:creator"
                content={siteMetadata.social.twitter}
            />
        </Head>
        <div
            style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
            }}
            className="mx-auto mt-20 mb-32"
        >
            <h1 className="text-8xl font-emoji font-bold mb-6">
                <span role="img" aria-label="Loudly crying face emoji">
                    😭
                </span>
            </h1>
            <h1 className="font-display font-semibold tracking-tight text-4xl my-4 text-gray-900 dark:text-gray-100">
                Page not found
            </h1>
            <p className="my-2 text-gray-908 dark:text-gray-200">
                That page doesn&apos;t exist. Try going to the{" "}
                <Link href="/" className="text-blue-500 hover:text-blue-700">
                    homepage
                </Link>
                .
            </p>
            <p className="text-sm text-gray-500">HTTP 404</p>
        </div>
    </Layout>
);

export default NotFound;
