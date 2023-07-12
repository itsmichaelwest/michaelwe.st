import Head from 'next/head'
import Link from 'next/link'
import * as React from 'react'
import Layout from '../components/Layout'

import siteMetadata from '../siteMetadata'

const ProfileLinks = () => (
    <Layout>
        <Head>
            <title>Profile Links - {siteMetadata.title}</title>
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
        <section className="mb-32">
            <h1 className="font-display text-4xl md:text-6xl font-semibold mb-8 text-gray-900 dark:text-gray-100">
                Profile Links
            </h1>
            <section className="prose dark:prose-dark mt-10">
                <p>
                    This page serves to list my public-facing social profiles, so you can check that a profile you're viewing and interacting with actually belongs to me.
                </p>
                <ul>
                    <li>
                        Twitter: <Link href="https://twitter.com/itsmichaelwest">@itsmichaelwest</Link>
                    </li>
                    <li>
                        Mastodon: <Link href="https://mastodon.social/@michaelwest">@michaelwest@mastodon.social</Link> (profile contains ownership-checked link to this website)
                    </li>
                    <li>
                        Bluesky: <Link href="https://bsky.app/profile/michaelwest.bsky.social">@michaelwest.bsky.social</Link>
                    </li>
                    <li>
                        Threads: <Link href="https://www.threads.net/@itsmichaelwest">@itsmichaelwest</Link>
                    </li>
                    <li>
                        LinkedIn: <Link href="https://www.linkedin.com/in/itsmichaelwest/">Michael West</Link>
                    </li>
                    <li>
                        GitHub: <Link href="https://github.com/itsmichaelwest">itsmichaelwest</Link>
                    </li>
                    <li>
                        Dribbble: <Link href="https://dribbble.com/itsmichaelwest">Michael West</Link>
                    </li>
                    <li>
                        Behance: <Link href="https://www.behance.net/itsmichaelwest">Michael West</Link>
                    </li>
                </ul>
            </section>
        </section>
    </Layout>
)

export default ProfileLinks
