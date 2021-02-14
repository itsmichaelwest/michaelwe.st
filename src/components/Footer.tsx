import React from "react"
import { useStaticQuery, graphql } from "gatsby"

export default function Footer() {
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
    <footer className="max-w-screen-xl sm:mx-auto sm:px-32 mx-8 my-8">
      <p className="text-xs text-gray-400">{copyright.site.siteMetadata.copyright}</p>
    </footer>
  )
}
