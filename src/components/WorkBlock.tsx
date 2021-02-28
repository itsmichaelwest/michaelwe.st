import React from "react"
import Img from "gatsby-image"
import { Link } from "gatsby"

export default function WorkBlock({ post }) {
  if (post.frontmatter.hideFromList) {
    return (
      <></>
    )
} else {
  return (
    post.frontmatter.redirectToOfficialURL 
    ? 
    <div className="group">
      <div className="relative h-64 sm:h-work-block transition-all overflow-hidden" style={{ maxHeight: '120rem' }}>
        <a className="absolute w-full h-full z-10 opacity-0 group-hover:opacity-75 bg-white transition-all" href={post.frontmatter.officialURL}></a>
        <Img className="h-full" fluid={post.frontmatter.featuredBlockImage.childImageSharp.fluid} alt={post.frontmatter.featuredImageAlt} />
      </div>
      <a href={post.frontmatter.officialURL}>
        <h2 className="group-hover:text-blue mt-4 text-2xl font-header font-semibold transition-colors">
          {post.frontmatter.title}
        </h2>
      </a>
    </div>
    :
    <div className="group">
      <div className="relative h-64 sm:h-work-block transition-all overflow-hidden" style={{ maxHeight: '120rem' }}>
        <Link className="absolute w-full h-full z-10 opacity-0 group-hover:opacity-75 bg-white transition-all" to={post.fields.slug}></Link>
        {
          post.frontmatter.featuredBlockImage && 
          <Img className="h-full" fluid={post.frontmatter.featuredBlockImage.childImageSharp.fluid} alt={post.frontmatter.featuredImageAlt} />
        }
      </div>
      <Link to={post.fields.slug}>
        <h2 className="group-hover:text-blue mt-4 text-2xl font-header font-semibold transition-colors">
          {post.frontmatter.title}
        </h2>
      </Link>
    </div>
    )
  }
}
