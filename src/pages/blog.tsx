import React from 'react'
import BlogLink from '../components/BlogLink'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

export default function BlogList({data: {allMdx: { edges }}}): React.ReactElement {
    const blogs = edges
        .filter(edge => !!edge.node.frontmatter.date)
        .map(edge => <BlogLink key={edge.node.id} post={edge.node} />)

    return (
        blogs.length > 0 
        ?
        <Layout>
            <motion.div
                initial={{ opacity :0, y: 300 }}
                animate={{ opacity :1, y: 0 }}
                transition={{ ease: 'circOut', delay: 0.2 }}>
                <div className="lg:mb-24 mb-16">
                    {blogs}
                </div>
            </motion.div>
        </Layout>
        :
        <Layout>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}>
                <div className="lg:mb-24 mb-16">
                    <h1 className="text-3xl font-header font-semibold dark:text-white">
                        No blog posts!
                    </h1>
                    <p className="font-body mt-4 dark:text-gray-100">
                        Perhaps some will appear here in the future... 🙂
                    </p>
                </div>
            </motion.div>
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
}`
