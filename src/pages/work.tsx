import React from "react"
import WorkLink from "../components/WorkLink"
import Layout from "../components/Layout"
import { graphql } from "gatsby"
import PropTypes from 'prop-types'
import ContactLowerBanner from "../components/ContactLowerBanner"

const WorkList = ({
    data: {
        allMdx: { edges },
    },
}) => {
    const Works = edges
        .filter(edge => !!edge.node.frontmatter.date) // You can filter your posts based on some criteria
        .map(edge => <WorkLink key={edge.node.id} post={edge.node} />)

    return (
        <Layout>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 m-8 sm:mx-32 sm:my-16">
                {Works}
            </div>
            <ContactLowerBanner/>
        </Layout>
    )
}

WorkList.propTypes = {
    data: PropTypes.any
}

export default WorkList

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
                        hideFromList
                        featuredBlockImage {
                            childImageSharp {
                                fluid(maxWidth: 800) {
                                    ...GatsbyImageSharpFluid_withWebp
                                }
                            }
                        }
                        featuredImageAlt
                    }
                }
            }
        }
    }
`