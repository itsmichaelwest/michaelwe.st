import React from "react"
import { StaticQuery, graphql } from 'gatsby'
import Button from "./Button"
import BackgroundImage from 'gatsby-background-image'

export default function ContactLowerBanner() {
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
        <div className="bg-gray-800">
          <BackgroundImage>
            <div className="p-16">
              <div className="lg:w-6/12 lg:pr-16">
                <h2 className="text-white text-2xl font-header font-semibold md:mb-4 mb-2">
                  Let&apos;s work together
                </h2>
                <p className="text-gray-200 font-body font-light leading-relaxed tracking-tight mb-4">
                  I&apos;m looking for new opportunities starting summer 2021. If you think I&apos;d be a good fit for your design team, get in touch — it could be the start of something great!
                </p>
                <Button isInternal={true} style="onPrimary" to='/about'>
                  Contact
                </Button>
              </div>
            </div>
          </BackgroundImage>
        </div>
        </>
      )}
    />
  )    
}