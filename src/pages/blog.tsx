import React from "react"
import BlogLink from "../components/BlogLink"
import Layout from "../components/Layout"
import { graphql } from "gatsby"
import PropTypes from 'prop-types'

const WorkList = ({
    data: {
        allMdx: { edges },
    },
}) => {
    const Works = edges
        .filter(edge => !!edge.node.frontmatter.date) // You can filter your posts based on some criteria
        .map(edge => <BlogLink key={edge.node.id} post={edge.node} />)

    return (
        <Layout>
            <div className="m-8 sm:mx-32 sm:mb-16">
                {Works}
            </div>
        </Layout>
    )
}

WorkList.propTypes = {
    data: PropTypes.node
}

export default WorkList

export const pageQuery = graphql`
    query {
        allMdx(sort: { order: DESC, fields: [frontmatter___date] } filter: { fileAbsolutePath: { regex: "/(\/content\/blog)/.*/" } }) {
            edges {
                node {
                    id
                    fields {
                        slug
                    }
                    frontmatter {
                        title
                        description
                        date(formatString: "MMMM DD, YYYY")
                    }
                }
            }
        }
    }
`