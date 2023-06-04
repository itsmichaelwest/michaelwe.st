import Head from 'next/head'
import Footer from './Footer'
import Header from './Header'

const Layout = ({ children }) => (
    <>
        <Head>
            <link rel="icon" href="/favicon.ico" />
            <link rel="me" href="https://mastodon.social/@michaelwest" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Header />
        <main className="max-w-screen-2xl w-auto px-8 md:px-16 mx-auto overflow-hidden">
            {children}
        </main>
        <Footer />
    </>
)

export default Layout
