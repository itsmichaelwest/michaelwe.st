import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import Header from "./Header"
import Footer from "./Footer"

const Layout = ({ children }) => {
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
            <Header menuLinks={data.site.siteMetadata.menuLinks} />
            <main className="mx-8 sm:mx-16 2xl:mx-auto max-w-screen-2xl w-auto transition-all">
                {children}
            </main>
            <Footer/>
        </>
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout
