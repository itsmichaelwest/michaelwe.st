import React from 'react'
import { Link } from 'gatsby'

export default function BlogLink({ post }): React.ReactElement {
    return (
        <div className="mb-16">
            <p className="font-light my-2">
                {post.frontmatter.date}
            </p>
            <h2>
                <Link className="text-xl font-bold text-blue hover:text-blue-700" to={post.fields.slug}>
                    {post.frontmatter.title}
                </Link>
            </h2>
            <p className="font-body font-light leading-loose">
                {post.frontmatter.description}
            </p>
        </div>
    )
}
