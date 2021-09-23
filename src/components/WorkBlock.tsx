import * as React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Link2 from './Link2'

export default function WorkBlock({ post }): React.ReactElement {
    const image = getImage(post.frontmatter.featuredBlockImage)

    if (post.frontmatter.hideFromList) {
        return (
            <></>
        )
    } else {
        let url: string
        let internal: boolean

        if (post.frontmatter.redirectToOfficialURL) {
            url = post.frontmatter.officialURL
            internal = false
        } else {
            url = post.fields.slug
            internal = true
        }

        return (
            <section className="relative" style={{ aspectRatio: "1" }}>
                <Link2 isInternal={internal} to={url} className="absolute inset-0 group w-full h-full">
                    <span className="sr-only">{post.frontmatter.title}</span>
                    <GatsbyImage className="w-full h-full" image={image} alt={post.frontmatter.featuredImageAlt} />
                    <div className="absolute inset-0 p-8 md:p-16 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <h2 className="font-display font-semibold text-4xl xl:text-6xl">
                            {post.frontmatter.title}
                        </h2>
                        <p className="font-text text-gray-600 xl:text-xl max-w-prose mt-4">
                            {post.frontmatter.description}
                        </p>
                    </div>
                </Link2>
            </section>
        )
    }
}
