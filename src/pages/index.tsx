import React from "react"
import PropTypes from 'prop-types'
import Layout from "../components/Layout"
import WorkBlock from "../components/WorkBlock"
import IndexHero from "../components/IndexHero"
import ContactLowerBanner from "../components/ContactLowerBanner"
import { graphql, Link } from "gatsby"
import SEO from "../components/Seo"

export default function IndexPage({data: { allMdx: { edges }}}) {     
    const Works = edges
      .filter(edge => !!edge.node.frontmatter.date)
      .map(edge => <WorkBlock key={edge.node.id} post={edge.node} />)

    return (
      <Layout>
        <SEO title="Michael West" />
        <IndexHero />
        <div className="lg:my-24 my-16">
          <div className="flex justify-start">
            <div className="w-full lg:w-6/12">
              <h2 className="text-xl font-bold">
                Recent work
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 md:gap-y-16 mt-8">
            {Works}
          </div>
        </div>
        <ContactLowerBanner />
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