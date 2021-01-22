import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Footer = ()  => {
  const copyright = useStaticQuery(graphql`
    query CopyrightQuery {
      site {
        siteMetadata {
          copyright
        }
      }
    }
  `)

  return (
    <footer className="my-8 mx-8 sm:mx-32">
      <p className="text-xs text-gray-400">{copyright.site.siteMetadata.copyright}</p>
    </footer>
  )

}

export default Footer