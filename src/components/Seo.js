/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'
import { siteMetadata } from '../../gatsby-config'

function SEO({ description, lang, meta, title, image }) {
    const { site } = useStaticQuery(graphql`
        query {
            site {
                siteMetadata {
                    title
                    description
                    author
                    social {
                        twitter
                    }
                }
            }
        }
    `)

    const metaDescription = description || site.siteMetadata.description

    let titleTemplate
    if (title === siteMetadata.title) {
        titleTemplate = `%s`
    } else {
        titleTemplate = `%s - ${site.siteMetadata.title}`
    }

    return (
        <Helmet
        htmlAttributes={{
            lang,
        }}
        title={title}
        titleTemplate={titleTemplate}
        meta={[
            {
                name: `description`,
                content: metaDescription,
            },
            {
                property: `og:title`,
                content: title,
            },
            {
                property: `og:description`,
                content: metaDescription,
            },
            {
                property: `og:type`,
                content: `website`,
            },
            {
                property: `og:image`,
                content: image,
            },
            {
                name: `twitter:card`,
                content: `summary`,
            },
            {
                name: `twitter:creator`,
                content: site.siteMetadata.social.twitter,
            },
            {
                name: `twitter:title`,
                content: title,
            },
            {
                name: `twitter:description`,
                content: metaDescription,
            },
            {
                name: `twitter:image`,
                content: image,
            }
        ].concat(meta)}
        />
    )
}

SEO.defaultProps = {
    lang: `en`,
    meta: [],
    description: ``,
    image: ``,
}

SEO.propTypes = {
    description: PropTypes.string,
    lang: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
}

export default SEO
