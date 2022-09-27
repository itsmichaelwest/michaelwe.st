import Head from 'next/head'
import * as React from 'react'
import Layout from '../components/Layout'
import siteMetadata from '../siteMetadata'

const NotFound = () => {
    const url = typeof window !== 'undefined' ? window.location.pathname : ''

    return (
        <Layout>
            <Head>
                <title>Page not found - {siteMetadata.title}</title>
                <meta name="description" content={siteMetadata.description} />
                <meta property="og:title" content={siteMetadata.title} />
                <meta property="og:description" content={siteMetadata.description} />
                <meta property="og:site_name" content={siteMetadata.title} />
                <meta property="twitter:card" content="summary" />
                <meta property="twitter:site" content={siteMetadata.social.twitter} />
                <meta property="twitter:title" content={siteMetadata.title} />
                <meta property="twitter:description" content={siteMetadata.description} />
                <meta property="twitter:creator" content={siteMetadata.social.twitter} />
            </Head>
            <div style={{ textAlign: "center", display: 'flex', flexDirection: 'column' }} className="mx-auto mt-20 mb-32">
                <h1 className="text-8xl font-emoji font-bold mb-6">
                    <span role="img" aria-label="Loudly crying face emoji">
                        😭
                    </span>
                </h1>
                <h1 className="font-display text-4xl font-bold my-4">
                    Page not found
                </h1>
                <p id="url">
                    {url}
                </p>
                <p className="my-2">
                    Oh no, the page you were trying to look for couldn&apos;t be found.
                </p>
                <p className="text-sm text-gray-500">
                    HTTP 404
                </p>
            </div>
        </Layout>
    )
}

export default NotFound
