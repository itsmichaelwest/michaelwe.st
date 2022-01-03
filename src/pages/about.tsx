import * as React from 'react'
import SEO from '../components/Seo'
import Layout from '../components/Layout'
import { StaticImage } from 'gatsby-plugin-image'
import Button from '../components/Button'
import { Link } from 'gatsby'

import Resume from '../files/mw-resume-jan2022.pdf'

export default function AboutPage(): React.ReactElement {
    return (
        <>
        <SEO title="About"/>
        <Layout>
            <article className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
                <StaticImage className="lg:h-full mb-10 md:mb-16 lg:mb-0" src="../images/michael-portrait-tall.jpg" alt="Photo of Michael" />
                <section>
                    <h1 className="font-display text-4xl md:text-6xl font-semibold mb-8">
                        Michael West
                    </h1>
                    <Button to={Resume} isInternal={false}>
                        Download résumé
                    </Button>
                    <section className="prose mt-10">
                        <p>
                            I&apos;m a self-taught designer with an engineering background, specializing in simple and effortless experiences for both the devices we use today and the ones we’ll use in the future. Crafting high-quality products that people love to use is my passion, and I work tirelessly to achieve that goal.
                        </p>
                        <p>
                            Using the medium of motion and rapid prototyping I bring these experiences to life, visualizing the smallest interactions to entire user journeys. I strongly believe in open design, and encourage co-creation that can help deliver a better solution for users.
                        </p>
                        <p>
                            Accessibility and inclusion sit at the center of my process — technology should empower everyone and nobody should be left with a subpar experience.
                        </p>
                        <p>
                            I recently rejoined <a href="https://www.microsoft.com/">Microsoft</a> as Designer 2, working on new products and other cross-company design initiatives.
                        </p>
                        <p>
                            Previously a Design Intern at Microsoft, where I was involved with products used by millions of people around the world. Check them out: <Link to="/work/surface-duo">Surface Duo</Link>, <Link to="/work/swiftkey-design-system">SwiftKey</Link>, <Link to="/work/fluent-icons">Fluent Icons</Link>. Before that, I worked independently on critically acclaimed concepts both by myself and friends.
                        </p>
                        <p>
                            BSc Computer Science graduate — First Class Honours.
                        </p>
                        <p>
                            Awarded 2018-19 <a href="https://mvp.microsoft.com/">Microsoft MVP</a> (Most Valuable Professional) for Windows Design.
                        </p>
                    </section>
                </section>
            </article>
        </Layout>
        </>
    )
}
