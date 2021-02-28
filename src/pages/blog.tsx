import React from "react"
import BlogLink from "../components/BlogLink"
import Layout from "../components/Layout"
import { graphql } from "gatsby"
import PropTypes from 'prop-types'

export default function BlogList({data: {allMdx: { edges }}}) {
  const blogs = edges
    .filter(edge => !!edge.node.frontmatter.date) // You can filter your posts based on some criteria
    .map(edge => <BlogLink key={edge.node.id} post={edge.node} />)

  return (
    blogs.length > 0 
    ?
    <Layout>
      <div className="lg:mb-24 mb-16">
        {blogs}
      </div>
    </Layout>
    :
    <Layout>
      <div className="lg:mb-24 mb-16">
        <h1 className="text-3xl font-header font-semibold dark:text-white">No blog posts!</h1>
        <p className="font-body mt-4 dark:text-gray-100">Perhaps some will appear here in the future... 🙂</p>
      </div>
    </Layout>
  )
}

BlogList.propTypes = {
  data: PropTypes.any
}

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