import React from "react"
import config from '../../gatsby-config'

export default function Footer() {
  return (
    <footer className="max-w-screen-lg mx-8 sm:mx-16 my-12">
      <p className="text-xs text-center sm:text-left text-gray-400 font-body">{config.siteMetadata.copyright}</p>
    </footer>
  )
}
