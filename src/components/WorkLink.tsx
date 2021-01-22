import React from "react"
import Img from "gatsby-image"
import PropTypes from 'prop-types'
import { Link } from "gatsby"

const WorkLink = ({ post }) => {
    return (
        <div className="relative overflow-hidden transition-all">
            <Link className="absolute w-full h-full z-10 opacity-0 hover:opacity-100 bg-gray-100 transition-all" to={post.fields.slug}>
                <div className="absolute inset-x-8 bottom-8">
                    <h2 className="text-xl text-black font-semibold" aria-label={'Title and description: ' + post.frontmatter.title + '.'}>{post.frontmatter.title}</h2>
                    <p className="text-gray-700 font-body font-light">{post.frontmatter.description}</p>
                </div>
            </Link>
            {post.frontmatter.featuredImage && <Img className="h-full" fluid={post.frontmatter.featuredBlockImage.childImageSharp.fluid} alt={post.frontmatter.featuredImageAlt} />}
        </div>
    )
}

WorkLink.propTypes = {
    post: PropTypes.node
}

export default WorkLink