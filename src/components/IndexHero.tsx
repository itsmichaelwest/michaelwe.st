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
        <div className='max-w-screen-lg sm:mx-auto sm:px-32 mx-8 sm:mt-16 mt-8 sm:mb-48 mb-16'>
          <div className='z-10 w-100 md:w-8/12 mx-auto'>
            <div className='flex flex-col'>
              <div className="flex-initial h-32 w-32 rounded-full overflow-hidden mb-8 shadow-xl mx-auto border-2 border-white">
                <Img fluid={data.file.childImageSharp.fluid} alt="Photo of Michael West" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl text-center font-semibold leading-tight mb-4">
                  Michael is a designer and developer.
                </h1>
                <div className="w-min mx-auto sm:mt-12 mt-8">
                  <SocialIcons/>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    />
  )     
}