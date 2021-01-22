import React from "react"
import PropTypes from 'prop-types'
import Layout from "../components/Layout"
import WorkBlock from "../components/WorkBlock"
import IndexHero from "../components/IndexHero"
import ContactLowerBanner from "../components/ContactLowerBanner"
import { graphql, Link } from "gatsby"

import SEO from "../components/Seo"
import { siteMetadata } from "../../gatsby-config"

const IndexPage = ({
    data: { allMdx: { edges },},}) => {const Works = edges.filter(edge => !!edge.node.frontmatter.date).map(edge => <WorkBlock key={edge.node.id} post={edge.node} />)

    return (
        <Layout>
            <SEO title="Michael West" />
            <IndexHero />
            <div className="mt-24 m-8 sm:mb-16 sm:mx-32">
                <div className="flex justify-start">
                    <div className="w-full md:w-6/12">
                        <h2 className="text-5xl font-medium mb-8">Recent work</h2>
                        <p className="text-lg font-body font-light leading-relaxed tracking-tight">screaming</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 mb-16">
                    {Works}
                </div>
                <Link className="font-body" to="/archive/">
                  Explore the archive
                </Link>
            </div>
            <ContactLowerBanner />
        </Layout>
    )
}

IndexPage.propTypes = {
  data: PropTypes.any
}

export default IndexPage

export const query = graphql`
  query {
    allMdx(sort: { fields: [frontmatter___date], order: DESC } filter: { fileAbsolutePath: { regex: "/(\/content\/work)/.*/" } }) {
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
                fluid(maxWidth: 1200, quality: 100) {
                  ...GatsbyImageSharpFluid_withWebp
                }
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
  }
`