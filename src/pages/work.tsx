import React from 'react'
import SEO from '../components/Seo'
import WorkLink from '../components/WorkBlock'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import ContactLowerBanner from '../components/ContactLowerBanner'
import { motion } from 'framer-motion'

export default function WorkList({data: {allMdx: { edges }}}): React.ReactElement {
    const Works = edges
        .filter(edge => !!edge.node.frontmatter.date)
        .map(edge => <WorkLink key={edge.node.id} post={edge.node} />)

    return (
        <Layout>
            <SEO title="Work"/>
            <motion.div
                initial={{ opacity :0, y: 300 }}
                animate={{ opacity :1, y: 0 }}
                transition={{ ease: 'circOut', delay: 0.2 }}>
                <div className="lg:mb-24 mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-32 mb-16">
                        {Works}
                    </div>
                </div>
                <ContactLowerBanner/>
            </motion.div>
        </Layout>
    )
}

WorkList.propTypes = {
    data: PropTypes.any
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
