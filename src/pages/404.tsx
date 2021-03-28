import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/Seo"

const NotFoundPage = () => {
    const url = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <Layout>
            <SEO title="Page Not Found" />
            <div style={{ textAlign: "center", display: 'flex', flexDirection: 'column' }} className="dark:text-white">
                <div className="mx-auto mt-20 mb-32">
                    <h1 className="text-8xl font-emoji font-bold mb-6"><span role="img" aria-label="Loudly crying face emoji">😭</span></h1>
                    <h1 className="text-2xl font-header font-bold my-4">Page not found</h1>
                    <div className="font-body leading-loose tracking-tight">
                        <p id="url">{url}</p>
                        <p className="my-2">Oh no, the page you were trying to look for couldn&apos;t be found.</p>
                        <p className="text-sm text-gray-500">HTTP 404</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default NotFoundPage
