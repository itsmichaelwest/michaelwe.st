import * as React from 'react'
import SEO from '../components/Seo'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'
import BlockGrid from '../components/BlockGrid'

export default function WorkList({data: {allMdx: { edges }}}: any): React.ReactElement {
    return (
        <Layout>
            <SEO title="Work"/>
            <BlockGrid data={edges} className="lg:mb-24 mb-16"/>
        </Layout>
    )
}

export const pageQuery = graphql`
query {
    allMdx(sort: { order: DESC, fields: [frontmatter___date] } filter: { fileAbsolutePath: { regex: "/(\/content\/work)/.*/" } }) {
        edges {
            node {
                id
                fields {
                    slug
                }
                frontmatter {
                    title
                    description
                    date(formatString: "MMMM YYYY")
                    featuredBlockImage {
                        childImageSharp {
                            gatsbyImageData(
                                width: 1200
                                placeholder: BLURRED
                                formats: [AUTO, WEBP, AVIF]
                            )
                        }
                    }
                    featuredImageAlt
                    officialURL
                    redirectToOfficialURL
                    hideFromList
                }
            }
        }
    }
}`
