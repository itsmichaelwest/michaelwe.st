import React from "react"
import config from '../../gatsby-config'

export default function Footer() {
  return (
    <footer className="max-w-screen-lg sm:mx-auto sm:px-32 mx-8 my-8">
      <p className="text-xs text-gray-400">{config.siteMetadata.copyright}</p>
    </footer>
  )
}
