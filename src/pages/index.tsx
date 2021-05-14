import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../components/Layout'
import WorkBlock from '../components/WorkBlock'
import IndexHero from '../components/IndexHero'
import ContactLowerBanner from '../components/ContactLowerBanner'
import { graphql } from 'gatsby'
import SEO from '../components/Seo'
import { motion } from 'framer-motion'

export default function IndexPage({data: { allMdx: { edges }}}): React.ReactElement {     
    const Works = edges
        .filter(edge => !!edge.node.frontmatter.date)
        .map(edge => <WorkBlock key={edge.node.id} post={edge.node} /> )

    return (
        <Layout>
            <SEO title="Michael"/>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}>
                <IndexHero/>
            </motion.div>
            <motion.div
                initial={{ opacity :0 }}
                animate={{ opacity :1 }}
                transition={{ ease: 'circOut', delay: 0.4 }}>
                <div className="lg:my-24 my-16">
                    <div className="flex justify-start">
                        <div className="w-full lg:w-6/12">
                            <h2 className="text-xl text-gray-900 dark:text-gray-100 font-header font-bold">
                                Recent work
                            </h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 md:gap-y-16 mt-8">
                        {Works}
                    </div>
                </div>
                <ContactLowerBanner/>
            </motion.div>
        </Layout>
    )
}

IndexPage.propTypes = {
  data: PropTypes.any
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
