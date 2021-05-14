import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
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
            <Header/>
            <main className="mx-8 sm:mx-16 2xl:mx-auto max-w-screen-2xl w-auto transition-all">
                {children}
            </main>
            <Footer/>
        </>
    )
}

export default Layout
