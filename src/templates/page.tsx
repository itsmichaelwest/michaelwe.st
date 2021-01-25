import React from "react"
import PropTypes from 'prop-types'
import { graphql, Link } from "gatsby"
import Img from "gatsby-image"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Layout from "../components/Layout"
import SEO from "../components/Seo"
import NoMSFTDisclaimer from "../components/NoMSFTDisclaimer"
import Button from "../components/Button"

const shortcodes = { Link }

export default function Template({ data }) {
  const post = data.mdx
  const image = post.frontmatter.featuredImage

  const imageSrc = image && image.childImageSharp.fluid.src

  let origin = ""
  if (typeof window !== "undefined") {
      origin = window.location.origin
  }

  const imageSocial = origin + imageSrc

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
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 m-8 sm:mx-32 sm:my-16">
          <div>
            <h1 className="text-5xl font-medium">{post.frontmatter.title}</h1>
            {post.frontmatter.officialURL && <Button isInternal={false} to={post.frontmatter.officialURL}>{post.frontmatter.officialURLText}</Button>}
          </div>
          <div>
            {post.frontmatter.description && <p className="font-body font-light leading-loose">{post.frontmatter.description}</p>}
          </div>
        </div>
        <Img fluid={post.frontmatter.featuredImage.childImageSharp.fluid} alt={post.frontmatter.featuredImageAlt}/>
        <div className="container prose font-body font-light leading-relaxed tracking-tight mt-8" style={{ padding: '6vmax 4vw' }}>
          {post.frontmatter.noMSFT && <NoMSFTDisclaimer title={post.frontmatter.title} />}
          <MDXProvider components={shortcodes}>
            <MDXRenderer>{post.body}</MDXRenderer>
          </MDXProvider>
        </div>
      </article>
      :
      <article className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 m-8 sm:mx-32 sm:my-16">
          <div>
            <h1 className="text-5xl font-medium">{post.frontmatter.title}</h1>
            {post.frontmatter.officialURL && <Button isInternal={false} to={post.frontmatter.officialURL}>{post.frontmatter.officialURLText}</Button>}
          </div>
          <div className="container prose font-body font-light leading-loose">
            {post.frontmatter.noMSFT && <NoMSFTDisclaimer title={post.frontmatter.title} />}
            <MDXProvider components={shortcodes}>
              <MDXRenderer>{post.body}</MDXRenderer>
            </MDXProvider>
          </div>
        </div>
      </article>
      }
    </Layout>
  )
}

Template.propTypes = {
  data: PropTypes.node
}

export const pageQuery = graphql`
  query ArticleBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      id
      body
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        category
        featuredImage {
          name
          extension
          childImageSharp {
            fluid(maxWidth: 2560) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        featuredImageAlt
        officialURL
        officialURLText
        noMSFT
        aliases
      }
    }
  }
`