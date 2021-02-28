import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import React from "react"
import SocialIcons from "./SocialIcons"

export default function IndexHero() {
  return (
    <StaticQuery
      query={graphql`
        query {
          file(relativePath: { eq: "michael-face.jpg" }) {
            childImageSharp {
              fluid(maxWidth: 1600, quality: 100) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      `}
      render={data => (
        <>
        <div className='relative w-auto max-w-prose my-40'>
          <h1 className="text-8xl font-emoji font-bold max-w-max mb-6">
            👋
          </h1>
          <h1 className="text-3xl font-header font-semibold leading-tight mb-4 dark:text-white">
            Designer and developer, passionate about magical software/hardware experiences.
          </h1>
          <div className="sm:mt-8 mt-6">
            <SocialIcons/>
          </div>
        </div>
        </>
      )}
    />
  )     
}

/*
            <span className="relative block bg-blue h-2 bottom-1 rounded-full" />

          <div className="flex-initial h-40 w-40 rounded-full overflow-hidden mb-8 shadow-2xl border-2 border-white">
            <Img fluid={data.file.childImageSharp.fluid} alt="Photo of Michael West" />
          </div>
          */