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
      <div className="relative h-96 transition-all">
        <a className="absolute w-full h-full z-10 opacity-0 group-hover:opacity-75 bg-white transition-all" href={post.frontmatter.officialURL}></a>
        <Img className="h-full" fluid={post.frontmatter.featuredBlockImage.childImageSharp.fluid} alt={post.frontmatter.featuredImageAlt} />
        <h2 className="mt-4 text-2xl font-semibold">
          {post.frontmatter.title}
        </h2>
      </div>
    </div>
    :
    <div className="group">
      <div className="relative h-96 transition-all">
        <Link className="absolute w-full h-full z-10 opacity-0 group-hover:opacity-75 bg-white transition-all" to={post.fields.slug}></Link>
        {
          post.frontmatter.featuredBlockImage && <Img className="h-full" fluid={post.frontmatter.featuredBlockImage.childImageSharp.fluid} alt={post.frontmatter.featuredImageAlt} />
        }
      </div>
      <Link to={post.fields.slug}>
        <h2 className="mt-4 text-2xl font-semibold">
          {post.frontmatter.title}
        </h2>
      </Link>
    </div>
    )
  }
}
