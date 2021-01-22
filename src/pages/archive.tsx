import React from "react"
import WorkLink from "../components/WorkLink"
import Layout from "../components/Layout"
import ContactLowerBanner from "../components/ContactLowerBanner"
import { graphql } from "gatsby"
import PropTypes from 'prop-types'

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 m-8 sm:mx-32 sm:my-16">
                {Works}
            </div>
            <ContactLowerBanner/>
        </Layout>
    )
}

WorkList.propTypes = {
    data: PropTypes.node
}

export default WorkList

export const pageQuery = graphql`
    query {
        allMdx(sort: { order: DESC, fields: [frontmatter___date] } filter: { fileAbsolutePath: { regex: "/(\/content\/archive)/.*/" } }) {
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