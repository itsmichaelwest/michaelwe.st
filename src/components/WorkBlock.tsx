import React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { Link } from 'gatsby'

export default function WorkBlock({ post }) {
    const image = getImage(post.frontmatter.featuredBlockImage)

    if (post.frontmatter.hideFromList) {
        return (
            <></>
        )
    } else {
        return (
            post.frontmatter.redirectToOfficialURL 
            ? 
            <div className="group">
                <div className="relative h-96 sm:h-work-block transition-all overflow-hidden" style={{ maxHeight: '120rem' }}>
                    <a className="absolute w-full h-full z-10 opacity-0 group-hover:opacity-75 bg-white transition-all" href={post.frontmatter.officialURL}>
                        <span className="sr-only">{post.frontmatter.title}</span>
                    </a>
                    <GatsbyImage className="h-full" image={image} alt={post.frontmatter.featuredImageAlt} />
                </div>
                <a href={post.frontmatter.officialURL}>
                    <h2 className="group-hover:text-blue dark:text-white mt-4 text-2xl font-header font-semibold transition-colors">
                        {post.frontmatter.title}
                    </h2>
                </a>
            </div>
            :
            <div className="group">
                <div className="relative h-96 sm:h-work-block transition-all overflow-hidden" style={{ maxHeight: '120rem' }}>
                    <Link className="absolute w-full h-full z-10 opacity-0 group-hover:opacity-75 bg-white transition-all" to={post.fields.slug}>
                        <span className="sr-only">{post.frontmatter.title}</span>
                    </Link>
                    {
                        post.frontmatter.featuredBlockImage && 
                        <GatsbyImage className="h-full" image={image} alt={post.frontmatter.featuredImageAlt} />
                    }
                </div>
                <Link to={post.fields.slug}>
                    <h2 className="group-hover:text-blue dark:text-white mt-4 text-2xl font-header font-semibold transition-colors">
                        {post.frontmatter.title}
                    </h2>
                </Link>
            </div>
        )
    }
}
