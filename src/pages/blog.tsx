import * as React from 'react'
import BlogLink from '../components/BlogLink'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'

export default function BlogList({data: {allMdx: { edges }}}: any): React.ReactElement {
    const blogs = edges
        .filter(edge => !!edge.node.frontmatter.date)
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
                <h1 className="font-display text-6xl font-semibold">
                    Blog coming soon...
                </h1>
                <p className="font-text mt-4">
                    Watch this space
                </p>
            </div>
        </Layout>
    )
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
}`
