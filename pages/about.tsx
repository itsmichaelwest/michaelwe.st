import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'
import Button from '../components/Button'
import Layout from '../components/Layout'

import PortraitTall from '../public/images/michael-portrait-tall.jpg'
import siteMetadata from '../siteMetadata'

const About = () => (
    <Layout>
        <Head>
            <title>About - {siteMetadata.title}</title>
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
        <article className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
            <Image className="lg:h-full mb-10 md:mb-16 lg:mb-0" src={PortraitTall} alt="Photo of Michael" />
            <section>
                <h1 className="font-display text-4xl md:text-6xl font-semibold mb-8 text-gray-900 dark:text-gray-100">
                    Michael West
                </h1>
                <div className="flex gap-2">
                    <Button to="/files/mw-resume-jan2022.pdf">
                        Download résumé
                    </Button>
                    <Button to="/profile-links">
                        Check social profiles
                    </Button>
                </div>
                <section className="prose dark:prose-dark mt-10">
                    <p>
                        I&apos;m a self-taught designer with an engineering background, specializing in simple and effortless experiences for both the devices we use today and the ones we'll use in the future. Crafting high-quality products that people love to use is my passion, and I work tirelessly to achieve that goal.
                    </p>
                    <p>
                        Using the medium of motion and rapid prototyping I bring these experiences to life, visualizing the smallest interactions to entire user journeys. I strongly believe in open design, and encourage co-creation that can help deliver a better solution for users.
                    </p>
                    <p>
                        Accessibility and inclusion sit at the center of my process — technology should empower everyone and nobody should be left with a subpar experience.
                    </p>
                    <p>
                        I'm currently a Designer 2 at <Link href="https://www.microsoft.com/">Microsoft</Link>, working on new products and other cross-company design initiatives.
                    </p>
                    <p>
                        Previously a Design Intern at Microsoft, where I was involved with products used by millions of people around the world. Check them out: <Link href="/work/surface-duo">Surface Duo</Link>, <Link href="/work/swiftkey-design-system">SwiftKey</Link>, <Link href="/work/fluent-icons">Fluent Icons</Link>. Before that, I worked independently on critically acclaimed concepts both by myself and friends.
                    </p>
                    <p>
                        BSc Computer Science graduate — First Class Honours.
                    </p>
                    <p>
                        Awarded 2018-19 <Link href="https://mvp.microsoft.com/">Microsoft MVP</Link> (Most Valuable Professional) for Windows Design.
                    </p>
                </section>
            </section>
        </article>
    </Layout>
)

export default About
