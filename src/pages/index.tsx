import * as React from 'react'
import Layout from '../components/Layout'
import IndexHero from '../components/IndexHero'
import { graphql } from 'gatsby'
import SEO from '../components/Seo'
import BlockGrid from '../components/BlockGrid'

export default function IndexPage({data: { allMdx: { edges }}}: any): React.ReactElement {     
    return (
        <Layout>
            <SEO title="Michael"/>
            <IndexHero/>
            <div className="lg:my-24 my-16">
                <h2 className="font-display font-semibold text-4xl mb-16">
                    Recent work
                </h2>
                <BlockGrid data={edges}/>
            </div>
        </Layout>
    )
}

export const query = graphql`
query {
    allMdx(sort: { fields: [frontmatter___date], order: DESC } filter: { fileAbsolutePath: { regex: "/(\/content\/work)/.*/" } } limit: 4) {
        edges {
            node {
                id
                fields {
                    slug
                }
                frontmatter {
                    title
                    description
                    isHero
                    date(formatString: "MMMM YYYY")
                    category
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
