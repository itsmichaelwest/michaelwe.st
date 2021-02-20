import React from "react"
import config from '../../gatsby-config'

export default function Footer() {
  return (
    <footer className="max-w-screen-lg mx-auto px-8 my-8 w-full">
      <p className="text-xs text-center sm:text-left text-gray-400">{config.siteMetadata.copyright}</p>
    </footer>
  )
}
