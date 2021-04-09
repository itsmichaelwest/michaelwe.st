import React from "react"
import PropTypes from 'prop-types'
import { graphql, Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Layout from "../components/Layout"
import SEO from "../components/Seo"
import NoMSFTDisclaimer from "../components/NoMSFTDisclaimer"
import Button from "../components/Button"
import { motion } from 'framer-motion'

const shortcodes = { Link }

export default function Template({ data }) {
    const post = data.mdx

    const image = getImage(post.frontmatter.featuredImage)
    let imageSocial

    if (image !== undefined) {
        const imageSrc = image.images.fallback.src

        let origin
        if (typeof window !== "undefined") {
            origin = window.location.origin
        }

        imageSocial = origin + imageSrc
    }

    return (
        <Layout>
            <SEO
                title={post.frontmatter.title}
                description={post.frontmatter.description}
                image={imageSocial}
            />
            {
            post.frontmatter.featuredImage
            ?
            <article className="mb-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}>
                    <div className="mt-16 mb-32">
                        <p className="text-sm mb-4 text-gray-600">
                            {post.frontmatter.category} — {post.frontmatter.date}
                        </p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                            <div>
                                <h1 className="text-4xl font-header font-bold mb-8 dark:text-white">{post.frontmatter.title}</h1>
                                {post.frontmatter.officialURL && <Button isInternal={false} to={post.frontmatter.officialURL}>{post.frontmatter.officialURLText}</Button>}
                            </div>
                            <div>
                                {post.frontmatter.description && <p className="font-body font-light leading-loose dark:text-gray-100">{post.frontmatter.description}</p>}
                            </div>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity :0, y: 300 }}
                    animate={{ opacity :1, y: 0 }}
                    transition={{ ease: 'circOut', delay: 0.3 }}>
                    <GatsbyImage className="lg:h-screen" style={{ maxHeight: '100rem' }} image={image} alt={post.frontmatter.featuredImageAlt}/>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ ease: 'circOut', delay: 0.5 }}>
                    <div className="prose mx-auto font-body leading-loose tracking-tight my-24 dark:prose-dark">
                        {post.frontmatter.noMSFT && <NoMSFTDisclaimer title={post.frontmatter.title} />}
                        <MDXProvider components={shortcodes}>
                            <MDXRenderer>{post.body}</MDXRenderer>
                        </MDXProvider>
                    </div>
                </motion.div>
            </article>
            :
            <article className="mb-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}>
                    <div className="mt-16 mb-32">
                        <p className="text-sm mb-4 text-gray-600">
                            {post.frontmatter.category} — {post.frontmatter.date}
                        </p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                            <div>
                                <h1 className="text-4xl font-header font-bold mb-8 dark:text-white">{post.frontmatter.title}</h1>
                                {post.frontmatter.officialURL && <Button isInternal={false} to={post.frontmatter.officialURL}>{post.frontmatter.officialURLText}</Button>}
                            </div>
                            <div>
                                {post.frontmatter.description && <p className="font-body font-light leading-loose dark:text-gray-100">{post.frontmatter.description}</p>}
                            </div>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity :0, y: 300 }}
                    animate={{ opacity :1, y: 0 }}
                    transition={{ ease: 'circOut', delay: 0.5 }}>
                    <div className="prose mx-auto font-body leading-loose tracking-tight my-24 dark:prose-dark">
                        {post.frontmatter.noMSFT && <NoMSFTDisclaimer title={post.frontmatter.title} />}
                        <MDXProvider components={shortcodes}>
                            <MDXRenderer>{post.body}</MDXRenderer>
                        </MDXProvider>
                    </div>
                </motion.div>
            </article>
            }
        </Layout>
    )
}

Template.propTypes = {
    data: PropTypes.any
}

export const pageQuery = graphql`
query ArticleBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
        id
        body
        frontmatter {
            title
            date(formatString: "YYYY")
            description
            category
            featuredImage {
                name
                extension
                childImageSharp {
                    gatsbyImageData(
                        width: 2560
                        placeholder: BLURRED
                        formats: [AUTO, WEBP, AVIF]
                    )
                }
            }
            featuredImageAlt
            officialURL
            officialURLText
            noMSFT
            aliases
        }
    }
}`
