import React from "react"

import Layout from "../components/Layout"
import SEO from "../components/Seo"

const NotFoundPage = () => {
    const url = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
    <Layout>
        <SEO title="Page Not Found" />
        <div style={{ textAlign: "center", display: 'flex', flexDirection: 'column' }}>
            <div style={{ margin: 'auto' }}>
                <h1 className="text-6xl"><span role="img" aria-label="Loudly crying face emoji">😭</span></h1>
                <h1 className="text-4xl my-4">Page not found</h1>
                <div className="text-lg font-body font-light leading-relaxed tracking-tight">
                    <p id="url">{url}</p>
                    <p className="my-2">You just hit a route that doesn&#39;t exist... the sadness.</p>
                    <p className="text-sm">HTTP 404</p>
                </div>
            </div>
        </div>
    </Layout>
    )
}

export default NotFoundPage