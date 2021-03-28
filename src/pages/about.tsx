import React from 'react'
import SEO from '../components/Seo'
import Layout from '../components/Layout'
import { StaticImage } from 'gatsby-plugin-image'
import Button from '../components/Button'
import Resume from '../files/mw-resume-dec2020.pdf'

export default function AboutPage() {
    return (
        <>
        <SEO title="About" />
        <Layout>
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
                <StaticImage src="../images/michael-portrait-tall.jpg" alt="Photo of Michael" style={{ height: '90%' }} />
                <div>
                    <h1 className="text-3xl font-header font-semibold leading-tight mb-8 dark:text-white">Michael West</h1>
                    <Button to={Resume} isInternal={false}>Download résumé</Button>
                    <div className="prose dark:prose-dark leading-loose mt-10">
                        <p>
                            I&apos;m a self-taught designer-developer (yep, that&apos;s a thing!) specializing in simple and effortless experiences for both the devices we use today and the ones we’ll use in the future. Crafting high-quality products is my passion, and I work tirelessly to achieve that goal.
                        </p>
                        <p>
                            Using the medium of motion I bring these experiences to life, visualizing the smallest interactions to entire user journeys.
                        </p>
                        <p>
                            I strongly believe in open design, and encourage co-creation that can help deliver a better solution for our users.
                        </p>
                        <p>
                            Accessibility and inclusion sit at the center of my process — nobody should be left with a subpar experience.
                        </p>
                        <p>
                            I&apos;m currently working on finishing my Computer Science degree, and am open for new work opportunities starting from July.
                        </p>
                        <p>
                            I was previously a design intern at <a href="https://www.microsoft.com/">Microsoft</a> working on a variety of products and design systems, and freelance before that. Awarded 2018-19 <a href="https://mvp.microsoft.com/">Microsoft MVP</a> (Most Valuable Professional) for Windows Design.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
        </>
    )
}