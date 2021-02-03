import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import React from "react"
import SocialIcons from "./SocialIcons"

export default function IndexHero() {
  return (
    <StaticQuery
      query={graphql`
        query {
          file(relativePath: { eq: "michael-home.png" }) {
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
        <div className='h-3/5 bg-gray-100 overflow-hidden p-8 sm:px-32 sm:py-24'>
          <div className='z-10 w-100 md:w-8/12'>
            <div className='relative'>
              <h1 className="text-3xl md:text-5xl leading-tight mb-4">
                Michael is a user experience designer and developer.
              </h1>
              <p>
                He previously worked at Microsoft.
              </p>
              <SocialIcons/>
            </div>
          </div>
        </div>
        </>
      )}
    />
  )

  //          <Img className='inset-0 h-screen' fluid={data.file.childImageSharp.fluid} alt="Photo of Michael West" />
}