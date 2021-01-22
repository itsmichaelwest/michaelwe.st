import React from "react"
import { siteMetadata } from "../../gatsby-config"

class HeaderNoLinks extends React.Component {
  render() {
    return (
      <header id="header" className="sticky top-0 z-20 px-32 py-16">
        <a className="text-xl font-body font-bold tracking-tight text-blue hover:text-blue-700" href="/" aria-label={siteMetadata.title}>
          Michael.
        </a>
      </header>
    )
  }
}

export default HeaderNoLinks
