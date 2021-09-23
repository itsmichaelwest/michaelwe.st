import * as React from 'react'
import Helmet from 'react-helmet'
import Header from './Header'
import Footer from './Footer'

const Layout: React.FunctionComponent = ({ children }) => {
    return (
        <>
            <Helmet>
                <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
                <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
            </Helmet>
            <Header/>
            <main className="max-w-screen-2xl w-auto px-8 md:px-16 mx-auto overflow-hidden">
                {children}
            </main>
            <Footer/>
        </>
    )
}

export default Layout
