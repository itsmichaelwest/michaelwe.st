import React, { useRef } from "react"
import Img from "gatsby-image"

import { Link } from "gatsby"

const WorkBlock = ({ post }) => {
    const wrapperRef = useRef()

    if (post.frontmatter.hideFromList) {
        return (
            <></>
        )
    } else {
        return (
            post.frontmatter.redirectToOfficialURL 
            ? 
            <div className="relative overflow-hidden transition-all">
                <a className="absolute w-full h-full z-10 opacity-0 hover:opacity-100 bg-gray-100 transition-all" href={post.frontmatter.officialURL}>
                  <div className="absolute inset-x-8 bottom-8">
                    <h2 className="text-2xl text-black font-semibold" aria-label={'Title and description: ' + post.frontmatter.title + '.'}>{post.frontmatter.title}</h2>
                    <p className="text-gray-400 font-body font-light">{post.frontmatter.description}</p>
                  </div>
                </a>
                <Img className="h-full" fluid={post.frontmatter.featuredBlockImage.childImageSharp.fluid} alt={post.frontmatter.featuredImageAlt} />
            </div>
            : 
            <div className="relative overflow-hidden transition-all">
                <Link className="absolute w-full h-full z-10 opacity-0 hover:opacity-100 bg-gray-100 transition-all" to={post.fields.slug} ref={wrapperRef}>
                    <div className="absolute inset-x-8 bottom-8">
                        <h2 className="text-2xl text-black font-semibold" aria-label={'Title and description: ' + post.frontmatter.title + '.'}>{post.frontmatter.title}</h2>
                        <p className="text-gray-700 font-body font-light">{post.frontmatter.description}</p>
                    </div>
                </Link>
                {post.frontmatter.featuredBlockImage && <Img className="h-full" fluid={post.frontmatter.featuredBlockImage.childImageSharp.fluid} alt={post.frontmatter.featuredImageAlt} />}
            </div>
        )
    }
}

export default WorkBlock