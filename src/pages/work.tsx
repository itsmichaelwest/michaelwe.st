import * as React from 'react'
import SEO from '../components/Seo'
import WorkLink from '../components/WorkBlock'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'
import ContactLowerBanner from '../components/ContactLowerBanner'
import BlockGrid from '../components/BlockGrid'

export default function WorkList({data: {allMdx: { edges }}}: any): React.ReactElement {
    const Works = edges
        .filter(edge => !!edge.node.frontmatter.date)
        .map(edge => <WorkLink key={edge.node.id} post={edge.node} />)

    return (
        <Layout>
            <SEO title="Work"/>
            <BlockGrid data={edges} className="lg:mb-24 mb-16"/>
            <ContactLowerBanner/>
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
