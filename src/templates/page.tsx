import React from 'react'
import { graphql, Link } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../components/Layout'
import SEO from '../components/Seo'
import NoMSFTDisclaimer from '../components/NoMSFTDisclaimer'
import Button from '../components/Button'

const shortcodes = { Link }

export default function Template({ data }: any): React.ReactElement {
    const post = data.mdx

    const image = getImage(post.frontmatter.featuredImage)
    let imageSocial

    if (image !== undefined) {
        const imageSrc = image.images.fallback.src

        let origin
        if (typeof window !== 'undefined') {
            origin = window.location.origin
        }

        imageSocial = origin + imageSrc
    }

    return (
        <Layout>
            <SEO
                title={post.frontmatter.title}
                description={post.frontmatter.description}
                image={imageSocial}/>
            <article className="mb-16">
                    <header className="mt-16">
                        <p className="font-body text-sm mb-4 text-gray-600">
                            {post.frontmatter.category} — {post.frontmatter.date}
                        </p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                            <div>
                                <h1 className="text-6xl font-header font-bold mb-8">
                                    {post.frontmatter.title}
                                </h1>
                                {post.frontmatter.officialURL && 
                                <Button isInternal={false} to={post.frontmatter.officialURL}>
                                    {post.frontmatter.officialURLText}
                                </Button>
                                }
                            </div>
                            {post.frontmatter.description && 
                            <p>
                                {post.frontmatter.description}
                            </p>
                            }
                        </div>
                        {image &&
                        <GatsbyImage className="mt-32 lg:h-screen" style={{ maxHeight: '100rem' }} image={image} alt={post.frontmatter.featuredImageAlt}/>
                        }
                    </header>
                    <section className="prose mx-auto font-body leading-loose my-24">
                        {post.frontmatter.noMSFT && 
                        <NoMSFTDisclaimer title={post.frontmatter.title}/>
                        }
                        <MDXProvider components={shortcodes}>
                            <MDXRenderer>
                                {post.body}
                            </MDXRenderer>
                        </MDXProvider>
                    </section>
            </article>
        </Layout>
    )
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
