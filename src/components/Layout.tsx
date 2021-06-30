import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Header from './Header'
import Footer from './Footer'

const Layout: React.FunctionComponent = ({ children }) => {
    const data = useStaticQuery(graphql`
        query SiteTitleQuery {
            site {
                siteMetadata {
                    title
                    menuLinks {
                        name
                        link
                    }
                }
            }
        }
    `)

    return (
        <>
            <Helmet>
                <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
                <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
            </Helmet>
            <Header/>
            <main className="mx-8 sm:mx-16 2xl:mx-auto max-w-screen-2xl w-auto transition-all">
                {children}
            </main>
            <Footer/>
        </>
    )
}

export default Layout
